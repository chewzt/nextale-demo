import { SITE } from "./content";

export function buildRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Llms-txt: ${SITE.url}/llms.txt`,
  ].join("\n");
}
