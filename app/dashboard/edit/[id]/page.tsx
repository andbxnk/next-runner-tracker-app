import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. ถอดรหัสค่า Parameter (ID การวิ่ง) ตามมาตรฐาน Next.js ยุคใหม่
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. หากยังไม่ล็อกอิน ให้ดีดกลับหน้า /auth/login (Path ใหม่ที่เราจัดระเบียบไว้)
  if (!user) {
    redirect("/auth/login");
  }

  // 3. ดึงข้อมูลการวิ่งชิ้นนี้จากหลังบ้าน Supabase
  const { data: run } = await supabase
    .from("runs")
    .select("*")
    .eq("id", id)
    .single();

  // 4. ถ้าหาไม่เจอ หรือข้อมูลถูกลบไปแล้ว ให้ดีดกลับหน้าหลักทันที
  if (!run) {
    redirect("/dashboard");
  }

  // 5. ส่งต่อข้อมูลเข้าไปยังตัว Form ที่ติดอาวุธ SweetAlert เรียบร้อยแล้ว พร้อมสวมโครงสร้าง Padding สวยๆ
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-4 sm:px-6 lg:px-8">
      <EditForm initialData={run} />
    </div>
  );
}