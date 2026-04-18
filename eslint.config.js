// @ts-check

import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import templateParser from "@angular-eslint/template-parser";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@angular-eslint": angular,
            "@angular-eslint/template": angularTemplate,
        },
        // @ts-expect-error
        processor: angularTemplate.processors[".inline-template"],
    },
    {
        files: ["**/*.html"],
        languageOptions: {
            parser: templateParser,
        },
        plugins: {
            "@angular-eslint/template": angularTemplate,
        },
        rules: {
            "@angular-eslint/template/prefer-self-closing-tags": ["error"],
        },
    },
];
