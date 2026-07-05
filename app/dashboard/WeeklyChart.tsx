import { BarChart3 } from "lucide-react";

interface RunRecord {
  id: string;
  distance_km: number;
  duration_mins: number;
  run_date: string;
}

interface WeeklyChartProps {
  runs: RunRecord[];
}

export default function WeeklyChart({ runs }: WeeklyChartProps) {
  // วันทำงาน/วันในสัปดาห์
  const daysOfWeek = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
  
  // เก็บค่าสะสมระยะทางของแต่ละวันในสัปดาห์ปัจจุบัน (ดัชนี 0 = จันทร์, ..., 6 = อาทิตย์)
  const weeklyDistances = [0, 0, 0, 0, 0, 0, 0];

  const today = new Date();
  const currentDay = today.getDay(); // 0 = อาทิตย์, 1 = จันทร์...
  
  // หาช่วงเวลาของสัปดาห์ปัจจุบัน (เริ่มที่วันจันทร์นี้)
  const currentMonday = new Date(today);
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  currentMonday.setDate(today.getDate() - distanceToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  const nextSunday = new Date(currentMonday);
  nextSunday.setDate(currentMonday.getDate() + 6);
  nextSunday.setHours(23, 59, 59, 999);

  // กรองข้อมูลการวิ่งเฉพาะสัปดาห์ปัจจุบันแล้วนำมาบวกรวมแยกรายวัน
  runs.forEach((run) => {
    const runDate = new Date(run.run_date);
    if (runDate >= currentMonday && runDate <= nextSunday) {
      let dayIndex = runDate.getDay();
      // แปลงมาตรฐานให้ 0 = วันจันทร์ และ 6 = วันอาทิตย์
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      weeklyDistances[dayIndex] += Number(run.distance_km);
    }
  });

  // ค้นหาระยะทางที่สูงที่สุดเพื่อนำไปคำนวณสัดส่วนความสูงของกราฟ (เปอร์เซ็นต์)
  const maxDistance = Math.max(...weeklyDistances, 5); // กำหนดขั้นต่ำไว้ที่ 5 กม. เพื่อความสวยงาม

  return (
    <div className="card p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-[var(--color-brand)]" />
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">ความคืบหน้าในสัปดาห์นี้</h3>
      </div>

      {/* แผงแสดงแท่งกราฟ */}
      <div className="flex items-end justify-between h-48 pt-4 px-2 border-b border-gray-200">
        {weeklyDistances.map((distance, idx) => {
          // คำนวณความสูงแบบ Dynamic อิงตามระยะทางจริงเทียบกับระยะทางสูงสุด
          const barHeightPercent = Math.min((distance / maxDistance) * 100, 100);

          return (
            <div key={idx} className="flex flex-col items-center w-full group">
              {/* Tooltip แสดงระยะทางเวลานำเมาส์ไปชี้ */}
              <div className="absolute mb-20 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transform -translate-y-2">
                {distance.toFixed(1)} กม.
              </div>

              {/* ตัวแท่งกราฟ */}
              <div 
                style={{ height: `${barHeightPercent}%` }}
                className={`w-8 sm:w-10 rounded-t-md transition-all duration-500 ease-out ${
                  distance > 0 
                    ? "bg-gradient-to-t from-blue-600 to-[var(--color-brand)] shadow-sm" 
                    : "bg-gray-100"
                }`}
              ></div>
            </div>
          );
        })}
      </div>

      {/* แถบป้ายชื่อวันใต้กราฟ */}
      <div className="flex justify-between mt-2 px-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="w-8 sm:w-10 text-center text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}