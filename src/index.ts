import logger from "./util/logger";
import { readCSVFile } from "./util/parser";
import config from "./config";


async function main() {
  const data = await readCSVFile(config.storagePath.csv.cakes, false);

  data.forEach((row) => logger.info(row))
}

main();