"use client";

import React, { MouseEvent, useEffect, useRef, useState } from "react";

/**
 * A 3D-tilt "AI Search Coverage" badge. Same tilt / shine infrastructure as
 * the Google and Shopify partner badges, rendered as a silver-finish card
 * with a row of colour-coded AI-engine chips (ChatGPT, Gemini, Perplexity,
 * Claude, Copilot).
 */

type Props = {
  link?: string;
  className?: string;
};

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.25;
const minRotate = -0.25;
const maxScale = 1;
const minScale = 0.97;

const overlayColors = [
  "#E9ECEF",
  "#CED4DA",
  "#ADB5BD",
  "#F8F9FA",
  "#DEE2E6",
  "#6C757D",
  "#CED4DA",
  "#F8F9FA",
  "#FFFFFF",
  "#E9ECEF",
];

// Real brand-mark pngs (1080×1080 source, resized to 200px in /public/engines)
const engines = [
  { name: "ChatGPT", src: "/engines/chatgpt.png" },
  { name: "Gemini", src: "/engines/gemini.png" },
  { name: "Perplexity", src: "/engines/perplexity.png" },
  { name: "Claude", src: "/engines/claude.png" },
  { name: "Copilot", src: "/engines/copilot.png" },
];

export function AIEnginesBadge({ link, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0);
  const [matrix, setMatrix] = useState<string>(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState<boolean>(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState<boolean>(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false);

  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDimensions = () => {
    const rect = ref.current?.getBoundingClientRect();
    return {
      left: rect?.left ?? 0,
      right: rect?.right ?? 0,
      top: rect?.top ?? 0,
      bottom: rect?.bottom ?? 0,
    };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    const scale = [
      maxScale - ((maxScale - minScale) * Math.abs(xCenter - clientX)) / (xCenter - left || 1),
      maxScale - ((maxScale - minScale) * Math.abs(yCenter - clientY)) / (yCenter - top || 1),
      maxScale -
        ((maxScale - minScale) *
          (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          ((xCenter - left || 1) + (yCenter - top || 1)),
    ];
    const rotate = {
      x1: 0.25 * ((yCenter - clientY) / (yCenter || 1) - (xCenter - clientX) / (xCenter || 1)),
      x2: maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left || 1),
      x3: 0,
      y0: 0,
      y2: maxRotate - ((maxRotate - minRotate) * (top - clientY)) / (top - bottom || 1),
      y3: 0,
      z0: -(maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left || 1)),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom || 1),
      z3: 0,
    };
    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (
    _matrix: string,
    clientY: number,
    onMouseEnter?: boolean
  ) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = onMouseEnter ? 0.7 : 4;
    const multiplier = onMouseEnter ? -1 : 1;
    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return (-parseFloat(item) * multiplier) / weakening + "";
        } else if (index === 0 || index === 5 || index === 10) {
          return "1";
        } else if (index === 6) {
          return (
            (multiplier *
              (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom || 1))) /
              weakening +
            ""
          );
        } else if (index === 9) {
          return (
            (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom || 1)) /
              weakening +
            ""
          );
        }
        return item;
      })
      .join(", ");
  };

  const onMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    setDisableOverlayAnimation(true);
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(() => setDisableInOutOverlayAnimation(true), 350);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        );
      });
    });
    const m = getMatrix(e.clientX, e.clientY);
    const oppositeMatrix = getOppositeMatrix(m, e.clientY, true);
    setMatrix(oppositeMatrix);
    setIsTimeoutFinished(false);
    setTimeout(() => setIsTimeoutFinished(true), 200);
  };

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setTimeout(
      () =>
        setFirstOverlayPosition(
          (Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5
        ),
      150
    );
    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY));
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const oppositeMatrix = getOppositeMatrix(matrix, e.clientY);
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    setCurrentMatrix(oppositeMatrix);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
          150
        );
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  useEffect(() => {
    if (isTimeoutFinished) setMatrix(currentMatrix);
  }, [currentMatrix, isTimeoutFinished]);

  const overlayAnimations = [...Array(10).keys()]
    .map(
      (e) => `
    @keyframes aiEnginesOverlay${e + 1} {
      0% { transform: rotate(${e * 10}deg); }
      50% { transform: rotate(${(e + 1) * 10}deg); }
      100% { transform: rotate(${e * 10}deg); }
    }`
    )
    .join(" ") +
    `
    @keyframes aiEnginesShine {
      0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
      18%  { opacity: 1; }
      82%  { opacity: 1; }
      100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
    }
    `;

  // Badge now 340 × 54 (wider to fit 5 real logos comfortably beside the label)
  const vbW = 340;
  const vbH = 54;
  const chipSize = 38;
  const chipGap = 6;
  const chipY = (vbH - chipSize) / 2;
  const chipsTotal = engines.length * chipSize + (engines.length - 1) * chipGap;
  const chipsStartX = vbW - 14 - chipsTotal; // right-aligned with 14px right padding

  return (
    <a
      ref={ref}
      href={link ?? "/services/aeo"}
      aria-label="DomiSearch - AI Search Coverage"
      className={`block h-auto w-[280px] cursor-pointer sm:w-[320px] ${className ?? ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="h-auto w-full"
          role="img"
        >
          <defs>
            <filter id="aiebBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="aiebMask">
              <rect width={vbW} height={vbH} fill="white" rx="10" />
            </mask>
            <linearGradient id="aiebSilver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F9FA" />
              <stop offset="55%" stopColor="#E2E5E9" />
              <stop offset="100%" stopColor="#C9CDD3" />
            </linearGradient>
            <linearGradient id="aiebShineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Silver card base */}
          <rect width={vbW} height={vbH} rx="10" fill="url(#aiebSilver)" />
          <rect
            x="4"
            y="4"
            width={vbW - 8}
            height={vbH - 8}
            rx="8"
            fill="transparent"
            stroke="#B2B5BA"
            strokeWidth="1"
          />

          {/* Label */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="bold"
            fill="#5F6368"
            letterSpacing="1.2"
            x="14"
            y="22"
          >
            TRACKED ACROSS
          </text>
          <text
            fontFamily="Helvetica-Bold, Helvetica, system-ui, sans-serif"
            fontSize="12"
            fontWeight="bold"
            fill="#1F1F1F"
            x="14"
            y="39"
            letterSpacing="0.2"
          >
            AI ENGINES
          </text>

          {/* Engine chips row — real logos on white */}
          {engines.map((engine, i) => {
            const x = chipsStartX + i * (chipSize + chipGap);
            return (
              <g key={engine.name} transform={`translate(${x}, ${chipY})`}>
                <rect
                  width={chipSize}
                  height={chipSize}
                  rx="7"
                  fill="#FFFFFF"
                  stroke="#D7D9DD"
                  strokeWidth="0.5"
                />
                <image
                  href={engine.src}
                  x={chipSize * 0.12}
                  y={chipSize * 0.12}
                  width={chipSize * 0.76}
                  height={chipSize * 0.76}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            );
          })}

          {/* Continuous shine sweep */}
          <g mask="url(#aiebMask)">
            <rect
              x="0"
              y="0"
              width={vbW * 0.3}
              height={vbH}
              fill="url(#aiebShineGrad)"
              style={{
                transformOrigin: "center",
                animation: "aiEnginesShine 4.6s ease-in-out infinite 0.3s",
                mixBlendMode: "overlay",
                willChange: "transform, opacity",
              }}
            />
          </g>

          {/* Tilt shimmer overlay */}
          <g style={{ mixBlendMode: "overlay" }} mask="url(#aiebMask)">
            {overlayColors.map((color, i) => (
              <g
                key={i}
                style={{
                  transform: `rotate(${firstOverlayPosition + i * 10}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation
                    ? "transform 200ms ease-out"
                    : "none",
                  animation: disableOverlayAnimation
                    ? "none"
                    : `aiEnginesOverlay${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points={`0,0 ${vbW},${vbH} ${vbW},0 0,${vbH}`}
                  fill={color}
                  filter="url(#aiebBlur)"
                  opacity="0.45"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </a>
  );
}
