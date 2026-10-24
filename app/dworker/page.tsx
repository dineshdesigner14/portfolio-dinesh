import type { Metadata } from "next";
import DWorkerPage from "@/components/orbit/DWorkerPage";

export const metadata: Metadata = {
  title: "D-Worker — Dinesh Kannan",
  description:
    "D-Worker: the modern workspace for Cloud & DevOps engineers. Explore the ecosystem of technologies it brings together.",
};

export default function Page() {
  return <DWorkerPage />;
}
