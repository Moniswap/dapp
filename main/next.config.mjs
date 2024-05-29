import runtimeCaching from "next-pwa/cache.js";
import pwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (webpackConfig, { webpack, dev }) => {
    if (webpackConfig.cache && !dev) {
      webpackConfig.cache = Object.freeze({
        type: "memory"
      });
    }

    webpackConfig.resolve.fallback = {
      fs: false
    };
    webpackConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, resource => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    return webpackConfig;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**"
      }
    ]
  }
};

const withPWA = pwa({
  dest: "public",
  skipWaiting: true,
  register: true,
  disable: process.env.NODE_ENV !== "production",
  runtimeCaching
});

export default withPWA(nextConfig);
