"use client";

import { FormData, Format, StudentRow, DEFAULT_STUDENTS } from "@/types";
import styles from "./InputPanel.module.css";

type Props = {
  form: FormData;
  onChange: (form: FormData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
};

const FORMATS: { value: Format; icon: string; label: string }[] = [
  { value: "集団授業", icon: "👥", label: "集団授業" },
  { value: "個別指導", icon: "🧑‍🏫", label: "個別指導" },
  { value: "集団＋個別（ハイブリッド）", icon: "🔀", label: "ハイブリッド" },
  { value: "オンライン", icon: "💻", label: "オンライン" },
];

const PRICES = [
  { value: "", label: "未定・非公開" },
  { value: "〜1万円（低価格帯）", label: "〜1万円（低価格帯）" },
  { value: "1〜2万円（中価格帯）", label: "1〜2万円（中価格帯）" },
  { value: "2〜3万円（中高価格帯）", label: "2〜3万円（中高価格帯）" },
  { value: "3万円以上（高価格帯）", label: "3万円以上（高価格帯）" },
];

export default function InputPanel({ form, onChange, onAnalyze, isAnalyzing }: Props) {
  const update = (patch: Partial<FormData>) => onChange({ ...form, ...patch });

  const toggleTarget = (t: string) => {
    const next = form.targets.includes(t)
      ? form.targets.filter((x) => x !== t)
      : [...form.targets, t];
    update({ targets: next });
  };

  const updateStudent = (i: number, field: keyof StudentRow, value: number) => {
    const next = form.students.map((s, idx) =>
      idx === i ? { ...s, [field]: value } : s
    );
    update({ students: next });
  };

  const addGrade = () => {
    const grades = ["小1", "小2", "小3", "高1", "高2", "高3"];
    const existing = form.students.map((s) => s.grade);
    const next = grades.find((g) => !existing.includes(g));
    if (next) update({ students: [...form.students, { grade: next, cur: 0, goal: 10 }] });
  };

  const removeStudent = (i: number) => {
    update({ students: form.students.filter((_, idx) => idx !== i) });
  };

  return (
    <div className={styles.panel}>
      {/* ── 基本情報 ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>校舎基本情報</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>住所（市区町村・番地）</label>
          <input
            className={styles.input}
            type="text"
            placeholder="例：埼玉県朝霞市根岸台１丁目"
            value={form.address}
            onChange={(e) => update({ address: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>授業形態</label>
          <div className={styles.radioGrid}>
            {FORMATS.map((f) => (
              <label key={f.value} className={styles.radioCard}>
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={form.format === f.value}
                  onChange={() => update({ format: f.value })}
                />
                <span className={styles.radioLabel}>
                  <span className={styles.radioIcon}>{f.icon}</span>
                  {f.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>主なターゲット（複数選択可）</label>
          <div className={styles.checkGroup}>
            {["小学生", "中学生", "高校生"].map((t) => (
              <label key={t} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.targets.includes(t)}
                  onChange={() => toggleTarget(t)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>月謝の価格帯（任意）</label>
          <select
            className={styles.select}
            value={form.price}
            onChange={(e) => update({ price: e.target.value })}
          >
            {PRICES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ── 生徒数 ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>自塾の在籍生徒数（任意）</div>
        <p className={styles.hint}>現在の在籍状況を入力すると、募集戦略のアドバイスが得られます</p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>学年</th>
              <th>在籍数</th>
              <th>目標数</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.students.map((s, i) => (
              <tr key={i}>
                <td>{s.grade}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={s.cur}
                    onChange={(e) => updateStudent(i, "cur", Number(e.target.value))}
                    className={styles.numInput}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={s.goal}
                    onChange={(e) => updateStudent(i, "goal", Number(e.target.value))}
                    className={styles.numInput}
                  />
                </td>
                <td>
                  <button className={styles.removeBtn} onClick={() => removeStudent(i)} title="削除">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={styles.addBtn} onClick={addGrade}>
          ＋ 学年を追加
        </button>
      </section>

      <div className={styles.divider} />

      {/* ── 追加情報 ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>追加情報（任意）</div>
        <textarea
          className={styles.textarea}
          placeholder="例：開校したばかりで認知度が低い、英語に力を入れたい、近くに大型マンションが建設予定、競合の〇〇塾が強い　など"
          value={form.memo}
          onChange={(e) => update({ memo: e.target.value })}
        />
      </section>

      {/* ── ボタン ── */}
      <div className={styles.btnWrapper}>
        <button
          className={styles.analyzeBtn}
          onClick={onAnalyze}
          disabled={isAnalyzing || !form.address.trim()}
        >
          {isAnalyzing ? (
            <>
              <span className={styles.spinner} />
              分析中...
            </>
          ) : (
            "🔍 AI戦略分析を実行する"
          )}
        </button>
      </div>
    </div>
  );
}
