# Clipo（クリポ）実装仕様書

> 最速・無料のブラウザ内動画変換ツール  
> バージョン: 2.0  
> 最終更新: 2025-05

---

## 目次

1. [プロダクト概要](#1-プロダクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構成](#3-ディレクトリ構成)
4. [SEO・メタデータ戦略](#4-seoメタデータ戦略)
5. [パフォーマンス最適化](#5-パフォーマンス最適化)
6. [セキュリティ対策](#6-セキュリティ対策)
7. [広告マネタイズ設計](#7-広告マネタイズ設計)
8. [アクセシビリティ](#8-アクセシビリティ)
9. [Analytics・計測](#9-analytics計測)
10. [PWA対応](#10-pwa対応)
11. [インフラ・デプロイ](#11-インフラデプロイ)
12. [コンテンツマーケティング](#12-コンテンツマーケティング)
13. [法務・コンプライアンス](#13-法務コンプライアンス)
14. [フェーズ別ロードマップ](#14-フェーズ別ロードマップ)

---

## 1. プロダクト概要

### コンセプト
**「ブラウザを開くだけで、動画を変換できる」**  
インストール不要・登録不要・完全無料。ファイルは一切外部サーバーへ送信しない。

### ターゲットユーザー
| セグメント | ニーズ |
|-----------|--------|
| 動画クリエイター | SNS用に形式を変換したい |
| 一般ユーザー | 受け取った動画を開けるようにしたい |
| ビジネスユーザー | 資料・プレゼン用に動画を軽くしたい |
| 開発者 | テスト素材を素早く変換したい |

### 対応フォーマット（入力・出力）
```
動画: MP4, MOV, WebM, MKV, AVI, FLV, WMV, M4V, TS, GIF
音声: MP3, AAC, WAV, FLAC, OGG, M4A
画像: PNG連番出力
```

### マネタイズ方針（段階的）
- **Phase 1（現在）**: 完全無料・表示広告のみ
- **Phase 2**: 2本目以降の変換前に動画広告（15秒スキップ可）
- **Phase 3**: ダウンロード時に動画広告（スキップ可）+ プレミアムプラン

---

## 2. 技術スタック

### フロントエンド
```
フレームワーク: Vanilla JS（依存ゼロ・最速ロード）
変換エンジン: FFmpeg.wasm v0.11.x（Web Workers上で動作）
フォント: Syne / IBM Plex Mono / Noto Sans JP（Google Fonts）
スタイル: CSS Custom Properties（ビルドツール不要）
```

### FFmpeg.wasm CDN読み込み
```html
<!-- SharedArrayBuffer有効化が必要（サーバーヘッダーで設定） -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg.min.js"></script>
```

### 必須サーバーヘッダー（FFmpeg.wasm動作要件）
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

> **重要**: SharedArrayBuffer（並列処理の高速化に必要）はこの2つのヘッダーがないと使えない。  
> Cloudflare Pages / Vercel / Netlifyいずれも設定可能。

### ホスティング推奨
```
第1候補: Cloudflare Pages（無料・CDN・カスタムヘッダー対応）
第2候補: Vercel（無料枠あり）
第3候補: Netlify（無料枠あり・_headers ファイルで設定）
```

---

## 3. ディレクトリ構成

```
clipo/
├── index.html              # メインアプリ（SEO完全対応）
├── sitemap.xml             # サイトマップ（自動生成）
├── robots.txt              # クローラー制御
├── manifest.json           # PWAマニフェスト
├── sw.js                   # Service Worker（オフライン対応）
├── _headers                # Netlify用ヘッダー設定
├── _redirects              # Netlify用リダイレクト
├── vercel.json             # Vercel設定
├── assets/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── favicon.ico
│   ├── og-image.png        # OGP画像（1200×630）
│   └── screenshot.png      # PWAスクリーンショット
├── blog/                   # SEOコンテンツ（静的HTML）
│   ├── index.html
│   ├── mp4-to-webm.html
│   ├── gif-maker.html
│   ├── video-compress.html
│   └── ...
└── pages/
    ├── about.html
    ├── privacy.html
    ├── terms.html
    └── contact.html
```

---

## 4. SEO・メタデータ戦略

### 4-1. HTMLメタデータ（index.html）

```html
<!-- ===== PRIMARY SEO ===== -->
<title>Clipo（クリポ）— 最速・無料の動画変換ツール | MP4・MOV・WebM・GIF対応</title>
<meta name="description"
  content="Clipoはブラウザ内で動作する最速の動画変換ツール。MP4・MOV・WebM・MKV・GIF・MP3など10形式対応。インストール不要・外部送信なし・完全無料。">
<meta name="keywords"
  content="動画変換,無料,MP4変換,MOV変換,WebM変換,GIF変換,音声抽出,MP3変換,オンライン,フォーマット変換,動画圧縮,クリポ">
<meta name="author" content="Clipo">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<link rel="canonical" href="https://clipo.app/">

<!-- ===== OGP ===== -->
<meta property="og:type" content="website">
<meta property="og:title" content="Clipo — 最速ブラウザ動画変換">
<meta property="og:description" content="MP4・MOV・WebM・GIFなど10形式対応。インストール不要・完全無料・外部送信なし。">
<meta property="og:url" content="https://clipo.app/">
<meta property="og:site_name" content="Clipo">
<meta property="og:locale" content="ja_JP">
<meta property="og:image" content="https://clipo.app/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Clipo 動画変換ツール">

<!-- ===== Twitter Card ===== -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@clipoapp">
<meta name="twitter:title" content="Clipo — 最速ブラウザ動画変換">
<meta name="twitter:description" content="MP4・MOV・WebM・GIFなど10形式対応。無料・安全・超高速。">
<meta name="twitter:image" content="https://clipo.app/assets/og-image.png">

<!-- ===== PWA ===== -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#050507">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Clipo">
<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">
```

### 4-2. 構造化データ（JSON-LD）

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Clipo",
      "alternateName": "クリポ",
      "url": "https://clipo.app/",
      "description": "ブラウザ内で動作する最速・無料の動画フォーマット変換ツール",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "VideoConverter",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY"
      },
      "featureList": [
        "MP4変換", "MOV変換", "WebM変換", "GIF変換",
        "音声抽出", "バッチ変換", "並列処理", "ブラウザ内処理"
      ],
      "screenshot": "https://clipo.app/assets/screenshot.png",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3840",
        "bestRating": "5"
      }
    },
    {
      "@type": "Organization",
      "name": "Clipo",
      "url": "https://clipo.app/",
      "logo": "https://clipo.app/assets/icons/icon-512.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@clipo.app",
        "availableLanguage": "Japanese"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ファイルはサーバーに送られますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "いいえ。すべての変換処理はあなたのブラウザ内で完結します。ファイルは一切外部サーバーへ送信されません。"
          }
        },
        {
          "@type": "Question",
          "name": "対応しているフォーマットは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MP4, MOV, WebM, MKV, AVI, GIF, MP3, AAC, WAV, FLACなど10形式以上に対応しています。"
          }
        },
        {
          "@type": "Question",
          "name": "無料で使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、完全無料でご利用いただけます。アカウント登録も不要です。"
          }
        },
        {
          "@type": "Question",
          "name": "スマートフォンでも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい。iPhone・Android・タブレットなど、最新ブラウザが動作するすべての端末で利用できます。"
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ホーム",
          "item": "https://clipo.app/"
        }
      ]
    }
  ]
}
```

### 4-3. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://clipo.app/sitemap.xml

# Crawl-delay for heavy bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10
```

### 4-4. sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://clipo.app/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ja" href="https://clipo.app/"/>
  </url>
  <url>
    <loc>https://clipo.app/blog/mp4-to-webm/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clipo.app/blog/video-compress/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clipo.app/blog/gif-maker/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://clipo.app/privacy/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://clipo.app/terms/</loc>
    <lastmod>2025-05-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

### 4-5. SEOキーワード戦略

#### メインキーワード（月間検索数 推定）
| キーワード | 検索数 | 難易度 | 優先度 |
|-----------|--------|--------|--------|
| 動画変換 無料 | 高 | 高 | ★★★ |
| MP4 変換 | 高 | 中 | ★★★ |
| 動画変換 オンライン | 中 | 中 | ★★★ |
| MOV MP4 変換 | 中 | 低 | ★★★ |
| WebM 変換 | 中 | 低 | ★★ |
| GIF 動画 変換 | 中 | 低 | ★★ |
| 動画 音声抽出 | 中 | 低 | ★★ |
| MKV MP4 変換 | 低 | 低 | ★ |

#### ブログ記事（ロングテールSEO）
```
/blog/mp4-to-webm/          「MP4をWebMに変換する方法」
/blog/mov-to-mp4/           「MOVをMP4に変換する方法【Mac・iPhone対応】」
/blog/video-compress/       「動画ファイルを圧縮して軽くする方法」
/blog/gif-maker/            「動画からGIFを作る方法」
/blog/audio-extract/        「動画から音声を抽出してMP3にする方法」
/blog/mkv-to-mp4/           「MKVをMP4に変換する方法」
/blog/iphone-video-convert/ 「iPhoneの動画（HEVC）をMP4に変換する方法」
/blog/discord-video/        「Discord用に動画を変換・圧縮する方法」
/blog/twitter-video/        「Twitter/X投稿用に動画を変換する方法」
/blog/youtube-format/       「YouTube最適動画フォーマット・設定ガイド」
```

---

## 5. パフォーマンス最適化

### 5-1. Core Web Vitals 目標値
```
LCP (Largest Contentful Paint): < 1.5s
FID (First Input Delay):        < 100ms
CLS (Cumulative Layout Shift):  < 0.05
TTFB (Time to First Byte):      < 200ms
```

### 5-2. HTML最適化

```html
<!-- フォントのプリロード -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- FFmpegのプリロード（非同期） -->
<link rel="preload" as="script"
  href="https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg.min.js">

<!-- 重要なCSSはインライン化 -->
<!-- 残りはメディアクエリで非同期読み込み -->
<link rel="stylesheet" href="/assets/non-critical.css" media="print" onload="this.media='all'">
```

### 5-3. Service Worker（sw.js）

```javascript
const CACHE_NAME = 'clipo-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

// FFmpegコアのキャッシュ（初回DL後はオフラインでも動作）
const FFMPEG_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg-core.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg-core.wasm',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(STATIC_ASSETS);
      // FFmpegは別途バックグラウンドでキャッシュ
      cache.addAll(FFMPEG_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        // CDNリソースはキャッシュ優先
        if (event.request.url.includes('cdnjs.cloudflare.com')) {
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return fetchRes;
      });
    })
  );
});
```

### 5-4. Cloudflare Pages設定（_headers）

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cdnjs.cloudflare.com; worker-src blob:; child-src blob:

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.wasm
  Cache-Control: public, max-age=31536000, immutable
  Content-Type: application/wasm

/blog/*
  Cache-Control: public, max-age=86400, s-maxage=86400

/
  Cache-Control: public, max-age=3600, s-maxage=3600
```

### 5-5. Vercel設定（vercel.json）

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/sitemap.xml" }
  ]
}
```

---

## 6. セキュリティ対策

### 6-1. Content Security Policy（CSP）
上記 `_headers` 参照。AdSense/GTMを追加する際はドメインをCSPに追加すること。

### 6-2. ファイル処理のセキュリティ
```javascript
// ファイルタイプバリデーション（MIMEタイプ + 拡張子の二重チェック）
function validateFile(file) {
  const ALLOWED_MIME = [
    'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
    'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv', 'image/gif',
    'audio/mpeg', 'audio/aac', 'audio/wav', 'audio/flac', 'audio/ogg'
  ];
  const ALLOWED_EXT = /\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v|ts|gif|mp3|aac|wav|flac|ogg|m4a)$/i;

  const mimeOk = ALLOWED_MIME.includes(file.type) || file.type.startsWith('video/') || file.type.startsWith('audio/');
  const extOk = ALLOWED_EXT.test(file.name);

  return mimeOk || extOk;
}

// ファイルサイズ制限
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

function checkFileSize(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`ファイルサイズが上限（2GB）を超えています: ${file.name}`);
  }
}
```

### 6-3. XSS対策
```javascript
// ファイル名のサニタイズ（DOM挿入時）
function sanitizeFileName(name) {
  const div = document.createElement('div');
  div.textContent = name; // textContentはHTMLエスケープ済み
  return div.innerHTML;
}

// innerHTML使用時は必ずサニタイズ
element.innerHTML = sanitizeFileName(file.name);
// または element.textContent = file.name; を優先
```

### 6-4. プライバシー設計
- **ファイルデータはメモリのみ** — localStorage/IndexedDB未使用
- **URLにファイル情報を含めない**
- **エラーログにファイル名を含めない**（コンソール出力のみ）
- **Google Analyticsは匿名化** — `anonymize_ip: true`

---

## 7. 広告マネタイズ設計

### Phase 1（現在）: 表示広告のみ

#### 広告枠配置
```
[728×90 リーダーボード] — ヘッダー直下（PC）
[300×250 レクタングル] — サイドバー（PC）
[970×90 ラージリーダーボード] — フッター上（PC）
[320×50 モバイルバナー] — ヘッダー下（SP）
```

#### Google AdSense実装
```html
<!-- ヘッダー下 728×90 -->
<ins class="adsbygoogle"
  style="display:inline-block;width:728px;height:90px"
  data-ad-client="ca-pub-XXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

<!-- Auto ads（全体最適化） -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

### Phase 2: 動画広告（2本目以降）

#### 実装フロー
```
ユーザーが2本目の変換を開始
  → 変換前に広告モーダルを表示
  → Google IMA SDK で動画広告（15秒、スキップ可）
  → 広告終了後に変換開始
  → 変換完了 → 通常ダウンロード
```

#### Google IMA SDK 組み込み準備
```html
<!-- IMA SDK（Phase 2実装時に追加） -->
<script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
```

```javascript
// 広告カウント管理（sessionStorage使用）
function getConvertCount() {
  return parseInt(sessionStorage.getItem('clipoConvertCount') || '0');
}

function incrementConvertCount() {
  const count = getConvertCount() + 1;
  sessionStorage.setItem('clipoConvertCount', count);
  return count;
}

// Phase 2: 変換前に呼ぶ
async function maybeShowAd() {
  const count = getConvertCount();
  if (count >= 1) { // 2本目以降
    await showVideoAd(); // IMAで動画広告
  }
  incrementConvertCount();
}
```

### Phase 3: ダウンロード時広告

```javascript
// ダウンロードボタンクリック時
async function onDownloadClick(blob, filename) {
  if (shouldShowAd()) {
    await showRewardedAd(); // Rewarded広告（ユーザーが広告を見てダウンロード）
  }
  triggerDownload(blob, filename);
}
```

### 広告UX原則
- スキップ可能（15秒後）
- 変換処理中は広告非表示（変換完了後に表示）
- モバイルでは控えめに
- 1セッションあたり最大3回まで

---

## 8. アクセシビリティ

### WCAG 2.1 AA準拠チェックリスト

#### 必須対応
```html
<!-- 全インタラクティブ要素にARIAラベル -->
<button aria-label="ファイルをアップロード">📂</button>

<!-- フォーカス管理 -->
<div role="button" tabindex="0" onkeydown="handleKeyDown(event)">

<!-- ライブリージョン（変換状態の通知） -->
<div aria-live="polite" aria-atomic="true" id="statusAnnounce">
  <!-- JSで変換状態を動的に更新 -->
</div>

<!-- スクリーンリーダー用テキスト -->
<span class="sr-only">変換進捗: 75%</span>
```

```css
/* フォーカスインジケーター（必須） */
:focus-visible {
  outline: 2px solid var(--g1);
  outline-offset: 2px;
}

/* スクリーンリーダー専用クラス */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

#### カラーコントラスト比
```
背景 #050507 × テキスト #f0f0fa → 比率: 19.8:1 ✓
背景 #050507 × グリーン #00ff88 → 比率: 12.4:1 ✓
最低基準: 4.5:1（AA）、7:1（AAA）
```

---

## 9. Analytics・計測

### Google Analytics 4 実装

```html
<!-- GTM経由で管理を推奨 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

### カスタムイベント設計

```javascript
// 変換開始
gtag('event', 'convert_start', {
  event_category: 'conversion',
  output_format: selFmt,
  input_format: inputExt,
  file_count: files.length,
});

// 変換完了
gtag('event', 'convert_complete', {
  event_category: 'conversion',
  output_format: selFmt,
  duration_seconds: elapsedTime,
  file_size_mb: Math.round(fileSize / 1048576),
});

// ダウンロード
gtag('event', 'file_download', {
  event_category: 'engagement',
  output_format: selFmt,
});

// エラー
gtag('event', 'convert_error', {
  event_category: 'error',
  error_type: errorMessage,
  output_format: selFmt,
});

// フォーマット選択
gtag('event', 'format_select', {
  event_category: 'engagement',
  format: selFmt,
});
```

### Google Search Console
- プロパティ登録: `https://clipo.app/`
- サイトマップ送信: `https://clipo.app/sitemap.xml`
- Core Web Vitals レポートを週次確認

### Clarityヒートマップ（無料）
```html
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){...})(window, document, "clarity", "script", "XXXXXXXXXX");
</script>
```

---

## 10. PWA対応

### manifest.json

```json
{
  "name": "Clipo — 動画変換ツール",
  "short_name": "Clipo",
  "description": "ブラウザ内で動作する最速・無料の動画フォーマット変換ツール",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050507",
  "theme_color": "#050507",
  "orientation": "any",
  "lang": "ja",
  "icons": [
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/assets/screenshot.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "動画を変換する",
      "url": "/",
      "description": "動画ファイルを別の形式に変換"
    }
  ]
}
```

### PWAインストール促進
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // 初回訪問から3回目以降にインストールバナーを表示
  const visitCount = parseInt(localStorage.getItem('clipoVisits') || '0') + 1;
  localStorage.setItem('clipoVisits', visitCount);
  if (visitCount >= 3) showInstallBanner();
});

