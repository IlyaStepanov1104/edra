import { config as reshapedConfig } from "reshaped/config/postcss";

// Получаем плагины из Reshaped или используем пустой объект
const reshapedPlugins = reshapedConfig?.plugins || {};

export default {
    plugins: {
        ...reshapedPlugins,
        'tailwindcss': {},
        'autoprefixer': {}
    }
}
