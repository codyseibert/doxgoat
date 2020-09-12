module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3333",
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
};
