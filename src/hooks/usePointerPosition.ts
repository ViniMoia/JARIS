"use client";

import { RefObject, useEffect } from "react";

export type PointerMoveCallback = (
  ndcX: number,
  ndcY: number,
  active: boolean
) => void;

/**
 * Tracks unified mouse & touch pointer coordinates inside a container element
 * and emits normalized device coordinates ([-1, 1] with +Y up).
 */
export function usePointerPosition(
  containerRef: RefObject<HTMLElement | null>,
  onPointerChange: PointerMoveCallback
): void {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const emitFromEvent = (event: PointerEvent, active: boolean) => {
      if (!active) {
        onPointerChange(0, 0, false);
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      onPointerChange(ndcX, ndcY, true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      emitFromEvent(event, true);
    };

    const handlePointerDown = (event: PointerEvent) => {
      emitFromEvent(event, true);
    };

    const handlePointerLeave = () => {
      onPointerChange(0, 0, false);
    };

    const handlePointerUpOrCancel = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        onPointerChange(0, 0, false);
      }
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerdown", handlePointerDown, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    el.addEventListener("pointerup", handlePointerUpOrCancel, { passive: true });
    el.addEventListener("pointercancel", handlePointerUpOrCancel, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerup", handlePointerUpOrCancel);
      el.removeEventListener("pointercancel", handlePointerUpOrCancel);
    };
  }, [containerRef, onPointerChange]);
}

