import type {
  Category,
  Product,
  BlogPost,
  SiteSettings,
  AdminActivityLog,
  AffiliateClick,
  MarketplaceCode,
  NewsletterSubscriber,
} from '../../types/index.ts';
import {
  INITIAL_SETTINGS,
  SAMPLE_CATEGORIES,
  SAMPLE_PRODUCTS,
  SAMPLE_BLOG_POSTS,
  SAMPLE_ACTIVITY_LOGS,
  SAMPLE_CLICKS,
} from './sample-data.ts';
import { getMongoDb } from '../mongodb.ts';
import type { Db } from 'mongodb';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let isSeeded = false;
async function ensureSeeded(db: Db): Promise<void> {
  if (isSeeded) return;
  try {
    const catCount = await db.collection('categories').countDocuments();
    if (catCount === 0) {
      console.log('[MongoDB] Initializing database with seed data...');
      await db.collection('categories').insertMany(SAMPLE_CATEGORIES.map((c) => ({ ...c })));
      await db.collection('products').insertMany(SAMPLE_PRODUCTS.map((p) => ({ ...p })));
      await db.collection('blog_posts').insertMany(SAMPLE_BLOG_POSTS.map((b) => ({ ...b })));
      await db.collection('settings').insertOne({ ...INITIAL_SETTINGS });
      await db.collection('clicks').insertMany(SAMPLE_CLICKS.map((c) => ({ ...c })));
      await db.collection('activity_logs').insertMany(SAMPLE_ACTIVITY_LOGS.map((a) => ({ ...a })));
      console.log('[MongoDB] Seed completed successfully!');
    }
    isSeeded = true;
  } catch (err) {
    console.warn('[MongoDB] Seeding check skipped/failed:', err instanceof Error ? err.message : err);
  }
}

// Data repository with dual MongoDB and in-memory fallback support
class DataRepository {
  private categories: Category[] = [...SAMPLE_CATEGORIES];
  private products: Product[] = [...SAMPLE_PRODUCTS];
  private blogPosts: BlogPost[] = [...SAMPLE_BLOG_POSTS];
  private settings: SiteSettings = { ...INITIAL_SETTINGS };
  private clicks: AffiliateClick[] = [...SAMPLE_CLICKS];
  private activityLogs: AdminActivityLog[] = [...SAMPLE_ACTIVITY_LOGS];
  private subscribers: NewsletterSubscriber[] = [];

  // Categories
  async getCategories(): Promise<Category[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const categories = await db
        .collection<Category>('categories')
        .find({}, { projection: { _id: 0 } })
        .toArray();
      const products = await db
        .collection<Product>('products')
        .find({ status: 'published' }, { projection: { _id: 0, category_id: 1 } })
        .toArray();
      return categories.map((c) => ({
        ...c,
        product_count: products.filter((p) => p.category_id === c.id).length,
      }));
    }

