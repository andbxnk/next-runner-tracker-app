import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // สร้าง Response เริ่มต้นขึ้นมาเพื่อให้นำไปอัปเดตคุกกี้ได้
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // สร้าง Supabase Client สำหรับ Middleware โดยเฉพาะตามมาตรฐาน SSR ของ Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  // ดึงข้อมูลผู้ใช้ปัจจุบัน (การใช้ getUser ปลอดภัยและเชื่อถือได้มากที่สุดบน Server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // เคสที่ 1: ผู้ใช้พยายามเข้าหน้า Dashboard แต่ยังไม่ได้ล็อกอิน ให้เปลี่ยนเส้นทางไปหน้า Login
  if (url.pathname.startsWith("/dashboard") && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // เคสที่ 2: ผู้ใช้ล็อกอินแล้ว แต่พยายามจะเข้าหน้า Login หรือ Register ให้ดีดไปหน้า Dashboard ทันที
  if ((url.pathname.startsWith("/auth/login") || url.pathname.startsWith("/register")) && user) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

// กำหนดขอบเขตให้ Middleware ทำงานในทุกๆ Route ยกเว้นไฟล์ Static และ Assets ต่างๆ
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};