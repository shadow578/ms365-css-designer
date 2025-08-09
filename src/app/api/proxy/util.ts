import { pbkdf2Sync } from "crypto";
import { env } from "~/env";
import { getBaseUrl } from "~/util/baseUrl";

function getHash(resource: string, expires: number): string {
  return pbkdf2Sync(
    resource + expires.toString(),
    env.NODE_ENV,
    1000,
    64,
    "sha256",
  ).toString("base64url");
}

export function validateResourceRequest(
  resource: string,
  expires: number,
  hash: string,
) {
  if (hash !== getHash(resource, expires)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return expires > now;
}

export function getResourceUrls<T extends Record<string, string | undefined>>(
  assets: T,
  expiresIn: number = 60 * 5, // 5 minutes
): Record<keyof T, string | undefined> {
  const urls: Record<string, string | undefined> = {};
  for (const [name, targetUrl] of Object.entries(assets)) {
    if (!targetUrl) {
      urls[name] = undefined;
      continue;
    }

    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const proxyUrl = new URL("/api/proxy", getBaseUrl());
    proxyUrl.searchParams.set("resource", targetUrl);
    proxyUrl.searchParams.set("expires", expiresAt.toString());
    proxyUrl.searchParams.set("hash", getHash(targetUrl, expiresAt));
    urls[name] = proxyUrl.toString();
  }

  return urls as Record<keyof T, string | undefined>;
}
