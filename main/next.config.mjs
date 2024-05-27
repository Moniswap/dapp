/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (webpackConfig, { webpack, dev }) => {
    if (webpackConfig.cache && !dev) {
      webpackConfig.cache = Object.freeze({
        type: "memory"
      });

      webpackConfig.cache.maxMemoryGenerations = 0;
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

export default nextConfig;
