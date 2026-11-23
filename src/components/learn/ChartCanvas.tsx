'use client';

/* React wrapper for the TIGERFX ChartEngine */

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ChartEngine, type EngineEvents } from '@/lib/chart/engine';
import type { Candle, Drawing, SceneHighlight, SceneNote, Tool } from '@/lib/types';

export interface ChartCanvasHandle {
  engine: ChartEngine | null;
}

interface Props {
  candles: Candle[];
  drawings?: Drawing[];
  tool?: Tool;
  visibleTo?: number;
  highlights?: SceneHighlight[];
  notes?: SceneNote[];
  interactive?: boolean;
  showCrosshair?: boolean;
  height?: number | string;
  events?: EngineEvents;
  onReady?: (engine: ChartEngine) => void;
  className?: string;
  ariaLabel?: string;
}

export const ChartCanvas = forwardRef<ChartCanvasHandle, Props>(function ChartCanvas(
  {
    candles,
    drawings,
    tool = 'cursor',
    visibleTo,
    highlights,
    notes,
    interactive = true,
    showCrosshair = true,
    height = 420,
    events,
    onReady,
    className = '',
    ariaLabel = 'Interactive candlestick chart',
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ChartEngine | null>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  /* Live getter: the engine is created in a useEffect AFTER this handle is
     built, so a plain `engine: engineRef.current` snapshot would stay null
     forever (Clear all / Undo / Redo / arena trade submit all read it). */
  useImperativeHandle(
    ref,
    () => ({
      get engine() {
        return engineRef.current;
      },
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new ChartEngine(canvas, {
      onClick: (pt) => eventsRef.current?.onClick?.(pt),
      onDrawingAdded: (d) => eventsRef.current?.onDrawingAdded?.(d),
      onDrawingsChanged: (d) => eventsRef.current?.onDrawingsChanged?.(d),
      onHover: (pt) => eventsRef.current?.onHover?.(pt),
    });
    engineRef.current = engine;
    onReady?.(engine);

    const ro = new ResizeObserver(() => engine.resize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setData(candles);
  }, [candles]);

  useEffect(() => {
    if (visibleTo !== undefined) engineRef.current?.setVisibleTo(visibleTo);
  }, [visibleTo]);

  useEffect(() => {
    engineRef.current?.setTool(tool);
  }, [tool]);

  useEffect(() => {
    if (drawings) engineRef.current?.setDrawings(drawings);
  }, [drawings]);

  useEffect(() => {
    engineRef.current?.setHighlights(highlights ?? []);
  }, [highlights]);

  useEffect(() => {
    engineRef.current?.setNotes(notes ?? []);
  }, [notes]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.interactive = interactive;
  }, [interactive]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.showCrosshair = showCrosshair;
  }, [showCrosshair]);

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <canvas ref={canvasRef} aria-label={ariaLabel} className="touch-none rounded-xl" />
    </div>
  );
});
