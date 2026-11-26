import { WorldMapCanvas } from '@/components/world-map/WorldMapCanvas';

export default function HomePage() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      <WorldMapCanvas />
    </main>
  );
}
