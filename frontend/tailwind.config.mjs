import { getTheme } from "reshaped/config/tailwind";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/reshaped/**/*.js"
    ],
    theme: getTheme(),
    corePlugins: {
        preflight: false
    }
}
