const { VitePWA } = require( 'vite-plugin-pwa')
const path = require( 'path')
const vue = require( '@vitejs/plugin-vue')
const components = require('unplugin-vue-components/vite')
const { HeadlessUiResolver } = require('unplugin-vue-components/resolvers')
const icons = require('unplugin-icons/vite')
const ViteIconsResolver = require('unplugin-icons/resolver')
const pages = require('vite-plugin-pages').default
const layouts = require('vite-plugin-vue-layouts').default
const markdown = require('vite-plugin-md').default
const shiki = require('shiki')
const anchorPlugin = require('markdown-it-anchor')
const taskListsPlugin = require('markdown-it-task-lists')
const { slugify } = require('./build-time/markdown/slugify')
const { modifyHeading } = require('./build-time/markdown/heading')
const { linkPlugin } = require('./build-time/markdown/link')
const { highlightLinePlugin } = require('./build-time/markdown/highlightLines')
const { lineNumberPlugin } = require('./build-time/markdown/lineNumbers')
const { containerPlugin } = require('./build-time/markdown/containers')
const { preWrapperPlugin } = require('./build-time/markdown/preWrapper')
const metaResolver = require('./build-time/frontmatter').default
const AutoImport = require('unplugin-auto-import/vite')

module.exports = async ({ command, mode }) => {
	const shikiHighlighter = await shiki.getHighlighter({
		// Choose which syntax highlighting themes you want
		// These are used below in the markdown highlight option
		themes: ['dark-plus', 'github-light']
	});
	/**
	 * @type {import('vite').UserConfig}
	 */
	const userConfig = {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		// Change this depending on your public path, default is '/'
		base: '/blog/',
		// Load scripts async and minify index for for faster initial load
		ssgOptions: {
			script: 'async',
			formatting: 'minify'
		},
		// This is just to disable some warnings, can be safely removed
		server: {
			fs: {
				strict: false
			}
		},
		optimizeDeps: {
			include: [
				'vue',
				'vue-router',
				'@vueuse/core',
				'@vueuse/head',
			],
		},
		plugins: [
			vue({
				include: [/\.vue$/, /\.md$/],
				script: {
					refSugar: true
				}
			}),
			VitePWA({
				registerType: 'autoUpdate', // default is 'promp'
				includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
				manifest: {
					name: 'Blog',
					short_name: 'Blog',
					theme_color: '#ffffff',
					icons: [
						{
							src: 'pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png'
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable'
						}
					]
				}
			}),
			pages({
				// pagesDir: [{ dir: 'src/pages', baseRoute: '' }],
				extensions: ['vue', 'md'],
				importMode(path) {
					// In case you want some paths to be loaded synchronously
					return 'async';
				},
				extendRoute(route) {
					if (!route.name) {
						route.name = route.path.replace('/', '');
					}

					if (route.component.endsWith('.md')) {
						const meta = metaResolver('.' + route.component);
						route = { ...route, meta: { ...route.meta, ...meta } };
						const keywords = route?.meta?.meta?.find(x => x.name === 'keywords')?.content;
						if (keywords) {
							route.meta.tags = keywords.split(',').map(x => x.trim());
						}
					}
					return route;
				}
			}),
			layouts(),
			AutoImport({
				// targets to transform
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/, /\.vue\?vue/, // .vue
					/\.md$/, // .md
				],
				// global imports to register
				imports: [
					'vue',
				],
				dts: 'src/auto-imports.d.ts',
			}),
			components({
				extensions: ['vue', 'md'],
				importPathTransform: (path) => {
					if (path.includes('src/components')) {
						return path.replace(/.*src\/components/, '@/components');
					}
					return path;
				},
				include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
				resolvers: [
					HeadlessUiResolver(),
					ViteIconsResolver()
				],
				dts: 'src/components.d.ts',
			}),
			icons({
				autoInstall: true
			}),
			markdown({
				wrapperClasses: 'post__layout !mx-auto prose dark:prose-dark',
				wrapperComponent: 'Markdown',
				headEnabled: true,
				markdownItOptions: {
					html: true,
					linkify: true,
					breaks: true,
					lineNumbers: false,
					highlight: (code, lang) => {
						const dark = shikiHighlighter
							.codeToHtml(code, lang || 'text', 'dark-plus')
							.replace('<pre class="shiki"', '<pre class="shiki shiki-dark"');
						const light = shikiHighlighter
							.codeToHtml(code, lang || 'text', 'github-light')
							.replace('<pre class="shiki"', '<pre class="shiki shiki-light"');
						return `${dark}${light}`;
					}
				},
				markdownItSetup(md) {
					md.use(highlightLinePlugin)
						.use(preWrapperPlugin)
						.use(lineNumberPlugin)
						.use(containerPlugin)
						.use(modifyHeading)
						.use(taskListsPlugin)
						.use(
							linkPlugin,
							{
								target: '_blank',
								rel: 'noopener noreferrer'
							},
							'focus:outline-none focus:ring-2 ring-primary-500 rounded'
						)
						.use(anchorPlugin, {
							slugify,
							// This is a pretty bad UX for screen readers apparently, but oh well
							permalink: anchorPlugin.permalink.ariaHidden({
								placement: 'before',
								symbol: '#',
								class:
									'header-anchor w-[1em] opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 absolute left-[-1em] !font-bold !ring-0',
								space: false
							})
						});
				}
			})
		]
	};
	return userConfig;
};
