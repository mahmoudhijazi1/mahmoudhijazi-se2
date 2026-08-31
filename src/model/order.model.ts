import { IIdentifiableItem, IItem } from "./IItem";
import { IIdentifiableOrderItem, IOrder } from "./IOrder";

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

export class IdentifiableOrderItem implements IIdentifiableOrderItem {
    constructor(private identifiableItem: IIdentifiableItem, private id: string, private price: number, private quantity: number) {
    }
    getId(): string {
        return this.id;
    }
    getItem(): IIdentifiableItem {
        return this.identifiableItem;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
}