/**
 * Static profile content — everything on the site that is NOT a project.
 *
 * Projects are pulled live from GitHub (see `src/lib/github.ts`); this file is
 * the single source of truth for the about, skills, research, achievements and
 * leadership content. Edit this file and push to update the site.
 *
 * NOTE: `skillGroups[].skills[].topics` are GitHub repo topics. They power the
 * interactive "hover a skill → highlight matching projects" behaviour: a
 * project lights up when its topics intersect the hovered skill's topics.
 */

export interface SkillItem {
  name: string;
  /** GitHub topics that indicate a project uses this skill. */
  topics: string[];
}

export interface SkillGroup {
  name: string;
  skills: SkillItem[];
}

export interface TimelineItem {
  role: string;
  org: string;
  period: string;
  description?: string;
  kind: "leadership" | "hackathon";
}

export interface QuickFact {
  label: string;
  value: string;
}

export const profile = {
  name: "Adhithyaa V P",
  /** Used for the generated favicon / app icon. */
  initials: "AV",
  roleLine: "AI · Data · Software Engineering",
  /** Rotating typewriter phrases in the hero. */
  typewriter: [
    "I build ML models",
    "I build data pipelines",
    "I build full-stack apps",
  ],
  status: "Open to internships · Class of 2027",
  location: "Chennai, India",
  email: "adhithyaaparamasivam6489@gmail.com",
  /** Public resume asset, served from /public. */
  resumePath: "/Adhithyaa_VP_Resume.pdf",

  links: {
    github: "https://github.com/immortalxmachine",
    githubUser: "immortalxmachine",
    linkedin:
      "https://www.linkedin.com/in/adhithyaa-paramasivam-506578317/",
  },

  about: {
    headline:
      "I build end-to-end software, data and AI systems — from Java and Python APIs to data pipelines, ML models and Generative-AI apps.",
    body: `Final-year B.Tech Computer Science (AI & ML) student at SRM Institute of Science and Technology, Kattankulathur (CGPA 7.56/10, Class of 2027). I build end-to-end software, data and AI systems, from Java and Python APIs to data pipelines, machine-learning models and Generative-AI apps. I research multi-modal deep learning and lead the SAP Tech Club at SRM, started in collaboration with SAP.`,
  },

  quickFacts: [
    { label: "Degree", value: "B.Tech CSE (AI & ML)" },
    { label: "University", value: "SRM IST, Kattankulathur" },
    { label: "CGPA", value: "7.56 / 10" },
    { label: "Location", value: "Chennai, India" },
    { label: "Graduating", value: "Class of 2027" },
    { label: "Focus", value: "AI · Data · Software" },
  ] satisfies QuickFact[],

  skillGroups: [
    {
      name: "Programming Languages",
      skills: [
        { name: "Python", topics: ["python"] },
        { name: "Java", topics: ["java"] },
        { name: "SQL", topics: ["sql", "postgresql", "mysql"] },
        { name: "TypeScript", topics: ["typescript"] },
        { name: "JavaScript", topics: ["javascript", "typescript", "react"] },
      ],
    },
    {
      name: "Data Structures & Algorithms",
      skills: [{ name: "DSA", topics: ["dijkstra", "algorithms"] }],
    },
    {
      name: "Software Engineering",
      skills: [
        { name: "OOP", topics: ["java", "spring-boot"] },
        { name: "REST APIs", topics: ["fastapi", "spring-boot"] },
        { name: "Spring Boot", topics: ["spring-boot"] },
        { name: "FastAPI", topics: ["fastapi"] },
        { name: "React.js", topics: ["react"] },
        { name: "JUnit", topics: ["junit", "spring-boot"] },
        { name: "pytest", topics: ["pytest"] },
      ],
    },
    {
      name: "SQL & Data",
      skills: [
        { name: "PostgreSQL", topics: ["postgresql"] },
        { name: "MySQL", topics: ["mysql"] },
        { name: "Supabase", topics: ["supabase"] },
        { name: "ETL pipelines", topics: ["etl", "elt", "data-engineering"] },
        { name: "pandas", topics: ["pandas"] },
        { name: "NumPy", topics: ["numpy"] },
        { name: "Power BI", topics: ["power-bi", "powerbi"] },
        { name: "Streamlit", topics: ["streamlit"] },
      ],
    },
    {
      name: "AI/ML & Generative AI",
      skills: [
        { name: "scikit-learn", topics: ["scikit-learn", "machine-learning"] },
        { name: "PyTorch", topics: ["pytorch", "deep-learning"] },
        { name: "CNNs", topics: ["cnn", "deep-learning"] },
        { name: "Transfer Learning", topics: ["transfer-learning"] },
        { name: "LangChain", topics: ["langchain"] },
        { name: "RAG", topics: ["rag", "retrieval-augmented-generation"] },
        { name: "FAISS", topics: ["faiss"] },
        { name: "Time-series Forecasting", topics: ["forecasting", "sarima"] },
      ],
    },
    {
      name: "Cloud & DevOps",
      skills: [
        { name: "Microsoft Azure", topics: ["azure"] },
        { name: "Docker", topics: ["docker"] },
        { name: "Git / GitHub", topics: ["git", "github"] },
        { name: "GitHub Actions CI/CD", topics: ["github-actions", "ci-cd"] },
        { name: "Linux", topics: ["linux"] },
      ],
    },
  ] satisfies SkillGroup[],

  research: {
    slug: "plant-disease-detection-multimodal",
    title:
      "Plant Disease Detection Using Multi-Modal Deep Learning: CNN, Deep Neural Networks, and Environmental Insights",
    venue: "Dept. of CSE, MNNIT Allahabad, Prayagraj",
    date: "Sep 2026",
    field: "Multi-modal Deep Learning",
    summary:
      "Combines CNN leaf-image features with environmental data in a multi-modal deep neural network to classify crop diseases.",
    abstract:
      "Image-only crop-disease classifiers ignore the growing conditions that drive many diseases. This work studies whether pairing a leaf photo with its environmental context improves recognition. A convolutional branch extracts visual features from the leaf image while a dense branch encodes structured environmental signals; the two are fused inside a single deep neural network that predicts the disease class. The model is served as an interactive Hugging Face Spaces demo so a leaf image plus environmental inputs can be classified live.",
    highlights: [
      "Multi-modal architecture: a CNN image branch and a dense environmental-feature branch are fused in one deep neural network, rather than classifying from the leaf image alone.",
      "Studies the added value of environmental context (the growing conditions that drive many crop diseases) on top of standard image features.",
      "Deployed as a live, interactive demo on Hugging Face Spaces for real-time inference from a leaf photo and environmental inputs.",
      "Built with PyTorch and a transfer-learning CNN backbone for the vision branch.",
    ],
    stack: [
      "PyTorch",
      "CNNs",
      "Transfer Learning",
      "Multi-modal Fusion",
      "Deep Neural Networks",
      "Hugging Face Spaces",
      "Python",
    ],
    paperUrl:
      "https://drive.google.com/file/d/1wuB-3ly9aK8pTdfsaAZwiTh0_Zzl3_jy/view?usp=sharing",
    demoUrl:
      "https://huggingface.co/spaces/immortalxmach/plant-disease-detection",
    /** Embeddable HF Space URL (direct iframe host for the Space above). */
    embedUrl: "https://immortalxmach-plant-disease-detection.hf.space",
  },

  achievements: [
    { label: "Top 5, HackStreet hackathon", date: "Mar 2025" },
    { label: "Top 10, Product 101 Hackathon", date: "Mar 2025" },
    { label: "Top 10, Webathon", date: "Mar 2025" },
  ],

  /** Experience & leadership timeline (most recent first). */
  timeline: [
    {
      role: "President, SAP Tech Club",
      org: "SRM IST",
      period: "Feb 2026 – Oct 2026",
      description:
        "Lead the SAP Tech Club, started in collaboration with SAP.",
      kind: "leadership",
    },
    {
      role: "PR Member, CINTEL Association",
      org: "SRM IST",
      period: "Oct 2025 – Jun 2026",
      kind: "leadership",
    },
    {
      role: "Volunteer, Discipline Team",
      org: "Directorate of Student Affairs, SRM IST",
      period: "Jan 2025 – Present",
      kind: "leadership",
    },
    {
      role: "Top 5 — HackStreet Hackathon",
      org: "Hackathon",
      period: "Mar 2025",
      kind: "hackathon",
    },
    {
      role: "Top 10 — Product 101 Hackathon",
      org: "Hackathon",
      period: "Mar 2025",
      kind: "hackathon",
    },
    {
      role: "Top 10 — Webathon",
      org: "Hackathon",
      period: "Mar 2025",
      kind: "hackathon",
    },
  ] satisfies TimelineItem[],
} as const;

/** Ordered nav sections. `id` must match each section's DOM id. */
export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
