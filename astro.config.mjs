// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	//site: 'https://github.com',
	integrations: [
		// astro-mermaid 必须位于 Starlight 之前，才能正确接管 mermaid 代码块的转换。
		mermaid({ enableLog: false }),
		starlight({
			title: 'Copper Loader 文档',
			description: 'Copper 模组加载器官方文档：安装、使用与模组开发指南。',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/MDTCopper/loader' }],
			sidebar: [
				{
					label: '玩家指南',
					items: [
						{ label: '总览', slug: 'players' },
						{ label: '安装', slug: 'players/install' },
						{ label: '更新', slug: 'players/update' },
						{ label: '管理模组', slug: 'players/manage-mods' },
						{ label: '故障排除', slug: 'players/troubleshooting' },
					],
				},
				{
					label: '开发者指南',
					items: [
						{ label: '总览与阅读顺序', slug: 'developers' },
						{ label: '快速开始', slug: 'developers/getting-started' },
						{ label: '模组元数据', slug: 'developers/mod-meta' },
						{ label: '主类与生命周期', slug: 'developers/main-class' },
						{ label: '版本、依赖与冲突', slug: 'developers/versions' },
						{ label: '类隔离机制', slug: 'developers/class-visibility' },
						{ label: '网络数据包', slug: 'developers/networking' },
						{ label: '数据、设置与本地化', slug: 'developers/data' },
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
