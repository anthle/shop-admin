/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts}'],
	theme: {
		extend: {}
	},
	plugins: [],
	corePlugins: {
		// 解决组件库中的组件样式冲突
		preflight: false
	}
}
