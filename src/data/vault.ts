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

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  accentColor: string;
  icon: string;
  topics: Topic[];
  pastPapers: Topic[];
  resources: Topic[];
}

export const vaultData = {
  subjects: [
    {
      id: "physics",
      name: "Physics",
      slug: "physics",
      description: "Classical mechanics, electromagnetism, thermodynamics, and quantum phenomena.",
      accentColor: "#8B9D77",
      icon: "atom",
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
      accentColor: "#A4B494",
      icon: "leaf",
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
      accentColor: "#9B8B7A",
      icon: "flask-conical",
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
      accentColor: "#C9B896",
      icon: "calculator",
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
        { id: "math-sim-1", title: "Graphing Calculator", description: "Interactive function plotting.", icon: "play-circle", type: "interactive" },
        { id: "math-sim-2", title: "Equation Solver", description: "Step-by-step solution visualizer.", icon: "play-circle", type: "interactive" },
        { id: "math-sim-3", title: "Statistical Distributions", description: "Probability distribution explorer.", icon: "play-circle", type: "interactive" }
      ]
    },
    {
      id: "information-technology",
      name: "Information Technology",
      slug: "information-technology",
      description: "Programming, databases, networking, and systems analysis.",
      accentColor: "#7A8B9D",
      icon: "cpu",
      topics: [
        {
          id: "programming",
          title: "Programming",
          description: "Algorithm design, data structures, and programming fundamentals.",
          icon: "code",
          type: "notes"
        },
        {
          id: "databases",
          title: "Database Systems",
          description: "SQL, normalization, relational models, and DBMS concepts.",
          icon: "database",
          type: "notes"
        },
        {
          id: "networking",
          title: "Computer Networks",
          description: "Network topologies, protocols, security, and architecture.",
          icon: "network",
          type: "notes"
        },
        {
          id: "systems",
          title: "Systems Analysis",
          description: "SDLC, UML modeling, requirements analysis, and design patterns.",
          icon: "workflow",
          type: "notes"
        },
        {
          id: "web-dev",
          title: "Web Development",
          description: "HTML, CSS, JavaScript, and modern web technologies.",
          icon: "globe",
          type: "notes"
        }
      ],
      pastPapers: [
        { id: "it-2024", title: "IT 2024", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2024", difficulty: "advanced" },
        { id: "it-2023", title: "IT 2023", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2023", difficulty: "advanced" },
        { id: "it-2022", title: "IT 2022", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2022", difficulty: "advanced" },
        { id: "it-2021", title: "IT 2021", description: "Advanced Level Examination", icon: "file-text", type: "past_paper", date: "2021", difficulty: "advanced" }
      ],
      resources: [
        { id: "it-sim-1", title: "Code Runner", description: "Execute and debug code samples.", icon: "play-circle", type: "interactive" },
        { id: "it-sim-2", title: "SQL Sandbox", description: "Practice database queries interactively.", icon: "play-circle", type: "interactive" },
        { id: "it-sim-3", title: "Network Simulator", description: "Configure virtual networks.", icon: "play-circle", type: "interactive" }
      ]
    }
  ] as Subject[],
  
  categories: {
    scientific: ["physics", "biology", "chemistry"],
    technical: ["mathematics", "information-technology"]
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
