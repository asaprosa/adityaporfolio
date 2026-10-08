"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PROVIDERS, type ProviderId } from "@/lib/resumeProviders";
import type { ResumeAnalysis } from "@/lib/extractJson";

type Status = "idle" | "loading" | "success" | "error";

const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];
const KEY_STORAGE_PREFIX = "resume-builder:key:";

export function ResumeBuilderForm() {
  const [provider, setProvider] = useState<ProviderId>("groq");
  const [apiKey, setApiKey] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  // Keys live only in this browser's sessionStorage, per provider — never sent anywhere but our proxy.
  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE_PREFIX + provider);
    setApiKey(stored ?? "");
  }, [provider]);

  function handleApiKeyChange(value: string) {
    setApiKey(value);
    if (value) {
      sessionStorage.setItem(KEY_STORAGE_PREFIX + provider, value);
    } else {
      sessionStorage.removeItem(KEY_STORAGE_PREFIX + provider);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey, resume, jobDescription }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setResult(body as ResumeAnalysis);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="provider" className="text-sm font-medium text-ink">
            Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as ProviderId)}
            className="mt-2 w-full rounded-control border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink/50"
          >
            {PROVIDER_IDS.map((id) => (
              <option key={id} value={id}>
                {PROVIDERS[id].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="apiKey" className="text-sm font-medium text-ink">
            Your {PROVIDERS[provider].label} API key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            required
            autoComplete="off"
            placeholder="Pasted here, used once, never stored on our servers"
            className="mt-2 w-full rounded-control border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink/50"
          />
          <p className="mt-1.5 text-xs text-muted">
            Kept only in this browser tab&apos;s session storage and sent straight through to{" "}
            {PROVIDERS[provider].label} for this request. We never log or persist it.
          </p>
        </div>

        <div>
          <label htmlFor="resume" className="text-sm font-medium text-ink">
            Your resume
          </label>
          <textarea
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            required
            rows={10}
            placeholder="Paste your resume as plain text"
            className="mt-2 w-full resize-y rounded-control border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink/50"
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="text-sm font-medium text-ink">
            Job description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={8}
            placeholder="Paste the job description you're targeting"
            className="mt-2 w-full resize-y rounded-control border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink/50"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-control bg-ink py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Analyzing…" : "Tailor & score my resume"}
        </button>

        {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="grain-surface rounded-card bg-ink p-8 lg:sticky lg:top-28">
        {status === "idle" && (
          <p className="text-sm text-paper/60">
            Results will appear here once you submit a resume and job description.
          </p>
        )}
        {status === "loading" && <p className="text-sm text-paper/60">Analyzing against the job description…</p>}
        {result && (
          <div className="space-y-8">
            <div>
              <p className="text-sm text-paper/50">ATS compatibility score</p>
              <p className="mt-1 text-5xl font-semibold text-paper">{result.atsScore}<span className="text-xl text-paper/50">/100</span></p>
            </div>

            {result.missingKeywords.length > 0 && (
              <div>
                <p className="text-sm text-paper/50">Missing keywords</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <span key={kw} className="rounded-control border border-paper/20 px-2.5 py-1 text-xs text-paper">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div>
                <p className="text-sm text-paper/50">Suggestions</p>
                <ul className="mt-3 space-y-2">
                  {result.suggestions.map((s) => (
                    <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-paper/80">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-paper/50" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm text-paper/50">Tailored resume</p>
              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-control bg-paper/5 p-4 text-xs leading-relaxed text-paper/90">
                {result.tailoredResume}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
