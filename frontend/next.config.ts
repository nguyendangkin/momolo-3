import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    trailingSlash: true, // Tùy chọn để tạo URL thân thiện
    eslint: {
        ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint khi build
    },
};

export default nextConfig;
