"use client";

import { useEffect, useRef } from "react";

export default function SkyscraperBackground() {
  const bgLayerRef = useRef<SVGGElement>(null);
  const fgLayerRef = useRef<SVGGElement>(null);
  const winLayerRef = useRef<SVGGElement>(null);
  const skyLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let frameId: number;

    const onScroll = () => {
      targetY = window.scrollY;
    };

    const update = () => {
      currentY += (targetY - currentY) * 0.08;
      const factor = Math.min(Math.max(currentY, 0) / 600, 1);

      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `translate3d(${-factor * 34}px, ${factor * 16}px, 0)`;
      }
      if (fgLayerRef.current) {
        fgLayerRef.current.style.transform = `translate3d(${factor * 26}px, ${factor * 8}px, 0)`;
      }
      if (winLayerRef.current) {
        winLayerRef.current.style.fillOpacity = `${0.08 + factor * 0.08}`;
      }
      if (skyLayerRef.current) {
        skyLayerRef.current.style.transform = `translate3d(0, ${factor * -12}px, 0)`;
      }

      frameId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    frameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes cloudDriftRightFast {
          0% { transform: translateX(0); }
          50% { transform: translateX(65px); }
          100% { transform: translateX(0); }
        }
        @keyframes cloudDriftLeftFast {
          0% { transform: translateX(0); }
          50% { transform: translateX(-55px); }
          100% { transform: translateX(0); }
        }
        @keyframes planeGlide {
          0% { transform: translate(680px, 60px) rotate(-14deg) scale(0.95); }
          50% { transform: translate(740px, 44px) rotate(-12deg) scale(0.98); }
          100% { transform: translate(680px, 60px) rotate(-14deg) scale(0.95); }
        }
        @keyframes birdsGlide {
          0% { transform: translate(0, 0); }
          50% { transform: translate(25px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes beaconBlink {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes beaconRingExpand {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .anim-cloud-1 {
          animation: cloudDriftRightFast 16s ease-in-out infinite;
        }
        .anim-cloud-2 {
          animation: cloudDriftLeftFast 19s ease-in-out infinite;
        }
        .anim-cloud-3 {
          animation: cloudDriftRightFast 22s ease-in-out infinite;
        }
        .anim-cloud-4 {
          animation: cloudDriftLeftFast 17s ease-in-out infinite;
        }
        .anim-cloud-5 {
          animation: cloudDriftRightFast 14s ease-in-out infinite;
        }
        .anim-cloud-6 {
          animation: cloudDriftLeftFast 21s ease-in-out infinite;
        }
        .anim-cloud-7 {
          animation: cloudDriftRightFast 18s ease-in-out infinite;
        }
        .anim-plane {
          animation: planeGlide 8s ease-in-out infinite;
        }
        .anim-birds {
          animation: birdsGlide 10s ease-in-out infinite;
        }
        .anim-beacon {
          transform-box: fill-box;
          transform-origin: center;
          animation: beaconBlink 2.4s ease-in-out infinite;
        }
        .anim-beacon-delayed {
          transform-box: fill-box;
          transform-origin: center;
          animation: beaconBlink 2.4s ease-in-out infinite 0.7s;
        }
        .anim-beacon-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: beaconRingExpand 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-cloud-1, .anim-cloud-2, .anim-cloud-3, .anim-cloud-4, .anim-cloud-5, .anim-cloud-6, .anim-cloud-7, .anim-plane, .anim-birds, .anim-beacon, .anim-beacon-delayed, .anim-beacon-ring {
            animation: none !important;
          }
        }
      `}</style>

      {/* Sky Layer - positioned cleanly below the 72px navbar so nothing is blocked */}
      <div
        ref={skyLayerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "76px",
          left: 0,
          right: 0,
          height: "230px",
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 1600 230"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {/* Sun & radiant rings */}
          <g>
            <circle cx="1260" cy="70" r="40" fill="#eb9d2a" fillOpacity="0.16" />
            <circle
              cx="1260"
              cy="70"
              r="60"
              stroke="#eb9d2a"
              strokeOpacity="0.10"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="1260"
              cy="70"
              r="82"
              stroke="#eb9d2a"
              strokeOpacity="0.07"
              strokeWidth="1"
              strokeDasharray="6 8"
              fill="none"
            />
          </g>

          {/* Flight trajectory lines */}
          <line
            x1="240"
            y1="165"
            x2="690"
            y2="58"
            stroke="#23251d"
            strokeOpacity="0.08"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <line
            x1="255"
            y1="169"
            x2="694"
            y2="62"
            stroke="#23251d"
            strokeOpacity="0.05"
            strokeWidth="1"
            strokeDasharray="6 8"
          />

          {/* Gliding Airplane */}
          <g className="anim-plane" fill="#23251d" fillOpacity="0.20">
            <path d="M -35,0 Q -15,-3.5 25,-3.5 Q 40,-3 48,0 Q 40,3 25,3.5 Q -15,3.5 -35,0 Z" />
            <polygon points="5,-3.5 -12,-38 -18,-38 -6,-3.5" />
            <polygon points="5,3.5 -12,38 -18,38 -6,3.5" />
            <rect x="-8" y="-18" width="10" height="3" rx="1.5" />
            <rect x="-8" y="15" width="10" height="3" rx="1.5" />
            <polygon points="-28,-1.5 -36,-14 -39,-14 -33,-1.5" />
            <polygon points="-28,1.5 -36,14 -39,14 -33,1.5" />
            <polygon points="-24,0 -34,-1.5 -38,-18 -32,-18 -22,0" />
          </g>

          {/* Clouds */}
          <g className="anim-cloud-1">
            <path
              d="M 60 145 h 220 a 30 30 0 0 0 -8 -58 a 48 48 0 0 0 -86 -18 a 38 38 0 0 0 -66 16 a 30 30 0 0 0 -60 60 z"
              fill="#23251d"
              fillOpacity="0.09"
            />
            <path
              d="M 120 155 h 130 a 20 20 0 0 0 -4 -38 a 32 32 0 0 0 -58 -12 a 24 24 0 0 0 -44 11 a 20 20 0 0 0 -24 39 z"
              fill="#23251d"
              fillOpacity="0.05"
            />
          </g>

          <g className="anim-cloud-2">
            <path
              d="M 280 85 h 180 a 24 24 0 0 0 -6 -46 a 38 38 0 0 0 -68 -15 a 28 28 0 0 0 -52 13 a 24 24 0 0 0 -54 48 z"
              fill="#23251d"
              fillOpacity="0.08"
            />
          </g>

          <g className="anim-cloud-5">
            <path
              d="M 510 135 h 190 a 26 26 0 0 0 -6 -50 a 42 42 0 0 0 -75 -16 a 32 32 0 0 0 -58 14 a 26 26 0 0 0 -51 52 z"
              fill="#23251d"
              fillOpacity="0.09"
            />
            <path
              d="M 560 145 h 110 a 18 18 0 0 0 -4 -34 a 28 28 0 0 0 -50 -11 a 20 20 0 0 0 -38 10 a 18 18 0 0 0 -18 35 z"
              fill="#23251d"
              fillOpacity="0.05"
            />
          </g>

          <g className="anim-cloud-3">
            <path
              d="M 780 75 h 160 a 22 22 0 0 0 -5 -42 a 34 34 0 0 0 -60 -13 a 26 26 0 0 0 -46 12 a 22 22 0 0 0 -49 43 z"
              fill="#23251d"
              fillOpacity="0.075"
            />
          </g>

          <g className="anim-cloud-6">
            <path
              d="M 980 135 h 230 a 32 32 0 0 0 -8 -62 a 50 50 0 0 0 -90 -19 a 40 40 0 0 0 -70 17 a 32 32 0 0 0 -62 64 z"
              fill="#23251d"
              fillOpacity="0.095"
            />
            <path
              d="M 1040 145 h 140 a 22 22 0 0 0 -5 -42 a 35 35 0 0 0 -62 -13 a 28 28 0 0 0 -48 12 a 22 22 0 0 0 -25 43 z"
              fill="#23251d"
              fillOpacity="0.05"
            />
          </g>

          <g className="anim-cloud-4">
            <path
              d="M 1260 90 h 170 a 24 24 0 0 0 -6 -46 a 38 38 0 0 0 -68 -15 a 28 28 0 0 0 -52 13 a 24 24 0 0 0 -44 48 z"
              fill="#23251d"
              fillOpacity="0.085"
            />
          </g>

          <g className="anim-cloud-7">
            <path
              d="M 1440 140 h 160 a 24 24 0 0 0 -6 -46 a 38 38 0 0 0 -68 -15 a 28 28 0 0 0 -52 13 a 24 24 0 0 0 -34 48 z"
              fill="#23251d"
              fillOpacity="0.07"
            />
          </g>

          {/* Flocks of birds */}
          <g className="anim-birds" stroke="#23251d" strokeOpacity="0.18" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M 320 68 Q 328 60 334 68 Q 340 60 348 68" />
            <path d="M 342 54 Q 348 48 353 54 Q 358 48 364 54" />
            <path d="M 360 44 Q 365 38 370 44 Q 375 38 380 44" />
            <path d="M 374 58 Q 379 52 383 58 Q 387 52 392 58" />
            <path d="M 390 70 Q 395 64 399 70 Q 403 64 408 70" />
            <path d="M 880 50 Q 887 43 893 50 Q 899 43 906 50" />
            <path d="M 900 38 Q 906 32 911 38 Q 916 32 922 38" />
            <path d="M 915 48 Q 920 42 924 48 Q 928 42 933 48" />
          </g>
        </svg>
      </div>

      {/* Skyscraper Silhouette Bottom Layer */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "420px",
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 -20 1600 470"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {/* Background building tier */}
          <g ref={bgLayerRef} style={{ willChange: "transform" }} fill="#23251d" fillOpacity="0.065">
            <rect x="70" y="70" width="80" height="380" />
            <polygon points="70,70 110,20 150,70" />
            <line x1="110" y1="20" x2="110" y2="0" stroke="#23251d" strokeOpacity="0.10" strokeWidth="3" />

            <rect x="235" y="85" width="105" height="365" />
            <rect x="255" y="45" width="65" height="40" />
            <rect x="275" y="25" width="25" height="20" />
            <line x1="287.5" y1="25" x2="287.5" y2="5" stroke="#23251d" strokeOpacity="0.10" strokeWidth="2.5" />

            <polygon points="445,450 445,95 535,35 565,450" />

            <rect x="695" y="65" width="115" height="385" />
            <rect x="725" y="30" width="55" height="35" />
            <polygon points="735,30 752.5,5 770,30" />
            <line x1="752.5" y1="5" x2="752.5" y2="-15" stroke="#23251d" strokeOpacity="0.10" strokeWidth="3" />

            <rect x="965" y="80" width="60" height="370" />
            <rect x="1035" y="80" width="60" height="370" />
            <rect x="985" y="170" width="90" height="18" />
            <rect x="985" y="270" width="90" height="18" />

            <polygon points="1195,450 1195,105 1285,45 1315,450" />

            <rect x="1425" y="85" width="90" height="365" />
            <polygon points="1425,85 1470,30 1515,85" />
            <line x1="1470" y1="30" x2="1470" y2="5" stroke="#23251d" strokeOpacity="0.10" strokeWidth="2.5" />
          </g>

          {/* Foreground building tier */}
          <g ref={fgLayerRef} style={{ willChange: "transform" }}>
            <g fill="#23251d" fillOpacity="0.12">
              <rect x="0" y="210" width="95" height="240" />
              <rect x="20" y="185" width="55" height="25" />

              <rect x="105" y="145" width="105" height="305" />
              <rect x="120" y="90" width="75" height="55" />
              <rect x="135" y="55" width="45" height="35" />
              <polygon points="145,55 157.5,25 170,55" />
              <line x1="157.5" y1="25" x2="157.5" y2="0" stroke="#23251d" strokeOpacity="0.15" strokeWidth="3" />

              <polygon points="235,450 235,185 335,115 335,450" />

              <rect x="355" y="195" width="110" height="255" />
              <rect x="370" y="135" width="80" height="60" />
              <rect x="385" y="90" width="50" height="45" />
              <polygon points="395,90 410,50 425,90" />
              <line x1="410" y1="50" x2="410" y2="15" stroke="#23251d" strokeOpacity="0.15" strokeWidth="3" />

              <rect x="480" y="175" width="140" height="275" />
              <rect x="500" y="120" width="100" height="55" />
              <rect x="520" y="70" width="60" height="50" />
              <polygon points="535,70 550,25 565,70" />
              <line x1="550" y1="25" x2="550" y2="-5" stroke="#23251d" strokeOpacity="0.15" strokeWidth="3.5" />

              <polygon points="635,450 635,135 730,95 745,155 745,450" />

              <rect x="760" y="115" width="50" height="335" />
              <rect x="830" y="115" width="50" height="335" />
              <rect x="780" y="195" width="80" height="22" />
              <rect x="780" y="295" width="80" height="22" />
              <line x1="785" y1="115" x2="785" y2="70" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />
              <line x1="855" y1="115" x2="855" y2="70" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />

              <polygon points="900,450 915,120 1000,120 1015,450" />
              <polygon points="925,120 957.5,50 990,120" />
              <line x1="957.5" y1="50" x2="957.5" y2="15" stroke="#23251d" strokeOpacity="0.15" strokeWidth="3" />

              <rect x="1040" y="180" width="120" height="270" />
              <polygon points="1055,180 1055,115 1145,155 1145,180" />
              <line x1="1055" y1="115" x2="1055" y2="70" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />

              <rect x="1175" y="155" width="120" height="295" />
              <rect x="1190" y="105" width="90" height="50" />
              <rect x="1210" y="75" width="50" height="30" />
              <line x1="1235" y1="75" x2="1235" y2="35" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />

              <polygon points="1310,450 1320,130 1410,85 1425,450" />
              <line x1="1410" y1="85" x2="1410" y2="40" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />

              <rect x="1440" y="165" width="95" height="285" />
              <rect x="1460" y="105" width="55" height="60" />
              <polygon points="1470,105 1487.5,55 1505,105" />
              <line x1="1487.5" y1="55" x2="1487.5" y2="20" stroke="#23251d" strokeOpacity="0.15" strokeWidth="2.5" />

              <rect x="1545" y="195" width="70" height="255" />
              <rect x="1560" y="170" width="40" height="25" />
            </g>

            {/* Lit window details */}
            <g ref={winLayerRef} fill="#eb9d2a" fillOpacity="0.08">
              <rect x="125" y="160" width="5" height="230" />
              <rect x="142" y="160" width="5" height="230" />
              <rect x="160" y="160" width="5" height="230" />
              <rect x="178" y="160" width="5" height="230" />

              <rect x="375" y="210" width="12" height="7" />
              <rect x="397" y="210" width="12" height="7" />
              <rect x="419" y="210" width="12" height="7" />
              <rect x="441" y="210" width="12" height="7" />
              <rect x="375" y="228" width="12" height="7" />
              <rect x="397" y="228" width="12" height="7" />
              <rect x="419" y="228" width="12" height="7" />
              <rect x="441" y="228" width="12" height="7" />
              <rect x="375" y="246" width="12" height="7" />
              <rect x="397" y="246" width="12" height="7" />
              <rect x="419" y="246" width="12" height="7" />
              <rect x="441" y="246" width="12" height="7" />
              <rect x="375" y="264" width="12" height="7" />
              <rect x="397" y="264" width="12" height="7" />
              <rect x="419" y="264" width="12" height="7" />
              <rect x="441" y="264" width="12" height="7" />

              <rect x="505" y="190" width="90" height="5" />
              <rect x="505" y="215" width="90" height="5" />
              <rect x="505" y="240" width="90" height="5" />
              <rect x="505" y="265" width="90" height="5" />
              <rect x="505" y="290" width="90" height="5" />
              <rect x="525" y="135" width="50" height="4" />
              <rect x="525" y="148" width="50" height="4" />

              <rect x="772" y="135" width="6" height="20" />
              <rect x="790" y="135" width="6" height="20" />
              <rect x="842" y="135" width="6" height="20" />
              <rect x="860" y="135" width="6" height="20" />
              <rect x="772" y="165" width="6" height="20" />
              <rect x="790" y="165" width="6" height="20" />
              <rect x="842" y="165" width="6" height="20" />
              <rect x="860" y="165" width="6" height="20" />

              <rect x="954" y="140" width="7" height="260" />

              <rect x="1195" y="175" width="14" height="8" />
              <rect x="1218" y="175" width="14" height="8" />
              <rect x="1241" y="175" width="14" height="8" />
              <rect x="1264" y="175" width="14" height="8" />
              <rect x="1195" y="193" width="14" height="8" />
              <rect x="1218" y="193" width="14" height="8" />
              <rect x="1241" y="193" width="14" height="8" />
              <rect x="1264" y="193" width="14" height="8" />
              <rect x="1195" y="211" width="14" height="8" />
              <rect x="1218" y="211" width="14" height="8" />
              <rect x="1241" y="211" width="14" height="8" />
              <rect x="1264" y="211" width="14" height="8" />
              <rect x="1195" y="229" width="14" height="8" />
              <rect x="1218" y="229" width="14" height="8" />
              <rect x="1241" y="229" width="14" height="8" />
              <rect x="1264" y="229" width="14" height="8" />
            </g>

            {/* Glowing beacon lights */}
            <g>
              <circle cx="550" cy="-5" r="3" fill="#eb9d2a" className="anim-beacon" />
              <circle cx="550" cy="-5" r="7" stroke="#eb9d2a" strokeWidth="1" fill="none" className="anim-beacon-ring" />

              <circle cx="157.5" cy="0" r="2.5" fill="#eb9d2a" className="anim-beacon-delayed" />
              <circle cx="410" cy="15" r="2.5" fill="#eb9d2a" className="anim-beacon" />
              <circle cx="957.5" cy="15" r="2.5" fill="#eb9d2a" className="anim-beacon-delayed" />
              <circle cx="1487.5" cy="20" r="2.5" fill="#eb9d2a" className="anim-beacon" />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}