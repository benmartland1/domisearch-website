/**
 * The Studio owns the whole viewport. It gets no site header, footer or
 * padding — LayoutChrome skips /studio for that reason — and this layout
 * exists to stop the root layout's page flow from constraining it.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ height: "100dvh" }}>{children}</div>;
}
