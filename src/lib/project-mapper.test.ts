import { describe, expect, it } from "vitest";

import {
  bulletsFromResume,
  deriveCategory,
  hasPortfolioTopic,
  mergeProject,
  parsePortfolioJson,
  rewriteReadmeImages,
  sortProjects,
  topicsToTech,
} from "./project-mapper";
import type { GitHubRepo, Project } from "./types";

const baseRepo: GitHubRepo = {
  name: "demo",
  full_name: "immortalxmachine/demo",
  html_url: "https://github.com/immortalxmachine/demo",
  description: "A demo repo",
  topics: ["portfolio", "python", "fastapi"],
  stargazers_count: 3,
  pushed_at: "2026-01-01T00:00:00Z",
  homepage: "",
  default_branch: "main",
  fork: false,
  archived: false,
  owner: { avatar_url: "https://avatars/1" },
};

describe("hasPortfolioTopic", () => {
  it("is true only when the portfolio topic is present", () => {
    expect(hasPortfolioTopic(["portfolio", "python"])).toBe(true);
    expect(hasPortfolioTopic(["python"])).toBe(false);
    expect(hasPortfolioTopic(undefined)).toBe(false);
  });
});

describe("topicsToTech", () => {
  it("drops the portfolio control topic", () => {
    expect(topicsToTech(["portfolio", "python", "fastapi"])).toEqual(["python", "fastapi"]);
    expect(topicsToTech(undefined)).toEqual([]);
  });
});

describe("parsePortfolioJson", () => {
  it("parses valid JSON objects", () => {
    expect(parsePortfolioJson('{"title":"X","featured":true}')).toEqual({
      title: "X",
      featured: true,
    });
  });
  it("returns null for invalid / empty / non-object input", () => {
    expect(parsePortfolioJson("not json")).toBeNull();
    expect(parsePortfolioJson(null)).toBeNull();
    expect(parsePortfolioJson("42")).toBeNull();
    expect(parsePortfolioJson("null")).toBeNull();
  });
});

describe("bulletsFromResume", () => {
  it("extracts dash/star bullets and trims them", () => {
    const md = "# Title\n\n- First bullet\n* Second bullet\nnot a bullet\n-   Third  ";
    expect(bulletsFromResume(md)).toEqual(["First bullet", "Second bullet", "Third"]);
  });
  it("handles null", () => {
    expect(bulletsFromResume(null)).toEqual([]);
  });
});

describe("deriveCategory", () => {
  it("honours an explicit category from portfolio.json", () => {
    expect(deriveCategory({ category: "Software" }, ["python"], ["Python"])).toBe("Software");
  });
  it("infers GenAI / AI-ML / Data from topics", () => {
    expect(deriveCategory(null, ["langchain", "rag"], [])).toBe("GenAI");
    expect(deriveCategory(null, ["pytorch", "cnn"], [])).toBe("AI/ML");
    expect(deriveCategory(null, ["etl", "sarima"], [])).toBe("Data");
  });
  it("falls back to Python → AI/ML, else Software", () => {
    expect(deriveCategory(null, ["misc"], ["Python"])).toBe("AI/ML");
    expect(deriveCategory(null, ["misc"], ["Java"])).toBe("Software");
  });
});

describe("rewriteReadmeImages", () => {
  it("rewrites relative markdown images to raw URLs", () => {
    const out = rewriteReadmeImages("![x](docs/a.png)", "u", "r", "main");
    expect(out).toBe("![x](https://raw.githubusercontent.com/u/r/main/docs/a.png)");
  });
  it("rewrites ./-prefixed and HTML <img> paths", () => {
    expect(rewriteReadmeImages("![x](./a.png)", "u", "r", "main")).toContain(
      "https://raw.githubusercontent.com/u/r/main/a.png",
    );
    expect(rewriteReadmeImages('<img src="b.png">', "u", "r", "main")).toContain(
      'src="https://raw.githubusercontent.com/u/r/main/b.png"',
    );
  });
  it("leaves absolute URLs and anchors untouched", () => {
    const abs = "![x](https://cdn.com/a.png)";
    expect(rewriteReadmeImages(abs, "u", "r", "main")).toBe(abs);
  });
});

describe("sortProjects", () => {
  const make = (over: Partial<Project>): Project =>
    ({
      slug: "s",
      name: "s",
      title: "s",
      tagline: "",
      category: "Software",
      description: "",
      highlights: [],
      metrics: [],
      techTopics: [],
      languages: [],
      stars: 0,
      updatedAt: "2026-01-01T00:00:00Z",
      featured: false,
      order: 999,
      repoUrl: "",
      homepage: null,
      demoUrl: null,
      defaultBranch: "main",
      ownerAvatar: null,
      readme: null,
      ...over,
    }) as Project;

  it("orders featured first, then by order, then recency", () => {
    const a = make({ slug: "a", featured: false, order: 999, updatedAt: "2026-01-01T00:00:00Z" });
    const b = make({ slug: "b", featured: true, order: 2 });
    const c = make({ slug: "c", featured: true, order: 1 });
    const d = make({ slug: "d", featured: false, order: 999, updatedAt: "2026-05-01T00:00:00Z" });
    const sorted = sortProjects([a, b, c, d]).map((p) => p.slug);
    expect(sorted).toEqual(["c", "b", "d", "a"]);
  });
});

describe("mergeProject", () => {
  it("prefers portfolio.json fields and falls back to repo data", () => {
    const project = mergeProject({
      repo: baseRepo,
      portfolioJson: {
        title: "Demo App",
        tagline: "A nice demo",
        category: "GenAI",
        featured: true,
        order: 2,
        demo: "https://demo.app",
        metrics: [{ label: "tests", value: "21" }],
        highlights: ["one", "two"],
      },
      languages: ["Python"],
      resumeBullets: ["bullet from resume"],
    });

    expect(project.title).toBe("Demo App");
    expect(project.category).toBe("GenAI");
    expect(project.featured).toBe(true);
    expect(project.order).toBe(2);
    expect(project.demoUrl).toBe("https://demo.app");
    expect(project.highlights).toEqual(["one", "two"]);
    expect(project.techTopics).toEqual(["python", "fastapi"]);
    expect(project.stars).toBe(3);
  });

  it("falls back to repo name, description, resume bullets, and homepage demo", () => {
    const project = mergeProject({
      repo: { ...baseRepo, homepage: "https://home.page" },
      portfolioJson: null,
      languages: ["Python"],
      resumeBullets: ["a", "b", "c", "d"],
    });

    expect(project.title).toBe("demo");
    expect(project.tagline).toBe("A demo repo");
    expect(project.highlights).toEqual(["a", "b", "c"]); // capped at 3
    expect(project.order).toBe(999);
    expect(project.featured).toBe(false);
    expect(project.demoUrl).toBe("https://home.page");
    expect(project.category).toBe("AI/ML"); // python fallback
  });
});
