require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	extends: [
		'@nuxt/eslint-config',
		'plugin:perfectionist/recommended-natural',
	],

	overrides: [
		{
			env: { node: true },
			files: ['*.cjs'],
		},
		{
			files: ['*.vue'],
			plugins: ['vue'],
			rules: { 'vue/no-v-html': 'off' },
		},
	],

	parserOptions: { ecmaVersion: 'latest' },

	plugins: [
		'@stylistic',
		'perfectionist',
	],

	root: true,

	rules: {
		'@stylistic/array-bracket-newline': [
			'error',
			{
				minItems: 2,
				multiline: true,
			},
		],
		'@stylistic/array-bracket-spacing': 'error',
		'@stylistic/array-element-newline': [
			'error',
			{
				minItems: 2,
				multiline: true,
			},
		],
		'@stylistic/arrow-parens': 'error',
		'@stylistic/arrow-spacing': 'error',
		'@stylistic/block-spacing': 'error',
		'@stylistic/brace-style': [
			'error',
			'1tbs',
			{ allowSingleLine: false },
		],
		'@stylistic/comma-dangle': [
			'error',
			'always-multiline',
		],
		'@stylistic/comma-spacing': 'error',
		'@stylistic/comma-style': 'error',
		'@stylistic/computed-property-spacing': 'error',
		'@stylistic/dot-location': [
			'error',
			'property',
		],
		'@stylistic/eol-last': 'error',
		'@stylistic/function-call-argument-newline': [
			'error',
			'consistent',
		],
		'@stylistic/function-call-spacing': 'error',
		'@stylistic/function-paren-newline': [
			'error',
			'consistent',
		],
		'@stylistic/generator-star-spacing': 'error',
		'@stylistic/implicit-arrow-linebreak': 'error',
		'@stylistic/indent': [
			'error',
			'tab',
		],
		'@stylistic/indent-binary-ops': [
			'error',
			'tab',
		],
		'@stylistic/key-spacing': 'error',
		'@stylistic/keyword-spacing': 'error',
		'@stylistic/linebreak-style': 'error',
		'@stylistic/lines-around-comment': [
			'error',
			{
				afterBlockComment: false,
				afterLineComment: false,
			},
		],
		'@stylistic/lines-between-class-members': [
			'error',
			{
				enforce: [
					{
						blankLine: 'always',
						next: 'method',
						prev: 'method',
					},
					{
						blankLine: 'never',
						next: 'field',
						prev: 'field',
					},
				],
			},
		],
		'@stylistic/max-len': 'error',
		'@stylistic/max-statements-per-line': 'error',
		'@stylistic/member-delimiter-style': 'error',
		'@stylistic/multiline-ternary': [
			'error',
			'always-multiline',
		],
		'@stylistic/new-parens': 'error',
		'@stylistic/newline-per-chained-call': 'error',
		'@stylistic/no-extra-parens': 'error',
		'@stylistic/no-extra-semi': 'error',
		'@stylistic/no-floating-decimal': 'error',
		'@stylistic/no-mixed-spaces-and-tabs': 'error',
		'@stylistic/no-multi-spaces': 'error',
		'@stylistic/no-multiple-empty-lines': 'error',
		'@stylistic/no-trailing-spaces': [
			'error',
			{ ignoreComments: true },
		],
		'@stylistic/no-whitespace-before-property': 'error',
		'@stylistic/object-curly-newline': [
			'error',
			{
				minProperties: 2,
				multiline: true,
			},
		],
		'@stylistic/object-curly-spacing': [
			'error',
			'always',
		],
		'@stylistic/object-property-newline': 'error',
		'@stylistic/one-var-declaration-per-line': [
			'error',
			'always',
		],
		'@stylistic/operator-linebreak': [
			'error',
			'before',
		],
		'@stylistic/padded-blocks': [
			'error',
			'never',
		],
		'@stylistic/padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				next: 'return',
				prev: '*',
			},
			{
				blankLine: 'always',
				next: '*',
				prev: [
					'const',
					'let',
					'var',
				],
			},
			{
				blankLine: 'any',
				next: [
					'const',
					'let',
					'var',
				],
				prev: [
					'const',
					'let',
					'var',
				],
			},
			{
				blankLine: 'always',
				next: '*',
				prev: 'directive',
			},
			{
				blankLine: 'any',
				next: 'directive',
				prev: 'directive',
			},
			{
				blankLine: 'always',
				next: '*',
				prev: 'import',
			},
			{
				blankLine: 'any',
				next: 'import',
				prev: 'import',
			},
			{
				blankLine: 'always',
				next: 'export',
				prev: '*',
			},
			{
				blankLine: 'any',
				next: 'export',
				prev: 'export',
			},
		],
		'@stylistic/quote-props': [
			'error',
			'consistent-as-needed',
		],
		'@stylistic/quotes': [
			'error',
			'single',
			{ allowTemplateLiterals: false },
		],
		'@stylistic/rest-spread-spacing': 'error',
		'@stylistic/semi': 'error',
		'@stylistic/semi-spacing': 'error',
		'@stylistic/semi-style': 'error',
		'@stylistic/space-before-blocks': 'error',
		'@stylistic/space-before-function-paren': [
			'error',
			{ named: 'never' },
		],
		'@stylistic/space-in-parens': 'error',
		'@stylistic/space-infix-ops': 'error',
		'@stylistic/space-unary-ops': 'error',
		'@stylistic/spaced-comment': 'error',
		'@stylistic/switch-colon-spacing': 'error',
		'@stylistic/template-curly-spacing': 'error',
		'@stylistic/template-tag-spacing': 'error',
		'@stylistic/type-annotation-spacing': 'error',
		'@stylistic/type-generic-spacing': 'error',
		'@stylistic/type-named-tuple-spacing': 'error',
		'@stylistic/wrap-iife': [
			'error',
			'inside',
			{ functionPrototypeMethods: true },
		],
		'@stylistic/yield-star-spacing': 'error',
		'eqeqeq': 'error',
		'vue/attributes-order': 'off',
	},
};
