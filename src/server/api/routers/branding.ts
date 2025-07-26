import { z } from "zod";
import { getResourceUrls } from "~/pages/api/assetProxy";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBaseHeaders } from "~/util/msHeaders";

/**
 * simplified response schema for /common/GetCredentialType endpoint response.
 * a lot of properties not relevant to branding are omitted.
 */
const credentialTypeSchema = z.object({
  Username: z.string(),
  Display: z.string(),
  EstsProperties: z.object({
    UserTenantBranding: z
      .array(
        z.object({
          BannerLogo: z.string().optional(),
          TileLogo: z.string().optional(),
          TileDarkLogo: z.string().optional(),
          Illustration: z.string().optional(), // background image
          BackgroundColor: z.string().optional(),
          BoilerPlateText: z.string().optional(),
          UserIdLabel: z.string().optional(),
          Favicon: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const brandingRouter = createTRPCRouter({
  getBranding: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const response = await fetch(
        "https://login.microsoftonline.com/common/GetCredentialType",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
            ...getBaseHeaders("api"),
          },
          body: JSON.stringify({
            username: input.username,
          }),
        },
      );

      const credentialType = credentialTypeSchema.parse(await response.json());
      const brandingData =
        credentialType.EstsProperties.UserTenantBranding?.at(0);

      return {
        userDisplayName: credentialType.Display,
        boilerplateText: brandingData?.BoilerPlateText,
        assets: getResourceUrls({
          BannerLogo: brandingData?.BannerLogo,
          Illustration: brandingData?.Illustration,
        }),
      };
    }),
});
