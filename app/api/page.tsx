"use client";

import { Suspense, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Input,
} from "@headlessui/react";
import { useSearchParams } from "next/navigation";
import type { Plan, ScreenType } from "../data";

function safeParse<T>(value: string | null): T | null {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function GenerateForm() {
  const params = useSearchParams();
  const plan = useMemo(() => safeParse<Plan>(params.get("audience")), [params]);
  const screen = useMemo(
    () => safeParse<ScreenType>(params.get("screen")),
    [params],
  );

  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // modal state

  const basePrompt = useMemo(() => {
    if (!plan || !screen) return "";
    return `${screen.additionToPrompt} for ${plan.name} users (${plan.audience.join(
      ", ",
    )}). ${plan.description}`;
  }, [plan, screen]);

  async function generate() {
    if (loading || !prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrompt,
          prompt,
          previousHtml: html || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setHtml(data.html);
      setPrompt("");
      setOpen(true); // show the result as soon as it arrives
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!plan || !screen) {
    return <p className="text-white">Missing selections.</p>;
  }

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-md">
        <p className="text-base">
          The goal of this tool is to guide users through the visualization or
          narrative process of creating a decision theater.
        </p>

        <div className="flex flex-col items-start gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            className="w-full rounded bg-gray-500 px-2 py-1"
          />
          <div className="flex gap-2">
            <Button
              disabled={loading}
              onClick={generate}
              className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-hover:bg-sky-500 data-active:bg-sky-700 data-disabled:opacity-50"
            >
              {loading ? "Generating..." : html ? "Apply change" : "Generate"}
            </Button>

            {html && (
              <Button
                onClick={() => setOpen(true)}
                className="rounded bg-white/10 px-4 py-2 text-sm text-white data-hover:bg-white/20"
              >
                View result
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/60 duration-200 ease-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-gray-900 shadow-xl duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <DialogTitle className="text-sm font-semibold text-white">
                Generated page
              </DialogTitle>
              <Button
                onClick={() => setOpen(false)}
                className="rounded bg-white/10 px-3 py-1 text-sm text-white data-hover:bg-white/20"
              >
                Close
              </Button>
            </div>

            <iframe
              title="Generated page"
              srcDoc={html}
              sandbox="allow-scripts"
              className="w-full flex-1 bg-white"
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default function Generate() {
  return (
    <Suspense fallback={<p className="text-white">Loading...</p>}>
      <GenerateForm />
    </Suspense>
  );
}
