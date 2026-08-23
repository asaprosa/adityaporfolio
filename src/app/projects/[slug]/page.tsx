import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/projects";
import { personal } from "@/data/personal";
import { RollingText } from "@/components/RollingTextButton";
import { motion } from "framer-motion";


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
      <div>Nav test</div>
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
              {project.link &&
                (isInternalLink ? (
                  <Link
                    href={project.link}
                    className="inline-flex items-center gap-1.5 rounded-control bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    {project.linkLabel ?? "View live"}
                    <ArrowUpRight size={15} />
                  </Link>
                ) : (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-control bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    {project.linkLabel ?? "View live"}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-control border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <Github size={15} />
                  Source
                </a>
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

          {heroImage && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-card">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(min-width: 1024px) 80rem, 100vw"
                priority
                className="object-cover object-top"
              />
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {galleryImages.map((img) => (
                <div key={img.src} className="relative aspect-[16/10] overflow-hidden rounded-card">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          )}

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
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-control border border-ink/15 px-3 py-1.5 text-sm text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>

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
