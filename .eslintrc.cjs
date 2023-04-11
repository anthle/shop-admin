/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	//  fix > index.html > unexpected token
	// parser: 'babel-eslint',

	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:prettier/recommended',
		'./.eslintrc-auto-import.json'
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'vue/multi-word-component-names': 'off',
		'vue/comment-directive': 'off'
	},
	globals: {
		module: true
	}
}
