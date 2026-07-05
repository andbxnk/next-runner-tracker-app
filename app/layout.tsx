import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

// โหลดฟอนต์ Inter
const notoThai = Noto_Sans_Thai({ subsets: ["latin", "thai"] });

// ตั้งค่า SEO และข้อมูลพื้นฐานของเว็บ
export const metadata: Metadata = {
  title: "Runner Tracker | บันทึกทุกก้าว พิชิตทุกเป้าหมาย",
  description: "แพลตฟอร์มบันทึกสถิติการวิ่ง ติดตามระยะทาง และเก็บภาพความประทับใจสำหรับนักวิ่งทุกคน",
  keywords: ["วิ่ง", "บันทึกการวิ่ง", "นักวิ่ง", "runner", "tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={notoThai.className}>
        {children}
      </body>
    </html>
  );
}