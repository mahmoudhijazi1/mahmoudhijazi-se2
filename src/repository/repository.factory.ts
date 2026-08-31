import config from "../config";
import { ItemCategory } from "../model/IItem";
import { IOrder } from "../model/IOrder";
import { CakeOrderRepository as CakeOrderRepository } from "./sqlite/cake.order.repository";
import { CakeOrderRepository as FileCakeOrderRepository } from "./file/cake.order.repository";
import { Initializable, IRepository } from "./IRepository";
import { OrderRepository } from "./sqlite/order.repository";

export enum DBMode {
    FILE = "FILE",
    SQLITE = "SQLITE"
}
export class RepositoryFactory {
    public static async create(mode: DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {
        switch (mode) {
            case DBMode.SQLITE:
                let repository: IRepository<IOrder> & Initializable;
                switch (category) {
                    case ItemCategory.CAKE:
                        repository = new OrderRepository(new CakeOrderRepository());
                        break;
                    default: throw new Error(`Unsupported category: ${category}`);
                }
                await repository.init();
                return repository;
            case DBMode.FILE:
                switch (category) {
                    case ItemCategory.CAKE:
                        return new FileCakeOrderRepository(config.storagePath.csv.cakes);

                    default:
                        throw new Error(`Unsupported category: ${category}`);
                }

        }
    }
}