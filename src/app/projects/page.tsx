import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectIndex } from "@/components/effects/ProjectIndexEffect";
import { personal } from "@/data/personal";
import { effects } from "@/config/effects";

export const metadata: Metadata = {
  title: `Projects — ${personal.name}`,
  description: "Every project in one list.",
};

export default function ProjectsPage() {
  if (!effects.projectIndex) notFound();

  return (
    <>
      <Nav />
      <main className="px-6 pb-28 pt-32 md:px-10">
        <div className="mx-auto max-w-content">
          <h1 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">Projects</h1>
          <ProjectIndex />
        </div>
      </main>
      <Footer />
    </>
  );
}
