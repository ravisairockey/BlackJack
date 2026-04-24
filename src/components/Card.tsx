"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { Card as CardType } from "@/core/types";
import { SPRING_CONFIG } from "@/lib/utils";

const SUIT_SYMBOLS: Record<string, string> = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
};

const SUIT_COLORS: Record<string, string> = {
  spade: "#e2e8f0",
  club: "#e2e8f0",
  heart: "#FF006E",
  diamond: "#FF4500",
};

interface CardProps {
  card: CardType;
  hidden?: boolean;
  index?: number;
  animate?: boolean;
}

export function Card({ card, hidden = false, index = 0, animate = true }: CardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hidden) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -12;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={animate ? { y: -120, rotateY: 180, opacity: 0, scale: 0.6 } : false}
  animate={{
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: tilt.x,
    rotateY: hidden ? 180 : tilt.y,
  }}
      transition={{
        ...SPRING_CONFIG.card,
        delay: index * 0.12,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-16 h-24 sm:w-20 sm:h-28 perspective-1000 cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front face */}
      <div
        className="absolute inset-0 rounded-xl backface-hidden overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {!hidden && (
          <div className="flex flex-col items-center justify-center h-full p-1">
            <span
              className="text-xs sm:text-sm font-bold font-mono leading-none"
              style={{ color: SUIT_COLORS[card.suit] }}
            >
              {card.rank}
            </span>
            <span
              className="text-lg sm:text-2xl leading-none mt-0.5"
              style={{ color: SUIT_COLORS[card.suit] }}
            >
              {SUIT_SYMBOLS[card.suit]}
            </span>
            {/* Corner decorations */}
            <span
              className="absolute top-1 left-1.5 text-[8px] sm:text-[10px] font-bold"
              style={{ color: SUIT_COLORS[card.suit] }}
            >
              {card.rank}
            </span>
            <span
              className="absolute bottom-1 right-1.5 text-[8px] sm:text-[10px] font-bold rotate-180"
              style={{ color: SUIT_COLORS[card.suit] }}
            >
              {card.rank}
            </span>
          </div>
        )}
      </div>

      {/* Back face */}
      <div
        className="absolute inset-0 rounded-xl backface-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(135deg, #1a0a2e, #0d0620)",
          border: "1px solid rgba(157,78,221,0.3)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(157,78,221,0.1)",
        }}
      >
        <div className="absolute inset-2 rounded-lg border border-neon-purple/20 flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neon-purple/30 flex items-center justify-center">
            <span className="text-neon-purple/60 text-lg">♠</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
