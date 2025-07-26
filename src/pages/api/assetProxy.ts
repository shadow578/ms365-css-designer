import { pbkdf2Sync } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { env } from "~/env";
import { getBaseUrl } from "~/util/baseUrl";
import { getBaseHeaders } from "~/util/msHeaders";

function getResourceHash(resource: string): string {
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

    const proxyUrl = new URL("/api/assetProxy", getBaseUrl());
    proxyUrl.searchParams.set("resource", targetUrl);
    proxyUrl.searchParams.set("hash", getResourceHash(targetUrl));
    urls[name] = proxyUrl.toString();
  }

  return urls as Record<keyof T, string | undefined>;
}

const requestQuerySchema = z.object({
  resource: z.string(),
  hash: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | { error?: string }>,
) {
  try {
    const { resource, hash } = requestQuerySchema.parse(req.query);
    if (!resource || !hash) {
      return res.status(400).send({ error: "Invalid request parameters." });
    }

    if (hash !== getResourceHash(resource)) {
      return res.status(400).send({});
    }

    const response = await fetch(resource, {
      method: "GET",
      headers: {
        Accept:
          "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
        ...getBaseHeaders("assets"),
      },
    });

    const contentType =
      response.headers.get("Content-Type") ?? "application/octet-stream";
    const data = Buffer.from(await response.arrayBuffer());

    res
      .status(response.status)
      .setHeader("Content-Type", contentType)
      .setHeader("Cache-Control", "no-cache")
      .setHeader("Pragma", "no-cache")
      .setHeader("Expires", "0")
      .send(data);
  } catch (error) {
    res.status(500).send({
      error:
        (error as Error).message ||
        "An error occurred while fetching the asset.",
    });
  }
}
