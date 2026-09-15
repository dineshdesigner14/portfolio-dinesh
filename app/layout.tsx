import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata: Metadata = {
  title: "Dinesh Kannan — Cloud & DevOps Engineer",
  description:
    "Cloud Engineer, DevOps Engineer, and Platform Engineering enthusiast. Building D-Worker — a unified workspace for cloud & DevOps engineers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalBackground />
        <div className="relative z-10">
          <SmoothScroll>{children}</SmoothScroll>
        </div>
      </body>
    </html>
  );
}