type Props = { id: string; title?: string };

export default function YouTubeEmbed({ id, title = 'Drone Depot Video' }: Props) {
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?mute=1&playsinline=1&controls=0&modestbranding=1&loop=1&playlist=${id}&rel=0`;

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 16 }}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
      {/* Optional fallback link for SEO/accessibility (not visible): */}
      <a href={`https://youtu.be/${id}`} aria-hidden="true" tabIndex={-1} style={{ position: 'absolute', left: -9999 }}>
        {title}
      </a>
    </div>
  );
}
