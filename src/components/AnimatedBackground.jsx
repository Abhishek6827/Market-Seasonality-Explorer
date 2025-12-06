"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function AnimatedBackground() {
  // Generate random shapes with different properties
  const shapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      width: Math.random() * 40 + 80, // 80-120px
      height: Math.random() * 30 + 50, // 50-80px
      top: Math.random() * 100, // Random vertical position (%)
      duration: Math.random() * 10 + 20, // 20-30 seconds
      delay: Math.random() * -20, // Staggered start (-20 to 0)
      gradient: getGradient(i),
      rotation: Math.random() * 360, // Random initial rotation
      opacity: Math.random() * 0.1 + 0.2, // 0.2-0.3 opacity
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" />

      {/* Animated shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute backdrop-blur-md border border-white/10"
          style={{
            width: shape.width,
            height: shape.height,
            top: `${shape.top}%`,
            left: "-150px",
            background: shape.gradient,
            borderRadius: "12px",
            boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.05)",
          }}
          animate={{
            x: ["0vw", "110vw"],
            rotate: [shape.rotation, shape.rotation + 360],
            opacity: [shape.opacity, shape.opacity * 1.5, shape.opacity],
          }}
          transition={{
            x: {
              duration: shape.duration,
              repeat: Infinity,
              ease: "linear",
              delay: shape.delay,
            },
            rotate: {
              duration: shape.duration * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: shape.delay,
            },
            opacity: {
              duration: shape.duration / 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            },
          }}
        />
      ))}

      {/* Additional subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

// Generate different gradient colors for variety
function getGradient(index) {
  const gradients = [
    "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.2))", // Blue-purple
    "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.2))", // Blue
    "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.2))", // Green
    "linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.2))", // Red
    "linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.2))", // Yellow
    "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(124, 58, 237, 0.2))", // Purple
    "linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(219, 39, 119, 0.2))", // Pink
    "linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.2))", // Cyan
  ];
  return gradients[index % gradients.length];
}
