import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["reshaped"],
    webpack(config) {
        config.module.rules.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
        });
        return config;
    },
    experimental: {
        optimizePackageImports: ["reshaped"],
    },
    allowedDevOrigins: ["http://158.160.198.102"],
    async redirects() {
        return [
            {
                source: '/',
                destination: '/information/information',
                permanent: true,
            },
        ]
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
        ]
    },
};

export default nextConfig;