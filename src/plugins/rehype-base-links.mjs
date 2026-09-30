/**
 * Prefix root-absolute links written in Markdown/MDX bodies with the site `base`.
 *
 * Why this is needed: Astro only applies `base` to links it generates itself (sidebar,
 * favicon, `_astro` assets, ...). A hand-written link such as `/zh/players/desktop/` is
 * emitted into the HTML verbatim. When the site is deployed under a subpath — a GitHub
 * Pages project site lives at https://<user>.github.io/<repo>/ — those links point at the
 * domain root and every one of them 404s.
 *
 * The alternative would be hard-coding the base into 140+ links (`/loader-wiki/zh/...`),
 * which has to be redone whenever the deployment address changes. Prefixing at build time
 * keeps the content independent of where the site is hosted: moving it means editing
 * astro.config.mjs only.
 *
 * The plugin deliberately avoids transitive dependencies such as `unist-util-visit` and
 * walks the hast tree directly.
 *
 * Scope: `<a>` and `<img>` in page bodies, i.e. Markdown links/images and JSX elements in
 * MDX. Frontmatter-driven links are NOT covered — for example `hero.actions[].link` on the
 * splash page is rendered verbatim by Starlight, so the base has to be written out there.
 */

/**
 * @param {{ base?: string }} options Site base, e.g. '/loader-wiki/'.
 * @returns {(tree: import('hast').Root) => void} A rehype plugin.
 */
export function rehypeBaseLinks({ base = '/' } = {}) {
	// Normalise to a prefix without a trailing slash. A `base` of '/' (site at the domain
	// root) needs no rewriting at all.
	const prefix = base.replace(/\/+$/, '');
	if (!prefix) return () => {};

	/**
	 * Rewrite same-site root-absolute paths only: skip external, protocol-relative,
	 * anchor-only and already-prefixed URLs.
	 */
	const withBase = (value) => {
		if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
		if (value === prefix || value.startsWith(prefix + '/')) return value;
		return prefix + value;
	};

	const walk = (node) => {
		if (node && node.type === 'element' && node.properties) {
			const attr = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : undefined;
			if (attr && attr in node.properties) {
				node.properties[attr] = withBase(node.properties[attr]);
			}
		}
		if (node && Array.isArray(node.children)) node.children.forEach(walk);
	};

	return (tree) => walk(tree);
}

export default rehypeBaseLinks;
