"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // 👈 นำเข้าเครื่องมือตรวจ URL
import Swal from "sweetalert2";

export default function GoogleWelcomeAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 🌟 เปลี่ยนมาเช็คว่าบน URL มีคำว่า ?login=google หรือไม่
    const isGoogleLogin = searchParams.get("login") === "google";

    if (isGoogleLogin) {
      Swal.fire({
        title: "เชื่อมต่อสำเร็จ!",
        text: "ยินดีต้อนรับเข้าสู่ระบบด้วยบัญชี Google",
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-3xl shadow-2xl font-medium",
        }
      });

      // 🌟 โชว์เสร็จแล้ว สั่งลบ ?login=google ออกจาก URL บนแถบเว็บบนเบราว์เซอร์ 
      // เพื่อเวลาผู้ใช้กดรีเฟรชหน้าจอหลังจากนี้ ป๊อปอัพจะได้ไม่เด้งขึ้นมาซ้ำซ้อนให้รำคาญตา
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(`/dashboard${newQuery}`);
    }
  }, [searchParams, router]);

  return null;
}