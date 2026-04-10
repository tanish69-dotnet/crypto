import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot  = dotRef.current;
    const rng  = ringRef.current;
    if (!dot || !rng) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    };

    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);
      rng.style.left = `${ring.current.x}px`;
      rng.style.top  = `${ring.current.y}px`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const hoverEls = document.querySelectorAll('button, a, [role="button"], .coin-card, select, input');
    hoverEls.forEach((el) => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
