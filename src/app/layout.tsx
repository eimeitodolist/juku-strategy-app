import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学習塾 経営戦略アドバイザー",
  description: "AIが近隣の学校・競合塾・市場動向を分析し、あなただけの経営戦略を提案します",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
