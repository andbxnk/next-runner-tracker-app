import { createClient } from "../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. ตรวจสอบสถานะว่ามีผู้ใช้ล็อกอินอยู่หรือไม่
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. สั่งให้ Supabase ล้าง Session ฝั่งเซิร์ฟเวอร์ออกทันที
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  } catch (error) {
    // แอบ log ไว้ที่ฝั่งเซิร์ฟเวอร์เบาๆ เผื่อกรณีเกิดเหตุฉุกเฉิน
    console.error("Sign out error:", error);
  } finally {
    // 3. รีเซ็ต Cache ของหน้าเว็บทั้งหมดเพื่อเคลียร์สเตตัสของผู้ใช้คนเก่า
    revalidatePath("/", "layout");

    // 4. เด้งผู้ใช้กลับไปที่หน้า Login เสมอ (ทำในบล็อก finally เพื่อการันตีว่ายังไงก็หลุดออกจากหน้าแดชบอร์ด)
    return NextResponse.redirect(new URL("/auth/login", request.url), {
      status: 302,
    });
  }
}