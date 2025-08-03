import { pbkdf2Sync } from "crypto";
import { env } from "~/env";
import { getBaseUrl } from "~/util/baseUrl";

export function getResourceHash(resource: string): string {
  return pbkdf2Sync(resource, env.NODE_ENV, 1000, 64, "sha256").toString(
    "base64url",
  );
}

export function getResourceUrls<T extends Record<string, string | undefined>>(
  assets: T,
): Record<keyof T, string | undefined> {
  const urls: Record<string, string | undefined> = {};
  for (const [name, targetUrl] of Object.entries(assets)) {
    if (!targetUrl) {
      urls[name] = undefined;
      continue;
    }

    const proxyUrl = new URL("/api/proxy", getBaseUrl());
    proxyUrl.searchParams.set("resource", targetUrl);
    proxyUrl.searchParams.set("hash", getResourceHash(targetUrl));
    urls[name] = proxyUrl.toString();
  }

  return urls as Record<keyof T, string | undefined>;
}
