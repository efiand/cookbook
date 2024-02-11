import { StatusCodes } from 'http-status-codes';

export default Object.freeze({
	DESCRIPTION: 'Все рецепты кулинарной книги',
	DOMAIN: 'https://cookbook.efiand.ru',
	HttpMethod: {
		DELETE: 'DELETE',
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
	},
	IMAGE: 'table.jpg',
	PROJECT: 'Кулинарная книга',
	StatusCodes,
	head: {
		htmlAttrs: { lang: 'ru' },
		link: [
			{
				as: 'font',
				crossorigin: 'anonymous',
				href: '/fonts/roboto-400.woff2',
				rel: 'preload',
			},
			{
				as: 'font',
				crossorigin: 'anonymous',
				href: '/fonts/roboto-700.woff2',
				rel: 'preload',
			},
			{
				href: '/favicon-16x16.png',
				rel: 'icon',
				sizes: '16x16',
				type: 'image/png',
			},
			{
				href: '/favicon-32x32.png',
				rel: 'icon',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				href: '/apple-touch-icon.png',
				rel: 'apple-touch-icon',
				sizes: '180x180',
			},
			{
				color: '#00796b',
				href: '/safari-pinned-tab.svg',
				rel: 'mask-icon',
			},
			{
				href: '/site.webmanifest',
				rel: 'manifest',
			},
		],
		meta: [
			{
				content: 'True',
				name: 'HandheldFriendly',
			},
			{
				content: '320',
				name: 'MobileOptimized',
			},
			{
				content: 'address=no',
				name: 'format-detection',
			},
			{
				content: 'telephone=no',
				name: 'format-detection',
			},
			{
				content: 'yes',
				name: 'apple-mobile-web-app-capable',
			},
			{
				content: '#ffffff',
				name: 'msapplication-TileColor',
			},
			{
				content: '#ffffff',
				name: 'theme-color',
			},
		],
	},
});
