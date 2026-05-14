export type Format = "集団授業" | "個別指導" | "集団＋個別（ハイブリッド）" | "オンライン";

export type StudentRow = {
  grade: string;
  cur: number;
  goal: number;
};

export type FormData = {
  address: string;
  format: Format;
  targets: string[];
  price: string;
  memo: string;
  students: StudentRow[];
};

export const DEFAULT_STUDENTS: StudentRow[] = [
  { grade: "小4", cur: 0, goal: 10 },
  { grade: "小5", cur: 5, goal: 15 },
  { grade: "小6", cur: 8, goal: 15 },
  { grade: "中1", cur: 12, goal: 20 },
  { grade: "中2", cur: 10, goal: 20 },
  { grade: "中3", cur: 18, goal: 25 },
];
