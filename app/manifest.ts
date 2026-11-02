import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CASHFLOW • Assistente Digital de Balanço Econômico",
    short_name: "Cashflow",
    description:
      "Ficha digital de balanço econômico para o jogo de tabuleiro Cashflow 101/202 (Pai Rico, Pai Pobre). Corrida dos Ratos e Pista Rápida 100% offline.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#18091d",
    theme_color: "#3b1443",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

