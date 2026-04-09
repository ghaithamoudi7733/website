export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "notes" | "past_paper" | "interactive";
  url?: string;
  date?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface SubjectTheme {
  primary: string;
  light: string;
  dark: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  accentColor: string;
  icon: string;
  theme: SubjectTheme;
  topics: Topic[];
  pastPapers: Topic[];
  resources: Topic[];
}

// Subject Signature Colors
export const SUBJECT_THEMES = {
  mathematics: {
    primary: "#8B0000",  // Crimson Red
    light: "#FDECEA",     // Light Pink/Red tint
    dark: "#5C0000"
  },
  biology: {
    primary: "#0047AB",   // Royal Blue
    light: "#EBF2FA",     // Light Blue tint
    dark: "#003380"
  },
  chemistry: {
    primary: "#6A0DAD",   // Royal Purple
    light: "#F3E8FF",     // Light Purple tint
    dark: "#4A087A"
  },
  physics: {
    primary: "#2F4F4F",   // Slate Teal (Deep Olive/Dark Slate)
    light: "#E8F0F0",     // Light Teal tint
    dark: "#1F3535"
  }
} as const;

export const vaultData = {
  subjects: [
    {
      id: "physics",
      name: "Physics",
      slug: "physics",
      description: "Classical mechanics, electromagnetism, thermodynamics, and quantum phenomena.",
      accentColor: SUBJECT_THEMES.physics.primary,
      icon: "atom",
      theme: SUBJECT_THEMES.physics,
      topics: [
        {
          id: "mechanics",
          title: "Classical Mechanics",
          description: "Newton's laws, kinematics, dynamics, and conservation principles.",
          icon: "move",
          type: "notes"
        },
        {
          id: "electromagnetism",
          title: "Electromagnetism",
          description: "Electric fields, magnetic fields, circuits, and Maxwell's equations.",
          icon: "zap",
          type: "notes"
        },
        {
          id: "thermodynamics",
          title: "Thermodynamics",
          description: "Laws of thermodynamics, entropy, heat engines, and statistical mechanics.",
          icon: "flame",
          type: "notes"
        },
        {
          id: "optics",
          title: "Wave Optics",
          description: "Interference, diffraction, polarization, and geometric optics.",
          icon: "waves",
          type: "notes"
        },
        {
          id: "quantum",
          title: "Quantum Mechanics",
          description: "Wave-particle duality, Schrödinger equation, and atomic structure.",
          icon: "orbit",
          type: "notes"
        }
      ],
      pastPapers: [
        { id: "pp-2024", title: "Physics 2024", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2024", difficulty: "advanced" },
        { id: "pp-2023", title: "Physics 2023", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2023", difficulty: "advanced" },
        { id: "pp-2022", title: "Physics 2022", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2022", difficulty: "advanced" },
        { id: "pp-2021", title: "Physics 2021", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2021", difficulty: "advanced" }
      ],
      resources: [
        { id: "sim-1", title: "Projectile Motion Simulator", description: "Interactive simulation of projectile trajectories.", icon: "play-circle", type: "interactive" },
        { id: "sim-2", title: "Circuit Builder", description: "Build and analyze electrical circuits.", icon: "play-circle", type: "interactive" },
        { id: "sim-3", title: "Wave Interference", description: "Visualize wave interference patterns.", icon: "play-circle", type: "interactive" }
      ]
    },
    {
      id: "biology",
      name: "Biology",
      slug: "biology",
      description: "Cellular biology, genetics, ecology, and human physiology.",
      accentColor: SUBJECT_THEMES.biology.primary,
      icon: "leaf",
      theme: SUBJECT_THEMES.biology,
      topics: [
        {
          id: "cell-biology",
          title: "Cell Biology",
          description: "Cell structure, organelles, membrane transport, and cell division.",
          icon: "microscope",
          type: "notes"
        },
        {
          id: "genetics",
          title: "Genetics",
          description: "DNA structure, gene expression, inheritance, and genetic engineering.",
          icon: "dna",
          type: "notes"
        },
        {
          id: "ecology",
          title: "Ecology",
          description: "Ecosystems, population dynamics, conservation, and biodiversity.",
          icon: "trees",
          type: "notes"
        },
        {
          id: "physiology",
          title: "Human Physiology",
          description: "Organ systems, homeostasis, and body functions.",
          icon: "heart-pulse",
          type: "notes"
        },
        {
          id: "evolution",
          title: "Evolution",
          description: "Natural selection, speciation, and evolutionary theory.",
          icon: "git-branch",
          type: "notes"
        }
      ],
      pastPapers: [
        { id: "bio-2024", title: "Biology 2024", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2024", difficulty: "advanced" },
        { id: "bio-2023", title: "Biology 2023", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2023", difficulty: "advanced" },
        { id: "bio-2022", title: "Biology 2022", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2022", difficulty: "advanced" },
        { id: "bio-2021", title: "Biology 2021", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2021", difficulty: "advanced" }
      ],
      resources: [
        { id: "bio-sim-1", title: "Cell Division Visualizer", description: "Interactive mitosis and meiosis simulation.", icon: "play-circle", type: "interactive" },
        { id: "bio-sim-2", title: "Genetics Calculator", description: "Punnett square and probability tool.", icon: "play-circle", type: "interactive" },
        { id: "bio-sim-3", title: "Ecosystem Model", description: "Simulate predator-prey relationships.", icon: "play-circle", type: "interactive" }
      ]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      slug: "chemistry",
      description: "Organic, inorganic, and physical chemistry principles.",
      accentColor: SUBJECT_THEMES.chemistry.primary,
      icon: "flask-conical",
      theme: SUBJECT_THEMES.chemistry,
      topics: [
        {
          id: "organic",
          title: "Organic Chemistry",
          description: "Hydrocarbons, functional groups, reactions, and synthesis pathways.",
          icon: "hexagon",
          type: "notes"
        },
        {
          id: "inorganic",
          title: "Inorganic Chemistry",
          description: "Periodic trends, bonding, coordination compounds, and metallurgy.",
          icon: "triangle",
          type: "notes"
        },
        {
          id: "physical",
          title: "Physical Chemistry",
          description: "Chemical kinetics, equilibrium, electrochemistry, and thermodynamics.",
          icon: "activity",
          type: "notes"
        },
        {
          id: "analytical",
          title: "Analytical Chemistry",
          description: "Titrations, spectroscopy, chromatography, and quantitative analysis.",
          icon: "search",
          type: "notes"
        },
        {
          id: "biochem",
          title: "Biochemistry",
          description: "Proteins, carbohydrates, lipids, nucleic acids, and metabolic pathways.",
          icon: "molecule",
          type: "notes"
        }
      ],
      pastPapers: [
        { id: "chem-2024", title: "Chemistry 2024", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2024", difficulty: "advanced" },
        { id: "chem-2023", title: "Chemistry 2023", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2023", difficulty: "advanced" },
        { id: "chem-2022", title: "Chemistry 2022", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2022", difficulty: "advanced" },
        { id: "chem-2021", title: "Chemistry 2021", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2021", difficulty: "advanced" }
      ],
      resources: [
        { id: "chem-sim-1", title: "Periodic Table Explorer", description: "Interactive element properties.", icon: "play-circle", type: "interactive" },
        { id: "chem-sim-2", title: "Molecule Builder", description: "3D molecular structure visualization.", icon: "play-circle", type: "interactive" },
        { id: "chem-sim-3", title: "Titration Simulator", description: "Virtual acid-base titration lab.", icon: "play-circle", type: "interactive" }
      ]
    },
    {
      id: "mathematics",
      name: "Mathematics",
      slug: "mathematics",
      description: "Pure mathematics, calculus, statistics, and applied mathematics.",
      accentColor: SUBJECT_THEMES.mathematics.primary,
      icon: "calculator",
      theme: SUBJECT_THEMES.mathematics,
      topics: [
        {
          id: "algebra",
          title: "Algebra & Functions",
          description: "Polynomials, equations, inequalities, and function analysis.",
          icon: "function",
          type: "notes"
        },
        {
          id: "calculus",
          title: "Calculus",
          description: "Limits, derivatives, integrals, and differential equations.",
          icon: "trending-up",
          type: "notes"
        },
        {
          id: "geometry",
          title: "Geometry & Vectors",
          description: "Coordinate geometry, transformations, and vector operations.",
          icon: "square",
          type: "notes"
        },
        {
          id: "trigonometry",
          title: "Trigonometry",
          description: "Trigonometric functions, identities, and applications.",
          icon: "circle",
          type: "notes"
        },
        {
          id: "statistics",
          title: "Statistics & Probability",
          description: "Data analysis, distributions, hypothesis testing, and probability.",
          icon: "bar-chart",
          type: "notes"
        }
      ],
      pastPapers: [
        { id: "math-2024", title: "Mathematics 2024", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2024", difficulty: "advanced" },
        { id: "math-2023", title: "Mathematics 2023", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2023", difficulty: "advanced" },
        { id: "math-2022", title: "Mathematics 2022", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2022", difficulty: "advanced" },
        { id: "math-2021", title: "Mathematics 2021", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2021", difficulty: "advanced" }
      ],
      resources: [
        { id: "math-sim-1", title: "Graphing Calculator", description: "Interactive function plotting.", icon: "graph-grid", type: "interactive" },
        { id: "math-sim-2", title: "Equation Solver", description: "Step-by-step solution visualizer.", icon: "radical", type: "interactive" },
        { id: "math-sim-3", title: "Statistical Distributions", description: "Probability distribution explorer.", icon: "bell-curve", type: "interactive" }
      ]
    }
  ] as Subject[],
  
  categories: {
    scientific: ["physics", "biology", "chemistry"],
    technical: ["mathematics"]
  }
};

export function getSubjectBySlug(slug: string): Subject | undefined {
  return vaultData.subjects.find(s => s.slug === slug);
}

export function getAllSubjects(): Subject[] {
  return vaultData.subjects;
}

export function searchResources(query: string): Array<{ subject: Subject; item: Topic; category: string }> {
  const results: Array<{ subject: Subject; item: Topic; category: string }> = [];
  const q = query.toLowerCase();
  
  for (const subject of vaultData.subjects) {
    for (const topic of subject.topics) {
      if (topic.title.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q)) {
        results.push({ subject, item: topic, category: "Topics" });
      }
    }
    for (const paper of subject.pastPapers) {
      if (paper.title.toLowerCase().includes(q) || paper.description.toLowerCase().includes(q)) {
        results.push({ subject, item: paper, category: "Past Papers" });
      }
    }
    for (const resource of subject.resources) {
      if (resource.title.toLowerCase().includes(q) || resource.description.toLowerCase().includes(q)) {
        results.push({ subject, item: resource, category: "Interactive" });
      }
    }
  }
  
  return results;
}
