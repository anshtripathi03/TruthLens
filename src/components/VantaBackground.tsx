"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const effect = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initVanta = async () => {
      if (!effect.current && vantaRef.current) {
        try {
          const NET = (await import("vanta/dist/vanta.net.min")).default;

          effect.current = NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x3f62ff,
            backgroundColor: 0x060912, // matches TruthLens body bg
            points: 8,
            maxDistance: 21,
            spacing: 15,
            showDots: true,
          });
        } catch (err) {
          console.error("Vanta NET failed to initialize:", err);
        }
      }
    };

    initVanta();

    return () => {
      if (effect.current) {
        effect.current.destroy();
        effect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
