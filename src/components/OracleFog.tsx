import './OracleFog.css';

export type FogPhase = 'covering' | 'waiting' | 'revealing';

export function OracleFog({ phase }: { phase: FogPhase }) {
  return (
    <div className={`oracle-fog is-${phase}`} role="status" aria-live="polite" aria-label="Туман раскрывает страницы Книжного оракула">
      <div className="oracle-fog__veil" />
      <div className="oracle-fog__cloud oracle-fog__cloud--left" />
      <div className="oracle-fog__cloud oracle-fog__cloud--right" />
      <div className="oracle-fog__cloud oracle-fog__cloud--near" />
      <div className="oracle-fog__texture" />
      <div className="oracle-fog__message" aria-hidden="true"><span>✦</span><p>Туман раскрывает страницы</p><small>КНИЖНЫЙ ОРАКУЛ</small></div>
    </div>
  );
}
