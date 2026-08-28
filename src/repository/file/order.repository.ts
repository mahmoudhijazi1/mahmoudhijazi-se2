import { IOrder } from "../../model/IOrder";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repostiroyException";
import logger from "../../util/logger";
import { id, ID, IRepository } from "../IRepository";

export abstract class OrderRepository implements IRepository<IOrder> {
    protected abstract load(): Promise<IOrder[]>

    protected abstract save(orders: IOrder[]): Promise<void>

    async create(item: IOrder): Promise<id> {
        // validate the orders
        if (!item) {
            throw new InvalidItemException("Order cannot be null");
        }
        // load all orders
        const orders = await this.load();

        // add the new order
        const id = orders.push(item)

        // save all orders
        await this.save(orders);
        logger.info("Order created successfully with ID: %s", id);
        return String(id);
    }
    async get(id: id): Promise<IOrder> {
        const orders = await this.load();
        const foundOrder = orders.find(o => o.getId() === id);
        if (!foundOrder) {
            logger.error("Failed to find order of id %s", id)
            throw new ItemNotFoundException("Failed to find this element")
        }
        return foundOrder;
    }
    async getAll(): Promise<IOrder[]> {
        return this.load();
    }
    async update(item: IOrder): Promise<void> {
        if (!item) {
            throw new InvalidItemException("No order of to update");
        }

        const orders = await this.load();

        const index = orders.findIndex(o => o.getId() === item.getId());

        if (index === -1) {
            logger.error("Failed to find order of id %s", item.getId())
            throw new ItemNotFoundException("Order not found")
        }

        orders[index] = item;
        await this.save(orders);
    }
    async delete(id: id): Promise<void> {
        const orders = await this.load();

        const index = orders.findIndex(o => o.getId() === id);

        if (index === -1) {
            logger.error("Failed to find order of id %s", id)
            throw new ItemNotFoundException("Order not found")
        }

        orders.splice(index, 1);
        await this.save(orders);
        logger.info("Deleted order with id %s", id)
    }

}