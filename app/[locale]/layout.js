import "../globals.css";
import {NextIntlClientProvider} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getMessages(locale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export default async function RootLayout(props) {
  const {children, params} = props;
  const {locale} = await params; 

  if (!routing.locales.includes(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
