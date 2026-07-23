/**
 * @file components/OceanElement.jsx
 * @description Main hero component for OCEAN. Assembles all vector layers into an SVG canvas,
 * handles entry transitions, mouse interactions, and exposes clean customization props.
 *
 * PROPS GUIDE:
 * @param {number} [size=600] - Max bounding box size in pixels (responsive up to screen bounds).
 * @param {boolean} [animated=true] - Enables/disables idle floating, bubbles, and bird flapping.
 * @param {boolean} [interactive=true] - Enables/disables spring-based mouse tilt interaction.
 * @param {number} [bubbleDensity=1] - Multiplier for standard bubble generation rate.
 * @param {number} [birdCount=2] - Number of vector birds in the sky (0 to 3).
 * @param {string} [className=''] - Additional CSS classes to apply to the root container.
 *
 * EXAMPLE USAGE:
 * <OceanElement size={600} animated={true} interactive={true} bubbleDensity={1} birdCount={2} />
 */

import { useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Glow } from './Glow';
import { WaterLine } from './WaterLine';
import { IcebergTop, IcebergBottom } from './Iceberg';
import { BubbleEmitter } from './BubbleEmitter';
import { Birds } from './Birds';
import { useFloating } from '../hooks/useFloating';
import '../styles/ocean.css';

export const OceanElement = ({
  size = 600,
  animated = true,
  interactive = true,
  bubbleDensity = 1,
  birdCount = 2,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Mouse interaction spring setup (constrained to max 2-degree rotation)
  const rawRotate = useMotionValue(0);
  const rawGlowX = useMotionValue(0);
  const rawGlowY = useMotionValue(0);

  const rotate = useSpring(rawRotate, { stiffness: 120, damping: 18 });
  const glowX = useSpring(rawGlowX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(rawGlowY, { stiffness: 80, damping: 20 });

  const { floatVariants, glowVariants } = useFloating({ animated: isAnimated });

  // Mouse tilt callback calculation
  const handleMouseMove = useCallback(
    (e) => {
      if (!interactive || !isAnimated) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Max 2 degree rotation limit
      rawRotate.set(normalizedX * 2);
      rawGlowX.set(normalizedX * 12);
      rawGlowY.set(normalizedY * 12);
    },
    [interactive, isAnimated, rawRotate, rawGlowX, rawGlowY]
  );

  const handleMouseLeave = useCallback(() => {
    rawRotate.set(0);
    rawGlowX.set(0);
    rawGlowY.set(0);
  }, [rawRotate, rawGlowX, rawGlowY]);

  // Entrance motion definition (opacity 0 -> 1, translateY 40px -> 0, scale 0.96 -> 1)
  const entranceVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={`ocean-container ${className}`}
      style={{ '--ocean-size': `${size}px` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="hidden"
      animate="visible"
      variants={entranceVariants}
    >
      <motion.svg
        className="ocean-svg"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ rotate }}
      >
        {/* Layer 1: Ambient Glow */}
        <Glow glowVariants={glowVariants} mouseX={glowX} mouseY={glowY} />

        {/* Layer Group: Floating Core Elements */}
        <motion.g
          id="FloatingIcebergGroup"
          variants={floatVariants}
          initial="initial"
          animate="animate"
        >
          {/* Layer 2: Submerged Iceberg Bottom */}
          <IcebergBottom />

          {/* Layer 3: Bubble Emitter System */}
          <BubbleEmitter animated={isAnimated} density={bubbleDensity} />

          {/* Layer 4: Above-water Iceberg Top */}
          <IcebergTop />

          {/* Layer 5: Rippling Water Line Cut */}
          <WaterLine animated={isAnimated} />

          {/* Layer 6: Flapping Vector Birds */}
          <Birds animated={isAnimated} count={birdCount} />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

export default OceanElement;
