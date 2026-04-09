# Logic Vault

A premium educational platform serving as a centralized repository for academic resources across Physics, Biology, Chemistry, Information Technology, and Mathematics.

## Design Philosophy

Logic Vault employs an "Organic Professional" aesthetic with a sophisticated color palette:
- **Primary:** Deep Olive (#3B3F30) - evoking academic authority
- **Secondary:** Warm Beige (#F5F5DC) - reducing cognitive load for students
- **Accent:** Muted Gold (#C9B896) - premium visual hierarchy

The UI features refined glassmorphism effects, generous whitespace, and elegant typography pairing Playfair Display (serif) with Inter (sans-serif).

## Subjects Covered

### Scientific Sciences
- **Physics** - Classical mechanics, electromagnetism, thermodynamics, optics, quantum mechanics
- **Biology** - Cell biology, genetics, ecology, human physiology, evolution
- **Chemistry** - Organic, inorganic, physical, analytical, biochemistry

### Technical & Logic
- **Mathematics** - Algebra, calculus, geometry, trigonometry, statistics
- **Information Technology** - Programming, databases, networking, systems analysis, web development

## Features

### The Repository
- **Notes Vault** - Comprehensive topic-based notes with standardized layouts
- **Past Papers** - Archive of examination papers with difficulty indicators
- **Interactive Tools** - Simulators and calculators for hands-on learning

### UX Excellence
- Global search with ⌘K/Ctrl+K keyboard shortcut
- Glassmorphism navigation with mega-menu organization
- Responsive design (desktop triple-column → mobile single-column)
- Subtle 0.3s eased animations maintaining premium feel

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Typography:** Playfair Display + Inter (Google Fonts)
- **Icons:** Custom SVG icon system
- **Data:** JSON-structured CMS layer for easy content management

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the vault.

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── subject/[slug]/   # Dynamic subject pages
│   │   ├── notes/            # Notes repository
│   │   └── page.tsx          # Homepage
│   ├── components/       # React components
│   │   ├── Navigation.tsx    # Glassmorphism header
│   │   ├── Hero.tsx          # Landing section
│   │   ├── Search.tsx        # Global search modal
│   │   ├── SubjectPage.tsx   # Subject detail layout
│   │   └── Icons.tsx          # SVG icon system
│   └── data/
│       └── vault.ts      # CMS data layer (subjects, topics, papers)
├── dist/                 # Static export output
└── README.md
```

## Content Management

To add new topics or resources, edit `src/data/vault.ts`. The modular structure allows injection of new content without rewriting components.

## Deployment

This project is configured for static export (`output: 'export'`). The `dist/` folder contains deployable HTML files.

---

Built for academic excellence. Curated for students.
