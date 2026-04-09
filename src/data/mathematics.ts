// EmeraldMath-style structured data for Mathematics modules
// Reusable pattern for Physics, Biology, Chemistry adaptation

export type DocumentType = "QP" | "MS" | "Notes";

export interface ExamSeries {
  name: "January" | "June" | "October";
  available: boolean;
  documents: {
    QP?: { url: string; size: string };
    MS?: { url: string; size: string };
  };
}

export interface YearData {
  year: number;
  series: ExamSeries[];
}

export interface MathModule {
  id: string;
  code: string; // P1, P2, P3, P4, S1, S2, M1, M2
  name: string;
  fullName: string;
  description: string;
  watermark: string; // Icon name for background watermark
  accentColor: string;
  topics: string[];
  years: YearData[];
}

// Document configuration for the modal
export const SERIES_NAMES = ["January", "June", "October"] as const;
export const YEARS_RANGE = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017] as const;

// Mathematics modules configuration
export const MATHEMATICS_MODULES: MathModule[] = [
  {
    id: "pure-1",
    code: "P1",
    name: "Pure Mathematics 1",
    fullName: "Pure Mathematics 1 - Algebra & Functions",
    description: "Quadratics, functions, coordinate geometry, circular measure, trigonometry, vectors",
    watermark: "integral",
    accentColor: "#C9B896",
    topics: ["Quadratics", "Functions", "Coordinate Geometry", "Circular Measure", "Trigonometry", "Vectors"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "pure-2",
    code: "P2",
    name: "Pure Mathematics 2",
    fullName: "Pure Mathematics 2 - Calculus & Algebra",
    description: "Algebra, logarithms, exponential functions, trigonometry, differentiation, integration",
    watermark: "derivative",
    accentColor: "#C9B896",
    topics: ["Algebra", "Logarithms", "Exponentials", "Trigonometry II", "Differentiation", "Integration"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "pure-3",
    code: "P3",
    name: "Pure Mathematics 3",
    fullName: "Pure Mathematics 3 - Advanced Calculus",
    description: "Algebra, trigonometry, complex numbers, differentiation, integration, numerical methods",
    watermark: "sigma",
    accentColor: "#C9B896",
    topics: ["Algebra", "Trigonometry III", "Complex Numbers", "Advanced Differentiation", "Advanced Integration", "Numerical Methods"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "pure-4",
    code: "P4",
    name: "Pure Mathematics 4",
    fullName: "Pure Mathematics 4 - Further Mathematics",
    description: "Polynomials, rational functions, polar coordinates, hyperbolic functions, differential equations",
    watermark: "infinity",
    accentColor: "#C9B896",
    topics: ["Polynomials", "Rational Functions", "Polar Coordinates", "Hyperbolic Functions", "Differential Equations"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "stats-1",
    code: "S1",
    name: "Statistics 1",
    fullName: "Statistics 1 - Data & Probability",
    description: "Data representation, permutations, probability, discrete random variables, normal distribution",
    watermark: "distribution",
    accentColor: "#9B8B7A",
    topics: ["Data Representation", "Permutations & Combinations", "Probability", "Discrete Random Variables", "Normal Distribution"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "stats-2",
    code: "S2",
    name: "Statistics 2",
    fullName: "Statistics 2 - Advanced Statistics",
    description: "Continuous random variables, sampling, hypothesis testing, Poisson distribution",
    watermark: "chi-square",
    accentColor: "#9B8B7A",
    topics: ["Continuous Random Variables", "Sampling", "Hypothesis Testing", "Poisson Distribution", "Linear Combinations"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "mechanics-1",
    code: "M1",
    name: "Mechanics 1",
    fullName: "Mechanics 1 - Forces & Motion",
    description: "Forces, equilibrium, kinematics, Newton's laws, energy, momentum",
    watermark: "velocity",
    accentColor: "#8B9D77",
    topics: ["Forces & Equilibrium", "Kinematics", "Newton's Laws", "Work & Energy", "Momentum"],
    years: generateYearData(2017, 2026)
  },
  {
    id: "mechanics-2",
    code: "M2",
    name: "Mechanics 2",
    fullName: "Mechanics 2 - Advanced Mechanics",
    description: "Motion in a circle, centers of mass, rigid bodies, elastic strings, simple harmonic motion",
    watermark: "acceleration",
    accentColor: "#8B9D77",
    topics: ["Circular Motion", "Centers of Mass", "Rigid Bodies", "Elastic Strings", "Simple Harmonic Motion"],
    years: generateYearData(2017, 2026)
  }
];

// Helper function to generate year data with all series
function generateYearData(startYear: number, endYear: number): YearData[] {
  const years: YearData[] = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({
      year,
      series: [
        {
          name: "January",
          available: year >= 2020, // January series available from 2020
          documents: {
            QP: { url: `/papers/${year}/january/qp.pdf`, size: "2.4 MB" },
            MS: { url: `/papers/${year}/january/ms.pdf`, size: "1.8 MB" }
          }
        },
        {
          name: "June",
          available: true,
          documents: {
            QP: { url: `/papers/${year}/june/qp.pdf`, size: "2.4 MB" },
            MS: { url: `/papers/${year}/june/ms.pdf`, size: "1.8 MB" }
          }
        },
        {
          name: "October",
          available: year >= 2022, // October series available from 2022
          documents: {
            QP: { url: `/papers/${year}/october/qp.pdf`, size: "2.4 MB" },
            MS: { url: `/papers/${year}/october/ms.pdf`, size: "1.8 MB" }
          }
        }
      ]
    });
  }
  return years;
}

// Get module by code
export function getModuleByCode(code: string): MathModule | undefined {
  return MATHEMATICS_MODULES.find(m => m.code === code);
}

// Get all module codes
export function getAllModuleCodes(): string[] {
  return MATHEMATICS_MODULES.map(m => m.code);
}

// Get revision notes for a module
export function getModuleNotes(moduleCode: string): { title: string; url: string; pages: number }[] {
  return [
    { title: "Complete Formula Sheet", url: `/notes/${moduleCode}/formulas.pdf`, pages: 12 },
    { title: "Key Concepts Summary", url: `/notes/${moduleCode}/concepts.pdf`, pages: 24 },
    { title: "Worked Examples", url: `/notes/${moduleCode}/examples.pdf`, pages: 36 },
    { title: "Exam Tips & Techniques", url: `/notes/${moduleCode}/tips.pdf`, pages: 8 }
  ];
}
