"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import Link from "next/link";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Swal from "sweetalert2"; // 🌟 นำเข้า SweetAlert2

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันสไตล์สำหรับเรียกใช้ SweetAlert แบบลักชู
  const showAlert = (
    title: string,
    text: string,
    icon: "success" | "error",
  ) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: "var(--color-brand, #3b82f6)",
      // ✅ ลบ borderRadius ออก แล้วย้ายมาใส่ใน customClass แทนเพื่อความถูกต้อง
      customClass: {
        popup: "rounded-3xl shadow-xl",
      },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      showAlert(
        "รหัสผ่านสั้นเกินไป",
        "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
        "error",
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showAlert(
        "ข้อมูลไม่ถูกต้อง",
        "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง",
        "error",
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (authError) throw authError;

      if (data.user?.identities?.length === 0) {
        showAlert(
          "สมัครสมาชิกไม่สำเร็จ",
          "อีเมลนี้ถูกใช้งานไปแล้ว กรุณาใช้อีเมลอื่น",
          "error",
        );
        setIsLoading(false);
        return;
      }

      // 🌟 ยิงแจ้งเตือนเมื่อสำเร็จแบบสวยงาม
      Swal.fire({
        title: "สมัครสมาชิกสำเร็จ!",
        text: "ยินดีต้อนรับเข้าสู่ระบบบันทึกสถิติการวิ่ง",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      showAlert(
        "เกิดข้อผิดพลาด",
        err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        "error",
      );
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    // 🌟 1. ยิง SweetAlert ขึ้นมาทักทายพร้อมไอคอนดาวน์โหลดแบบมินิมอล
    Swal.fire({
      title: "กำลังเชื่อมต่อกับ Google",
      text: "ระบบกำลังนำท่านไปยังหน้าลงทะเบียนด้วยบัญชี Google",
      icon: "info",
      showConfirmButton: false,
      timer: 1500, // โชว์เอฟเฟกต์ค้างไว้ 1.5 วินาทีให้ผู้ใช้เห็นความสวยงาม
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(); // สั่งให้หัวหมุนติ้วๆ แบบ Luxury
      },
    });

    // 🌟 2. รอให้แสดงผลครบ 1.5 วินาที แล้วค่อยวาร์ปไปหน้าเลือกบัญชี Google
    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (err: any) {
        showAlert(
          "การเชื่อมต่อล้มเหลว",
          "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google",
          "error",
        );
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full p-8 space-y-8 animate-luxury">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[var(--color-text-main)] tracking-tight">
            สร้างบัญชีใหม่
          </h2>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
            เริ่มต้นบันทึกสถิติการวิ่งของคุณได้ฟรีวันนี้
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          ลงทะเบียนด้วย Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[var(--color-surface)] text-[var(--color-text-muted)] font-bold">
              หรือระบุข้อมูลบัญชีใหม่
            </span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                ชื่อ - นามสกุล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-12 font-medium"
                  placeholder="สมชาย สายวิ่ง"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                อีเมล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 font-medium"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                รหัสผ่าน (ขั้นต่ำ 6 ตัว)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                ยืนยันรหัสผ่านอีกครั้ง
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-12 font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
            {isLoading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-[var(--color-text-muted)] font-medium">
            มีบัญชีผู้ใช้แล้ว?{" "}
          </span>
          <Link
            href="/auth/login"
            className="font-bold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors"
          >
            เข้าสู่ระบบเลย
          </Link>
        </div>
      </div>
    </div>
  );
}
