// ── Types ──

export interface KpiData {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: string;
}

export interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  tags: string[];
  score?: number;
}

export interface TrendingRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  starsToday: number;
  language: string;
  languageColor: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  url: string;
  date: string;
}

// ── Mock KPIs ──

export const mockKpis: KpiData[] = [
  {
    label: "Repos Trending",
    value: "25",
    trend: "up",
    trendValue: "+8",
    icon: "🔥",
  },
  {
    label: "Articles Tech",
    value: "142",
    trend: "up",
    trendValue: "+23",
    icon: "📰",
  },
  {
    label: "Offres Emploi",
    value: "1,247",
    trend: "down",
    trendValue: "-5%",
    icon: "💼",
  },
  {
    label: "Certifications",
    value: "38",
    trend: "neutral",
    trendValue: "stable",
    icon: "🎓",
  },
];

// ── Mock Tech Feed (Hacker News / Dev.to style) ──

export const mockTechFeed: FeedItem[] = [
  {
    id: "1",
    title: "React 20 Released: Server Components Are Now the Default",
    url: "https://react.dev",
    source: "Hacker News",
    date: "Il y a 2h",
    tags: ["React", "Frontend"],
    score: 892,
  },
  {
    id: "2",
    title: "Why Rust Is Taking Over Backend Development in 2026",
    url: "https://dev.to",
    source: "Dev.to",
    date: "Il y a 3h",
    tags: ["Rust", "Backend"],
    score: 456,
  },
  {
    id: "3",
    title: "PostgreSQL 18: The Most Exciting Release in Years",
    url: "https://postgresql.org",
    source: "Hacker News",
    date: "Il y a 5h",
    tags: ["Database", "PostgreSQL"],
    score: 723,
  },
  {
    id: "4",
    title: "Building AI Agents with TypeScript and LangChain.js",
    url: "https://dev.to",
    source: "Dev.to",
    date: "Il y a 6h",
    tags: ["AI", "TypeScript"],
    score: 312,
  },
  {
    id: "5",
    title: "Next.js 16 Preview: Partial Prerendering Goes Stable",
    url: "https://nextjs.org",
    source: "Hacker News",
    date: "Il y a 8h",
    tags: ["Next.js", "SSR"],
    score: 567,
  },
  {
    id: "6",
    title: "Docker Acquires Podman: What It Means for Containers",
    url: "https://docker.com",
    source: "Hacker News",
    date: "Il y a 10h",
    tags: ["DevOps", "Docker"],
    score: 891,
  },
];

// ── Mock GitHub Trending ──

export const mockTrendingRepos: TrendingRepo[] = [
  {
    id: "1",
    name: "awesome-ai-agents",
    fullName: "e2b-dev/awesome-ai-agents",
    description: "A list of AI autonomous agents — tools, platforms, and frameworks.",
    url: "https://github.com/e2b-dev/awesome-ai-agents",
    stars: 12400,
    starsToday: 342,
    language: "Python",
    languageColor: "#3572A5",
  },
  {
    id: "2",
    name: "open-webui",
    fullName: "open-webui/open-webui",
    description: "User-friendly AI interface — supports Ollama, OpenAI, etc.",
    url: "https://github.com/open-webui/open-webui",
    stars: 58200,
    starsToday: 287,
    language: "TypeScript",
    languageColor: "#3178c6",
  },
  {
    id: "3",
    name: "dify",
    fullName: "langgenius/dify",
    description: "Open-source LLM app development platform with RAG pipeline.",
    url: "https://github.com/langgenius/dify",
    stars: 89100,
    starsToday: 198,
    language: "Python",
    languageColor: "#3572A5",
  },
  {
    id: "4",
    name: "bun",
    fullName: "oven-sh/bun",
    description:
      "Incredibly fast JavaScript runtime, bundler, test runner, and package manager.",
    url: "https://github.com/oven-sh/bun",
    stars: 76300,
    starsToday: 156,
    language: "Zig",
    languageColor: "#ec915c",
  },
  {
    id: "5",
    name: "biome",
    fullName: "biomejs/biome",
    description:
      "High-performance toolchain for web projects — linter, formatter, and more.",
    url: "https://github.com/biomejs/biome",
    stars: 18900,
    starsToday: 134,
    language: "Rust",
    languageColor: "#dea584",
  },
];

// ── Mock Emploi (France Travail style) ──

export const mockJobOffers: JobOffer[] = [
  {
    id: "1",
    title: "Développeur Full Stack React/Node.js",
    company: "TechCorp Lyon",
    location: "Lyon (69)",
    contract: "CDI",
    url: "#",
    date: "Aujourd'hui",
  },
  {
    id: "2",
    title: "Développeur Python / Machine Learning",
    company: "DataLab",
    location: "Paris (75)",
    contract: "CDI",
    url: "#",
    date: "Hier",
  },
  {
    id: "3",
    title: "DevOps Engineer — AWS / Kubernetes",
    company: "CloudNine",
    location: "Remote",
    contract: "CDI",
    url: "#",
    date: "Hier",
  },
  {
    id: "4",
    title: "Alternance — Développeur Web Java/Angular",
    company: "IT-Akademy",
    location: "Lyon (69)",
    contract: "Alternance",
    url: "#",
    date: "Il y a 2j",
  },
  {
    id: "5",
    title: "Formateur Référent — Cybersécurité",
    company: "CyberSchool",
    location: "Marseille (13)",
    contract: "CDD",
    url: "#",
    date: "Il y a 3j",
  },
];
