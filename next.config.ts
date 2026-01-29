module.exports = {
  transpilePackages: [
    "react-web-white-label",
    "react-dnd",
    "react-dnd-html5-backend",
    "prismjs",
  ],
  output: "export",
  images: { unoptimized: true },
  experimental: {
    turbopack: true,
  },
};
