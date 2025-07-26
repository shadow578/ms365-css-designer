import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const credentialTypeSchema = z.object({
  // note: many things not relevant to branding are omitted
  Username: z.string(),
  Display: z.string(),
  EstsProperties: z.object({
    UserTenantBranding: z.array(
      z.object({
        BannerLogo: z.string(),
        TileLogo: z.string(),
        TileDarkLogo: z.string(),
        Illustration: z.string(), // Background image
        BackgroundColor: z.string(),
        BoilerPlateText: z.string(),
        UserIdLabel: z.string(),
        Favicon: z.string(),
      }),
    ),
  }),
});

export const brandingRouter = createTRPCRouter({
  getBranding: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const credentialTypeRaw: unknown = await fetch(
        "https://login.microsoftonline.com/common/GetCredentialType",
        {
          method: "POST",
          headers: {
            // mirror "normal" headers as best as possible
            // user-agent matches Chrome 134 on Windows 11
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Host: "login.microsoftonline.com",
            Origin: "https://login.microsoftonline.com",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36",
          },
          body: JSON.stringify({
            username: input.username,
          }),
        },
      ).then((r) => r.json());

      const credentialType = credentialTypeSchema.parse(credentialTypeRaw);

      console.log("Credential Type Response:", credentialType);

      const brandingData =
        credentialType.EstsProperties.UserTenantBranding.at(0);

      return {
        userDisplayName: credentialType.Display,
        branding: brandingData
          ? {
              bannerLogo: brandingData.BannerLogo,
              backgroundImage: brandingData.Illustration,
              boilerplateText: brandingData.BoilerPlateText,
            }
          : {},
      };
    }),
});
