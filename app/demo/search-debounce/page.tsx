"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";

interface Repo {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

type Status = "idle" | "loading" | "done" | "error";

const PER_PAGE = 9;

export default function SearchDebounceDemo() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const debounced = useDebounce(query.trim(), 400);

  // Reset pagination whenever the query changes
  useEffect(() => {
    setPage(1);
    setRepos([]);
    setTotalCount(0);
  }, [debounced]);

  useEffect(() => {
    const controller = new AbortController();

    if (!debounced) {
      setStatus("idle");
      return () => controller.abort();
    }

    setStatus("loading");
    setError("");

    fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(debounced)}&per_page=${PER_PAGE}&page=${page}&sort=stars`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 403 ? "Rate limit hit — wait a moment." : `GitHub error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTotalCount(data.total_count ?? 0);
        setRepos((prev) => page === 1 ? (data.items ?? []) : [...prev, ...(data.items ?? [])]);
        setStatus("done");
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, [debounced, page]);

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const isLoading = status === "loading" && page === 1;
  const isLoadingMore = status === "loading" && page > 1;
  const hasMore = repos.length < totalCount;

  return (
    <main className="min-h-screen bg-background text-foreground px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Search + Debounce</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Searches GitHub repositories — API call fires 400 ms after you stop typing.
      </p>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search GitHub repositories…"
        loading={isLoading}
        loadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        skeletonCount={9}
        className="max-w-4xl"
      >
        {repos.length > 0 && (
          <>
            {status === "done" && debounced && (
              <p className="text-xs text-muted-foreground mb-4">
                Showing {repos.length} of {totalCount.toLocaleString()} results for{" "}
                <span className="font-medium text-foreground">"{debounced}"</span>
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 hover:border-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs text-muted-foreground truncate">{repo.owner.login}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug truncate">
                    {repo.full_name.split("/")[1]}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-1">
                    {repo.language && (
                      <span className="text-xs text-muted-foreground">{repo.language}</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      ★ {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </SearchInput>

      {status === "error" && (
        <p className="text-sm text-destructive mt-4">{error}</p>
      )}
      {status === "idle" && (
        <p className="text-sm text-muted-foreground mt-4">Start typing to search.</p>
      )}
    </main>
  );
}
