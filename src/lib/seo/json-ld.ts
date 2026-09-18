/**
 * Serializes a JSON-LD payload for a <script type="application/ld+json">
 * tag. Escapes "<" so a value containing "</script>" (e.g. admin-entered
 * company info) can't break out of the script tag when injected via
 * dangerouslySetInnerHTML.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
