import { QRCodeSVG } from 'qrcode.react';
import { Camera, ArrowUpRight } from 'lucide-react';
import { getIskinArUrl } from '../utils/iskinProjectionUrl';
import './IskinWidget.css';
export function IskinWidget() {
  const link = getIskinArUrl();
  return <div className="iskin-invite">
    <div className="iskin-invite__portrait"><img src="/characters/iskin.webp" alt="Искин в новой рисовке" loading="lazy" /></div>
    <div className="iskin-invite__text"><p className="iskin-invite__eyebrow">ИЗ КРАСНОЦАРСТВА В ВАШ МИР</p><h2 id="iskin-invite-title">Искин рядом</h2><p>Познакомьтесь с проводником за пределами книжных страниц. Откройте дополненную реальность на телефоне и разместите его проекцию в своём пространстве.</p><a href="/iskin-ar"><Camera size={20} /> Открыть дополненную реальность <ArrowUpRight size={18} /></a><small>На совместимом смартфоне. Для размещения потребуется доступ к камере.</small></div>
    <div className="iskin-invite__qr"><QRCodeSVG value={link.url} size={136} bgColor="#f3e6c8" fgColor="#142632" marginSize={2} title="Искин в дополненной реальности" /><p>Откройте камерой телефона</p></div>
  </div>;
}
