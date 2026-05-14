# 🏫 学習塾 経営戦略アドバイザー

Claude AIが住所・授業形態・在籍生徒数をもとに、近隣学校の生徒数・競合塾動向・募集戦略を分析する学習塾向け経営アドバイスアプリです。

## 機能

- 📍 **エリア市場分析** — 住所から近隣の小中学校と推定生徒数をリサーチ
- 🏆 **競合塾動向分析** — 授業形態・価格帯ごとの競合ポジションを分析
- 📊 **在籍生徒分析** — 学年別の充足率と優先募集ターゲットを提示
- 🚀 **5つのアクションプラン** — 具体的な経営施策を提案
- 🗓️ **3ヶ月ロードマップ** — 今月から動ける優先順位付きリスト

## セットアップ

### 1. Claude Codeでプロジェクトを開く

```bash
# このディレクトリをClaude Codeで開く
cd juku-strategy-app
claude
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. APIキーの設定

`.env.local.example` をコピーして `.env.local` を作成し、APIキーを設定します：

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> APIキーは https://console.anthropic.com/ で取得できます

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## Claude Codeでの開発のヒント

Claude Codeのチャットで以下のように依頼すると、機能追加が簡単にできます：

```
「レポートをPDFでダウンロードできる機能を追加して」
「競合塾を手動で追加できるフォームを作って」
「分析履歴を保存できるようにして」
「グラフで在籍状況を可視化して」
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **ウェブ検索**: Claude Web Search Tool（リアルタイム競合情報の取得）
- **スタイリング**: CSS Modules

## ディレクトリ構成

```
juku-strategy-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts      # APIルート（Claude API呼び出し）
│   │   ├── globals.css           # グローバルスタイル
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # メインページ
│   │   └── page.module.css
│   ├── components/
│   │   ├── InputPanel.tsx        # 入力フォーム（左パネル）
│   │   ├── InputPanel.module.css
│   │   ├── ResultPanel.tsx       # 分析結果（右パネル）
│   │   └── ResultPanel.module.css
│   └── types.ts                  # 型定義
├── .env.local.example            # 環境変数テンプレート
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## 注意事項

- `.env.local` は `.gitignore` に含まれているため、GitHubにはアップロードされません
- APIキーは絶対にコードにハードコードしないでください
- 分析1回あたりのAPI使用量の目安：約3,000〜5,000トークン
