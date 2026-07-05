import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server"; // 👈 เช็ค Path ถอยหลัง 3 ชั้นให้ถูกด้วยนะครับ

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // ถ้าระบบต้องการให้เด้งไปหน้าอื่นหลังจากล็อกอินสำเร็จ สามารถเปลี่ยนตรงนี้ได้ (เช่น /dashboard)
  const next = searchParams.get("next") ?? "/dashboard"; 

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // โค้ดเดิมอาจจะเป็นแบบนี้: return NextResponse.redirect(`${origin}${next}`);
      // แนะนำให้เขียนแบบล็อก Path ตรงตัวไปเลย ปลอดภัยสุดครับ:
      return NextResponse.redirect(new URL("/dashboard?login=google", request.url));
    }
  }

  // หากเกิดข้อผิดพลาด ให้ดีดกลับไปหน้า Login
  return NextResponse.redirect(new URL("/auth/login", request.url));
}