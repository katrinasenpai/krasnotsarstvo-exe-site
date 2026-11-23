import { useState } from 'react';
import { Play } from 'lucide-react';
import poster from '../assets/images/gallery-1-thumb.webp';
export function Trailer() {
  const [playing, setPlaying] = useState(false);
  return <div className="trailer-player aspect-video">{playing ? <iframe
    src="https://vkvideo.ru/video_ext.php?oid=-17047312&id=456240243&hd=2&autoplay=1"
    title="Первый трейлер КрасноЦарства" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen
  /> : <button type="button" onClick={() => setPlaying(true)} aria-label="Смотреть трейлер КрасноЦарства">
    <img src={poster} alt="Библиотека КрасноЦарства" loading="lazy" decoding="async" width="640" height="360" />
    <span><Play size={32} fill="currentColor" aria-hidden="true" /><strong>Смотреть трейлер</strong><small>VK Видео · ранняя версия</small></span>
  </button>}</div>;
}
