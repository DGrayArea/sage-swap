import Navbar from "@/components/Navbar";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full text-black bg-white dark:bg-black dark:text-white justify-center items-center flex-col transition-all duration-100`}
    >
      <Navbar />
      <div className="flex w-full h-full mx-auto justify-center items-center px-3"></div>
    </div>
  );
}
