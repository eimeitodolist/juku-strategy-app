"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import ResultPanel from "@/components/ResultPanel";
import { FormData, DEFAULT_STUDENTS } from "@/types";
import styles from "./page.module.css";

type Step = "idle" | "active" | "done";

const DEFAULT_FORM: FormData = {
  address: "",
  format: "個別指導",
  targets: ["小学生", "中学生"],
  price: "2〜3万円（中高価格帯）",
  memo: "",
  students: DEFAULT_STUDENTS,
};

const STEP_DELAYS = [0, 900, 1800, 2700];

export default function Home() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<[Step, Step, Step, Step]>(["idle", "idle", "idle", "idle"]);

  const runAnalysis = async () => {
    if (isAnalyzing || !form.address.trim()) return;

    setIsAnalyzing(true);
    setResult("");
    setError("");
    setSteps(["idle", "idle", "idle", "idle"]);

    // Animate steps
    STEP_DELAYS.forEach((delay, i) => {
      setTimeout(() => {
        setSteps((prev) => {
          const next = [...prev] as [Step, Step, Step, Step];
          next[i] = "active";
          return next;
        });
      }, delay);
    });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "APIエラーが発生しました");

      // Mark all done
      setSteps(["done", "done", "done", "done"]);
      setResult(data.result);
    } catch (err) {
      setSteps(["idle", "idle", "idle", "idle"]);
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerIcon}>🏫</div>
        <div>
          <div className={styles.headerTitle}>学習塾 経営戦略アドバイザー</div>
          <div className={styles.headerSub}>AI-Powered Juku Strategy Planner</div>
        </div>
        <div className={styles.headerBadge}>POWERED BY CLAUDE AI</div>
      </header>

      {/* Main layout */}
      <div className={styles.main}>
        <div className={styles.left}>
          <InputPanel
            form={form}
            onChange={setForm}
            onAnalyze={runAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
        <div className={styles.right}>
          <ResultPanel
            form={form}
            result={result}
            isAnalyzing={isAnalyzing}
            error={error}
            steps={steps}
          />
        </div>
      </div>
    </div>
  );
}
