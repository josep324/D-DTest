import { createFileRoute } from "@tanstack/react-router";
import { Thornwake } from "@/components/thornwake/Thornwake";

export const Route = createFileRoute("/")({
  component: Thornwake,
});
