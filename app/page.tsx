import Link from "next/link";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import { Activity, Route, Trophy, Sparkles, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[90vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-[var(--color-background)] to-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl space-y-12 text-center animate-luxury">
        
        {/* ป้ายต้อนรับด้านบนแบบอินเทรนด์ */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm text-sm font-semibold text-[var(--color-brand)] animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>The Next Generation Runner Tracker</span>
          </div>
        </div>
        
        {/* โลโก้แอปหลัก */}
        <div className="flex justify-center">
          <div className="bg-[var(--color-brand)] p-5 rounded-3xl shadow-xl shadow-blue-500/20 rotate-1 hover:rotate-0 transition-transform duration-300">
            <Activity className="w-16 h-16 text-white" />
          </div>
        </div>
        
        {/* สโลแกนหลักของแอป */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--color-text-main)] max-w-3xl mx-auto leading-tight">
            ยกระดับทุกการวิ่งของคุณด้วย <br />
            <span className="bg-gradient-to-r from-[var(--color-brand)] to-blue-600 bg-clip-text text-transparent">
              Runner Tracker APP
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl font-medium text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            บันทึกทุกก้าวอย่างแม่นยำ วิเคราะห์สถิติผ่านแดชบอร์ดลักชูรี 
            พร้อมเก็บภาพประทับใจในทุกเส้นทางการวิ่งของคุณอย่างปลอดภัย
          </p>
        </div>

        {/* ส่วนแสดงฟีเจอร์หลัก (3 คอลัมน์ดีไซน์พรีเมียม) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
          
          {/* ฟีเจอร์ 1 */}
          <div className="card p-6 flex flex-col items-center text-center group hover:border-[var(--color-brand)] hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <Route className="w-8 h-8 text-[var(--color-brand)]" />
            </div>
            <h3 className="font-black text-xl mt-4 mb-2 text-[var(--color-text-main)]">บันทึกระยะทาง</h3>
            <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">
              ติดตามข้อมูลระยะเวลา ระยะทาง เพซ และความเร็วเฉลี่ยแบบละเอียดแม่นยำ
            </p>
          </div>

          {/* ฟีเจอร์ 2 */}
          <div className="card p-6 flex flex-col items-center text-center group hover:border-yellow-400 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-yellow-50 rounded-2xl group-hover:bg-yellow-100 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="font-black text-xl mt-4 mb-2 text-[var(--color-text-main)]">ติดตามความสำเร็จ</h3>
            <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">
              ฉลองทุกความสำเร็จและดูพัฒนาการการวิ่งของคุณผ่านสถิติที่เข้าใจง่าย
            </p>
          </div>

          {/* ฟีเจอร์ 3 */}
          <div className="card p-6 flex flex-col items-center text-center group hover:border-green-400 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-black text-xl mt-4 mb-2 text-[var(--color-text-main)]">เก็บความทรงจำ</h3>
            <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed">
              ปักหมุดภาพถ่ายความประทับใจและบรรยากาศในแต่ละเส้นทางวิ่งของคุณ
            </p>
          </div>
          
        </div>

        {/* ปุ่มควบคุม (Call to Action) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 max-w-md mx-auto">
          <Link 
            href="/auth/login" 
            className="btn-primary w-full sm:w-auto px-10 py-4 text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>เข้าสู่ระบบ</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-[var(--color-brand)] bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all border-2 border-transparent hover:border-blue-200 text-center cursor-pointer active:scale-95"
          >
            สมัครสมาชิกใหม่
          </Link>
        </div>

      </div>
    </div>
  );
}