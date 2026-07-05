/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // ข้อควรระวัง: ต้องเปลี่ยน YOUR_PROJECT_ID เป็นรหัสโปรเจกต์ Supabase ของคุณ
        // ตัวอย่างเช่น 'abcdefghijklmno.supabase.co'
        hostname: '*.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // เพิ่มโดเมนของ Google เผื่อกรณีใช้รูปโปรไฟล์จาก Google OAuth ในอนาคต
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;