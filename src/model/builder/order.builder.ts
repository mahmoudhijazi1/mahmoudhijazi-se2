import { IIdentifiableItem, IItem } from "../IItem";
import { IdentifiableOrderItem, Order } from "../order.model";

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

export class IdentifiableOrderItemBuilder {
    private item!: IIdentifiableItem;
    private order!: Order;

    public static newBuilder(): IdentifiableOrderItemBuilder {
        return new IdentifiableOrderItemBuilder();
    }
    
    setItem(item: IIdentifiableItem): IdentifiableOrderItemBuilder {
        this.item = item;
        return this;
    }
    setOrder(order: Order): IdentifiableOrderItemBuilder {
        this.order = order;
        return this;
    }
    build(): IdentifiableOrderItem {
        if (!this.item || !this.order) {
            throw new Error("All identifiable order item properties are required.");
        }
        return new IdentifiableOrderItem(this.item, this.order.getId(), this.order.getPrice(), this.order.getQuantity());
    }
}