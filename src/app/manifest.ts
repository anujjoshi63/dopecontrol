import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dope Control",
    short_name: "Dope Control",
    description: "Control your dope with ease. Don't just have fun, earn it.",
    shortcuts: [
      {
        name: "Home",
        short_name: "Home",
        url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // logs
      {
        name: "Logs",
        short_name: "Logs",
        url: "/logs",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    ],
    categories: ["productivity"],
    scope: "/",
    lang: "en-US",
    dir: "ltr",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#165046",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
