import { createFileRoute } from "@tanstack/react-router";
import { HarmonyApp } from "@/components/HarmonyApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harmony — Find your people" },
      { name: "description", content: "Discover the right people in the room, and the people behind those people." },
      { property: "og:title", content: "Harmony — Find your people" },
      { property: "og:description", content: "Discover the right people in the room, and the people behind those people." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HarmonyApp,
});
