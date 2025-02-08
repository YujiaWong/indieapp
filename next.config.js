/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: "/api/:slug*",
      destination: "https://api.indieapp.ai/:slug*",
      has: [
        {
          type: 'header',
          key: 'x-use-external-api',
          value: 'true'
        }
      ]
    },
  ];
};

const nextConfig = {
  rewrites,
  reactStrictMode: false,
  
  compiler: {
    styledComponents: true, // 添加
  },
}

module.exports = nextConfig;
