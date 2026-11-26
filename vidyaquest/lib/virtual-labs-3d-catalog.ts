/**
 * Verified open-source, public-domain, and Creative Commons 3D educational
 * models and interactive 3D study resources for VidyaQuest Virtual Labs.
 */

export type SubjectCategory =
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Astronomy"
  | "Engineering & Math"

export const SUBJECT_CATEGORIES: readonly SubjectCategory[] = [
  "Physics",
  "Chemistry",
  "Biology",
  "Astronomy",
  "Engineering & Math",
] as const

export interface OpenSource3DModel {
  id: string
  title: string
  subject: SubjectCategory
  topic: string
  license: string
  licenseBadge: string
  source: string
  url: string
  studyConcepts: string[]
}

export const OPEN_SOURCE_3D_MODELS: OpenSource3DModel[] = [
  // Physics
  {
    id: "physics-pendulum-lab",
    title: "Pendulum Lab",
    subject: "Physics",
    topic: "Classical Mechanics & Harmonic Motion",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/pendulum-lab",
    studyConcepts: [
      "Period dependence on length & gravity (T = 2*pi*sqrt(L/g))",
      "Kinetic & potential energy conservation",
      "Damping, friction, and small-angle approximation",
    ],
  },
  {
    id: "physics-circuit-construction-dc",
    title: "Circuit Construction Kit: DC",
    subject: "Physics",
    topic: "Electromagnetism & DC Circuits",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
    studyConcepts: [
      "Ohm's Law (V = IR) and series vs. parallel networks",
      "Current flow, voltage drops, and meter measurement",
      "Short circuits and internal battery resistance",
    ],
  },
  {
    id: "physics-wave-on-a-string",
    title: "Wave on a String",
    subject: "Physics",
    topic: "Waves, Oscillations & Acoustics",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/wave-on-a-string",
    studyConcepts: [
      "Frequency, wavelength, amplitude, and wave speed relationships",
      "Wave reflection at fixed, loose, and open ends",
      "Standing waves, tension, and damping",
    ],
  },
  {
    id: "physics-projectile-motion",
    title: "Projectile Motion",
    subject: "Physics",
    topic: "Kinematics & 2D Motion",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/projectile-motion",
    studyConcepts: [
      "Independence of horizontal and vertical motion under gravity",
      "Launch angle, initial velocity, range, and apex",
      "Air resistance, drag coefficient, and mass effects",
    ],
  },

  // Chemistry
  {
    id: "chemistry-molecule-shapes",
    title: "Molecule Shapes (3D VSEPR)",
    subject: "Chemistry",
    topic: "Molecular Geometry & VSEPR Theory",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/molecule-shapes",
    studyConcepts: [
      "VSEPR 3D geometries from electron-pair repulsion",
      "Bond angles with single/double/triple bonds and lone pairs",
      "Electron vs. molecular geometry (tetrahedral, trigonal planar, bent)",
    ],
  },
  {
    id: "chemistry-caffeine-3d",
    title: "Caffeine 3D Conformer (CID 2519)",
    subject: "Chemistry",
    topic: "Organic Chemistry & Alkaloid Structure (C8H10N4O2)",
    license: "Public Domain",
    licenseBadge: "Public Domain",
    source: "PubChem 3D (NIH / NCBI)",
    url: "https://pubchem.ncbi.nlm.nih.gov/compound/2519",
    studyConcepts: [
      "Fused purine/xanthine heterocyclic ring system in 3D",
      "Planar conjugated pi-systems and methyl orientation",
      "Low-energy 3D conformer coordinates (SDF/PDB)",
    ],
  },
  {
    id: "chemistry-d-glucose-3d",
    title: "D-Glucose 3D Conformer (CID 5793)",
    subject: "Chemistry",
    topic: "Biochemistry & Carbohydrate Stereochemistry (C6H12O6)",
    license: "Public Domain",
    licenseBadge: "Public Domain",
    source: "PubChem 3D (NIH / NCBI)",
    url: "https://pubchem.ncbi.nlm.nih.gov/compound/5793",
    studyConcepts: [
      "Pyranose six-membered ring chair conformation in 3D",
      "Equatorial vs. axial hydroxyl (-OH) stereochemistry",
      "Chiral centers and hydrogen-bonding sites",
    ],
  },
  {
    id: "chemistry-molview-studio",
    title: "MolView 3D Molecular Studio",
    subject: "Chemistry",
    topic: "Interactive 2D-to-3D Molecular Modeling",
    license: "AGPL-3.0 (Open Source)",
    licenseBadge: "AGPL-3.0",
    source: "MolView",
    url: "https://molview.org/",
    studyConcepts: [
      "Real-time 2D skeletal sketching to 3D conformer conversion",
      "Ball-and-stick, van der Waals spacefill, and wireframe views",
      "Bond length, angle, and electrostatic potential inspection",
    ],
  },

  // Biology
  {
    id: "biology-sars-cov-2-virion",
    title: "SARS-CoV-2 Virion (NIAID, 3DPX-013323)",
    subject: "Biology",
    topic: "Virology & Structural Microbiology",
    license: "Public Domain / NIH 3D Open Access",
    licenseBadge: "NIH Open Access",
    source: "NIH 3D (NIAID)",
    url: "https://3d.nih.gov/entries/3DPX-013323",
    studyConcepts: [
      "Viral envelope, membrane proteins, and trimeric spike architecture",
      "Open (active) vs. closed (inactive) spike conformations",
      "PDB atomic models combined with electron microscopy",
    ],
  },
  {
    id: "biology-human-male-brain",
    title: "Human Reference Atlas Male Brain (3DPX-020960)",
    subject: "Biology",
    topic: "Neuroanatomy & Human Organ Systems",
    license: "NIH 3D Open Access",
    licenseBadge: "NIH Open Access",
    source: "NIH 3D (Human Reference Atlas)",
    url: "https://3d.nih.gov/entries/3DPX-020960",
    studyConcepts: [
      "3D spatial organization of cerebral cortex, sulci, and gyri",
      "Reference anatomical landmarks from volumetric neuroimaging",
      "Structure-function mapping across brain regions",
    ],
  },
  {
    id: "biology-human-hemoglobin",
    title: "Human Hemoglobin (3DPX-011342)",
    subject: "Biology",
    topic: "Molecular Biology & Protein Quaternary Structure",
    license: "NIH 3D Open Access",
    licenseBadge: "NIH Open Access",
    source: "NIH 3D",
    url: "https://3d.nih.gov/entries/3DPX-011342",
    studyConcepts: [
      "Tetrameric quaternary protein structure (alpha2-beta2 subunits)",
      "Alpha-helix folding and peptide backbone geometry",
      "Heme prosthetic group pocket and oxygen-binding cooperativity",
    ],
  },
  {
    id: "biology-fetal-hemoglobin-hbf",
    title: "Wild-type Fetal Human Hemoglobin HbF (3DPX-004591)",
    subject: "Biology",
    topic: "Developmental Biology & Protein Variants",
    license: "NIH 3D Open Access",
    licenseBadge: "NIH Open Access",
    source: "NIH 3D",
    url: "https://3d.nih.gov/entries/3DPX-004591",
    studyConcepts: [
      "Structural comparison between fetal (alpha2-gamma2) and adult hemoglobin",
      "Higher oxygen affinity mechanism for placental oxygen transfer",
      "Crystal structure visualization from PDB 4MQJ",
    ],
  },

  // Astronomy
  {
    id: "astronomy-nasa-eyes-solar-system",
    title: "NASA's Eyes on the Solar System",
    subject: "Astronomy",
    topic: "Planetary Science & Orbital Missions",
    license: "Public Domain",
    licenseBadge: "Public Domain",
    source: "NASA JPL",
    url: "https://eyes.nasa.gov/apps/solar-system",
    studyConcepts: [
      "Real-time 3D positions of planets, moons, comets, and spacecraft (1950-2050)",
      "Planetary scale, orbital inclination, and mission trajectories",
      "Comparative planetology across terrestrial and gas/ice giants",
    ],
  },
  {
    id: "astronomy-nasa-eyes-exoplanets",
    title: "NASA's Eyes on Exoplanets",
    subject: "Astronomy",
    topic: "Exoplanet Systems & Astrobiology",
    license: "Public Domain",
    licenseBadge: "Public Domain",
    source: "NASA JPL",
    url: "https://eyes.nasa.gov/apps/exo/",
    studyConcepts: [
      "3D exploration of 5,500+ confirmed exoplanets from NASA Exoplanet Archive",
      "Habitable zone boundaries around different stellar types",
      "Size and orbital comparisons against our Solar System",
    ],
  },
  {
    id: "astronomy-nasa-eyes-earth",
    title: "NASA's Eyes on the Earth",
    subject: "Astronomy",
    topic: "Earth Observation & Climate Science",
    license: "Public Domain",
    licenseBadge: "Public Domain",
    source: "NASA JPL",
    url: "https://eyes.nasa.gov/apps/earth",
    studyConcepts: [
      "Real-time 3D tracking of NASA Earth-observing satellite fleet",
      "Global atmospheric CO2, ozone, sea-level, and temperature datasets",
      "Remote sensing from low-Earth and geostationary orbits",
    ],
  },
  {
    id: "astronomy-gravity-and-orbits",
    title: "Gravity and Orbits",
    subject: "Astronomy",
    topic: "Celestial Mechanics & Universal Gravitation",
    license: "CC BY 4.0 / CC BY-NC 4.0",
    licenseBadge: "CC BY 4.0",
    source: "PhET Interactive Simulations (CU Boulder)",
    url: "https://phet.colorado.edu/en/simulations/gravity-and-orbits",
    studyConcepts: [
      "Newton's Law of Universal Gravitation and inverse-square force vectors",
      "Orbital velocity, elliptical vs. circular orbits, and escape paths",
      "Mass-dependent attraction in Sun-Earth-Moon systems",
    ],
  },

  // Engineering & Math
  {
    id: "eng-math-platonic-solids-3d",
    title: "Platonic Solids 3D",
    subject: "Engineering & Math",
    topic: "3D Euclidean Geometry & Polyhedra",
    license: "CC BY-NC-SA 4.0",
    licenseBadge: "CC BY-NC-SA 4.0",
    source: "GeoGebra 3D (Tim Brzezinski)",
    url: "https://www.geogebra.org/m/tf4fyktn",
    studyConcepts: [
      "Five regular convex polyhedra (Tetrahedron to Icosahedron)",
      "Euler's polyhedron formula (V - E + F = 2)",
      "3D rotational symmetry, dihedral angles, and 2D net unfolding",
    ],
  },
  {
    id: "eng-math-solid-of-revolution",
    title: "Solid of Revolution (Calculus Volumes)",
    subject: "Engineering & Math",
    topic: "Integral Calculus & 3D Volume Modeling",
    license: "CC BY-NC-SA 4.0",
    licenseBadge: "CC BY-NC-SA 4.0",
    source: "GeoGebra 3D (Andreas Lindner)",
    url: "https://www.geogebra.org/m/wyVSG4ay",
    studyConcepts: [
      "Rotating 2D curves around x- or y-axes to form 3D solids",
      "Disk, washer, and cylindrical shell integration methods",
      "Cross-sectional area accumulation in 3D space",
    ],
  },
  {
    id: "eng-math-geogebra-3d-calculator",
    title: "GeoGebra 3D Calculator",
    subject: "Engineering & Math",
    topic: "Multivariable Calculus & Analytic Geometry",
    license: "Non-Commercial Educational Freeware",
    licenseBadge: "Edu Freeware",
    source: "GeoGebra",
    url: "https://www.geogebra.org/3d",
    studyConcepts: [
      "Plotting 3D surfaces z = f(x, y), saddle points, and paraboloids",
      "3D vectors, planes, intersections, and parametric curves",
      "Spatial reasoning for CAD and engineering geometry",
    ],
  },
  {
    id: "eng-math-smithsonian-3d",
    title: "Smithsonian 3D Open Access Collection",
    subject: "Engineering & Math",
    topic: "Aerospace Engineering & Historic Mechanisms",
    license: "CC0 (Public Domain)",
    licenseBadge: "CC0",
    source: "Smithsonian Institution (3d.si.edu)",
    url: "https://3d.si.edu/",
    studyConcepts: [
      "High-res scans of Apollo 11 Command Module & 1903 Wright Flyer",
      "Wing warping, truss engineering, and spacecraft heat-shield geometry",
      "Interactive 3D Voyager slicing, measurement, and STL/OBJ inspection",
    ],
  },
]

export const OPEN_SOURCE_3D_MODELS_BY_SUBJECT: Record<
  SubjectCategory,
  OpenSource3DModel[]
> = {
  Physics: OPEN_SOURCE_3D_MODELS.filter((m) => m.subject === "Physics"),
  Chemistry: OPEN_SOURCE_3D_MODELS.filter((m) => m.subject === "Chemistry"),
  Biology: OPEN_SOURCE_3D_MODELS.filter((m) => m.subject === "Biology"),
  Astronomy: OPEN_SOURCE_3D_MODELS.filter((m) => m.subject === "Astronomy"),
  "Engineering & Math": OPEN_SOURCE_3D_MODELS.filter(
    (m) => m.subject === "Engineering & Math"
  ),
}
