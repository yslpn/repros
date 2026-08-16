const lang = new URLSearchParams(location.search).get('lang') ?? 'de';

export async function loadValibotLocale(lang: string) {
  return import(`@valibot/i18n/${lang}`);
}

void loadValibotLocale(lang);
