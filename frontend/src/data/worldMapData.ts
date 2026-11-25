import { LevelNode, LevelStatus, PlayerMapProgress, RegionInfo } from '@/types/worldMap';

export const WORLD_REGIONS: RegionInfo[] = [
  {
    id: 'knowledge-village',
    name: 'Knowledge Village',
    subtitle: 'Starting Meadows & Farms',
    xPercent: 54,
    yPercent: 56,
    accentColor: '#eab308',
  },
  {
    id: 'science-forest',
    name: 'Science Forest',
    subtitle: 'Hidden Woodland Lab',
    xPercent: 26,
    yPercent: 25,
    accentColor: '#22c55e',
  },
  {
    id: 'mathematics-mountains',
    name: 'Mathematics Mountains',
    subtitle: 'Snowy Peaks & Caves',
    xPercent: 55,
    yPercent: 18,
    accentColor: '#38bdf8',
  },
  {
    id: 'discovery-coast',
    name: 'Discovery Coast',
    subtitle: 'Beaches, Bridges & Isles',
    xPercent: 28,
    yPercent: 74,
    accentColor: '#f59e0b',
  },
  {
    id: 'innovation-castle',
    name: 'Innovation Castle',
    subtitle: 'Grand Citadel Finale',
    xPercent: 84,
    yPercent: 54,
    accentColor: '#a855f7',
  },
];

