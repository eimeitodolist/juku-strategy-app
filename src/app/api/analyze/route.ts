import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, format, targets, price, memo, students } = body;

    if (!address) {
      return NextResponse.json({ error: "住所を入力してください" }, { status: 400 });
    }

    const totalCur = students.reduce(
      (sum: number, s: { cur: number }) => sum + Number(s.cur || 0),
      0
    );
    const totalGoal = students.reduce(
      (sum: number, s: { goal: number }) => sum + Number(s.goal || 0),
      0
    );
    const studentSummary = students
      .map((s: { grade: string; cur: number; goal: number }) =>
        `${s.grade}: 現在${s.cur}名 → 目標${s.goal}名`
      )
      .join("\n");

    const prompt = `あなたは学習塾経営の専門コンサルタントです。以下の情報をもとに、詳細な経営戦略レポートを日本語で作成してください。

## 塾の基本情報
- 住所：${address}
- 授業形態：${format}
- ターゲット：${targets.join("・")}
- 月謝帯：${price || "未定"}
- 追加情報：${memo || "なし"}

## 現在の在籍状況
${studentSummary}
合計：現在${totalCur}名 → 目標${totalGoal}名（差分：+${totalGoal - totalCur}名）

---

## レポート構成（必ずこの順番・この見出しで出力すること）

### 📍 エリア市場分析
- 住所から判断できる地域特性（住宅地・商業地・交通アクセスなど）
- 通塾圏（半径1〜2km）に存在すると思われる小学校・中学校の名称と推定生徒数
- 潜在的な小中学生の総数（通塾率20〜30%を掛けた通塾ポテンシャルも提示）
- 保護者の教育ニーズ傾向（共働き率、中学受験率の高低、など）

### 🏆 競合塾動向分析
- このエリアで想定される競合塾のタイプ（大手チェーン・地域密着型・オンラインなど）
- 授業形態「${format}」の市場ポジションと競合優位性・課題
- 価格帯「${price || "未定"}」の競合比較と差別化ポイント
- 参入余地（競合が少ないニッチな層やニーズ）の特定

### 📊 在籍生徒分析と募集優先度
以下を必ず含めること：
1. 学年別の充足率（現在数÷目標数）をランキング形式で提示
2. **最優先募集学年（TOP3）** と具体的な理由
3. 学年ミックスの健全性診断（偏りがある場合は警告）
4. 各学年の打ち手（集客施策の具体例）

### 🚀 経営戦略 5つのアクション
1〜5のアクションそれぞれについて：
- **やること**：具体的な施策内容
- **期待効果**：数値目標も含めて
- **注意点**：リスクや落とし穴

### 🗓️ 3ヶ月ロードマップ
- **1ヶ月目**：今すぐやること（基盤整備）
- **2ヶ月目**：認知拡大フェーズ
- **3ヶ月目**：成果確認と改善

### 💬 総評
この塾の最大の強みと最優先課題を3〜4文で端的に述べる。

---
出力はマークダウン形式。具体的・実践的な内容にし、一般論は避けること。数字や固有名詞を積極的に使うこと。`;

    // Use web_search tool for real market data
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      tools: [
        {
          type: "web_search_20250305" as const,
          name: "web_search",
        },
      ],
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from all content blocks
    let fullText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        fullText += block.text;
      }
    }

    return NextResponse.json({ result: fullText });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました。APIキーを確認してください。" },
      { status: 500 }
    );
  }
}
