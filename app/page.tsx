import Image from "next/image";
import AppName from "@/components/AppName";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="w-full">
      {/* แสดงชื่อแอป */}
      <div className="text-center mt-6">
        <AppName />
      </div>
      {/* แสดงรูป logo ของแอป */}
      <Image
        src="https://ulaodkphbziflpafrbik.supabase.co/storage/v1/object/public/task_bk/task.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mt-10"
      />
      {/* การป้อน secure code เพื่อเข้าถึงแอป */}
      <input type="text" placeholder="Enter secure code" className="mt-10 p-2 border rounded w-full max-w-xs mx-auto flex" />
      {/* ปุ่มกดเข้าถึงแอป */}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 w-full max-w-xs mx-auto flex justify-center items-center">
        <span className="mx-auto">เข้าใช้งาน</span>
      </button>
      {/* แสดง footer*/}
      <Footer /> 
       
      
    </div>
  );
}