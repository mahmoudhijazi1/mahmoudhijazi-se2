import { ID } from "../repository/IRepository";

export interface IItem {
    getCategory(): ItemCategory;
}

export enum ItemCategory {
    CAKE="cake",BOOK="book",TOY="toy"
}

export interface IIdentifiableItem extends IItem,ID{
}