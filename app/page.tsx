"use client";

import { useState } from "react";
import { Button, Input } from "@headlessui/react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, previousHtml: html || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setHtml(data.html);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 mt-16 grid w-[calc(100vw-3rem)] max-w-3xl gap-8">
      <p className="text-xl">Decision Theater Tool Visualization</p>
      <p className="text-md">
        The goal of this tool is to guide users through the visualization or
        narrative process of creating a decision theater.
      </p>

      <div className="flex flex-col items-start gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          className="rounded bg-gray-500 px-2 py-1 w-full"
        />
        <Button
          disabled={loading}
          onClick={generate}
          className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-hover:bg-sky-500 data-active:bg-sky-700 data-disabled:opacity-50"
        >
          {loading ? "Generating..." : html ? "Apply change" : "Generate"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <p className="text-lg">Templates</p>
      <p>tbd</p>

      {html && (
        <iframe
          title="Generated page"
          srcDoc={html}
          sandbox="allow-scripts"
          className="w-full h-[600px] rounded border bg-white"
        />
      )}
    </div>
  );
}