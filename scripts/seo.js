// Generates public/sitemap.xml and public/robots.txt before each build.
// The site URL comes from SITE_URL, or from Vercel's production URL variable.
import { writeFileSync, mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });

let host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
host = host.trim().replace(/\/+$/, "");
if (host && !/^https?:\/\//.test(host)) host = "https://" + host;

let robots = "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/\n";

if (host) {
  const today = new Date().toISOString().slice(0, 10);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `  <url>\n    <loc>${host}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n` +
    "</urlset>\n";
  writeFileSync("public/sitemap.xml", xml);
  robots += `Sitemap: ${host}/sitemap.xml\n`;
  console.log("seo: wrote sitemap.xml for " + host);
} else {
  console.warn("seo: no SITE_URL found, sitemap.xml skipped. Set SITE_URL in Vercel and redeploy.");
}

writeFileSync("public/robots.txt", robots);
