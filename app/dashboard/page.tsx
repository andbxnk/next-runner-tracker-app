import { createClient } from "../../utils/supabase/server";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { Route, Clock, Trophy, Plus, Calendar, ArrowRight, MapPin, Activity } from "lucide-react";
import Image from "next/image";
import GoogleWelcomeAlert from "./GoogleWelcomeAlert"; // 👈 1. อิมพอร์ตตัวดักแจ้งเตือนเข้ามา

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: runs } = await supabase.from("runs").select("*").order("run_date", { ascending: false });
  const typedRuns = runs || [];

  const totalDistance = typedRuns.reduce((sum, r) => sum + Number(r.distance_km), 0);
  const totalDuration = typedRuns.reduce((sum, r) => sum + Number(r.duration_mins), 0);
  const avgSpeed = typedRuns.length > 0 ? (totalDistance / (totalDuration / 60)).toFixed(1) : "0";

  return (
    <div className="space-y-12 animate-luxury">
      <GoogleWelcomeAlert />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-main)] tracking-tight">Performance</h1>
          <p className="text-[var(--color-text-muted)] font-medium mt-1">ยินดีต้อนรับกลับมา พร้อมสำหรับการวิ่งครั้งต่อไปหรือยัง?</p>
        </div>
        <Link href="/dashboard/create" className="btn-primary shadow-xl">
          <Plus className="w-5 h-5" />
          บันทึกการวิ่งใหม่
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "ระยะทางรวม", value: totalDistance.toFixed(2), unit: "กม.", icon: Route, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "เวลาทั้งหมด", value: totalDuration, unit: "นาที", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "ความเร็วเฉลี่ย", value: avgSpeed, unit: "กม./ชม.", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
          <div key={i} className="card p-8 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[var(--color-text-main)]">{stat.value}</span>
                  <span className="text-sm font-bold text-[var(--color-text-muted)]">{stat.unit}</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.icon} transition-transform group-hover:rotate-12`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-500" />
            Recent Activity
          </h2>
        </div>

        {typedRuns.length === 0 ? (
          <div className="card p-20 text-center border-dashed border-2">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-[var(--color-text-muted)] font-bold">ยังไม่มีข้อมูลการวิ่งของคุณ กดปุ่มเพิ่มเพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {typedRuns.map((run) => (
              <Link key={run.id} href={`/dashboard/edit/${run.id}`} className="card group hover:-translate-y-2">
                <div className="relative h-56 w-full bg-gray-100">
                  {run.image_url ? (
                    <Image src={run.image_url} alt="Run" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <Activity className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="badge-indigo bg-white/90 backdrop-blur shadow-sm">
                      {format(new Date(run.run_date), "d MMM yyyy", { locale: th })}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tighter">Distance</p>
                      <h3 className="text-2xl font-black">{run.distance_km} กม.</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tighter">Duration</p>
                      <p className="text-lg font-bold">{run.duration_mins} นาที</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-bold text-indigo-600">แก้ไขข้อมูล / ดูรายละเอียด</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}