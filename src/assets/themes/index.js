const themes = {
  apple: {
    background: "#f5f5f7",
    card: "#ffffff",
    text: "#0b0b0c",
    shadow: "rgba(0,0,0,0.12)",
    radius: 28,
    accent: "#0a84ff"
  },
  white: {
    background: "#ffffff",
    card: "#ffffff",
    text: "#111111",
    shadow: "rgba(0,0,0,0.08)",
    radius: 24,
    accent: "#111111"
  },
  black: {
    background: "#000000",
    card: "#000000",
    text: "#ffffff",
    shadow: "rgba(255,255,255,0.05)",
    radius: 24,
    accent: "#ffffff"
  },
  dark: {
    background: "#121212",
    card: "#1c1c1e",
    text: "#f2f2f2",
    shadow: "rgba(0,0,0,0.4)",
    radius: 26,
    accent: "#9b9b9b"
  },
  brat: {
    background: "#8ace00",
    card: "#8ace00",
    text: "#101010",
    shadow: "rgba(0,0,0,0.15)",
    radius: 0,
    accent: "#101010"
  },
  lime: {
    background: "#c6f135",
    card: "#c6f135",
    text: "#1a1a1a",
    shadow: "rgba(0,0,0,0.1)",
    radius: 12,
    accent: "#1a1a1a"
  },
  purple: {
    background: "#6a4bff",
    card: "#6a4bff",
    text: "#ffffff",
    shadow: "rgba(0,0,0,0.2)",
    radius: 26,
    accent: "#ffffff"
  },
  pink: {
    background: "#ff9ecb",
    card: "#ff9ecb",
    text: "#3a0d24",
    shadow: "rgba(0,0,0,0.12)",
    radius: 26,
    accent: "#3a0d24"
  },
  orange: {
    background: "#ff7a1a",
    card: "#ff7a1a",
    text: "#241000",
    shadow: "rgba(0,0,0,0.15)",
    radius: 26,
    accent: "#241000"
  },
  sky: {
    background: "#8fd9ff",
    card: "#8fd9ff",
    text: "#052a3a",
    shadow: "rgba(0,0,0,0.1)",
    radius: 26,
    accent: "#052a3a"
  },
  forest: {
    background: "#1f4d2c",
    card: "#26603a",
    text: "#eaf6ea",
    shadow: "rgba(0,0,0,0.35)",
    radius: 24,
    accent: "#c8f2c8"
  },
  coffee: {
    background: "#4b3121",
    card: "#5c3d29",
    text: "#f5e6d8",
    shadow: "rgba(0,0,0,0.35)",
    radius: 24,
    accent: "#e0b88a"
  },
  sand: {
    background: "#e8d9b5",
    card: "#f1e6c8",
    text: "#41341b",
    shadow: "rgba(0,0,0,0.1)",
    radius: 24,
    accent: "#41341b"
  },
  rose: {
    background: "#c9184a",
    card: "#e0355f",
    text: "#ffffff",
    shadow: "rgba(0,0,0,0.2)",
    radius: 26,
    accent: "#ffe3ec"
  }
};

function resolveTheme(name) {
  if (typeof name !== "string") return themes.apple;
  const key = name.toLowerCase().trim();
  return themes[key] || themes.apple;
}

module.exports = { themes, resolveTheme };