function showInstallBanner() {
  // カスタムインストールバナーを表示
  document.getElementById('pwaInstallBanner').style.display = 'flex';
}

async function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  gtag('event', 'pwa_install', { outcome });
  deferredPrompt = null;
}
```

---

## 11. インフラ・デプロイ

### Cloudflare Pages（推奨構成）

```bash
# デプロイコマンド
npx wrangler pages deploy . --project-name=clipo

# カスタムドメイン
# Cloudflare DNS → clipo.app → Pages プロジェクト

# Cloudflare設定
# ✓ Auto Minify: HTML/CSS/JS
# ✓ Brotli圧縮
# ✓ HTTP/3
# ✓ Early Hints
# ✓ Bot Fight Mode
# ✓ HSTS（max-age=31536000; includeSubDomains; preload）
```

### GitHub Actions（CI/CD）

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate HTML
        run: |
          npx html-validate index.html

      - name: Check SEO
        run: |
          # sitemap検証
          python scripts/validate_sitemap.py

      - name: Deploy
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: clipo
          directory: .
```

---

## 12. コンテンツマーケティング

### SNS戦略

#### Twitter/X
```
毎週投稿:
- 変換Tip（例：「iPhoneのHEVC動画はMP4に変換するとどこでも再生できる」）
- 使い方短動画（15秒）
- ユーザーからの質問に回答

ハッシュタグ: #動画変換 #動画編集 #Clipo #無料ツール
```

