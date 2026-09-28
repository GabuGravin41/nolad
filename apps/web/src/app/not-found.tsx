import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">The page may have moved when a report was renamed.</p>
      <p className="mt-6">
        <Link href="/reports">Browse all reports →</Link>
      </p>
    </div>
  );
}
