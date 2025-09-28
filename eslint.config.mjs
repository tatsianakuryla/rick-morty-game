import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
    { ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'] },
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    ...tseslint.configs.recommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
    ...tseslint.configs.recommendedTypeChecked.map((c) => ({ ...c, files: ['**/*.ts'] })),
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-argument': 'error',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'TSAsExpression:not(:has(TSTypeReference[typeName.name="const"]))',
                    message: 'The "as" assertion is not allowed.',
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { disallowTypeAnnotations: false },
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    eslintConfigPrettier,
];
