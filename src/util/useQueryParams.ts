import { useEffect } from "react";

export default function useQueryParams(query: Record<string, string> = {}) {
  // update url when query changes
  useEffect(() => {
    // timer to avoid too many updates
    // otherwise, replaceState may throw a security error
    const timer = setTimeout(() => {
      const params = new URLSearchParams(query);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);
}
