import { notFound } from "next/navigation";
import { ButterflyMotionLab } from "@/components/butterfly-motion-lab";

export default function ButterflyLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ButterflyMotionLab />;
}