    return this.categories.map((c) => ({
      ...c,
      product_count: this.products.filter((p) => p.category_id === c.id && p.status === 'published').length,
    }));
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const category = await db
        .collection<Category>('categories')
        .findOne({ slug }, { projection: { _id: 0 } });
      if (!category) return null;
      const productCount = await db
        .collection('products')
        .countDocuments({ category_id: category.id, status: 'published' });
      return {
        ...category,
        product_count: productCount,
      };
    }

    const category = this.categories.find((c) => c.slug === slug);
    if (!category) return null;
    return {
      ...category,
      product_count: this.products.filter((p) => p.category_id === category.id && p.status === 'published').length,
    };
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<Category>('categories')
        .findOne({ id }, { projection: { _id: 0 } });
    }

    return this.categories.find((c) => c.id === id) || null;
  }

  async saveCategory(categoryData: Partial<Category>): Promise<Category> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      if (categoryData.id) {
        const existing = await db
          .collection<Category>('categories')
          .findOne({ id: categoryData.id }, { projection: { _id: 0 } });
        if (existing) {
          const updated: Category = {
            ...existing,
            ...categoryData,
            updated_at: new Date().toISOString(),
          } as Category;
          await db.collection('categories').updateOne({ id: categoryData.id }, { $set: updated });
          return updated;
        }
      }
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: categoryData.name || 'Untitled Category',
        slug: categoryData.slug || `category-${Date.now()}`,
        description: categoryData.description || '',
        image_reference: categoryData.image_reference || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        seo_title: categoryData.seo_title || `${categoryData.name} | GlobalCart`,
        seo_description: categoryData.seo_description || categoryData.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.collection('categories').insertOne({ ...newCategory });
      return newCategory;
    }

    if (categoryData.id) {
      const idx = this.categories.findIndex((c) => c.id === categoryData.id);
      if (idx !== -1) {
        this.categories[idx] = {
          ...this.categories[idx],
          ...categoryData,
          updated_at: new Date().toISOString(),
        } as Category;
        return this.categories[idx];
      }
    }
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name || 'Untitled Category',
      slug: categoryData.slug || `category-${Date.now()}`,
      description: categoryData.description || '',
      image_reference: categoryData.image_reference || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      seo_title: categoryData.seo_title || `${categoryData.name} | GlobalCart`,
      seo_description: categoryData.seo_description || categoryData.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.categories.unshift(newCategory);
    return newCategory;
  }

  async deleteCategory(id: string): Promise<{ success: boolean; message?: string }> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const assignedCount = await db.collection('products').countDocuments({ category_id: id });
      if (assignedCount > 0) {
        return {
          success: false,
          message: `Cannot delete category because ${assignedCount} product(s) are assigned to it. Reassign or delete them first.`,
        };
      }
      const res = await db.collection('categories').deleteOne({ id });
      return { success: res.deletedCount > 0 };
    }

    const assignedProducts = this.products.filter((p) => p.category_id === id);
    if (assignedProducts.length > 0) {
      return {
        success: false,
        message: `Cannot delete category because ${assignedProducts.length} product(s) are assigned to it. Reassign or delete them first.`,
      };
    }
    this.categories = this.categories.filter((c) => c.id !== id);
    return { success: true };
  }

  // Products
  async getProducts(options?: {
    categorySlug?: string;
    brand?: string;
    search?: string;
    featured?: boolean;
    status?: 'published' | 'draft' | 'archived' | 'all';
    limit?: number;
  }): Promise<Product[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const query: Record<string, unknown> = {};

      if (options?.status && options.status !== 'all') {
        query.status = options.status;
      } else if (!options?.status) {
        query.status = 'published';
      }

      if (options?.categorySlug) {
        const cat = await db
          .collection<Category>('categories')
          .findOne({ slug: options.categorySlug }, { projection: { _id: 0 } });
        if (cat) {
          query.category_id = cat.id;
        } else {
          return [];
        }
      }

      if (options?.brand) {
        query.brand = { $regex: new RegExp(`^${escapeRegex(options.brand)}$`, 'i') };
      }

      if (options?.featured !== undefined) {
        query.featured = options.featured;
      }

      if (options?.search) {
        const q = escapeRegex(options.search.toLowerCase().trim());
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
          { short_description: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      let cursor = db.collection<Product>('products').find(query, { projection: { _id: 0 } });
      if (options?.limit) {
        cursor = cursor.limit(options.limit);
      }

      const products = await cursor.toArray();
      const categories = await db
        .collection<Category>('categories')
        .find({}, { projection: { _id: 0 } })
        .toArray();

      return products.map((p) => ({
        ...p,
        category: categories.find((c) => c.id === p.category_id),
      }));
    }

    let result = [...this.products];

    // Status filter
    if (options?.status && options.status !== 'all') {
      result = result.filter((p) => p.status === options.status);
    } else if (!options?.status) {
      result = result.filter((p) => p.status === 'published');
    }

    // Category filter
    if (options?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === options.categorySlug);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      } else {
        return [];
      }
    }

    // Brand filter
    if (options?.brand) {
      result = result.filter((p) => p.brand.toLowerCase() === options.brand?.toLowerCase());
    }

    // Featured filter
    if (options?.featured !== undefined) {
      result = result.filter((p) => p.featured === options.featured);
    }

    // Search filter
    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Attach category object
    result = result.map((p) => ({
      ...p,
      category: this.categories.find((c) => c.id === p.category_id),
    }));

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const product = await db
        .collection<Product>('products')
        .findOne({ slug }, { projection: { _id: 0 } });
      if (!product) return null;
      const category = await db
        .collection<Category>('categories')
        .findOne({ id: product.category_id }, { projection: { _id: 0 } });
      return {
        ...product,
        category: category || undefined,
      };
    }

    const product = this.products.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      category: this.categories.find((c) => c.id === product.category_id),
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const product = await db
        .collection<Product>('products')
        .findOne({ id }, { projection: { _id: 0 } });
      if (!product) return null;
      const category = await db
        .collection<Category>('categories')
        .findOne({ id: product.category_id }, { projection: { _id: 0 } });
      return {
        ...product,
        category: category || undefined,
      };
    }

    const product = this.products.find((p) => p.id === id);
    if (!product) return null;
    return {
      ...product,
      category: this.categories.find((c) => c.id === product.category_id),
    };
  }

  async saveProduct(productData: Partial<Product>): Promise<Product> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      if (productData.id) {
        const existing = await db
          .collection<Product>('products')
          .findOne({ id: productData.id }, { projection: { _id: 0 } });
        if (existing) {
          const updated: Product = {
            ...existing,
            ...productData,
            updated_at: new Date().toISOString(),
          } as Product;
          await db.collection('products').updateOne({ id: productData.id }, { $set: updated });
          return updated;
        }
      }
      const firstCategory = await db
        .collection<Category>('categories')
        .findOne({}, { projection: { _id: 0 } });
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'Untitled Product',
        slug: productData.slug || `product-${Date.now()}`,
        brand: productData.brand || 'Generic',
        category_id: productData.category_id || firstCategory?.id || 'cat-1',
        short_description: productData.short_description || '',
        description: productData.description || '',
        specifications: productData.specifications || {},
        features: productData.features || [],
        pros: productData.pros || [],
        cons: productData.cons || [],
        editorial_rating: productData.editorial_rating || 4.5,
        featured: productData.featured || false,
        status: productData.status || 'published',
        image_reference:
          productData.image_reference ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        marketplaces: productData.marketplaces || [],
        seo_title: productData.seo_title || `${productData.name} | GlobalCart Review`,
        seo_description: productData.seo_description || productData.short_description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.collection('products').insertOne({ ...newProduct });
      return newProduct;
    }

    if (productData.id) {
      const idx = this.products.findIndex((p) => p.id === productData.id);
      if (idx !== -1) {
        this.products[idx] = {
          ...this.products[idx],
          ...productData,
          updated_at: new Date().toISOString(),
        } as Product;
        return this.products[idx];
      }
    }
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'Untitled Product',
      slug: productData.slug || `product-${Date.now()}`,
      brand: productData.brand || 'Generic',
      category_id: productData.category_id || this.categories[0]?.id || 'cat-1',
      short_description: productData.short_description || '',
      description: productData.description || '',
      specifications: productData.specifications || {},
      features: productData.features || [],
      pros: productData.pros || [],
      cons: productData.cons || [],
      editorial_rating: productData.editorial_rating || 4.5,
      featured: productData.featured || false,
      status: productData.status || 'published',
      image_reference:
        productData.image_reference ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      marketplaces: productData.marketplaces || [],
      seo_title: productData.seo_title || `${productData.name} | GlobalCart Review`,
      seo_description: productData.seo_description || productData.short_description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const res = await db.collection('products').deleteOne({ id });
      return res.deletedCount > 0;
    }

    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  // Blog Posts
  async getBlogPosts(options?: {
    categorySlug?: string;
    status?: 'published' | 'draft' | 'archived' | 'all';
    limit?: number;
    search?: string;
  }): Promise<BlogPost[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const query: Record<string, unknown> = {};

      if (options?.status && options.status !== 'all') {
        query.status = options.status;
      } else if (!options?.status) {
        query.status = 'published';
      }

      if (options?.categorySlug) {
        query.category_slug = options.categorySlug;
      }

      if (options?.search) {
        const q = escapeRegex(options.search.toLowerCase().trim());
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { excerpt: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
        ];
      }

      let cursor = db.collection<BlogPost>('blog_posts').find(query, { projection: { _id: 0 } });
      if (options?.limit) {
        cursor = cursor.limit(options.limit);
      }

      return await cursor.toArray();
    }

    let result = [...this.blogPosts];

    if (options?.status && options.status !== 'all') {
      result = result.filter((p) => p.status === options.status);
    } else if (!options?.status) {
      result = result.filter((p) => p.status === 'published');
    }

    if (options?.categorySlug) {
      result = result.filter((p) => p.category_slug === options.categorySlug);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<BlogPost>('blog_posts')
        .findOne({ slug }, { projection: { _id: 0 } });
    }

    return this.blogPosts.find((p) => p.slug === slug) || null;
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<BlogPost>('blog_posts')
        .findOne({ id }, { projection: { _id: 0 } });
    }

    return this.blogPosts.find((p) => p.id === id) || null;
  }

  async saveBlogPost(postData: Partial<BlogPost>): Promise<BlogPost> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      if (postData.id) {
        const existing = await db
          .collection<BlogPost>('blog_posts')
          .findOne({ id: postData.id }, { projection: { _id: 0 } });
        if (existing) {
          const updated: BlogPost = {
            ...existing,
            ...postData,
            updated_at: new Date().toISOString(),
          } as BlogPost;
          await db.collection('blog_posts').updateOne({ id: postData.id }, { $set: updated });
          return updated;
        }
      }
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: postData.title || 'Untitled Article',
        slug: postData.slug || `article-${Date.now()}`,
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        featured_image_reference:
          postData.featured_image_reference ||
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        author_name: postData.author_name || 'GlobalCart Editorial Team',
        author_role: postData.author_role || 'Staff Reviewer',
        status: postData.status || 'published',
        category_slug: postData.category_slug || 'computers-and-accessories',
        category_name: postData.category_name || 'Computers & Accessories',
        published_at: postData.published_at || new Date().toISOString(),
        reading_time_minutes: postData.reading_time_minutes || 5,
        seo_title: postData.seo_title || `${postData.title} | GlobalCart`,
        seo_description: postData.seo_description || postData.excerpt || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await db.collection('blog_posts').insertOne({ ...newPost });
      return newPost;
    }

    if (postData.id) {
      const idx = this.blogPosts.findIndex((p) => p.id === postData.id);
      if (idx !== -1) {
        this.blogPosts[idx] = {
          ...this.blogPosts[idx],
          ...postData,
          updated_at: new Date().toISOString(),
        } as BlogPost;
        return this.blogPosts[idx];
      }
    }
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: postData.title || 'Untitled Article',
      slug: postData.slug || `article-${Date.now()}`,
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      featured_image_reference:
        postData.featured_image_reference ||
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      author_name: postData.author_name || 'GlobalCart Editorial Team',
      author_role: postData.author_role || 'Staff Reviewer',
      status: postData.status || 'published',
      category_slug: postData.category_slug || 'computers-and-accessories',
      category_name: postData.category_name || 'Computers & Accessories',
      published_at: postData.published_at || new Date().toISOString(),
      reading_time_minutes: postData.reading_time_minutes || 5,
      seo_title: postData.seo_title || `${postData.title} | GlobalCart`,
      seo_description: postData.seo_description || postData.excerpt || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.blogPosts.unshift(newPost);
    return newPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const res = await db.collection('blog_posts').deleteOne({ id });
      return res.deletedCount > 0;
    }

    const initialLen = this.blogPosts.length;
    this.blogPosts = this.blogPosts.filter((p) => p.id !== id);
    return this.blogPosts.length < initialLen;
  }

  // Affiliate Clicks
  async recordAffiliateClick(
    productId: string,
    marketplaceCode: MarketplaceCode,
    referrerPage?: string
  ): Promise<AffiliateClick> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const product = await db
        .collection<Product>('products')
        .findOne({ id: productId }, { projection: { _id: 0, name: 1 } });
      const newClick: AffiliateClick = {
        id: `clk-${Date.now()}`,
        product_id: productId,
        product_name: product?.name || 'Unknown Product',
        marketplace_code: marketplaceCode,
        clicked_at: new Date().toISOString(),
        referrer_page: referrerPage,
      };
      await db.collection('clicks').insertOne({ ...newClick });
      return newClick;
    }

    const product = this.products.find((p) => p.id === productId);
    const newClick: AffiliateClick = {
      id: `clk-${Date.now()}`,
      product_id: productId,
      product_name: product?.name || 'Unknown Product',
      marketplace_code: marketplaceCode,
      clicked_at: new Date().toISOString(),
      referrer_page: referrerPage,
    };
    this.clicks.unshift(newClick);
    return newClick;
  }

  async getAffiliateClicks(): Promise<AffiliateClick[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<AffiliateClick>('clicks')
        .find({}, { projection: { _id: 0 } })
        .sort({ clicked_at: -1 })
        .toArray();
    }

    return [...this.clicks];
  }

  // Activity Logs
  async logAdminActivity(
    adminName: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: string
  ): Promise<AdminActivityLog> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const log: AdminActivityLog = {
        id: `act-${Date.now()}`,
        admin_id: 'admin-current',
        admin_name: adminName,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        created_at: new Date().toISOString(),
      };
      await db.collection('activity_logs').insertOne({ ...log });
      return log;
    }

    const log: AdminActivityLog = {
      id: `act-${Date.now()}`,
      admin_id: 'admin-current',
      admin_name: adminName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString(),
    };
    this.activityLogs.unshift(log);
    return log;
  }

  async getActivityLogs(): Promise<AdminActivityLog[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<AdminActivityLog>('activity_logs')
        .find({}, { projection: { _id: 0 } })
        .sort({ created_at: -1 })
        .toArray();
    }

    return [...this.activityLogs];
  }

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const settings = await db
        .collection<SiteSettings>('settings')
        .findOne({}, { projection: { _id: 0 } });
      if (settings) {
        return settings;
      }
    }

    return { ...this.settings };
  }

  async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const current =
        (await db
          .collection<SiteSettings>('settings')
          .findOne({}, { projection: { _id: 0 } })) || INITIAL_SETTINGS;
      const updated: SiteSettings = {
        ...current,
        ...newSettings,
      };
      await db.collection('settings').updateOne({}, { $set: updated }, { upsert: true });
      return updated;
    }

    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    return { ...this.settings };
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await db
        .collection<NewsletterSubscriber>('subscribers')
        .findOne({ email: normalizedEmail }, { projection: { _id: 0 } });

      if (existing && existing.subscription_status === 'subscribed') {
        return { success: true, message: 'You are already subscribed to GlobalCart updates.' };
      }

      if (existing && existing.subscription_status === 'unsubscribed') {
        await db.collection('subscribers').updateOne(
          { email: normalizedEmail },
          {
            $set: {
              subscription_status: 'subscribed',
              consent_timestamp: new Date().toISOString(),
            },
          }
        );
        return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
      }

      const newSubscriber: NewsletterSubscriber = {
        id: `sub-${Date.now()}`,
        email: normalizedEmail,
        consent_timestamp: new Date().toISOString(),
        subscription_status: 'subscribed',
        unsubscribe_token_hash: `token-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      await db.collection('subscribers').insertOne({ ...newSubscriber });
      return { success: true, message: 'Thank you for subscribing! You will receive our buying guides.' };
    }

    const existing = this.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing && existing.subscription_status === 'subscribed') {
      return { success: true, message: 'You are already subscribed to GlobalCart updates.' };
    }
    if (existing && existing.subscription_status === 'unsubscribed') {
      existing.subscription_status = 'subscribed';
      existing.consent_timestamp = new Date().toISOString();
      return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
    }
    this.subscribers.push({
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      consent_timestamp: new Date().toISOString(),
      subscription_status: 'subscribed',
      unsubscribe_token_hash: `token-${Date.now()}`,
      created_at: new Date().toISOString(),
    });
    return { success: true, message: 'Thank you for subscribing! You will receive our buying guides.' };
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const db = await getMongoDb();
    if (db) {
      await ensureSeeded(db);
      return await db
        .collection<NewsletterSubscriber>('subscribers')
        .find({}, { projection: { _id: 0 } })
        .toArray();
    }

    return [...this.subscribers];
  }
}

// Global singleton instance across Next.js invocations
const globalForRepo = global as unknown as { repoInstance?: DataRepository };
export const repository = globalForRepo.repoInstance ?? new DataRepository();
if (process.env.NODE_ENV !== 'production') globalForRepo.repoInstance = repository;
