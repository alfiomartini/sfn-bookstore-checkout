const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/handlers/index.js"],
    bundle: true,
    platform: "node",
    target: "node20", // or the Node.js version you are using
    outdir: "dist/src",
    external: ["aws-sdk"], // Exclude AWS SDK since it's available in the Lambda runtime
  })
  .catch(() => process.exit(1));
