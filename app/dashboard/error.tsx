"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // สามารถนำ Error ไปบันทึกลงระบบ Tracking เช่น Sentry ได้ที่นี่
    console.error("Dashboard caught an error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        โอ๊ะโอ! เกิดข้อผิดพลาดบางอย่าง
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        ดูเหมือนว่าระบบจะไม่สามารถดึงข้อมูลของคุณได้ในขณะนี้ อาจเกิดจากปัญหาการเชื่อมต่ออินเทอร์เน็ตหรือเซิร์ฟเวอร์
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm active:scale-95"
      >
        <RefreshCcw className="w-5 h-5" />
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}