import {createTranslator} from "next-intl";

export default async function Home({params}) {
  const {locale} = await params; // Next.js 15: await params
  const messages = (await import(`@/messages/${locale}.json`)).default;

  const t = createTranslator({
    locale,
    messages,
    namespace: "home"
  });

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-sans text-brand-500 ltr:text-left rtl:text-right">
        {t("hello")}
      </p>
    </main>
  );
}
