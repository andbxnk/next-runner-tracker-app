"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

export default function GoogleWelcomeAlert() {
  useEffect(() => {
    // 🌟 ดักเช็คใน sessionStorage ว่ารอบนี้เคยเปิดทักทายไปหรือยัง
    const hasWelcomed = sessionStorage.getItem("google_success_shown");

    if (!hasWelcomed) {
      Swal.fire({
        title: "เชื่อมต่อสำเร็จ!",
        text: "ยินดีต้อนรับเข้าสู่ระบบด้วยบัญชี Google",
        icon: "success",
        timer: 2500, // โชว์ค้างไว้ 2.5 วินาที
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-3xl shadow-2xl font-medium",
        }
      });

      // บันทึกไว้ว่าแสดงผลแล้ว กดรีเฟรชหน้าจอหลังจากนี้จะไม่ขึ้นซ้ำซ้อน
      sessionStorage.setItem("google_success_shown", "true");
    }
  }, []);

  return null; // คอมโพเนนต์นี้ทำหน้าที่รันสคริปต์อย่างเดียว ไม่ต้องพ่นหน้าตา HTML ออกมา
}