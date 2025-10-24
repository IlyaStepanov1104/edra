import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const fsdRules = {
  rules: {
    // Запрещаем импорт из вышележащих слоёв (app → fsd-pages → widgets → features → entities → shared)
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["**/../**/*/{app,fsd-pages,widgets,features,entities}"],
            message: "Импорт из вышележащих слоёв запрещён по FSD. Используйте DI или переместите зависимость."
          },
          {
            group: ["**/../../**/*/{app,fsd-pages,widgets,features,entities}"],
            message: "Используйте абсолютные пути для импортов между слоями."
          }
        ]
      }
    ],
    // Разрешаем относительные импорты внутри одного слоя
    "import/no-relative-parent-imports": ["error", { allow: ["../"] }],
    // Запрещаем циклические зависимости между слоями
    "import/no-cycle": ["error", { maxDepth: Infinity }]
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      }
    }
  }
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  fsdRules,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
