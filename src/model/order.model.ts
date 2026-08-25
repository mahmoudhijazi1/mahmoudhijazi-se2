import { Item } from "./item.model";

export interface Order {
    getId(): string;
    getItem(): Item;
    getPrice(): number;
    getQuantity(): number;
}