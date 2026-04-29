// @ts-check

import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.app.json",
            },
        },
        plugins: {
            "@angular-eslint": angular,
        },
        processor: angularTemplate.processors["extract-inline-html"],
        rules: {
            ...angular.configs.all.rules,
            "@angular-eslint/component-class-suffix": "off",
            "@angular-eslint/no-async-lifecycle-method": "off",
        },
    },
    {
        files: ["**/*.html"],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            "@angular-eslint/template": angularTemplate,
        },
        rules: {
            ...angularTemplate.configs.all.rules,
            "@angular-eslint/template/prefer-self-closing-tags": "error",
            "@angular-eslint/template/no-call-expression": "off",
            "@angular-eslint/template/i18n": "off",
            "@angular-eslint/template/no-interpolation-in-attributes": "off",
        },
    },
];
