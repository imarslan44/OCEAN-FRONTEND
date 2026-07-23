/**
 * @file hooks/useBubbleEmitter.js
 * @description Manages state and generation for procedural subterranean bubbles and occasional particle bursts.
 * Handles DOM node recycling by cleaning up popped/completed bubbles.
 *
 * Usage:
 * const { bubbles, removeBubble } = useBubbleEmitter({ animated: true, density: 1 });
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useBubbleEmitter({ animated = true, density = 1 }) {
  const [bubbles, setBubbles] = useState([]);
  const idCounter = useRef(0);

  // Creates an individual bubble object with randomized offsets and speeds
  const createBubble = useCallback(
    (isBurst = false, customX, customY) => {
      idCounter.current += 1;
      const size = isBurst ? Math.random() * 3 + 2 : Math.random() * 6 + 3; // 3-9px
      const x = customX ?? (Math.random() > 0.5 ? 200 + Math.random() * 40 : 360 + Math.random() * 40);
      const y = customY ?? 340 + Math.random() * 120;
      const driftX = (Math.random() - 0.5) * (isBurst ? 30 : 20);
      const duration = isBurst ? 1.5 + Math.random() * 1 : 4 + Math.random() * 4;
      const delay = isBurst ? Math.random() * 0.2 : Math.random() * 1.5;

      return {
        id: `bubble-${idCounter.current}-${Date.now()}`,
        x,
        y,
        size,
        driftX,
        duration,
        delay,
        isBurst,
      };
    },
    []
  );

  useEffect(() => {
    if (!animated) {
      return;
    }

    // Initialize initial pool after the effect subscribes.
    const initialPoolTimeout = setTimeout(() => {
      const initialCount = Math.round(8 * density);
      const initialPool = Array.from({ length: initialCount }, () => createBubble());
      setBubbles(initialPool);
    }, 0);

    // Continuous bubble spawner
    const intervalTime = Math.max(1200 / density, 400);
    const interval = setInterval(() => {
      setBubbles((prev) => {
        const next = prev.filter((b) => !b.isBurst);
        if (next.length < 16 * density) {
          return [...next, createBubble()];
        }
        return next;
      });
    }, intervalTime);

    // Burst generator (triggers every 4-8 seconds, spawning 5-10 particles)
    let burstTimeout;
    const scheduleBurst = () => {
      const burstDelay = (Math.random() * 4 + 4) * 1000;
      burstTimeout = setTimeout(() => {
        const burstX = 240 + Math.random() * 120;
        const burstY = 380 + Math.random() * 80;
        const burstCount = Math.floor(Math.random() * 6) + 5;
        const burstParticles = Array.from({ length: burstCount }, () =>
          createBubble(true, burstX, burstY)
        );

        setBubbles((prev) => [...prev, ...burstParticles]);
        scheduleBurst();
      }, burstDelay);
    };

    scheduleBurst();

    return () => {
      clearTimeout(initialPoolTimeout);
      clearInterval(interval);
      clearTimeout(burstTimeout);
    };
  }, [animated, density, createBubble]);

  const removeBubble = useCallback((id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bubbles: animated ? bubbles : [], removeBubble };
}
