# Pazaryeri - E-Commerce Frontend

Modern, performant ve SEO-optimized e-ticaret frontend uygulaması. Next.js 16, React 19, Tailwind CSS v4 ve TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

- **Çoklu Dil Desteği (i18n)**: Türkçe ve İngilizce
- **Dark/Light Mode**: Sistem tercihine uyumlu tema desteği
- **SEO Optimizasyonu**: Meta tags, Open Graph, JSON-LD structured data
- **Responsive Tasarım**: Mobile-first yaklaşım
- **Favoriler Sistemi**: LocalStorage ile kalıcı favoriler
- **Performans**: SSG, SSR, ISR rendering stratejileri

## 🛠️ Teknolojiler

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **State Management**: Zustand
- **Testing**: Jest, Fast-check (Property-based testing)
- **Documentation**: Storybook
- **Language**: TypeScript

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   └── [locale]/          # i18n dynamic routes
├── components/
│   ├── molecules/         # ProductCard, SearchBar, Pagination, ThemeToggle
│   ├── organisms/         # Header, Footer, ProductGrid, FilterSidebar
│   └── providers/         # ThemeProvider
├── data/mock/             # Mock data
├── i18n/                  # next-intl configuration
├── lib/
│   ├── i18n/              # Internationalization utilities
│   └── utils/             # Utility functions
├── services/              # API services (productService, categoryService)
├── shared/
│   ├── hooks/             # Custom hooks
│   ├── layout/            # Layout components
│   ├── providers/         # Shared providers
│   └── ui/                # shadcn/ui components
├── stores/                # Zustand stores (favorites, theme)
├── styles/                # Global styles and themes
├── types/                 # TypeScript definitions
└── __tests__/             # Property-based tests
```

## 🏃‍♂️ Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Production server
npm start
```

### Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Development server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm test` | Testleri çalıştır |
| `npm run lint` | ESLint kontrolü |
| `npm run storybook` | Storybook başlat (http://localhost:6006) |

## 🌐 Sayfalar

| Sayfa | URL | Rendering |
|-------|-----|-----------|
| Ana Sayfa | `/[lang]` | SSG |
| Ürünler | `/[lang]/products` | ISR (1 dakika) |
| Ürün Detay | `/[lang]/products/[slug]` | SSR |
| Favoriler | `/[lang]/favorites` | CSR |

## 🎨 Tema Sistemi

Dark/Light mode desteği:

```tsx
import { useThemeStore } from '@/stores/useThemeStore';

const { theme, setTheme, toggleTheme } = useThemeStore();

// Tema değiştir
setTheme('dark');  // 'light' | 'dark' | 'system'
toggleTheme();     // light <-> dark
```

## 🌍 i18n Kullanımı

```tsx
import { getDictionary } from '@/lib/i18n';

const dictionary = await getDictionary('tr'); // 'tr' | 'en'
console.log(dictionary.common.loading); // "Yükleniyor..."
```

## ❤️ Favoriler

```tsx
import { useFavoritesStore } from '@/stores/useFavoritesStore';

const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

addFavorite('product-id');
removeFavorite('product-id');
const isInFavorites = isFavorite('product-id');
```

## 🧪 Testler

Property-based testler ile kod kalitesi:

```bash
# Tüm testleri çalıştır
npm test

# Watch mode
npm run test:watch

# Coverage raporu
npm run test:coverage
```

### Test Kategorileri

- **i18n**: Dictionary yapısı ve çeviri tutarlılığı
- **Theme**: Tema geçişleri ve state yönetimi
- **Favorites**: Favori ekleme/çıkarma işlemleri
- **Accessibility**: ARIA attributes ve erişilebilirlik
- **SEO**: Metadata ve JSON-LD validasyonu

## 📚 Storybook

Component documentation:

```bash
npm run storybook
```

http://localhost:6006 adresinde tüm componentleri görüntüleyebilirsiniz.

## 🔧 Konfigürasyon

### Environment Variables

```env
NEXT_PUBLIC_BASE_URL=https://pazaryeri.com
NEXT_PUBLIC_USE_MOCK_DATA=true
```


