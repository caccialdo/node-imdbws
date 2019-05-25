/* eslint-disable import/no-extraneous-dependencies */

const yaml = require("js-yaml");
const fse = require("fs-extra");
const imdbWs = require("..");

const EXAMPLE_TCONST = "tt6139732"; // Aladdin (2019)

async function main() {
  await fse.ensureDir("exampleData");

  const promises = [
    "heroVideos",
    "belowTheFold",
    "auxiliary",
    "whereToWatch",
  ].map(async (endpoint) => {
    const { body } = await imdbWs[endpoint](EXAMPLE_TCONST, { region: "GB" });
    await fse.writeFile(`exampleData/${endpoint}.yml`, yaml.dump(body));
  });

  await Promise.all(promises);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
