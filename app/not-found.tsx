import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative isolate mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="eyebrow">404</div>
      <h1 className="display mt-4 text-5xl sm:text-6xl">Page not found.</h1>
      <p className="mt-6 max-w-md text-[color:var(--color-fog)]/80">
        That link is either gone or was never here. Head back home, or book a call with Ben.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/contact" className="btn btn-ghost">Contact us</Link>
      </div>
    </section>
  );
}
