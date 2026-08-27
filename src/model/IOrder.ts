import { IItem } from "./IItem";

export interface IOrder {
    getId(): string;
    getItem(): IItem;
    getPrice(): number;
    getQuantity(): number;
}