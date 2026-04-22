"use client";

import React, { MouseEvent, useEffect, useRef, useState } from "react";

/**
 * A 3D-tilt "Shopify Partner" badge.
 * Same tilt physics / overlay shimmer system as the Google Partner badge,
 * rendered in a premium silver/platinum finish with the Shopify mark.
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

// Silver-spectrum overlay palette for the shimmer sweep
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

export function ShopifyPartnerBadge({ link, className }: Props) {
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
    @keyframes shopifyPartnerOverlay${e + 1} {
      0% { transform: rotate(${e * 10}deg); }
      50% { transform: rotate(${(e + 1) * 10}deg); }
      100% { transform: rotate(${e * 10}deg); }
    }`
    )
    .join(" ") +
    `
    @keyframes shopifyPartnerShine {
      0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
      18%  { opacity: 1; }
      82%  { opacity: 1; }
      100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
    }
    `;

  return (
    <a
      ref={ref}
      href={link ?? "https://www.shopify.com/partners"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="DomiSearch - Shopify Partner"
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
            <filter id="spbBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <mask id="spbMask">
              <rect width="260" height="54" fill="white" rx="10" />
            </mask>
            <linearGradient id="spbSilver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F9FA" />
              <stop offset="55%" stopColor="#E2E5E9" />
              <stop offset="100%" stopColor="#C9CDD3" />
            </linearGradient>
            <linearGradient id="spbShineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Silver card base */}
          <rect width="260" height="54" rx="10" fill="url(#spbSilver)" />
          <rect
            x="4"
            y="4"
            width="252"
            height="46"
            rx="8"
            fill="transparent"
            stroke="#B2B5BA"
            strokeWidth="1"
          />

          {/* Eyebrow */}
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

          {/* Main title */}
          <text
            fontFamily="Helvetica-Bold, Helvetica, system-ui, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#1F1F1F"
            x="55"
            y="40"
          >
            Shopify Partner
          </text>

          {/* Shopify bag emblem - simplified brand mark */}
          <g transform="translate(10, 8)">
            <path
              d="M29.9 8.7c0-.1-.1-.2-.2-.2l-2.6-.2-1.9-1.9c-.2-.2-.5-.1-.6-.1 0 0-.4.1-1 .3-.1-.3-.3-.6-.5-.9-.7-1.3-1.8-2.1-3-2.1h-.3C19.6 3.4 19.4 3.2 19.1 3c-1.8-1.9-4.6-.7-6.1 4.2-.6 2-1 2.9-1.3 3.9-1.4.4-2.3.7-2.4.8-.7.2-.8.3-.9 1-.1.5-1.9 14.6-1.9 14.6l15 2.6 6.5-1.6S29.9 8.9 29.9 8.7Zm-7-1.7c-.5.2-1.1.4-1.7.5 0-.9-.1-2.1-.5-3.1 1.1.2 1.7 1.5 2.2 2.6ZM20 5.7c.3.8.5 2 .5 3.1-.9.3-1.8.6-2.8.9.5-2 1.5-3 2.3-4Zm-.9-2.7c.2 0 .3 0 .5.1-1.1.5-2.2 1.8-2.7 4.4-.7.2-1.5.5-2.2.7C15.6 5.7 17.2 3 19.1 3Z"
              fill="#95BF47"
            />
            <path
              d="M29.7 8.5 27.1 8.3 25.2 6.4c-.1-.1-.2-.1-.3-.1v25l6.5-1.6S29.9 8.9 29.9 8.7c0-.1-.1-.2-.2-.2Z"
              fill="#5E8E3E"
            />
            <path
              d="M19.7 11.7 18.9 14.3s-.9-.4-1.9-.4c-1.5 0-1.6 1-1.6 1.2 0 1.3 3.6 1.9 3.6 5.2 0 2.6-1.6 4.2-3.8 4.2-2.6 0-4-1.6-4-1.6L12 19s1.5 1.3 2.7 1.3c.8 0 1.1-.6 1.1-1.1 0-1.7-3-1.8-3-4.9 0-2.5 1.8-5 5.8-5 1.4.1 2.1.4 2.1.4Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Continuous shine sweep - always on, no hover needed */}
          <g mask="url(#spbMask)">
            <rect
              x="0"
              y="0"
              width="90"
              height="54"
              fill="url(#spbShineGrad)"
              style={{
                transformOrigin: "center",
                animation: "shopifyPartnerShine 4.8s ease-in-out infinite 0.6s",
                mixBlendMode: "overlay",
                willChange: "transform, opacity",
              }}
            />
          </g>

          {/* Shimmer overlay */}
          <g style={{ mixBlendMode: "overlay" }} mask="url(#spbMask)">
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
                    : `shopifyPartnerOverlay${i + 1} 5s infinite`,
                  willChange: "transform",
                }}
              >
                <polygon
                  points="0,0 260,54 260,0 0,54"
                  fill={color}
                  filter="url(#spbBlur)"
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
