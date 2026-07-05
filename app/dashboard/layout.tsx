"use client"; // 🌟 สั่งให้ไฟล์นี้เปิดใช้งาน SweetAlert บนหน้าจอได้

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client"; // 🌟 เปลี่ยนมาใช้ client
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, User, LogOut } from "lucide-react";
import Swal from "sweetalert2";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ตรวจสอบเช็คยูสเซอร์ฝั่ง Client
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login"); // ถ้าไม่เจอยูสเซอร์ให้เด้งไปล็อกอิน
      } else {
        setUserEmail(user.email || "");
      }
    };
    checkUser();
  }, [supabase, router]);

  // 🌟 ฟังก์ชันล็อกเอาท์โชว์ป๊อปอัพ จบในไฟล์นี้เลย!
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบบันทึกสถิติการวิ่งใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-brand, #3b82f6)",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      customClass: { popup: "rounded-3xl shadow-xl" }
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "กำลังออกจากระบบ...",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // ยิง POST ไปที่หลังบ้านเพื่อเคลียร์คุกกี้ตามระบบเดิมของคุณ
      await fetch("/auth/signout", { method: "POST" });
      
      // วาร์ปกลับหน้าล็อกอินแบบสะอาดๆ
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <nav className="glass-nav border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-[var(--color-text-main)]">
                RUNNER<span className="text-[var(--color-brand)]">.</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              {userEmail && (
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                     <User className="w-4 h-4" />
                  </div>
                  <span className="hidden md:inline">{userEmail}</span>
                </Link>
              )}
              
              {/* ปุ่มล็อกเอาท์แบบผูก SweetAlert โดยตรง ไม่ต้องสร้างไฟล์ใหม่ */}
              <button 
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}