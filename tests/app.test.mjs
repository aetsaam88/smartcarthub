import test from 'node:test';
import assert from 'node:assert/strict';

// Import modules to test
import {
  MARKETPLACES,
  MARKETPLACE_LIST,
  getMarketplace,
  buildAffiliateUrl,
} from '../src/lib/marketplaces.ts';
import {
  CategorySchema,
  ProductSchema,
  NewsletterSchema,
  AdminLoginSchema,
} from '../src/lib/validation/index.ts';
import { slugify, formatDate, truncate } from '../src/lib/utils.ts';
import { repository } from '../src/lib/data/repository.ts';

test('Utility Functions', async (t) => {
  await t.test('slugify converts titles to valid url slugs', () => {
    assert.equal(slugify('Sony WH-1000XM5 Headphones'), 'sony-wh-1000xm5-headphones');
    assert.equal(slugify('Logitech MX Master 3S! & Special'), 'logitech-mx-master-3s-special');
  });

  await t.test('truncate limits long strings correctly', () => {
    assert.equal(truncate('Hello world', 5), 'Hello...');
    assert.equal(truncate('Short', 10), 'Short');
  });
});

test('Marketplaces Configuration', async (t) => {
  await t.test('supports all 6 target international marketplaces', () => {
    const expectedCodes = ['US', 'UK', 'CA', 'DE', 'FR', 'IT'];
    assert.equal(MARKETPLACE_LIST.length, 6);
    expectedCodes.forEach((code) => {
      assert.ok(MARKETPLACES[code], `Marketplace ${code} must exist`);
      assert.ok(MARKETPLACES[code].domain.includes('amazon'), `Marketplace domain must be Amazon`);
      assert.ok(MARKETPLACES[code].currencySymbol, `Currency symbol must be defined`);
    });
  });

  await t.test('buildAffiliateUrl attaches affiliate tag properly', () => {
    const url = 'https://www.amazon.com/dp/B09XS7JWHH';
    const tag = 'globalcart-us-20';
    const result = buildAffiliateUrl(url, tag);
    assert.ok(result.includes('tag=globalcart-us-20'));
  });

  await t.test('getMarketplace defaults to US when invalid code provided', () => {
    assert.equal(getMarketplace('XYZ').code, 'US');
    assert.equal(getMarketplace('UK').code, 'UK');
  });
});

test('Validation Schemas', async (t) => {
  await t.test('NewsletterSchema requires valid email and consent=true', () => {
    const valid = NewsletterSchema.safeParse({
      email: 'reader@example.com',
      consent: true,
    });
    assert.equal(valid.success, true);

    const missingConsent = NewsletterSchema.safeParse({
      email: 'reader@example.com',
      consent: false,
    });
    assert.equal(missingConsent.success, false);

    const invalidEmail = NewsletterSchema.safeParse({
      email: 'not-an-email',
      consent: true,
    });
    assert.equal(invalidEmail.success, false);
  });

  await t.test('AdminLoginSchema enforces email and password length', () => {
    const valid = AdminLoginSchema.safeParse({
      email: 'admin@globalcart.example',
      password: 'GlobalCart2025!#',
    });
    assert.equal(valid.success, true);

    const tooShort = AdminLoginSchema.safeParse({
      email: 'admin@globalcart.example',
      password: '123',
    });
    assert.equal(tooShort.success, false);
  });

  await t.test('CategorySchema validates category fields', () => {
    const valid = CategorySchema.safeParse({
      name: 'Audio Equipment',
      slug: 'audio-equipment',
      description: 'High performance audio gear and headphones for everyday listening.',
    });
    assert.equal(valid.success, true);
  });
});

test('Repository Data Operations', async (t) => {
  await t.test('getCategories returns populated sample categories', async () => {
    const categories = await repository.getCategories();
    assert.ok(categories.length >= 6, 'Should have at least 6 categories');
  });

  await t.test('getProducts supports category and search filtering', async () => {
    const electronics = await repository.getProducts({ categorySlug: 'electronics' });
    assert.ok(electronics.length > 0);
    electronics.forEach((p) => {
      assert.equal(p.category_id, 'cat-1');
    });

    const searchSony = await repository.getProducts({ search: 'Sony' });
    assert.ok(searchSony.length > 0);
    assert.ok(searchSony[0].name.includes('Sony'));
  });

  await t.test('saveProduct and deleteProduct work seamlessly', async () => {
    const newProd = await repository.saveProduct({
      name: 'Test Mechanical Keypad',
      slug: 'test-mechanical-keypad',
      brand: 'TestBrand',
      category_id: 'cat-2',
      short_description: 'Test short description for testing',
      description: 'Test long description for testing the repository product save functionality',
      editorial_rating: 4.5,
      featured: false,
      status: 'published',
      image_reference: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    });

    assert.ok(newProd.id);
    const retrieved = await repository.getProductBySlug('test-mechanical-keypad');
    assert.ok(retrieved);
    assert.equal(retrieved.brand, 'TestBrand');

    // Clean up
    const deleted = await repository.deleteProduct(newProd.id);
    assert.equal(deleted, true);
  });

  await t.test('category deletion protects against orphaning products', async () => {
    // cat-1 has products assigned, so deleting should be prevented
    const result = await repository.deleteCategory('cat-1');
    assert.equal(result.success, false);
    assert.ok(result.message.includes('assigned to it'));
  });

  await t.test('affiliate click logging records events accurately', async () => {
    const initialClicks = await repository.getAffiliateClicks();
    const newClick = await repository.recordAffiliateClick('prod-1', 'UK', '/product/test');
    assert.ok(newClick.id);
    assert.equal(newClick.marketplace_code, 'UK');

    const updatedClicks = await repository.getAffiliateClicks();
    assert.equal(updatedClicks.length, initialClicks.length + 1);
  });
});
