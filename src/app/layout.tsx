import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pazaryeri',
  description: 'E-ticaret pazaryeri uygulaması',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
