"use client";

import AppName from "@/components/AppName";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

type TaskItem = {
  id?: number;
  title: string;
  detail: string;
  iscompleted: boolean | number | string;
  image_url?: string | null;
};

export default function Page() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("task_tb").select("*");

      if (error) {
        console.error("Supabase fetch error:", error);
        setTasks([]);
        return;
      }

      setTasks(data ?? []);
    } catch (err) {
      console.error("Unexpected fetch error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (id: number | undefined) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "ยืนยันการลบงานนี้หรือไม่",
      text: "ข้อมูลจะถูกลบออกจากฐานข้อมูลทันที",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) {
      return;
    }

    const { error } = await supabase.from("task_tb").delete().eq("id", id);

    if (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบข้อมูล",
        text: error.message,
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "ลบข้อมูลสำเร็จ",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    await fetchTasks();
  };

  const isDone = (value: boolean | number | string) =>
    value === true || value === 1 || value === "1";

  return (
    <div>
      <div className="text-center mt-6">
        <AppName />
      </div>

      <Image
        src="https://ulaodkphbziflpafrbik.supabase.co/storage/v1/object/public/task_bk/task.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mt-10"
      />

      <div className="text-center mt-10">
        <Link href="/addtask">
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            เพิ่ม TASK
          </span>
        </Link>
      </div>

      <div className="w-4/5 mt-10 mx-auto overflow-x-auto">
        <table className="w-full border border-gray-500 rounded-xl bg-gray-100 shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-500 px-4 py-2">รูปงาน</th>
              <th className="border border-gray-500 px-4 py-2">ชื่องาน</th>
              <th className="border border-gray-500 px-4 py-2">รายละเอียด</th>
              <th className="border border-gray-500 px-4 py-2">สถานะ</th>
              <th className="border border-gray-500 px-4 py-2">ลบ/แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  ยังไม่มีข้อมูล TASK
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id ?? task.title} className="align-top">
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {task.image_url ? (
                      <img
                        src={task.image_url}
                        alt={task.title}
                        className="w-20 h-20 object-cover rounded-md mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    )}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">{task.title}</td>
                  <td className="border border-gray-500 px-4 py-2">{task.detail}</td>
                  <td className="border border-gray-500 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                        isDone(task.iscompleted)
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isDone(task.iscompleted) ? "เสร็จสิ้น" : "ยังไม่เสร็จ"}
                    </span>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/edittask?id=${task.id ?? ""}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-center hover:bg-yellow-600"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
