import type { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { getBaseHeaders } from "~/util/msHeaders";

const requestQuerySchema = z.object({
  url: z.string().url(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | { error?: string }>,
) {
  try {
    const { url } = requestQuerySchema.parse(req.query);

    const response = await fetch(url, {
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
