import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n';
import { ThemeProvider } from '@/components/providers';
import Header from '@/components/organisms/Header/Header';
import Footer from '@/components/organisms/Footer/Footer';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }

  const dictionary = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pazaryeri.com';

  return {
    title: {
      default: dictionary.meta.siteTitle,
      template: `%s | ${dictionary.meta.siteTitle}`,
    },
    description: dictionary.meta.siteDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'tr': '/tr',
        'en': '/en',
      },
    },
    openGraph: {
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      siteName: dictionary.meta.siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('pazaryeri-theme');
                  var theme = stored ? JSON.parse(stored).state.theme : 'system';
                  var isDark = theme === 'dark' || 
                    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider>
          <Header
            lang={locale}
            dictionary={{
              navigation: dictionary.navigation,
              common: dictionary.common,
              theme: dictionary.theme,
            }}
          />
          <main className="flex-grow">
            {children}
          </main>
          <Footer
            lang={locale}
            dictionary={{
              navigation: dictionary.navigation,
              footer: dictionary.footer,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
