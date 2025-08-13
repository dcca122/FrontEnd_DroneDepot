import YouTubeEmbed from '@/components/YouTubeEmbed';
import { scrollCinemas } from '@/data/scrollCinemas';

export default function ScrollCinemaList() {
  return (
    <div>
      {scrollCinemas.map(({ id, yt, title, cta }) => (
        <section key={id} className="grid md:grid-cols-2 items-center gap-6 py-16">
          {/* Sticky text/CTA column (unchanged) */}
          <div className="sticky top-24">
            <h2 className="text-3xl font-semibold">{title}</h2>
            <button className="mt-4 px-5 py-3 rounded-2xl shadow">{cta}</button>
          </div>

          {/* Video column → YouTube embed */}
          <div>
            <YouTubeEmbed id={yt} title={title} />
          </div>
        </section>
      ))}
    </div>
  );
}
