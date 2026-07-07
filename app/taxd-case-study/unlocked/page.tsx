import type { Metadata } from "next";
import { PlaybookCourse } from "@/components/landing/PlaybookCourse";

export const metadata: Metadata = {
  title: "The AI Visibility Playbook · DomiSearch",
  description:
    "How to become the brand AI recommends: the exact framework the DomiSearch AEO team uses for clients, in six short modules.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PlaybookPage() {
  return <PlaybookCourse />;
}
