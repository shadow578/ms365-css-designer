import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useQueryParams(query?: Record<string, string>) {
  useEffect(() => {
    if (!query) return;

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

  const params = useSearchParams();
  const queryParams: Record<string, string> = {};
  params.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
}
