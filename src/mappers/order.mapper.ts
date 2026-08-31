import { IdentifiableOrderItemBuilder, OrderBuilder } from "../model/builder/order.builder";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IMapper } from "./IMapper";

export class CSVOrderMapper implements IMapper<string[], IOrder> {

    constructor(private itemMapper: IMapper<string[], IItem>) { }

    map(data: string[]): IOrder {
        const item: IItem = this.itemMapper.map(data)
        return OrderBuilder.newBuilder()
            .setId(data[0])
            .setPrice(parseInt(data[data.length - 2]))
            .setQuantity(parseInt(data[data.length - 1]))
            .setItem(item)
            .build()
    }

    reverseMap(data: IOrder): string[] {
        const item = this.itemMapper.reverseMap(data.getItem())
        return [
            data.getId(),  
            ...item,        // item concatinated to the cake order list
            data.getPrice().toString(),
            data.getQuantity().toString(),
        ]
    }
}
    export interface ISqliteOrder{
        id: string;
        quantity: number;
        price: number;
        item_id: string;
        item_category: string;
    }
    export class SQLiteOrderMapper implements IMapper<{data: ISqliteOrder, item: IIdentifiableItem}, IIdentifiableOrderItem> {
        map({data, item}: {data: ISqliteOrder, item: IIdentifiableItem}): IIdentifiableOrderItem {
            const order = OrderBuilder.newBuilder()
                .setId(data.id)
                .setQuantity(data.quantity)
                .setPrice(data.price)
                .setItem(item)
                .build();
            return IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order)
                .setItem(item)
                .build();
        }

        reverseMap(data: IIdentifiableOrderItem): {data: ISqliteOrder, item: IIdentifiableItem} {
            return {
                data: {
                    id: data.getId(),
                    quantity: data.getQuantity(),
                    price: data.getPrice(),
                    item_id: data.getItem().getId(),
                    item_category: data.getItem().getCategory()
                },
                item: data.getItem()
            }
        }   
}
