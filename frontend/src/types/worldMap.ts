export type RegionId =
  | 'knowledge-village'
  | 'science-forest'
  | 'mathematics-mountains'
  | 'discovery-coast'
  | 'innovation-castle';

export type LevelStatus = 'completed' | 'current' | 'unlocked' | 'locked';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export interface RegionInfo {
  id: RegionId;
  name: string;
  subtitle: string;
  xPercent: number;
  yPercent: number;
  accentColor: string;
}

export interface LevelNode {
  id: string;
  levelNumber: number;
  title: string;
  regionId: RegionId;
  regionName: string;
  description: string;
  objectives: string[];
  difficulty: Difficulty;
  xpReward: number;
  xPercent: number;
  yPercent: number;
  prerequisites: string[];
}

export interface PlayerMapProgress {
  completedLevels: Record<string, { stars: 1 | 2 | 3 }>;
  currentLevelId: string;
  totalXp: number;
}
