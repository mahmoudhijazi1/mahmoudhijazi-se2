import logger from "./util/logger";
import { readCSVFile } from "./util/parsers/csvParser";
import config from "./config";
import { readJSONfile } from "./util/parsers/jsonParser";
import { readXMLfile } from "./util/parsers/xmlParser";

interface Book {
  "Order ID": string;
  "Book Title": string;
  Author: string;
  Genre: string;
  Format: string;
  Language: string;
  Publisher: string;
  "Special Edition": string;
  Packaging: string;
  Price: string;
  Quantity: string;
}

interface Toy {
  OrderID: string;
  Type: string;
  AgeGroup: string;
  Brand: string;
  Material: string;
  BatteryRequired: string;
  Educational: string;
  Price: string;
  Quantity: string;
}

type ToysXML = {
  data: {
    row: Toy[];
  };
};

async function main() {
  const cakes = await readCSVFile(config.storagePath.csv.cakes, false);

  // cakes.forEach((row) => logger.info(row))

  const books = await readJSONfile<Book []>(config.storagePath.data.books)

  // books.forEach((b)=>logger.info(JSON.stringify(b)))

  const toysXmlData = await readXMLfile<ToysXML>(config.storagePath.data.toys)
  const toys = toysXmlData.data.row

  toys.forEach((b)=>logger.info(JSON.stringify(b)))


}


main(); 