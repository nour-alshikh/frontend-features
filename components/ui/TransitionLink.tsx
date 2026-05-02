"use client";

import { useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Anchor tag that triggers the View Transitions API (Chrome/Edge) for smooth
 * page navigation. Falls back to router.push() in unsupported browsers.
 *
 * Add ::view-transition-old/new CSS rules in globals.css to customise the animation.
 */
export function TransitionLink({ href, className, children }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!("startViewTransition" in document)) {
      router.push(href);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).startViewTransition(() => router.push(href));
  }, [href, router]);

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
