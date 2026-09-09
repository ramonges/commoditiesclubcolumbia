import { useEffect } from 'react';

const DEFAULT_TITLE =
  'Columbia Commodity Club | Student-Led Platform Exploring Global Commodity Markets';
const DEFAULT_DESCRIPTION =
  'Columbia Commodity Club is a student-led platform bridging academia and global commodity markets through analysis, research, and events.';
const DEFAULT_IMAGE = 'https://www.columbia-commodity.com/assets/logo.png';
const DEFAULT_URL = 'https://www.columbia-commodity.com/';

interface PageSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  image?: string;
  type?: 'website' | 'profile';
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    const tagName = selector.startsWith('link') ? 'link' : 'meta';
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

function setJsonLd(data?: Record<string, unknown>) {
  const existing = document.getElementById('page-jsonld');
  if (existing) {
    existing.remove();
  }

  if (!data) return;

  const script = document.createElement('script');
  script.id = 'page-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function usePageSeo({
  title,
  description,
  canonicalUrl,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}: PageSeo) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    setJsonLd(jsonLd);

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      upsertMeta('meta[name="description"]', { name: 'description', content: DEFAULT_DESCRIPTION });
      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: DEFAULT_TITLE });
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: DEFAULT_DESCRIPTION });
      upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: DEFAULT_URL });
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_IMAGE });
      upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: DEFAULT_URL });
      setJsonLd(undefined);
    };
  }, [title, description, canonicalUrl, image, type, jsonLd]);
}
