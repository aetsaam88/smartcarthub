
import React from 'react';
import { Mail, ShieldCheck, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | SmartCartHub',
  description:
    'Contact SmartCartHub for product inquiries, corrections, feedback, affiliate disclosures, and privacy requests.',
};

export default function ContactPage() {
  const email = 'dosktech02@gmail.com';
  const whatsappNumber = '923446561125';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact SmartCartHub
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Have a question about a product, need to report incorrect
          information, or want to share feedback? We would love to hear
          from you. Contact us through email or WhatsApp.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Email */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>

          <h3 className="font-bold text-slate-900 text-lg">
            Email Us
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            For general inquiries, product information, corrections,
            and feedback, send us an email.
          </p>

          <a
            href={`mailto:${email}`}
            className="block p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 hover:border-amber-400 hover:text-amber-600 transition-colors break-all"
          >
            {email}
          </a>

          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
        </div>

        {/* WhatsApp */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>

          <h3 className="font-bold text-slate-900 text-lg">
            WhatsApp Support
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Contact us on WhatsApp for general questions, website
            feedback, or other inquiries.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900">
            +{whatsappNumber}
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello SmartCartHub! I have a question about your website.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Compliance */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <strong className="text-slate-900 font-bold">
            Customer Support Notice
          </strong>
        </div>

        <p>
          SmartCartHub is an informational and affiliate website.
          We do not directly sell products or process payments.
          For orders, shipments, returns, or refunds, please contact
          the retailer from which you purchased the product.
        </p>

        <p>
          For details about how affiliate links work, read our{' '}
          <Link
            href="/affiliate-disclosure"
            className="text-amber-700 font-semibold underline"
          >
            Affiliate Disclosure
          </Link>.
        </p>
      </div>

    </div>
  );
}
