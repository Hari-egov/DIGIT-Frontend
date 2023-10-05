const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.PRODUCTION_DOMAIN || "https://design-egov.github.io";

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      publicPath: "auto"
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "core",
        remotes: {
          // landing: `landing@${domain}/landing/remoteEntry.js`,
          auth: `auth@${domain}/auth/remoteEntry.js`,
          // header: `header@${domain}/header/remoteEntry.js`,
          dashboard: `dashboard@${domain}/dashboard/remoteEntry.js`,
          hrms: `hrms@${domain}/hrms/remoteEntry.js`,
          workbench : `workbench@${domain}/workbench/remoteEntry.js`,
          dss : `dss@${doamin}/dss/remoteEntry.js`,
          measurement : `measurement@${domain}/measurement/remoteEntry.js`
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
