"use client";

import { FormData } from "@/types";
import styles from "./ResultPanel.module.css";

type Step = "idle" | "active" | "done";

type Props = {
  form: FormData;
  result: string;
  isAnalyzing: boolean;
  error: string;
  steps: [Step, Step, Step, Step];
};

const STEP_LABELS = ["情報収集", "競合分析", "生徒数分析", "戦略立案"];

function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "<br/><br/>")
    .replace(/💡([^\n<]+)/g, '<div class="highlight">💡 $1</div>')
    .replace(/⚠️([^\n<]+)/g, '<div class="alertRed">⚠️ $1</div>')
    .replace(/✅([^\n<]+)/g, '<div class="alertGreen">✅ $1</div>');
}

export default function ResultPanel({ form, result, isAnalyzing, error, steps }: Props) {
  const isEmpty = !isAnalyzing && !result && !error;

  return (
    <div className={styles.panel}>
      {isEmpty && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <div className={styles.emptyTitle}>戦略レポートがここに表示されます</div>
          <div className={styles.emptySub}>
            左のフォームに校舎情報を入力して「AI戦略分析を実行」ボタンを押してください。
            AIが近隣の学校・競合塾・市場動向をリアルタイムで検索・分析し、
            あなただけの経営戦略を提案します。
          </div>
        </div>
      )}

      {(isAnalyzing || result || error) && (
        <div className={styles.content}>
          {/* Progress steps */}
          <div className={styles.progressSteps}>
            {STEP_LABELS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div className={`${styles.step} ${styles[steps[i]]}`}>
                  <span className={styles.dot} />
                  {label}
                </div>
                {i < 3 && <span className={styles.arrow}>›</span>}
              </div>
            ))}
          </div>

          {/* Result header */}
          <div className={styles.resultHeader}>
            <div className={styles.resultAddr}>📍 {form.address}</div>
            <div className={styles.resultTitle}>経営戦略レポート</div>
            <div className={styles.resultMeta}>
              <span className={styles.tag}>{form.format}</span>
              {form.targets.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
              {form.price && <span className={styles.tag}>{form.price}</span>}
              {isAnalyzing && <span className={styles.tag}>🔄 AI分析中...</span>}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>⚠️ {error}</div>
          )}

          {/* Loading skeleton */}
          {isAnalyzing && !result && (
            <div className={styles.card}>
              <div className={styles.cardLabel}>AI分析レポート生成中</div>
              {[80, 60, 90, 55, 75, 40].map((w, i) => (
                <div key={i} className={styles.skeleton} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={styles.card}>
              <div className={styles.cardLabel}>AI分析レポート</div>
              <div
                className={styles.aiContent}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
