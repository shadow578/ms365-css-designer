/**
 * user agent matching Chrome 134 on Windows 11.
 */
const userAgent =
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.166 Safari/537.36";

/**
 * get a base set of headers used for requests to Microsoft login endpoints.
 * set to somewhat obfuscate the request as a normal browser request.
 */
export function getBaseHeaders(purpose: "api" | "assets") {
  switch (purpose) {
    case "api":
      return {
        Host: "login.microsoftonline.com",
        Origin: "https://login.microsoftonline.com",
        Referer: "https://login.microsoftonline.com/",
        "User-Agent": userAgent,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      };
    case "assets":
      return {
        Host: "aadcdn.msauthimages.net",
        Origin: "https://login.microsoftonline.com",
        Referer: "https://login.microsoftonline.com/",
        "User-Agent": userAgent,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      };
  }
}
