'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Crosshair,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  INITIAL_PLAYER_PROGRESS,
  WORLD_LEVELS,
  WORLD_REGIONS,
  getLevelStatus,
} from '@/data/worldMapData';
import { LevelNode, LevelStatus, PlayerMapProgress } from '@/types/worldMap';
import { LevelInfoPanel } from './LevelInfoPanel';
import { LevelMarker } from './LevelMarker';
import { MapMinimap } from './MapMinimap';

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 960;
const MIN_SCALE = 0.7;
const MAX_SCALE = 2.5;
const MAP_IMAGE_URL = '/assets/vidyaquest-world-map.jpg';

interface CameraState {
  x: number;
  y: number;
  scale: number;
}

export function WorldMapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 720 });
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [smoothCamera, setSmoothCamera] = useState(false);

  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    camX: number;
    camY: number;
  } | null>(null);

  const [progress, setProgress] = useState<PlayerMapProgress>(INITIAL_PLAYER_PROGRESS);
  const [selectedLevel, setSelectedLevel] = useState<{
    level: LevelNode;
    status: LevelStatus;
  } | null>(null);
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Clamp camera translation so the map stays comfortably inside the viewport
  const clampCamera = useCallback(
    (next: CameraState, vp = viewportSize): CameraState => {
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next.scale));
      const scaledW = MAP_WIDTH * clampedScale;
      const scaledH = MAP_HEIGHT * clampedScale;

      const minX = Math.min(0, vp.width - scaledW) - 80;
      const maxX = Math.max(0, (vp.width - scaledW) / 2) + 80;
      const minY = Math.min(0, vp.height - scaledH) - 80;
      const maxY = Math.max(0, (vp.height - scaledH) / 2) + 80;

      return {
        scale: clampedScale,
        x: Math.max(minX, Math.min(maxX, next.x)),
        y: Math.max(minY, Math.min(maxY, next.y)),
      };
    },
    [viewportSize],
  );

  const centerOnPercent = useCallback(
    (xPercent: number, yPercent: number, targetScale?: number, vp = viewportSize) => {
      setSmoothCamera(true);
      setCamera((prev) => {
        const scale = targetScale ?? prev.scale;
        const targetX = vp.width / 2 - (xPercent / 100) * MAP_WIDTH * scale;
        const targetY = vp.height / 2 - (yPercent / 100) * MAP_HEIGHT * scale;
        return clampCamera({ x: targetX, y: targetY, scale }, vp);
      });
    },
    [clampCamera, viewportSize],
  );

  // Measure viewport & fit map on initial mount
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vp = { width: rect.width, height: rect.height };
      setViewportSize(vp);

      setCamera((prev) => {
        if (prev.x === 0 && prev.y === 0 && prev.scale === 1) {
          const fitScale = Math.max(
            MIN_SCALE,
            Math.min(1.15, Math.max(vp.width / MAP_WIDTH, vp.height / MAP_HEIGHT)),
          );
          const x = (vp.width - MAP_WIDTH * fitScale) / 2;
          const y = (vp.height - MAP_HEIGHT * fitScale) / 2;
          return clampCamera({ x, y, scale: fitScale }, vp);
        }
        return clampCamera(prev, vp);
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [clampCamera]);

  const handleZoomToCurrentLevel = useCallback(() => {
    const current =
      WORLD_LEVELS.find((l) => l.id === progress.currentLevelId) ?? WORLD_LEVELS[0];
    centerOnPercent(current.xPercent, current.yPercent, 1.45);
  }, [centerOnPercent, progress.currentLevelId]);

  const handleResetView = useCallback(() => {
    const fitScale = Math.max(
      MIN_SCALE,
      Math.min(1.1, Math.max(viewportSize.width / MAP_WIDTH, viewportSize.height / MAP_HEIGHT)),
    );
    centerOnPercent(50, 50, fitScale);
  }, [centerOnPercent, viewportSize.height, viewportSize.width]);

  const handleZoomStep = useCallback(
    (delta: number) => {
      setSmoothCamera(true);
      setCamera((prev) => {
        const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale + delta));
        const ratio = nextScale / prev.scale;
        const cx = viewportSize.width / 2;
        const cy = viewportSize.height / 2;
        const nextX = cx - (cx - prev.x) * ratio;
        const nextY = cy - (cy - prev.y) * ratio;
        return clampCamera({ x: nextX, y: nextY, scale: nextScale });
      });
    },
    [clampCamera, viewportSize.height, viewportSize.width],
  );

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      setSmoothCamera(false);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;

      setCamera((prev) => {
        const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * zoomFactor));
        const ratio = nextScale / prev.scale;
        const nextX = pointerX - (pointerX - prev.x) * ratio;
        const nextY = pointerY - (pointerY - prev.y) * ratio;
        return clampCamera({ x: nextX, y: nextY, scale: nextScale });
      });
    },
    [clampCamera],
  );

  // Pointer drag pan (mouse + touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setSmoothCamera(false);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      camX: camera.x,
      camY: camera.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    setCamera((prev) =>
      clampCamera({
        ...prev,
        x: dragStartRef.current!.camX + dx,
        y: dragStartRef.current!.camY + dy,
      }),
    );
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleSelectLevel = useCallback(
    (level: LevelNode, status: LevelStatus) => {
      if (status === 'locked') {
        showToast(`Level ${level.levelNumber} is locked! Complete earlier connected quests first.`);
        return;
      }
      setSelectedLevel({ level, status });
      centerOnPercent(level.xPercent, level.yPercent, Math.max(camera.scale, 1.3));
    },
    [camera.scale, centerOnPercent, showToast],
  );

  const applyLevelCompletion = useCallback(
    (level: LevelNode, stars: 1 | 2 | 3) => {
      setProgress((prev) => {
        const alreadyCompleted = Boolean(prev.completedLevels[level.id]);
        const prevStars = prev.completedLevels[level.id]?.stars ?? 0;
        const nextCompleted = {
          ...prev.completedLevels,
          [level.id]: { stars: Math.max(prevStars, stars) as 1 | 2 | 3 },
        };

        const nextUnlocked = WORLD_LEVELS.find(
          (candidate) =>
            !nextCompleted[candidate.id] &&
            candidate.prerequisites.every((p) => Boolean(nextCompleted[p])),
        );

        const nextState: PlayerMapProgress = {
          completedLevels: nextCompleted,
          currentLevelId: nextUnlocked ? nextUnlocked.id : level.id,
          totalXp: prev.totalXp + (alreadyCompleted ? 0 : level.xpReward),
        };
        return nextState;
      });

      setSelectedLevel((prev) =>
        prev && prev.level.id === level.id ? { ...prev, status: 'completed' } : prev,
      );
      showToast(`Quest Complete! Earned ${stars}★ and +${level.xpReward} XP!`);
    },
    [showToast],
  );

  const handleStartLevel = useCallback(
    (level: LevelNode) => {
      setIsSimulatingRun(true);
      setTimeout(() => {
        setIsSimulatingRun(false);
        applyLevelCompletion(level, 3);
      }, 750);
    },
    [applyLevelCompletion],
  );

  const handleResetSimulation = useCallback(() => {
    setProgress(INITIAL_PLAYER_PROGRESS);
    setSelectedLevel(null);
    showToast('Simulator progress reset to Knowledge Village.');
  }, [showToast]);

  const totalStars = useMemo(
    () => Object.values(progress.completedLevels).reduce((sum, entry) => sum + entry.stars, 0),
    [progress.completedLevels],
  );

  const minimapViewportRect = useMemo(() => {
    const scaledW = MAP_WIDTH * camera.scale;
    const scaledH = MAP_HEIGHT * camera.scale;
    return {
      xPercent: (-camera.x / scaledW) * 100,
      yPercent: (-camera.y / scaledH) * 100,
      widthPercent: (viewportSize.width / scaledW) * 100,
      heightPercent: (viewportSize.height / scaledH) * 100,
    };
  }, [camera.scale, camera.x, camera.y, viewportSize.height, viewportSize.width]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative h-[100dvh] w-full overflow-hidden bg-[#1b5e7a] select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Transformed World Layer */}
      <div
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
          transformOrigin: '0 0',
          transition: smoothCamera ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
        className="relative will-change-transform"
      >
        {/* Pixel-art Overworld Terrain */}
        <img
          src={MAP_IMAGE_URL}
          alt="VidyaQuest Interactive Pixel-Art Adventure World"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Subtle drifting clouds overlay */}
        <motion.div
          aria-hidden
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-[12%] top-[8%] h-14 w-36 rounded-full bg-white/15 blur-xl"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -70, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute right-[15%] top-[16%] h-16 w-44 rounded-full bg-white/15 blur-xl"
        />

        {/* Connecting Quest Trail Lines */}
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {WORLD_LEVELS.map((level) =>
            level.prerequisites.map((prereqId) => {
              const prereq = WORLD_LEVELS.find((l) => l.id === prereqId);
              if (!prereq) return null;
              const isTrailUnlocked = Boolean(progress.completedLevels[prereqId]);
              return (
                <line
                  key={`${prereqId}-${level.id}`}
                  x1={(prereq.xPercent / 100) * MAP_WIDTH}
                  y1={(prereq.yPercent / 100) * MAP_HEIGHT}
                  x2={(level.xPercent / 100) * MAP_WIDTH}
                  y2={(level.yPercent / 100) * MAP_HEIGHT}
                  stroke={isTrailUnlocked ? '#fde047' : '#334155'}
                  strokeWidth={isTrailUnlocked ? 4 : 3}
                  strokeDasharray={isTrailUnlocked ? '10 6' : '6 8'}
                  strokeOpacity={isTrailUnlocked ? 0.85 : 0.55}
                />
              );
            }),
          )}
        </svg>

        {/* Region Name Signposts */}
        {WORLD_REGIONS.map((region) => (
          <div
            key={region.id}
            style={{
              left: `${region.xPercent}%`,
              top: `${region.yPercent - 7}%`,
            }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-md border border-amber-200/70 bg-slate-950/75 px-2.5 py-1 text-center shadow-lg backdrop-blur-[2px]">
              <p className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
                {region.name}
              </p>
            </div>
          </div>
        ))}

        {/* Interactive Level Markers */}
        {WORLD_LEVELS.map((level) => {
          const status = getLevelStatus(level, progress);
          const stars = progress.completedLevels[level.id]?.stars;
          return (
            <LevelMarker
              key={level.id}
              level={level}
              status={status}
              stars={stars}
              isSelected={selectedLevel?.level.id === level.id}
              onSelect={handleSelectLevel}
            />
          );
        })}
      </div>

      {/* Minimal Floating RPG HUD - Top Left */}
      <div
        className="fixed left-3 top-3 z-40 flex flex-wrap items-center gap-2"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 rounded-xl border-2 border-amber-300/80 bg-slate-950/85 px-3.5 py-2 text-slate-100 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-extrabold tracking-wide text-white">VidyaQuest</span>
          </div>
          <span className="h-4 w-px bg-slate-700" />
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            {progress.totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-200">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-300" />
            {totalStars} / {WORLD_LEVELS.length * 3}
          </span>
        </div>
      </div>

      {/* Minimap - Bottom Left */}
      <div className="fixed bottom-3 left-3 z-40">
        <MapMinimap
          mapImageUrl={MAP_IMAGE_URL}
          viewportRect={minimapViewportRect}
          onJumpToPercent={(xPct, yPct) => centerOnPercent(xPct, yPct)}
        />
      </div>

      {/* Camera & Simulator Controls - Bottom Right */}
      <div
        className="fixed bottom-3 right-3 z-40 flex items-center gap-1.5 rounded-xl border-2 border-amber-300/70 bg-slate-950/85 p-1.5 text-slate-100 shadow-xl backdrop-blur-md"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => handleZoomStep(0.25)}
          title="Zoom In"
          aria-label="Zoom In"
          className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-amber-300"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoomStep(-0.25)}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-amber-300"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomToCurrentLevel}
          title="Focus Current Quest"
          aria-label="Focus Current Quest"
          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/30"
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Current Quest</span>
        </button>
        <button
          type="button"
          onClick={handleResetView}
          title="Fit Full Island"
          aria-label="Fit Full Island"
          className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-amber-300"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleResetSimulation}
          title="Reset Simulator Progress"
          aria-label="Reset Simulator Progress"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-rose-300"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-lg border border-amber-300/80 bg-slate-950/95 px-4 py-2 text-xs font-bold text-amber-200 shadow-2xl sm:top-4"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Level Panel */}
      <LevelInfoPanel
        level={selectedLevel?.level ?? null}
        status={selectedLevel?.status ?? null}
        earnedStars={
          selectedLevel ? progress.completedLevels[selectedLevel.level.id]?.stars : undefined
        }
        isSimulatingRun={isSimulatingRun}
        onClose={() => setSelectedLevel(null)}
        onStartLevel={handleStartLevel}
        onSimulateComplete={applyLevelCompletion}
      />
    </div>
  );
}
