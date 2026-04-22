"use client";

import React, { MouseEvent, useEffect, useRef, useState } from "react";

/**
 * A 3D-tilt "Certified Google Partner" badge.
 * Adapted from a Product Hunt-style animated badge - identical tilt/overlay
 * physics, Google Partner branding and Google colour palette.
 */

type Props = {
  /** External link - defaults to Google's Partner directory */
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

// Google brand colours - used for the sweeping overlay highlights
const overlayColors = [
  "#4285F4", // blue
  "#EA4335", // red
  "#FBBC05", // yellow
  "#34A853", // green
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
  "#ffffff",
  "#ffffff",
];

export function GooglePartnerBadge({ link, className }: Props) {
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
    @keyframes googlePartnerOverlay${e + 1} {
      0% { transform: rotate(${e * 10}deg); }
      50% { transform: rotate(${(e + 1) * 10}deg); }
      100% { transform: rotate(${e * 10}deg); }
    }`
    )
    .join(" ") +
    `
    @keyframes googlePartnerShine {
      0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
      18%  { opacity: 1; }
      82%  { opacity: 1; }
      100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
    }
    `;

  return (
    <a
      ref={ref}
      href={link ?? "https://www.google.com/partners/agency"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="DomiSearch - Certified Google Partner"
      className={`block h-auto w-[220px] cursor-pointer sm:w-[260px] ${className ?? ""}`}
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
          viewBox="0 0 260 54"
          className="h-auto w-full"
          role="img"
        >
          <defs>
            <filter id="gpbBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="gpbMask">
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
            <linearGradient id="gpbShineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Card base - off-white with subtle inner border */}
          <rect width="260" height="54" rx="10" fill="#F6F4EF" />
          <rect
            x="4"
            y="4"
            width="252"
            height="46"
            rx="8"
            fill="transparent"
            stroke="#C9C6C0"
            strokeWidth="1"
          />

          {/* CERTIFIED label */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, system-ui, sans-serif"
            fontSize="9"
            fontWeight="bold"
            fill="#5F6368"
            letterSpacing="1.2"
            x="56"
            y="20"
          >
            CERTIFIED
          </text>

          {/* Google Partner main title */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, system-ui, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#1F1F1F"
            x="55"
            y="40"
          >
            Google Partner
          </text>

          {/* Google G emblem - four-colour arc construction */}
          <g transform="translate(12, 12)">
            {/* Background circle softener */}
            <circle cx="15" cy="15" r="14.5" fill="#FFFFFF" />
            {/* Four-colour G mark */}
            <path
              d="M29.4 15.3c0-1-.1-2-.3-2.9H15v5.5h8.1c-.3 1.9-1.4 3.5-3 4.6v3.8h4.8c2.8-2.6 4.5-6.4 4.5-11Z"
              fill="#4285F4"
            />
            <path
              d="M15 30c4 0 7.4-1.3 9.9-3.7l-4.8-3.8c-1.3.9-3 1.4-5.1 1.4-3.9 0-7.3-2.6-8.5-6.2H1.5v3.9C4 26.8 9.1 30 15 30Z"
              fill="#34A853"
            />
            <path
              d="M6.5 17.7c-.3-.9-.5-1.8-.5-2.7s.2-1.8.5-2.7V8.4H1.5C.5 10.4 0 12.6 0 15s.5 4.6 1.5 6.6l5-3.9Z"
              fill="#FBBC05"
            />
            <path
              d="M15 5.9c2.2 0 4.2.8 5.7 2.3l4.3-4.3C22.3 1.5 19 0 15 0 9.1 0 4 3.2 1.5 8.4l5 3.9c1.2-3.6 4.6-6.4 8.5-6.4Z"
              fill="#EA4335"
            />
          </g>

          {/* Continuous shine sweep - always on, no hover needed */}
          <g mask="url(#gpbMask)">
            <rect
              x="0"
              y="0"
              width="90"
              height="54"
              fill="url(#gpbShineGrad)"
              style={{
                transformOrigin: "center",
                animation: "googlePartnerShine 4.2s ease-in-out infinite",
                mixBlendMode: "overlay",
                willChange: "transform, opacity",
              }}
            />
          </g>

          {/* Shimmer overlay layers (identical tilt physics to source) */}
          <g style={{ mixBlendMode: "overlay" }} mask="url(#gpbMask)">
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
                    : `googlePartnerOverlay${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={color}
                  filter="url(#gpbBlur)"
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </a>
  );
}
