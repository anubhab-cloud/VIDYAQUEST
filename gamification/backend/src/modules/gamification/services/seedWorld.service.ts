import { SubjectModel } from '../../catalog/models/Subject.model';
import { MapLocationModel } from '../models/MapLocation.model';
import { MissionModel } from '../models/Mission.model';
import { SubjectMapModel } from '../models/SubjectMap.model';

/**
 * Idempotently seeds (and upgrades) the four core VidyaQuest subject worlds:
 * Chemistry (Alchemy Castle), Physics (Atom Kingdom),
 * Biology (Life Forest), and Mathematics (Number Kingdom).
 * Each subject has exactly 8 strictly sequential levels (1 -> 2 -> ... -> 8).
 */
let seedPromise: Promise<void> | null = null;

export async function seedSubjectWorlds(): Promise<void> {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const worlds = [
      {
        subject: {
          name: 'Chemistry',
          slug: 'chemistry',
          description: 'Master elements, reactions, acids, bases, and solutions inside Alchemy Castle.',
          icon: 'flask-conical',
          displayOrder: 1,
        },
        map: {
          mapName: 'Alchemy Castle',
          mapSlug: 'alchemy-castle',
          theme: {
            primaryColor: '#a855f7',
            secondaryColor: '#f59e0b',
            oceanColor: '#1e293b',
            badgeStyle: 'alchemy-purple',
            ambientEffect: 'sparkles',
          },
          backgroundAsset: '/assets/vidyaquest-world-map.jpg',
          previewAsset: '/assets/vidyaquest-world-map.jpg',
        },
        zones: [
          { slug: 'elements-courtyard', name: 'Elements Courtyard', x: 54, y: 56, color: '#eab308', desc: 'Discover atoms, symbols, and pure substances.' },
          { slug: 'periodic-hall', name: 'Periodic Hall', x: 26, y: 25, color: '#22c55e', desc: 'Navigate groups, periods, and element families.' },
          { slug: 'reaction-forge', name: 'Reaction Forge', x: 55, y: 18, color: '#38bdf8', desc: 'Balance chemical equations and reaction types.' },
          { slug: 'acids-bases-lab', name: 'Acids & Bases Lab', x: 28, y: 74, color: '#f59e0b', desc: 'Test pH scales, indicators, and neutralization.' },
          { slug: 'solutions-spire', name: 'Solutions Spire', x: 84, y: 54, color: '#a855f7', desc: 'Master concentration, solubility, and mixtures.' },
        ],
        missions: [
          { slug: 'chem-1', zone: 'elements-courtyard', title: 'Properties of Acids & Bases', type: 'Virtual experiment', diff: 'Beginner', xp: 50, x: 55, y: 66, prereq: null, obj: ['Test litmus and pH indicators on acids and bases', 'Classify solutions by pH value'] },
          { slug: 'chem-2', zone: 'elements-courtyard', title: 'Acid-Base Titration Lab', type: 'Virtual experiment', diff: 'Beginner', xp: 75, x: 42, y: 58, prereq: 'chem-1', obj: ['Perform controlled burette titration', 'Detect the neutralization endpoint using indicators'] },
          { slug: 'chem-3', zone: 'periodic-hall', title: 'Periodic Patterns', type: 'Puzzle', diff: 'Intermediate', xp: 100, x: 26, y: 38, prereq: 'chem-2', obj: ['Group metals, non-metals, and metalloids'] },
          { slug: 'chem-4', zone: 'periodic-hall', title: 'Chemical Bonding', type: 'Interactive lesson', diff: 'Intermediate', xp: 120, x: 34, y: 22, prereq: 'chem-3', obj: ['Compare ionic and covalent electron sharing'] },
          { slug: 'chem-5', zone: 'reaction-forge', title: 'Balancing Equations', type: 'Challenge', diff: 'Intermediate', xp: 140, x: 56, y: 26, prereq: 'chem-4', obj: ['Apply conservation of mass to chemical reactions'] },
          { slug: 'chem-6', zone: 'acids-bases-lab', title: 'pH Indicator Quest', type: 'Virtual experiment', diff: 'Intermediate', xp: 160, x: 30, y: 74, prereq: 'chem-5', obj: ['Classify acids and bases using litmus and pH'] },
          { slug: 'chem-7', zone: 'solutions-spire', title: 'Solution Molarity Lab', type: 'Virtual experiment', diff: 'Advanced', xp: 200, x: 70, y: 62, prereq: 'chem-6', obj: ['Calculate concentration and dilution of solutions'] },
          { slug: 'chem-8', zone: 'solutions-spire', title: 'Grand Elixir Trial', type: 'Project', diff: 'Master', xp: 250, x: 84, y: 48, prereq: 'chem-7', obj: ['Synthesize molarity and neutralization concepts'] },
        ],
      },
      {
        subject: {
          name: 'Physics',
          slug: 'physics',
          description: 'Explore mechanics, electricity, magnetism, optics, and energy in Atom Kingdom.',
          icon: 'atom',
          displayOrder: 2,
        },
        map: {
          mapName: 'Atom Kingdom',
          mapSlug: 'atom-kingdom',
          theme: {
            primaryColor: '#38bdf8',
            secondaryColor: '#22c55e',
            oceanColor: '#1b5e7a',
            badgeStyle: 'physics-cyan',
            ambientEffect: 'clouds',
          },
          backgroundAsset: '/assets/vidyaquest-world-map.jpg',
          previewAsset: '/assets/vidyaquest-world-map.jpg',
        },
        zones: [
          { slug: 'mechanics-plains', name: 'Mechanics Plains', x: 54, y: 56, color: '#eab308', desc: 'Motion, forces, and Newton’s laws.' },
          { slug: 'optics-observatory', name: 'Optics Observatory', x: 26, y: 25, color: '#22c55e', desc: 'Reflection, refraction, and lenses.' },
          { slug: 'magnetism-peaks', name: 'Magnetism Peaks', x: 55, y: 18, color: '#38bdf8', desc: 'Magnetic fields and electromagnetism.' },
          { slug: 'electricity-coast', name: 'Electricity Bay', x: 28, y: 74, color: '#f59e0b', desc: 'Current, voltage, and circuits.' },
          { slug: 'energy-citadel', name: 'Energy Citadel', x: 84, y: 54, color: '#a855f7', desc: 'Work, power, and energy conservation.' },
        ],
        missions: [
          { slug: 'phys-1', zone: 'mechanics-plains', title: 'Motion & Speed', type: 'Interactive lesson', diff: 'Beginner', xp: 50, x: 55, y: 66, prereq: null, obj: ['Calculate speed from distance and time'] },
          { slug: 'phys-2', zone: 'mechanics-plains', title: 'Balanced Forces', type: 'Virtual experiment', diff: 'Beginner', xp: 75, x: 42, y: 58, prereq: 'phys-1', obj: ['Predict net force on moving objects'] },
          { slug: 'phys-3', zone: 'optics-observatory', title: 'Mirror Maze', type: 'Virtual experiment', diff: 'Intermediate', xp: 100, x: 26, y: 38, prereq: 'phys-2', obj: ['Verify angle of incidence equals angle of reflection'] },
          { slug: 'phys-4', zone: 'optics-observatory', title: 'Refraction & Lenses', type: 'Quiz', diff: 'Intermediate', xp: 120, x: 34, y: 22, prereq: 'phys-3', obj: ['Trace light bending through convex and concave lenses'] },
          { slug: 'phys-5', zone: 'magnetism-peaks', title: 'Magnetic Fields', type: 'Puzzle', diff: 'Intermediate', xp: 140, x: 56, y: 26, prereq: 'phys-4', obj: ['Map field lines around bar magnets'] },
          { slug: 'phys-6', zone: 'electricity-coast', title: 'Ohm’s Law Bridge', type: 'Virtual experiment', diff: 'Advanced', xp: 170, x: 30, y: 74, prereq: 'phys-5', obj: ['Relate voltage, current, and resistance'] },
          { slug: 'phys-7', zone: 'energy-citadel', title: 'Work & Power Forge', type: 'Interactive lesson', diff: 'Advanced', xp: 210, x: 70, y: 62, prereq: 'phys-6', obj: ['Compute kinetic and potential energy transformations'] },
          { slug: 'phys-8', zone: 'energy-citadel', title: 'Atom King’s Trial', type: 'Challenge', diff: 'Master', xp: 260, x: 84, y: 48, prereq: 'phys-7', obj: ['Solve multi-step conservation of energy challenges'] },
        ],
      },
      {
        subject: {
          name: 'Biology',
          slug: 'biology',
          description: 'Journey through Cell City, DNA Valley, and living ecosystems in Life Forest.',
          icon: 'leaf',
          displayOrder: 3,
        },
        map: {
          mapName: 'Life Forest',
          mapSlug: 'life-forest',
          theme: {
            primaryColor: '#22c55e',
            secondaryColor: '#eab308',
            oceanColor: '#134e4a',
            badgeStyle: 'bio-emerald',
            ambientEffect: 'leaves',
          },
          backgroundAsset: '/assets/vidyaquest-world-map.jpg',
          previewAsset: '/assets/vidyaquest-world-map.jpg',
        },
        zones: [
          { slug: 'plant-life', name: 'Plant Life Grove', x: 54, y: 56, color: '#22c55e', desc: 'Photosynthesis and plant anatomy.' },
          { slug: 'cell-city', name: 'Cell City', x: 26, y: 25, color: '#10b981', desc: 'Organelles and cellular transport.' },
          { slug: 'dna-valley', name: 'DNA Valley', x: 55, y: 18, color: '#38bdf8', desc: 'Genetics, heredity, and replication.' },
          { slug: 'ecosystems', name: 'Ecosystem Coast', x: 28, y: 74, color: '#f59e0b', desc: 'Food webs and biodiversity.' },
          { slug: 'human-body', name: 'Human Body Kingdom', x: 84, y: 54, color: '#ef4444', desc: 'Organ systems and homeostasis.' },
        ],
        missions: [
          { slug: 'bio-1', zone: 'plant-life', title: 'Leaf Peel Stomata Lab', type: 'Virtual experiment', diff: 'Beginner', xp: 50, x: 55, y: 66, prereq: null, obj: ['Prepare a temporary stained leaf peel mount', 'Inspect guard cells and stomatal pores under 3D microscopy'] },
          { slug: 'bio-2', zone: 'plant-life', title: 'Human Heart 3D Model', type: 'Virtual experiment', diff: 'Beginner', xp: 75, x: 42, y: 58, prereq: 'bio-1', obj: ['Identify the four chambers and major vessels of the heart', 'Trace oxygenated and deoxygenated blood flow'] },
          { slug: 'bio-3', zone: 'cell-city', title: 'Organelle Tour', type: 'Quiz', diff: 'Beginner', xp: 95, x: 26, y: 38, prereq: 'bio-2', obj: ['Match cell organelles to their functions'] },
          { slug: 'bio-4', zone: 'cell-city', title: 'Mitosis & Cell Division', type: 'Interactive lesson', diff: 'Intermediate', xp: 120, x: 34, y: 22, prereq: 'bio-3', obj: ['Order the phases of mitotic cell division'] },
          { slug: 'bio-5', zone: 'dna-valley', title: 'Double Helix Code', type: 'Puzzle', diff: 'Intermediate', xp: 145, x: 56, y: 26, prereq: 'bio-4', obj: ['Pair complementary DNA base pairs'] },
          { slug: 'bio-6', zone: 'ecosystems', title: 'Tidepool Food Web', type: 'Virtual experiment', diff: 'Intermediate', xp: 170, x: 30, y: 74, prereq: 'bio-5', obj: ['Balance producer and consumer populations'] },
          { slug: 'bio-7', zone: 'human-body', title: 'Nervous Reflexes', type: 'Quiz', diff: 'Advanced', xp: 200, x: 70, y: 62, prereq: 'bio-6', obj: ['Trace sensory, relay, and motor neuron pathways'] },
          { slug: 'bio-8', zone: 'human-body', title: 'Circulatory Quest', type: 'Challenge', diff: 'Master', xp: 250, x: 84, y: 48, prereq: 'bio-7', obj: ['Trace oxygen flow through heart and lungs'] },
        ],
      },
      {
        subject: {
          name: 'Mathematics',
          slug: 'mathematics',
          description: 'Conquer Algebra City, Geometry Valley, and Number Mountains in Number Kingdom.',
          icon: 'sigma',
          displayOrder: 4,
        },
        map: {
          mapName: 'Number Kingdom',
          mapSlug: 'number-kingdom',
          theme: {
            primaryColor: '#f59e0b',
            secondaryColor: '#38bdf8',
            oceanColor: '#1e3a8a',
            badgeStyle: 'math-gold',
            ambientEffect: 'clouds',
          },
          backgroundAsset: '/assets/vidyaquest-world-map.jpg',
          previewAsset: '/assets/vidyaquest-world-map.jpg',
        },
        zones: [
          { slug: 'puzzle-village', name: 'Puzzle Village', x: 54, y: 56, color: '#eab308', desc: 'Arithmetic, ratios, and logic puzzles.' },
          { slug: 'algebra-city', name: 'Algebra City', x: 26, y: 25, color: '#22c55e', desc: 'Expressions, equations, and functions.' },
          { slug: 'number-mountains', name: 'Number Mountains', x: 55, y: 18, color: '#38bdf8', desc: 'Prime numbers, exponents, and sequences.' },
          { slug: 'geometry-valley', name: 'Geometry Valley', x: 28, y: 74, color: '#f59e0b', desc: 'Triangles, circles, and coordinate planes.' },
          { slug: 'theorem-keep', name: 'Theorem Keep', x: 84, y: 54, color: '#a855f7', desc: 'Grand mathematical proofs and challenges.' },
        ],
        missions: [
          { slug: 'math-1', zone: 'puzzle-village', title: 'Ratio Bakery', type: 'Puzzle', diff: 'Beginner', xp: 50, x: 55, y: 66, prereq: null, obj: ['Solve proportional reasoning problems'] },
          { slug: 'math-2', zone: 'puzzle-village', title: 'Percentage Market', type: 'Quiz', diff: 'Beginner', xp: 75, x: 42, y: 58, prereq: 'math-1', obj: ['Calculate discounts, tax, and percent change'] },
          { slug: 'math-3', zone: 'algebra-city', title: 'Linear Balance', type: 'Interactive lesson', diff: 'Intermediate', xp: 100, x: 26, y: 38, prereq: 'math-2', obj: ['Solve two-step linear equations'] },
          { slug: 'math-4', zone: 'algebra-city', title: 'Quadratic Arcs', type: 'Puzzle', diff: 'Intermediate', xp: 125, x: 34, y: 22, prereq: 'math-3', obj: ['Factor quadratics and find parabola vertices'] },
          { slug: 'math-5', zone: 'number-mountains', title: 'Prime Summit', type: 'Challenge', diff: 'Intermediate', xp: 150, x: 56, y: 26, prereq: 'math-4', obj: ['Factor numbers into primes and exponents'] },
          { slug: 'math-6', zone: 'geometry-valley', title: 'Bridge Trigonometry', type: 'Quiz', diff: 'Advanced', xp: 175, x: 30, y: 74, prereq: 'math-5', obj: ['Apply Pythagorean theorem to right triangles'] },
          { slug: 'math-7', zone: 'theorem-keep', title: 'Coordinate Fortress', type: 'Interactive lesson', diff: 'Advanced', xp: 210, x: 70, y: 62, prereq: 'math-6', obj: ['Compute slope, midpoint, and distance on planes'] },
          { slug: 'math-8', zone: 'theorem-keep', title: 'Crown of Numbers', type: 'Challenge', diff: 'Master', xp: 250, x: 84, y: 48, prereq: 'math-7', obj: ['Combine algebra and geometry in a timed trial'] },
        ],
      },
    ] as const;

    for (const world of worlds) {
      let subjectDoc = await SubjectModel.findOne({ slug: world.subject.slug });
      if (!subjectDoc) {
        subjectDoc = await SubjectModel.create({
          ...world.subject,
          isActive: true,
        });
      }

      let mapDoc = await SubjectMapModel.findOne({ subjectId: subjectDoc._id, isPublished: true });
      if (!mapDoc) {
        mapDoc = await SubjectMapModel.create({
          subjectId: subjectDoc._id,
          mapName: world.map.mapName,
          mapSlug: world.map.mapSlug,
          theme: world.map.theme,
          backgroundAsset: world.map.backgroundAsset,
          previewAsset: world.map.previewAsset,
          mapConfiguration: {
            width: 1600,
            height: 960,
            minScale: 0.7,
            maxScale: 2.5,
            defaultCenterX: 50,
            defaultCenterY: 50,
          },
          isPublished: true,
          version: 1,
        });
      }

      const zoneIdBySlug = new Map<string, typeof mapDoc._id>();
      for (let i = 0; i < world.zones.length; i += 1) {
        const z = world.zones[i];
        const zoneDoc = await MapLocationModel.findOneAndUpdate(
          { mapId: mapDoc._id, slug: z.slug },
          {
            $setOnInsert: {
              mapId: mapDoc._id,
              name: z.name,
              slug: z.slug,
              locationType: 'zone',
              positionX: z.x,
              positionY: z.y,
              accentColor: z.color,
              displayOrder: i + 1,
              description: z.desc,
              isActive: true,
            },
          },
          { upsert: true, new: true },
        );
        zoneIdBySlug.set(z.slug, zoneDoc._id);
      }

      const missionIdBySlug = new Map<string, typeof mapDoc._id>();
      for (let i = 0; i < world.missions.length; i += 1) {
        const m = world.missions[i];
        const prereqId = m.prereq ? missionIdBySlug.get(m.prereq) : undefined;
        const missionDoc = await MissionModel.findOneAndUpdate(
          { mapId: mapDoc._id, slug: m.slug },
          {
            $set: {
              locationId: zoneIdBySlug.get(m.zone),
              title: m.title,
              missionType: m.type,
              difficulty: m.diff,
              xpReward: m.xp,
              prerequisites: prereqId ? [prereqId] : [],
              sequence: i + 1,
              positionX: m.x,
              positionY: m.y,
              isPublished: true,
            },
            $setOnInsert: {
              subjectId: subjectDoc._id,
              mapId: mapDoc._id,
              slug: m.slug,
              description: `Embark on ${m.title} in ${world.map.mapName}.`,
              gradeEligibility: ['6', '7', '8', '9', '10'],
              estimatedDurationMinutes: 10,
              learningObjectives: [...m.obj],
            },
          },
          { upsert: true, new: true },
        );
        missionIdBySlug.set(m.slug, missionDoc._id);
      }
    }
  })().catch((err) => {
    seedPromise = null;
    throw err;
  });

  return seedPromise;
}
