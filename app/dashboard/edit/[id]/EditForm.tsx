"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { Save, ImagePlus, Loader2, ArrowLeft, X, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2"; // 🌟 นำเข้า SweetAlert2

export default function EditForm({ initialData }: any) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    distance: initialData.distance_km.toString(),
    duration: initialData.duration_mins.toString(),
    runDate: initialData.run_date,
    notes: initialData.notes || "",
  });

  const [image, setImage] = useState<{ file: File | null; preview: string | null }>({
    file: null,
    preview: initialData.image_url,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removeImage = async () => {
    setImage({ file: null, preview: null });
  };

  // 🌟 ฟังก์ชันอัปเดตข้อมูล
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // เปิดกล่อง Loading อัปโหลดข้อมูล
    Swal.fire({
      title: "กำลังบันทึกการเปลี่ยนแปลง",
      text: "ระบบกำลังอัปเดตข้อมูลและตรวจสอบรูปภาพของคุณ...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let imageUrl = image.preview;

      if (image.file) {
        const filePath = `${initialData.user_id}/${Date.now()}_${image.file.name}`;
        const { error: upErr } = await supabase.storage.from("run_images").upload(filePath, image.file);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("run_images").getPublicUrl(filePath).data.publicUrl;
      }

      const { error } = await supabase.from("runs")
        .update({
          distance_km: parseFloat(form.distance),
          duration_mins: parseInt(form.duration),
          run_date: form.runDate,
          notes: form.notes || null,
          image_url: imageUrl,
        })
        .eq("id", initialData.id);

      if (error) throw error;

      // แสดงสเตตัสสำเร็จ
      Swal.fire({
        title: "อัปเดตสถิติสำเร็จ!",
        text: "แก้ไขข้อมูลการวิ่งของคุณเรียบร้อยแล้ว",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "var(--color-brand, #3b82f6)",
      });
      setIsLoading(false);
    }
  };

  // 🌟 ฟังก์ชันลบข้อมูล (พร้อมกล่อง Confirm สไตล์ลักชู)
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "สถิติการวิ่งและรูปภาพนี้จะถูกลบถาวร ไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // สีแดงเตือนภัย
      cancelButtonColor: "#6b7280",  // สีเทาเบรกอารมณ์
      confirmButtonText: "ใช่, ฉันต้องการลบ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "rounded-3xl shadow-xl",
      }
    });

    if (result.isConfirmed) {
      setIsDeleting(true);

      // เปิดกล่อง Loading ตอนลบ
      Swal.fire({
        title: "กำลังลบข้อมูล...",
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const { error } = await supabase.from("runs").delete().eq("id", initialData.id);
        if (error) throw error;
        
        // แสดงสเตตัสลบสำเร็จ
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ!",
          text: "ลบสถิติการวิ่งออกจากระบบเรียบร้อยแล้ว",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } catch (err: any) {
        Swal.fire({
          title: "ลบไม่สำเร็จ",
          text: err.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
          icon: "error",
          confirmButtonColor: "var(--color-brand, #3b82f6)",
        });
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-luxury">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-brand)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
      </Link>

      <div className="card p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-black mb-2">แก้ไขข้อมูลการวิ่ง</h1>
            <p className="text-[var(--color-text-muted)] font-medium">ปรับปรุงสถิติหรือรูปภาพของคุณให้ถูกต้อง</p>
          </div>
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            title="ลบข้อมูล"
          >
            {isDeleting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">ระยะทาง (กม.)</label>
              <input type="number" step="0.01" required value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} className="input-field text-lg font-bold" disabled={isLoading || isDeleting} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">เวลา (นาที)</label>
              <input type="number" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-field text-lg font-bold" disabled={isLoading || isDeleting} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">วันที่วิ่ง</label>
            <input type="date" required value={form.runDate} onChange={e => setForm({...form, runDate: e.target.value})} className="input-field" disabled={isLoading || isDeleting} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">รูปภาพ</label>
            {image.preview ? (
              <div className="relative h-64 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                <Image src={image.preview} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-colors" disabled={isLoading || isDeleting}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-100 hover:border-[var(--color-brand)] transition-all">
                <ImagePlus className="w-10 h-10 text-gray-300 mb-2" />
                <span className="text-sm font-bold text-gray-400">คลิกเพื่ออัปโหลดรูปภาพใหม่</span>
                <input type="file" className="hidden" onChange={handleImage} accept="image/*" disabled={isLoading || isDeleting} />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)]">บันทึกเพิ่มเติม</label>
            <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field resize-none" disabled={isLoading || isDeleting} />
          </div>

          <div className="flex gap-4 pt-4">
             <Link href="/dashboard" className="flex-1 px-8 py-5 bg-gray-100 text-gray-600 font-bold rounded-2xl text-center hover:bg-gray-200 transition-colors">
               ยกเลิก
             </Link>
             <button type="submit" disabled={isLoading || isDeleting} className="btn-primary flex-[2] py-5 text-lg cursor-pointer">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                บันทึกการเปลี่ยนแปลง
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}