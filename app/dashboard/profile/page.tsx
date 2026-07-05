"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { User, Save, Loader2, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ฟังก์ชันสไตล์สำหรับเรียกใช้ SweetAlert แบบลักชู
  const showAlert = (title: string, text: string, icon: "success" | "error") => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: "var(--color-brand, #3b82f6)",
      customClass: {
        popup: "rounded-3xl shadow-xl font-medium",
      },
    });
  };

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        }

        setEmail(user.email || "");

        // ดึงข้อมูลชื่อจากตาราง profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profile) {
          setFullName(profile.full_name || "");
        }
      } catch (err: any) {
        showAlert("เกิดข้อผิดพลาด", err.message || "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์", "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ไม่พบเซสชันผู้ใช้ปัจจุบัน");

      // อัปเดตตาราง profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 🌟 ยิงกล่องข้อความความสำเร็จแบบหรูหราผ่าน SweetAlert
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ!",
        text: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      router.refresh();
    } catch (err: any) {
      showAlert("อัปเดตล้มเหลว", err.message || "ไม่สามารถอัปเดตโปรไฟล์ได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand)]" />
          <p className="text-sm font-bold text-[var(--color-text-muted)] animate-pulse">กำลังโหลดข้อมูลโปรไฟล์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 py-6 px-4">
      {/* ส่วนหัวของหน้าจอ (Header) */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-3 text-gray-500 hover:bg-white border-2 border-transparent hover:border-gray-200 rounded-2xl transition-all shadow-sm active:scale-95 bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tight">ตั้งค่าโปรไฟล์</h1>
          <p className="text-sm font-medium text-[var(--color-text-muted)] mt-0.5">จัดการข้อมูลส่วนตัวและข้อมูลบัญชีของคุณ</p>
        </div>
      </div>

      {/* บล็อกฟอร์มหลัก (Main Card) */}
      <div className="card p-8 animate-luxury space-y-6">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-5">
            
            {/* กล่องอินพุต: อีเมล (เปิดดูได้อย่างเดียว) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                ที่อยู่อีเมล <span className="text-gray-400 font-normal">(บัญชีหลัก ไม่สามารถเปลี่ยนได้)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input-field pl-12 bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200 font-medium"
                />
              </div>
            </div>

            {/* กล่องอินพุต: ชื่อ-นามสกุล */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]" htmlFor="fullName">
                ชื่อ - นามสกุล *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-12 font-medium focus:ring-2 focus:ring-offset-2"
                  placeholder="ชื่อของคุณเพื่อแสดงในระบบ"
                  disabled={isSaving}
                />
              </div>
            </div>

          </div>

          {/* ส่วนปุ่มกดบันทึกท้ายฟอร์ม */}
          <div className="pt-6 flex justify-end border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 cursor-pointer shadow-md min-w-[160px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>บันทึกการตั้งค่า</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}