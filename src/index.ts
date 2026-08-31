import logger from "./util/logger";
import { readCSVFile } from "./util/parsers/csvParser";
import config from "./config";
import { readJSONfile } from "./util/parsers/jsonParser";
import { readXMLfile } from "./util/parsers/xmlParser";
import { CakeBuilder, IdentifiableCakeBuilder } from "./model/builder/cake.builder";
import { CakeMapper } from "./mappers/cake.mapper";
import { CSVOrderMapper } from "./mappers/order.mapper";
import { CakeOrderRepository } from "./repository/sqlite/cake.order.repository";
import { open } from "sqlite";
import { Database } from "sqlite3";
import { ConnectionManager } from "./repository/sqlite/ConnectionManager";
import { OrderRepository } from "./repository/sqlite/order.repository";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "./model/builder/order.builder";

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
  // const cakes = await readCSVFile(config.storagePath.csv.cakes, false);

  // // cakes.forEach((row) => logger.info(row))

  // const books = await readJSONfile<Book []>(config.storagePath.data.books)

  // // books.forEach((b)=>logger.info(JSON.stringify(b)))

  // const toysXmlData = await readXMLfile<ToysXML>(config.storagePath.data.toys)
  // const toys = toysXmlData.data.row

  // toys.forEach((b)=>logger.info(JSON.stringify(b)))

  // const cakeBuilder = new CakeBuilder();

  // const cake = cakeBuilder
  //   .setType("Chocolate Cake")
  //   .setFlavor("Chocolate")
  //   .setFilling("Chocolate")
  //   .setSize(1)
  //   .setLayers(1)
  //   .setFrostingType("Buttercream")
  //   .setFrostingFlavor("Chocolate")
  //   .setDecorationType("Sprinkles")
  //   .setDecorationColor("Brown")
  //   .setCustomMessage("Happy Birthday")
  //   .setShape("Round")
  //   .setAllergies("None")
  //   .setSpecialIngredients("None")
  //   .setPackagingType("Box")
  //   .build();

  // console.log(cake)

  // const cakesdata = await readCSVFile(config.storagePath.csv.cakes, false);
  // const cakemapper = new CakeMapper();
  // const orderMapper = new CSVOrderMapper(cakemapper)
  // const orders = cakesdata.map(orderMapper.map.bind(orderMapper));
  // logger.info("List of orders %o", orders)

  // const path = "src/data/cake orders.csv";
  // const repo = new CakeOrderRepository(path);
  // const data = await repo.get("1");

  // console.log(data)



}


async function testSqlite() {
  const dbOrder = new OrderRepository(new CakeOrderRepository());
  await dbOrder.init();


  const cake = CakeBuilder.newBuilder()
    .setType("Chocolate Cake")
    .setFlavor("Chocolate")
    .setFilling("Chocolate")
    .setSize(1)
    .setLayers(1)
    .setFrostingType("Buttercream")
    .setFrostingFlavor("Chocolate")
    .setDecorationType("Sprinkles")
    .setDecorationColor("Brown")
    .setCustomMessage("Happy Birthday")
    .setShape("Round")
    .setAllergies("None")
    .setSpecialIngredients("None")
    .setPackagingType("Box")
    .build();


  const idcake = IdentifiableCakeBuilder.newBuilder()
    .setId(Math.random().toString(36).substring(2, 15))
    .setCake(cake)
    .build();

  const order = OrderBuilder.newBuilder()
    .setId(Math.random().toString(36).substring(2, 15))
    .setItem(idcake)
    .setPrice(20)
    .setQuantity(1)
    .build();
  const idorder = IdentifiableOrderItemBuilder.newBuilder()

    .setOrder(order) 
    .setItem(idcake) 
    .build();

  await dbOrder.create(idorder);
  console.log(await dbOrder.get(idorder.getId()));
  const allOrders = await dbOrder.getAll();
  console.log("All orders: ", allOrders);
}
main();
testSqlite().catch((err) => {
  logger.error("Error in testSqlite: %o", err as Error); 
} )

