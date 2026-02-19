'use client';

import { useEffect, useRef } from 'react';
import styles from './Logo.module.css';
import { initLogo3D } from './three';

export default function Logo() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { dispose } = initLogo3D(el);

    return () => dispose();
  }, []);

  return <div className={styles.logo} ref={containerRef} />;
}
