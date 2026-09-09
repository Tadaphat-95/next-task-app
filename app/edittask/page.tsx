"use client";

import AppName from "@/components/AppName";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";

type TaskItem = {
  id?: number | string;
  title: string;
  detail: string;
  iscompleted: boolean | number | string;
  image_url?: string | null;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTaskId = searchParams.get("id");
  const taskId = rawTaskId ?? "";

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [iscompleted, setIsCompleted] = useState(false);
  const [imagefile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalTask, setOriginalTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล task ที่ต้องการแก้ไขตาม id จาก query string
  useEffect(() => {
    if (!taskId || taskId === "undefined" || taskId === "null") {
      Swal.fire({
        title: "ไม่พบรหัสงานที่ต้องการแก้ไข",
        icon: "error",
      }).then(() => router.push("/hometask"));
      return;
    }

    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error || !data) {
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          text: error?.message ?? "ไม่พบข้อมูล",
          icon: "error",
        }).then(() => router.push("/hometask"));
        return;
      }

      setOriginalTask(data);
      setTitle(data.title ?? "");
      setDetail(data.detail ?? "");
      setIsCompleted(
        data.iscompleted === true || data.iscompleted === 1 || data.iscompleted === "1",
      );
      setImagePreview(data.image_url ?? null);
      setLoading(false);
    };

    fetchTask();
  }, [taskId, router]);

  // จัดการการเลือกไฟล์รูปใหม่
  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // รีเซ็ตข้อมูลกลับไปเป็นค่าเดิมที่โหลดมาจากฐานข้อมูล
  const handleResetData = () => {
    if (!originalTask) return;

    setTitle(originalTask.title ?? "");
    setDetail(originalTask.detail ?? "");
    setIsCompleted(
      originalTask.iscompleted === true || originalTask.iscompleted === 1 || originalTask.iscompleted === "1",
    );
    setImageFile(null);
    setImagePreview(originalTask.image_url ?? null);
  };

  // บันทึกการแก้ไขข้อมูล task
  const handleUpdateTask = async () => {
    if (!taskId || taskId === "undefined" || taskId === "null") return;

    if (title === "" || detail === "") {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบ",
        icon: "error",
      });
      return;
    }

    let finalImageUrl = originalTask?.image_url ?? null;

    // ถ้ามีรูปภาพใหม่ให้อัปโหลดก่อนบันทึกข้อมูล
    if (imagefile) {
      const newFileName = `dtisau_edit_${Date.now()}_${imagefile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("task_bk")
        .upload(newFileName, imagefile);

      if (uploadError) {
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
          text: uploadError.message,
          icon: "error",
        });
        return;
      }

      const { data } = supabase.storage.from("task_bk").getPublicUrl(newFileName);
      finalImageUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("task_tb")
      .update({
        title,
        detail,
        iscompleted,
        image_url: finalImageUrl,
      })
      .eq("id", taskId);

    if (updateError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        text: updateError.message,
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "บันทึกการแก้ไขสำเร็จ",
      icon: "success",
    }).then(() => {
      router.push("/hometask");
    });
  };

  // กรณีกำลังโหลดข้อมูลยังไม่เสร็จ ให้แสดงสถานะนี้
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

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

      {/* ส่วนฟอร์มแก้ไขข้อมูล task */}
      <div className="w-[600px] max-w-[90%] border border-gray-300 mx-auto mt-10 rounded-xl px-8 py-10">
        <h1 className="text-2xl font-bold text-center">แก้ไขข้อมูลงาน</h1>

        {/* ช่องกรอกหัวข้องาน */}
        <h3 className="mt-4 text-gray-700 font-bold">หัวข้องาน</h3>
        <input
          type="text"
          id="taskTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="กรอกหัวข้องาน"
        />

        {/* ช่องกรอกรายละเอียดงาน */}
        <h3 className="mt-4 text-gray-700 font-bold">รายละเอียดงาน</h3>
        <textarea
          rows={4}
          id="taskDescription"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="กรอกรายละเอียดงาน"
        />

        {/* เลือกรูปภาพใหม่ */}
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

        {/* แสดงตัวอย่างรูปภาพ */}
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Preview"
              width={120}
              height={120}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}

        {/* เลือกสถานะงาน */}
        <h3 className="mt-4 text-gray-700 font-bold mb-3">สถานะ</h3>
        <select
          value={iscompleted ? "1" : "0"}
          onChange={(e) => setIsCompleted(e.target.value === "1")}
          className="border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">เสร็จสิ้น</option>
          <option value="0">ยังไม่เสร็จ</option>
        </select>

        {/* ปุ่มบันทึกการแก้ไข */}
        <button
          onClick={handleUpdateTask}
          className="block w-full mt-10 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          บันทึกแก้ไข
        </button>

        {/* ปุ่มรีเซ็ตข้อมูลกลับค่าเดิม */}
        <button
          onClick={handleResetData}
          className="block w-full mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300"
        >
          รีเซ็ตข้อมูล
        </button>
      </div>

      {/* ลิงก์กลับหน้า Home Task */}
      <Link href="/hometask">
        <span className="block w-full mt-10 text-gray-800 text-center hover:text-blue-500">
          กลับไปหน้า Home Task
        </span>
      </Link>

      {/* แสดง footer */}
      <Footer />
    </div>
  );
}
