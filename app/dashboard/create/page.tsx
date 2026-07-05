"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { Save, ImagePlus, Loader2, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2"; // 🌟 นำเข้า SweetAlert2

export default function CreateRunPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ distance: "", duration: "", runDate: new Date().toISOString().split("T")[0], notes: "" });
  const [image, setImage] = useState<{ file: File | null, preview: string | null }>({ file: null, preview: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 🌟 ขึ้น SweetAlert แบบกำลังโหลด เพื่อความพรีเมียมและกันยูสเซอร์สับสนระหว่างรออัปโหลดรูป
    Swal.fire({
      title: "กำลังบันทึกสถิติการวิ่ง",
      text: "ระบบกำลังอัปโหลดข้อมูลและรูปภาพของคุณ...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      let imageUrl = null;
      if (image.file) {
        const filePath = `${user.id}/${Date.now()}_${image.file.name}`;
        const { error: upErr } = await supabase.storage.from('run_images').upload(filePath, image.file);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from('run_images').getPublicUrl(filePath).data.publicUrl;
      }

      const { error } = await supabase.from('runs').insert({
        user_id: user.id,
        distance_km: parseFloat(form.distance),
        duration_mins: parseInt(form.duration),
        run_date: form.runDate,
        notes: form.notes || null,
        image_url: imageUrl
      });

      if (error) throw error;

      // 🌟 เปลี่ยนกล่องสเตตัสเป็นสำเร็จแบบหรูหรา
      Swal.fire({
        title: "บันทึกสถิติสำเร็จ!",
        text: "เยี่ยยมมาก! รักษาวินัยแบบนี้ต่อไปนะครับ",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);

    } catch (err: any) {
      // 🌟 ยิงกล่อง Error สวยๆ บอกผู้ใช้แทน alert เดิม
      Swal.fire({
        title: "บันทึกไม่สำเร็จ",
        text: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "var(--color-brand, #3b82f6)",
        customClass: {
          popup: "rounded-3xl",
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-luxury">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-brand)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
      </Link>

      <div className="card p-10">
        <h1 className="text-3xl font-black mb-2">บันทึกการวิ่งใหม่</h1>
        <p className="text-[var(--color-text-muted)] mb-10 font-medium">เก็บข้อมูลและรูปภาพความประทับใจจากการวิ่งของคุณ</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">ระยะทาง (กม.)</label>
              <input type="number" step="0.01" required value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} className="input-field text-lg font-bold" placeholder="ตัวอย่าง: 5.2" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">เวลา (นาที)</label>
              <input type="number" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-field text-lg font-bold" placeholder="ตัวอย่าง: 45" disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">วันที่วิ่ง</label>
            <input type="date" required value={form.runDate} onChange={e => setForm({...form, runDate: e.target.value})} className="input-field" disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">รูปภาพ (ไม่บังคับ)</label>
            {image.preview ? (
              <div className="relative h-64 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                <Image src={image.preview} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => setImage({ file: null, preview: null })} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-colors" disabled={isLoading}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-100 hover:border-[var(--color-brand)] transition-all">
                <ImagePlus className="w-10 h-10 text-gray-300 mb-2" />
                <span className="text-sm font-bold text-gray-400">คลิกเพื่ออัปโหลดรูปภาพ</span>
                <input type="file" className="hidden" onChange={handleImage} accept="image/*" disabled={isLoading} />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">บันทึกเพิ่มเติม (ไม่บังคับ)</label>
            <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field resize-none" placeholder="บอกเล่าความรู้สึก หรือสภาพอากาศวันนี้..." disabled={isLoading} />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 text-lg cursor-pointer">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลเข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}