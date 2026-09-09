"use client";

import Image from "next/image";
import AppName from "@/components/AppName";
import Footer from "@/components/Footer";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function Page() {
  // สร้าง state สำหรับเก็บค่า secure code
  const [secureCode, setSecureCode] = useState("");
  // สร้าง router สำหรับการนำทางไปยังหน้าอื่น
  const router = useRouter();
  // ฟังก์ชันสำหรับตรวจสอบ secure code และเข้าถึงแอป
  const handleAccessTask = () => {
    //Validate UI
    if (secureCode === "") {
      Swal.fire({
        title: "กรุณากรอก secure code ด้วย",
        icon: "error",
        draggable: true,
      });
      return;
    }

    // check secure code
    if (secureCode.toLocaleLowerCase() === "dtisau") {
      // เปิดไปหน้า /hometask
      router.push("/hometask");
    } else {
      Swal.fire({
        title: "secure code ไม่ถูกต้อง",
        icon: "warning",
      });
    }
  };

  return (
    <div className="w-full">
      {/* แสดงชื่อแอป */}
      <div className="text-center mt-30">
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
      <input
        type="text"
        placeholder="Enter secure code"
        className="mt-10 p-2 border rounded w-full max-w-xs mx-auto flex"
        value={secureCode}
        onChange={(e) => setSecureCode(e.target.value)}
      />
      {/* ปุ่มกดเข้าถึงแอป */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 w-full max-w-xs mx-auto flex justify-center items-center"
        onClick={handleAccessTask}
      >
        <span className="mx-auto">เข้าใช้งาน</span>
      </button>
      {/* แสดง footer*/}
      <Footer />
    </div>
  );
}
