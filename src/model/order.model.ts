import { IItem } from "./IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {
    constructor(
        private id: string,
        private item: IItem,
        private price: number,
        private quantity: number
    ) { }

    getId(): string {
        return this.id;
    }
    getItem(): IItem {
        return this.item;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
}