import Image from 'next/image';
import Link from 'next/link';
import { Inter } from '@next/font/google';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.center}>
        <h1>Torchlite</h1>
      </div>

      <div className={styles.grid}>
        <Link href='dashboard'>
          <h2 className={inter.className}>
            Dashboard <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Try out the default dashboard
          </p>
        </Link>
      </div>
    </main>
  );
}
