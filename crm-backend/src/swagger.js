const fs = require("fs");
const path = require("path");
const base = require("./swagger/swagger.base.json");

const swaggerDir = path.join(__dirname, "swagger");
const merged = fs
  .readdirSync(swaggerDir)
  .filter((f) => f.endsWith(".json") && f !== "swagger.base.json")
  .reduce(
    (acc, file) => {
      const partial = require(path.join(swaggerDir, file));
      acc.paths = { ...acc.paths, ...partial.paths };
      acc.components.schemas = {
        ...acc.components.schemas,
        ...partial.components?.schemas,
      };
      return acc;
    },
    {
      ...base,
      paths: {},
      components: {
        ...base.components,
        schemas: { ...base.components.schemas },
      },
    },
  );

module.exports = merged;
