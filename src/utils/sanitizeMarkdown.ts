export function sanitizeMarkdown(markdown: string): string {
  if (!markdown) return '';

  return (
    markdown
      // 1. Fix autolinks: <https://...> -> [https://...](https://...)
      // MDX parser interprets <url> as JSX tags
      .replace(/<((?:https?|ftp):\/\/[^>]+)>/g, (_, url) => {
        return `[${url}](${url})`;
      })

      // 2. Fix email autolinks: <email@domain.com> -> [email](mailto:email)
      .replace(/<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g, (_, email) => {
        return `[${email}](mailto:${email})`;
      })

      // 3. Escape raw HTML-like tags that aren't valid JSX
      // Convert <tag> to &lt;tag&gt; if not a known HTML element
      .replace(/<(?!\/?(?:br|hr|p|div|span|strong|em|a|ul|ol|li|h[1-6]|blockquote|code|pre|table|thead|tbody|tr|th|td|img|input|button|form|select|option|textarea)[\s>])([^>\s][^>]*)>/g, (_, tag) => {
        return `&lt;${tag}&gt;`;
      })

      // 4. Fix unclosed angle brackets that aren't markdown
      // e.g., "text < something" -> "text &lt; something"
      .replace(/(?<!\n)\s<([^>\s][^<]*?)(?=\s|$)/g, ' &lt;$1')

      // 5. Fix broken links: [text](url without closing paren
      .replace(/\[([^\]]*)\]\((?!.*\))([^)]*)$/gm, (_, text, url) => {
        return `[${text}](${url})`;
      })

      // 6. Escape standalone < and > that could be misinterpreted
      // Only if they're not part of markdown syntax (links, images, etc.)
      .replace(/(?<![\[\(])<(?![\[\(\/!a-zA-Z#])/g, '&lt;')
      .replace(/(?<![\w\)])>(?![\]\)])/g, '&gt;')

      // 7. Fix underscores in URLs that could be interpreted as italic markers
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, (match, text, url) => {
        // Escape underscores in URLs
        const escapedUrl = url.replace(/_/g, '\\_');
        return `[${text}](${escapedUrl})`;
      })
  );
}
