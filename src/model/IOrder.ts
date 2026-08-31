import { ID } from "../repository/IRepository";
import { IIdentifiableItem, IItem } from "./IItem";

export interface IOrder {
    getId(): string;
    getItem(): IItem;
    getPrice(): number;
    getQuantity(): number;
}

export interface IIdentifiableOrderItem extends IOrder,ID{
    getItem():IIdentifiableItem;
}