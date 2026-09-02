import type { Metadata, Viewport } from "next";
import "./onboarding.css";

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  // The form is full-height with a sticky footer; letting the browser resize
  // the viewport when the keyboard opens keeps the current question in view.
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "Client onboarding · DomiSearch",
  description: "A short questionnaire for new DomiSearch clients. About ten minutes, saved as you go.",
  // Nobody should find a client's onboarding form in a search result, and
  // there is nothing here worth indexing.
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
