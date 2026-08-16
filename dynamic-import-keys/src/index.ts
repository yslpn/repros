const lang = new URLSearchParams(location.search).get('lang') ?? 'de';

export async function loadLocalLocale(lang: string) {
  return import(`./locales/${lang}.ts`);
}

void loadLocalLocale(lang).then(({ default: locale }) => {
  console.log(locale);
});