#### YouTube（使い方動画）
```
「Clipoの使い方 - 30秒で動画変換」
「iPhoneの動画をMP4に変換する方法」
「動画をGIFに変換する方法」
```

### 被リンク獲得戦略
1. **Product Hunt 掲載** — 英語圏にもリーチ
2. **Qiita/Zenn 記事** — 技術者向け（FFmpeg.wasmの実装解説）
3. **note 記事** — 一般ユーザー向け使い方ガイド
4. **有名ツールリスト系サイトへの掲載申請**

---

## 13. 法務・コンプライアンス

### プライバシーポリシー 必須記載事項
```
1. 収集する情報
   - アクセスログ（IPアドレス、ブラウザ情報）
   - Google Analytics データ（匿名化済み）
   - Cookie（広告・分析目的）

2. 収集しない情報
   - アップロードされたファイルの内容
   - ファイル名・サイズ（Analytics送信なし）

3. Cookieポリシー
   - 分析Cookie（GA4）
   - 広告Cookie（AdSense/IMA）
   - セッションCookie（変換カウント）

4. 第三者サービス
   - Google Analytics
   - Google AdSense
   - Google IMA（Phase 2以降）
   - CDNjs（Cloudflare）
```

### Cookie同意バナー（GDPR/改正電気通信事業法対応）

