import AppName from "@/components/AppName";
import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function page() {
  return (
    <div>
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
      {/* ปุ่มเปิดไปหน้า /addtask */}
      <div className="text-center mt-10">
        <Link href="/addtask">
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            เพิ่ม TASK
          </span>
        </Link>
      </div>
    </div>
  );
}
