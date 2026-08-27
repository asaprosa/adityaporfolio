import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/projects";
import { personal } from "@/data/personal";
import { ProjectGallery } from "@/components/ProjectGallery";
import { TechStackTags } from "@/components/TechStackTags";
import { MotionCta } from "@/components/MotionCta";


type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — ${personal.name}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const isInternalLink = project.link?.startsWith("/");
  const [heroImage, ...galleryImages] = project.images;

  return (
    <>
      
      <main className="px-6 pb-28 pt-32 md:px-10">
        <div className="mx-auto max-w-content">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={15} />
            Back to portfolio
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm text-muted">{project.subtitle}</p>
              <h1 className="grain-text mt-2 max-w-2xl text-4xl font-semibold tracking-tightest2 sm:text-5xl">
                {project.title}
              </h1>
            </div>
            <div className="flex gap-3">
              {project.link && (
                <MotionCta
                  href={project.link}
                  external={!isInternalLink}
                  className="inline-flex items-center gap-1.5 rounded-control bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                >
                  {project.linkLabel ?? "View live"}
                  <ArrowUpRight size={15} />
                </MotionCta>
              )}
              {project.repo && (
                <MotionCta
                  href={project.repo}
                  external
                  className="inline-flex items-center gap-1.5 rounded-control border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <Github size={15} />
                  Source
                </MotionCta>
              )}
            </div>
          </div>

          {project.secondaryLink && (
            <p className="mt-3">
              <Link
                href={project.secondaryLink}
                className="inline-flex items-center gap-1 text-sm text-muted underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                {project.secondaryLinkLabel ?? "Also see"}
                <ArrowUpRight size={13} />
              </Link>
            </p>
          )}

          <ProjectGallery heroImage={heroImage} galleryImages={galleryImages} />

          <div className="mt-14 grid gap-14 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Overview</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">{project.description}</p>

              <h2 className="mt-12 text-sm font-medium uppercase tracking-wide text-muted">
                What it does
              </h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-base leading-relaxed text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Tech stack</h2>
              <TechStackTags tech={project.tech} />

              {!project.link && !project.repo && (
                <p className="mt-8 text-sm leading-relaxed text-muted">
                  This is a private/internal project — no public link or repository is available.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