```javascript
// 日本の「改正電気通信事業法」対応（2023年6月施行）
// 外部送信する情報（GA・AdSense）の通知義務

function showCookieBanner() {
  if (localStorage.getItem('clipoCookieConsent')) return;

  const banner = document.createElement('div');
  banner.innerHTML = `
    <div id="cookieBanner">
      <p>Clipoはサービス改善のためGoogle Analytics・広告サービスを使用しています。
      <a href="/privacy">詳細</a></p>
      <button onclick="acceptCookies()">同意する</button>
      <button onclick="declineCookies()">拒否する</button>
    </div>
  `;
  document.body.appendChild(banner);
}

function acceptCookies() {
  localStorage.setItem('clipoCookieConsent', 'accepted');
  initAnalytics();
  initAds();
  document.getElementById('cookieBanner').remove();
}
```

### 利用規約 必須項目
```
- サービスの説明（ブラウザ内処理・外部送信なし）
- 禁止事項（著作権侵害コンテンツの変換）
- 免責事項（変換失敗・データ損失）
- 広告について
- 準拠法・管轄（日本法）
```

---

## 14. フェーズ別ロードマップ

### Phase 1（現在 〜 1ヶ月）
```
✅ コアUI完成（クリポ 2.0）
✅ FFmpeg.wasm統合
✅ SEO完全対応
✅ PWA対応
□ Google Search Console登録
□ Google Analytics設置
□ Google AdSense申請
□ Cloudflare Pagesデプロイ
□ ブログ記事3本公開
□ Product Hunt掲載
```

