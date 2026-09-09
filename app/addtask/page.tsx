"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AppName from "@/components/AppName";
import Footer from "@/components/Footer";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [iscompleted, setIsCompleted] = useState(false);
  const [imagefile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://ulaodkphbziflpafrbik.supabase.co/storage/v1/object/public/task_bk/sun.png",
  );

  // จัดการการเลือกไฟล์รูปภาพ
  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);

      // สร้าง URL สำหรับแสดง Preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // รีเซ็ตข้อมูล
  const handleResetData = () => {
    setTitle("");
    setDetail("");
    setIsCompleted(false);
    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
  };

  // บันทึกข้อมูล TASK
  const handleSaveTask = async () => {
    // Validate UI
    if (title === "" || detail === "" || imagefile === null) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบ",
        icon: "error",
        draggable: true,
      });
      return;
    }
    // Upload Image to supabase storage and get image url from bucket
    // เปลี่ยนชื่อรูป
    const newFileName = `dtisau_${Date.now()}_${imagefile.name}`;
    // Upload รูปไปยัง Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("task_bk")
      .upload(newFileName, imagefile);
    if (uploadError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
        text: uploadError.message,
        icon: "error",
        draggable: true,
      });
      return;
    }

    // get image url มาใส่ในตัวแปรเพื่อบันทึกลงตาราง
    const { data } = supabase.storage.from("task_bk").getPublicUrl(newFileName);
    const image_url = data.publicUrl;
    // Save data to supabase Database
    const { error: saveError } = await supabase.from("task_tb").insert({
      // colums name
      title: title,
      detail: detail,
      iscompleted: iscompleted,
      image_url: image_url,
    });
    if (saveError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: saveError.message,
        icon: "error",
        draggable: true,
      });
      return;
    }
    // ตรวจสอบแล้วว่าไม่มีข้อผิดพลาดในการบันทึกข้อมูล แสดงข้อความแจ้งเตือนบันทึกข้อมูลสำเร็จ และ redirect ไปหน้า /hometask
    Swal.fire({
      title: "บันทึกข้อมูลสำเร็จ",
      icon: "success",
      draggable: true,
    }).then(() => {
      // redirect ไปหน้า /hometask
      router.push("/hometask");
    });
  };

  return (
    <div>
      {/* ชื่อแอป */}
      <div className="text-center mt-6">
        <AppName />
      </div>

      {/* Logo */}
      <Image
        src="https://ulaodkphbziflpafrbik.supabase.co/storage/v1/object/public/task_bk/task.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mt-10"
      />

      {/* Form */}
      <div className="w-[600px] max-w-[90%] border border-gray-300 mx-auto mt-10 rounded-xl px-8 py-10">
        <h1 className="text-2xl font-bold text-center">เพิ่มข้อมูลงาน</h1>

        {/* หัวข้องาน */}
        <h3 className="mt-4 text-gray-700 font-bold">หัวข้องาน</h3>

        <input
          type="text"
          id="taskTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="กรอกหัวข้องาน"
        />

        {/* รายละเอียดงาน */}
        <h3 className="mt-4 text-gray-700 font-bold">รายละเอียดงาน</h3>

        <textarea
          rows={4}
          id="taskDescription"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="กรอกรายละเอียดงาน"
        />

        {/* เลือกรูป */}
        <h3 className="mt-4 text-gray-700 font-bold">เลือกรูป</h3>

        <input
          type="file"
          id="selectImageFile"
          className="hidden"
          accept="image/*"
          onChange={handleImageFileChange}
        />

        <label
          htmlFor="selectImageFile"
          className="cursor-pointer text-blue-500 hover:underline"
        >
          คลิกเลือกรูปภาพ
        </label>

        {/* Preview รูป */}
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Preview"
              width={40}
              height={40}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}

        {/* สถานะ */}
        <h3 className="mt-4 text-gray-700 font-bold mb-3">สถานะ</h3>

        <select
          value={iscompleted ? "1" : "0"}
          onChange={(e) => setIsCompleted(e.target.value === "1")}
          className="border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">เสร็จสิ้น</option>
          <option value="0">ยังไม่เสร็จ</option>
        </select>

        {/* ปุ่มบันทึก */}
        <button
          onClick={handleSaveTask}
          className="block w-full mt-10 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          บันทึก
        </button>

        {/* ปุ่มรีเซ็ต */}
        <button
          onClick={handleResetData}
          className="block w-full mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300"
        >
          รีเซ็ตข้อมูล
        </button>
      </div>

      {/* กลับหน้า Home Task */}
      <Link href="/hometask">
        <span className="block w-full mt-10 text-gray-800 text-center hover:text-blue-500">
          กลับไปหน้า Home Task
        </span>
      </Link>

      {/* Footer */}
      <Footer />
    </div>
  );
}
