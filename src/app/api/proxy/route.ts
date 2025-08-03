import z from "zod";
import { getBaseHeaders } from "~/util/msHeaders";
import { type NextRequest } from "next/server";
import { getResourceHash } from "./util";

const requestQuerySchema = z.object({
  resource: z.string(),
  hash: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get("resource");
    const hash = searchParams.get("hash");

    const parsed = requestQuerySchema.safeParse({ resource, hash });
    if (!parsed.success || !resource || !hash) {
      return new Response(
        JSON.stringify({ error: "Invalid request parameters." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (hash !== getResourceHash(resource)) {
      return new Response(JSON.stringify({}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          (error as Error).message ||
          "An error occurred while fetching the asset.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
