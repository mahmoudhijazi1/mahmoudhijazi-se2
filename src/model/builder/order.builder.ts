import { IItem } from "../IItem";
import { Order } from "../order.model";

export class OrderBuilder {
    private item!: IItem;
    private price!: number;
    private quantity!: number;
    private id!: string;

    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
    }

    public setItem(item: IItem): OrderBuilder {
        this.item = item;
        return this;
    }

    public setPrice(price: number): OrderBuilder {
        this.price = price;
        return this;
    }

    public setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }

    public setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }

    public build(): Order {
        const requiredProperties = [
            this.item,
            this.price,
            this.quantity,
            this.id
        ];

        if (requiredProperties.some(property => property === undefined || property === null)) {
            throw new Error("All order properties are required.");
        }

        return new Order(this.id, this.item, this.price, this.quantity);
    }
}