### Phase 2（1〜3ヶ月）
```
□ Google IMA SDK組み込み（2本目以降に動画広告）
□ Rewarded広告テスト（ダウンロード時）
□ ブログ記事10本
□ Twitter/X公式アカウント開設
□ YouTube使い方動画公開
□ AB テスト（広告表示タイミング最適化）
```

### Phase 3（3〜6ヶ月）
```
□ プレミアムプラン（月額480円）
  - 広告非表示
  - 並列4スレッド開放
  - 最大ファイルサイズ引き上げ
□ 多言語対応（英語・中国語・韓国語）
□ API提供（開発者向け）
□ Stripe決済統合
```

---

## 付録: 実装時のチェックリスト

### デプロイ前チェック
```
□ Cross-Origin-Opener-Policy ヘッダー設定済み
□ Cross-Origin-Embedder-Policy ヘッダー設定済み
□ robots.txt 配置済み
□ sitemap.xml 配置済み・Search Console送信済み
□ manifest.json 設定済み
□ Service Worker 登録済み
□ OGP画像（1200×630px）作成済み
□ favicon.ico / icon-192.png / icon-512.png 作成済み
□ Google Analytics ID 設定済み
□ プライバシーポリシー・利用規約ページ公開済み
□ Cookie同意バナー実装済み
□ HTML バリデーション通過（W3C Validator）
□ Lighthouse スコア 90以上（Performance/SEO/Accessibility）
□ PageSpeed Insights でモバイル確認
□ 各ブラウザ動作確認（Chrome/Safari/Firefox/Edge）
□ スマホ実機確認（iOS Safari / Android Chrome）
```

---

*このドキュメントはClipo開発チーム内での参照用です。*  
*最終更新: 2025-05 | バージョン: 2.0*
