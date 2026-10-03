// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { rehypeBaseLinks } from './src/plugins/rehype-base-links.mjs';

// GitHub Pages 项目站点的部署地址：站点挂在用户名域名下，仓库名作为子路径。
// 将来若绑定自定义域名，只需改这两行（并把 BASE 改回 '/'）。
const SITE = 'https://mdtcopper.github.io';
const BASE = '/loader-wiki/';

// https://astro.build/config
export default defineConfig({
	// site 决定 canonical、sitemap 与 OpenGraph 里的绝对地址。
	site: SITE,
	// base 必须与仓库名完全一致，否则 CSS、JS、图标都会 404。
	// Starlight 会自动给 favicon 补上 base，但正文里手写的 /zh/... 链接不会，
	// 所以下面用 rehypeBaseLinks 在构建期统一补齐（详见该插件文件里的注释）。
	base: BASE,
	markdown: {
		rehypePlugins: [[rehypeBaseLinks, { base: BASE }]],
	},
	// 站点根路径没有内容，统一跳到默认语言（中文）的首页。
	redirects: {
		'/': `${BASE}zh/`,
	},
	integrations: [
		// astro-mermaid 必须位于 Starlight 之前，才能正确接管 mermaid 代码块的转换。
		mermaid({ enableLog: false }),
		starlight({
			title: 'Copper Loader 文档',
			description: 'Copper 模组加载器官方文档：安装、使用与模组开发指南。',
			// 站点图标取自 launcher 的 assets/images/copper.png，与启动器用的是同一张。
			logo: { src: './src/assets/copper.png', alt: 'Copper' },
			favicon: '/copper.png',
			// 多语言：每种语言的正文放在同名子目录里（src/content/docs/zh/、src/content/docs/en/…）。
			// 未翻译的页面会自动回退显示默认语言的内容，并在页面顶部提示「尚未翻译」，
			// 所以新增语言时可以先只注册 locale，之后再往对应目录补译文。
			defaultLocale: 'zh',
			locales: {
				zh: {
					label: '简体中文',
					lang: 'zh-CN',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/MDTCopper/loader' }],
			// 侧边栏是「一套结构服务所有语言」：slug 与语言无关，Starlight 会按当前语言把它
			// 解析到对应目录下的页面（developers/cli → zh 解析到 zh/…、en 解析到 en/…），
			// 所以新增语言时这里不需要复制一份结构。
			//
			// 标签翻译写在每一项（分组或链接）的 translations 里，键是上面 locales 里的 lang，
			// 也就是 BCP-47 标签 'en' / 'zh-CN'——注意不是 locale 名 'zh'：
			//   { label: '玩家指南', translations: { en: 'Player Guide' }, items: [...] }
			//
			// 目前所有项都没有写 translations，因此各语言都回退显示 label（中文）。
			// 这是有意的：译文就绪前先不翻译，届时只补 translations、不动结构。
			sidebar: [
				{
					label: '玩家指南',
					items: [
						{ label: '总览', slug: 'players' },
						{ label: '使用桌面版', slug: 'players/desktop' },
						{ label: '使用移动版', slug: 'players/mobile' },
					],
				},
				{
					label: '开发者指南',
					items: [
						{ label: '总览与阅读顺序', slug: 'developers' },
						{ label: '快速开始', slug: 'developers/getting-started' },
						{ label: '模组元数据', slug: 'developers/mod-meta' },
						{ label: '主类与生命周期', slug: 'developers/main-class' },
						{ label: '命名与映射', slug: 'developers/naming' },
						{ label: '版本、依赖与冲突', slug: 'developers/versions' },
						{ label: '类隔离机制', slug: 'developers/class-visibility' },
						{ label: '网络数据包', slug: 'developers/networking' },
						{ label: '数据、设置与本地化', slug: 'developers/data' },
						{ label: '加载器命令行', slug: 'developers/cli' },
						{ label: '启动报错', slug: 'developers/startup-errors' },
						{
							label: 'Android 平台',
							items: [
								{ label: 'ART 平台', slug: 'developers/android-art' },
								{ label: 'android-bridge 平台', slug: 'developers/android-bridge' },
							],
						},
						{ label: '收录到模组浏览器', slug: 'developers/browser-listing' },
					],
				},
				{
					label: 'Mixin',
					items: [
						{ label: 'Mixin 概述', slug: 'developers/mixin' },
						{ label: '入门教程', slug: 'developers/mixin/intro' },
						{ label: '配置 JSON 详解', slug: 'developers/mixin/config' },
						{ label: '与 Minecraft Mixin 的差异', slug: 'developers/mixin/copper-differences' },
						{ label: 'Mixin 示例', slug: 'developers/mixin/examples' },
						{ label: '注解参考手册', slug: 'developers/mixin/reference' },
					],
				},
			],
		}),
	],
});
