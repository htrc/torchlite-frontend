import PublicationDateTimelineWidget from '@/components/widgets/PublicationDateTimelineWidget'
import styles from './dashboard.module.css'
import books from '@/data/books'
import population from '@/data/population'

export default function Dashboard() {
  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <PublicationDateTimelineWidget data={population} />
      <section>
        Footer
      </section>
    </main>
  );
}
