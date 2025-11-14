import type { Locale } from './translations';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'nl' || lang === 'en') return lang;
  return 'fr';
}

export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, targetLang: string = lang) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');

    // Remove leading slash
    const cleanPath = path.replace(/^\//, '');

    // For default locale (fr), don't add prefix
    if (targetLang === 'fr') {
      return `${base}/${cleanPath}`;
    }

    // For other locales, add language prefix
    return `${base}/${targetLang}/${cleanPath}`;
  };
}
