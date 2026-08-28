import { CakeMapper } from "../../mappers/cake.mapper";
import { CSVOrderMapper } from "../../mappers/order.mapper";
import { IOrder } from "../../model/IOrder";
import { readCSVFile, writeCSVFile } from "../../util/parsers/csvParser";
import { OrderRepository } from "./order.repository";

export class CakeOrderRepository extends OrderRepository {
    private mapper = new CSVOrderMapper(new CakeMapper());
    constructor(private readonly filepath: string) {
        super();

    }
    protected async load(): Promise<IOrder[]> {
        //read 2D string from the file
        const csv = await readCSVFile(this.filepath);

        //return list of objects
        return csv.map(this.mapper.map.bind(this.mapper));
    }

    protected async save(orders: IOrder[]): Promise<void> {
        //generate list of headers
        const header = ["id", "Type", "Flavor", "Filling", "Size", "Layers", "Frosting Type", "Frosting Flavor", "Decoration Type", "Decoration Color", "Custom Message", "Shape", "Allergies", "Special Ingredients", "Packaging Type", "Price", "Quantity"];

        //convert orders to 2Dstrings
        const rawItems = orders.map(o => this.mapper.reverseMap(o));
        //parse.write
        await writeCSVFile(this.filepath, [header, ...rawItems])
        return
    }
}