export const WORLD_LEVELS: LevelNode[] = [
  // Region 1: Knowledge Village (Center)
  {
    id: 'kv-1',
    levelNumber: 1,
    title: 'Village Welcome',
    regionId: 'knowledge-village',
    regionName: 'Knowledge Village',
    description: 'Begin your VidyaQuest journey at the village square and learn how observation sparks discovery.',
    objectives: [
      'Explore the scientific method basics',
      'Identify everyday patterns in nature',
      'Complete your first village quest',
    ],
    difficulty: 'Beginner',
    xpReward: 50,
    xPercent: 55,
    yPercent: 60,
    prerequisites: [],
  },
  {
    id: 'kv-2',
    levelNumber: 2,
    title: 'Harvest Ratios',
    regionId: 'knowledge-village',
    regionName: 'Knowledge Village',
    description: 'Help the village farmers measure crop rows, water buckets, and seed proportions.',
    objectives: [
      'Compare quantities using simple ratios',
      'Balance farm resources accurately',
    ],
    difficulty: 'Beginner',
    xpReward: 75,
    xPercent: 45,
    yPercent: 57,
    prerequisites: ['kv-1'],
  },
  {
    id: 'kv-3',
    levelNumber: 3,
    title: 'Crossroads Compass',
    regionId: 'knowledge-village',
    regionName: 'Knowledge Village',
    description: 'Read the village signpost and chart bearings toward the forest, mountains, and coast.',
    objectives: [
      'Understand cardinal directions and scale',
      'Plan the shortest path between landmarks',
    ],
    difficulty: 'Beginner',
    xpReward: 80,
    xPercent: 55,
    yPercent: 47,
    prerequisites: ['kv-2'],
  },

  // Region 2: Science Forest (North-West)
  {
    id: 'sf-4',
    levelNumber: 4,
    title: 'Canopy Ecosystems',
    regionId: 'science-forest',
    regionName: 'Science Forest',
    description: 'Step beneath the tall pines to study food webs, sunlight, and forest habitats.',
    objectives: [
      'Classify producers, consumers, and decomposers',
      'Trace energy flow through a woodland habitat',
    ],
    difficulty: 'Beginner',
    xpReward: 100,
    xPercent: 34,
    yPercent: 39,
    prerequisites: ['kv-2'],
  },
  {
    id: 'sf-5',
    levelNumber: 5,
    title: 'Hidden Woodland Lab',
    regionId: 'science-forest',
    regionName: 'Science Forest',
    description: 'Enter the secret forest observatory to experiment with states of matter and mixtures.',
    objectives: [
      'Separate mixtures using filtration and evaporation',
      'Observe reversible vs. irreversible changes',
    ],
    difficulty: 'Intermediate',
    xpReward: 125,
    xPercent: 27,
    yPercent: 27,
    prerequisites: ['sf-4'],
  },
  {
    id: 'sf-6',
    levelNumber: 6,
    title: 'Optics Clearing',
    regionId: 'science-forest',
    regionName: 'Science Forest',
    description: 'Use prisms and mirrors in the sunlit clearing to bend light beams onto target crystals.',
    objectives: [
      'Predict angles of reflection on plane mirrors',
      'Explain how prisms split white light',
    ],
    difficulty: 'Intermediate',
    xpReward: 140,
    xPercent: 18,
    yPercent: 38,
    prerequisites: ['sf-5'],
  },

  // Region 3: Mathematics Mountains (North-Center)
  {
    id: 'mm-7',
    levelNumber: 7,
    title: 'Foothill Fractions',
    regionId: 'mathematics-mountains',
    regionName: 'Mathematics Mountains',
    description: 'Climb the rocky foothills by bridging gaps with equivalent fractions.',
    objectives: [
      'Simplify and compare fractions visually',
      'Add fractions with unlike denominators',
    ],
    difficulty: 'Intermediate',
    xpReward: 150,
    xPercent: 55,
    yPercent: 36,
    prerequisites: ['kv-3'],
  },
  {
    id: 'mm-8',
    levelNumber: 8,
    title: 'Echo Cavern Equations',
    regionId: 'mathematics-mountains',
    regionName: 'Mathematics Mountains',
    description: 'Unlock the ancient mountain cavern doors by solving linear balance puzzles.',
    objectives: [
      'Solve one- and two-step linear equations',
      'Verify solutions by substitution',
    ],
    difficulty: 'Intermediate',
    xpReward: 175,
    xPercent: 68,
    yPercent: 31,
    prerequisites: ['mm-7'],
  },
  {
    id: 'mm-9',
    levelNumber: 9,
    title: 'Summit Geometry',
    regionId: 'mathematics-mountains',
    regionName: 'Mathematics Mountains',
    description: 'Reach the snow-capped peak by calculating triangle angles and mountain slopes.',
    objectives: [
      'Apply angle sum properties of triangles',
      'Calculate slope as rise over run',
    ],
    difficulty: 'Advanced',
    xpReward: 200,
    xPercent: 54,
    yPercent: 18,
    prerequisites: ['mm-8'],
  },

  // Region 4: Discovery Coast (South-West & South-Center)
  {
    id: 'dc-10',
    levelNumber: 10,
    title: 'Tidepool Treasures',
    regionId: 'discovery-coast',
    regionName: 'Discovery Coast',
    description: 'Walk along the golden shoreline and discover how tides, moon phases, and oceans interact.',
    objectives: [
      'Connect lunar phases to high and low tides',
      'Identify coastal landforms and erosion',
    ],
    difficulty: 'Intermediate',
    xpReward: 140,
    xPercent: 24,
    yPercent: 66,
    prerequisites: ['kv-1'],
  },
  {
    id: 'dc-11',
    levelNumber: 11,
    title: 'Bridge of Forces',
    regionId: 'discovery-coast',
    regionName: 'Discovery Coast',
    description: 'Reinforce the wooden coastal bridge by balancing tension, compression, and load.',
    objectives: [
      'Distinguish balanced and unbalanced forces',
      'Test how trusses distribute weight',
    ],
    difficulty: 'Intermediate',
    xpReward: 160,
    xPercent: 34,
    yPercent: 68,
    prerequisites: ['dc-10'],
  },
  {
    id: 'dc-12',
    levelNumber: 12,
    title: 'Islet Navigation',
    regionId: 'discovery-coast',
    regionName: 'Discovery Coast',
    description: 'Chart coordinates across the turquoise bay to reach the offshore islet.',
    objectives: [
      'Plot and read points on a coordinate grid',
      'Measure distance between coastal beacons',
    ],
    difficulty: 'Advanced',
    xpReward: 180,
    xPercent: 36,
    yPercent: 86,
    prerequisites: ['dc-11'],
  },

  // Region 5: Innovation Castle (South-East)
  {
    id: 'ic-13',
    levelNumber: 13,
    title: 'Gatehouse Circuits',
    regionId: 'innovation-castle',
    regionName: 'Innovation Castle',
    description: 'Power the castle stone bridge by wiring series and parallel electrical circuits.',
    objectives: [
      'Build closed circuits with switches and resistors',
      'Compare current flow in series vs. parallel paths',
    ],
    difficulty: 'Advanced',
    xpReward: 220,
    xPercent: 71,
    yPercent: 68,
    prerequisites: ['dc-12', 'mm-8'],
  },
  {
    id: 'ic-14',
    levelNumber: 14,
    title: 'Clockwork Tower',
    regionId: 'innovation-castle',
    regionName: 'Innovation Castle',
    description: 'Calibrate gear ratios and simple machines inside the tall castle spire.',
    objectives: [
      'Calculate mechanical advantage of gears and levers',
      'Optimize energy transfer in a compound machine',
    ],
    difficulty: 'Advanced',
    xpReward: 250,
    xPercent: 84,
    yPercent: 77,
    prerequisites: ['ic-13'],
  },
  {
    id: 'ic-15',
    levelNumber: 15,
    title: 'Grand Scholar Trial',
    regionId: 'innovation-castle',
    regionName: 'Innovation Castle',
    description: 'Face the final multi-disciplinary challenge in the Castle Courtyard to earn the VidyaQuest Crown.',
    objectives: [
      'Synthesize science, math, and engineering concepts',
      'Complete the timed Grand Citadel simulation',
    ],
    difficulty: 'Master',
    xpReward: 350,
    xPercent: 84,
    yPercent: 60,
    prerequisites: ['ic-14', 'mm-9'],
  },
];

export const INITIAL_PLAYER_PROGRESS: PlayerMapProgress = {
  completedLevels: {
    'kv-1': { stars: 3 },
    'kv-2': { stars: 2 },
    'dc-10': { stars: 3 },
  },
  currentLevelId: 'kv-3',
  totalXp: 265,
};

export function getLevelStatus(level: LevelNode, progress: PlayerMapProgress): LevelStatus {
  if (progress.completedLevels[level.id]) {
    return 'completed';
  }
  if (progress.currentLevelId === level.id) {
    return 'current';
  }
  const prereqsMet = level.prerequisites.every((prereqId) =>
    Boolean(progress.completedLevels[prereqId]),
  );
  return prereqsMet ? 'unlocked' : 'locked';
}
