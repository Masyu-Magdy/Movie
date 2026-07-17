import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="font-display text-7xl text-[#E3A857]">404</p>
      <h1 className="mt-4 text-2xl text-[var(--text-primary)]">This reel is missing</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        The page you&apos;re looking for was never in the programme.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-[#E3A857] text-[#0B0F1A]
                   px-6 py-2.5 text-sm font-semibold hover:bg-[#F5C518] transition-colors"
      >
        Back to Home
      </Link>
    </section>
  );
}
