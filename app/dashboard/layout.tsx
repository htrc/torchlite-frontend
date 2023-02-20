import Link from 'next/link';

export default function DashboardLayout({children}: {
  children: React.ReactNode,
}) {
  return (
    <section>
      <nav>
        <Link href='/'>Torchlite</Link>
      </nav>

      {children}
    </section>
  );
}
