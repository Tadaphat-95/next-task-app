import AppName from "@/components/AppName";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

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
      {/* ส่วนขอการป้อนข้อมูลเพื่อบันทึก TASK */}
      <div className="w-150 border border-gray-300 mx-auto mt-10 rounded-xl px-8 py-10">
        
        <h1 className="text-2xl font-bold text-center">แก้ไขข้อมูลงาน</h1>
          <h3 className="mt-4">หัวข้องาน</h3>
          <input
            type="text"
            id="taskTitle"
            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <h3 className="mt-2 text-gray-700 font-bold">รายละเอียดงาน</h3>
          <textarea
            rows={4}
            id="taskDescription"
            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <h3 className="mt-2 text-gray-700 font-bold">เลือกรูป</h3>
          <input
            type="file"
            id="selectImageFile"
            className="hidden"
            accept="image/*"
          />
          <label htmlFor="selectImageFile" className="cursor-pointer text-blue-500 hover:underline">
            คลิกเลือกรูปภาพ
          </label>
          <h3 className="mt-2 text-gray-700 font-bold mb-3">สถานะ</h3>
          <select className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pending">รอดำเนินการ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
          </select>

          <button
            className="block w-full mt-10 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
          >บันทึกแก้ไข</button>

          <button
            className="block w-full mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300"
          >รีเซ็ตข้อมูล</button>
      </div>
      {/* ลิงก์ไปยังหน้า /hometask */}
      <Link href="/hometask">
        <span className="block w-full mt-10 text-gray-800 text-center">
          กลับไปหน้า Home Task
        </span>
      </Link>
      {/* แสดง footer */}
      <Footer />
    </div>
  );
}
