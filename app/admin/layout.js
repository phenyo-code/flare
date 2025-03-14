import { Geist, Geist_Mono } from "next/font/google";
import AdminHeader from "../components/AdminHeader";
import "./../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Dashboard",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AdminHeader />
      {children}
    </div>
  );
}
