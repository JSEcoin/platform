module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: true
	},
	env: {
		browser: true,
		node: true
	},
	extends: 'airbnb-base',
	globals: {
		__static: true
	},
	plugins: [
		'html'
	],
	'rules': {
		'strict': 0,
		'global-require': 0,
		'import/no-unresolved': 0,
		'no-param-reassign': 0,
		'no-shadow': 0,
		'import/extensions': 0,
		'import/newline-after-import': 0,
		'no-multi-assign': 0,

		// disable rules from base configurations
		'no-console': 'off',
		'func-names': 0,
		'comma-spacing': 0,
		'space-infix-ops': 0,
		'space-before-function-paren': 0,
		'arrow-spacing': [1,{'before':true,'after':true}],
		'prefer-arrow-callback': 0,
		'space-before-blocks': 0,
		'indent': 0,
		'no-unused-vars': 0,
		'no-multi-spaces': 0,
		'prefer-template': 0,
		'no-tabs': 0,
		'spaced-comment': 0,
		'max-len': 0,
		'no-mixed-spaces-and-tabs': 0,
		'linebreak-style': 0,
		'import/no-dynamic-require': 0,
		'no-undef': 0,
		'allowForLoopAfterthoughts':  true,
		'no-plusplus': 0,
		'no-underscore-dangle': ['error', { 'allow': ['__static'] }],
		'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
		'no-bitwise': ['error', { 'int32Hint': true }],
		'default-case': 0
	}
}
