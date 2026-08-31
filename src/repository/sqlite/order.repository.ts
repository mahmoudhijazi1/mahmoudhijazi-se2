import { open } from "sqlite";
import { IIdentifiableOrderItem, IOrder } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../IRepository";
import config from "../../config";
import { Database } from "sqlite3";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repostiroyException";
import { ConnectionManager } from "./ConnectionManager";
import { IIdentifiableItem } from "../../model/IItem";
import { ISqliteOrder, SQLiteOrderMapper } from "../../mappers/order.mapper";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "order"(
    id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    item_category TEXT NOT NULL
)`;

const INSERT_ORDER = `INSERT INTO "order" (id,quantity,price,item_category,item_id) VALUES (?,?,?,?,?)`;

const SELECT_ALL_ORDERS = `SELECT * FROM "order" where item_category = ?`;

const DELETE_ORDER_BY_ID = `DELETE FROM "order" WHERE id = ?`;

export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable {

    constructor(private readonly itemRepository: IRepository<IIdentifiableItem>) { }

    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("order table initialized")

            // Initialize the item repository if it implements Initializable
            if ('init' in this.itemRepository && typeof (this.itemRepository as any).init === 'function') {
                await (this.itemRepository as any).init();
            }
        } catch (error: unknown) {
            throw new InitializationException("Failed to initialize Order Table", error as Error)
        }
    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.run("BEGIN TRANSACTION");

            const item_id = await this.itemRepository.create(order.getItem())
            conn.run(INSERT_ORDER, [order.getId(), order.getQuantity(), order.getPrice(), order.getItem().getCategory(), item_id]);
            conn.run("COMMIT");
            return order.getId();


        } catch (error: unknown) {
            logger.error("Failed to create order", error as Error);
            conn && conn.run("ROLLBACK TRANSACTION");
            throw new DbException("Failed to create order", error as Error)
        }
    }
    get(id: id): Promise<IIdentifiableOrderItem> {
        let conn;
        return new Promise(async (resolve, reject) => {
            try {
                conn = await ConnectionManager.getConnection();
                const row = await conn.get(`SELECT * FROM "order" WHERE id = ?`, [id]);
                if (!row) {
                    reject(new Error("Order not found"));
                    return;
                }
                const cake = await this.itemRepository.get(row.item_id); // retrieve the item from the item repository
                resolve(new SQLiteOrderMapper().map({data: row, item: cake}));
            } catch (error: unknown) {
                logger.error("Failed to get order", error as Error);
                reject(error);
            }
        });
    }
    async getAll(): Promise<IIdentifiableOrderItem[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const items = await this.itemRepository.getAll();
            if (items.length === 0) {
                return [];
            }
            const orders = await conn.all<ISqliteOrder[]>(SELECT_ALL_ORDERS, [items[0].getCategory()]);
            // bind the items to the orders
            const identifiableOrders = orders.map(order => {
                const item = items.find(i => i.getId() === order.item_id);
                if (!item) {
                    throw new Error(`Item with id ${order.item_id} not found for order ${order.id}`);
                }
                return new SQLiteOrderMapper().map({data: order, item: item});
            });
            return identifiableOrders;
        } catch (error: unknown) {
            logger.error("Failed to get all orders", error as Error);
            throw new DbException("Failed to get all orders", error as Error);
        }
    }

    async update(item: IIdentifiableOrderItem): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.run("BEGIN TRANSACTION");
            await this.itemRepository.update(item.getItem());
            await conn.run(`UPDATE "order" SET quantity = ?, price = ? WHERE id = ?`, [item.getQuantity(), item.getPrice(), item.getId()]);
            conn.run("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to update order", error as Error);
            conn && conn.run("ROLLBACK TRANSACTION");
            throw new DbException("Failed to update order", error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            conn.run("BEGIN TRANSACTION");

            const order = await conn.get<{ item_id: string }>(`SELECT item_id FROM "order" WHERE id = ?`, [id]);
            if (!order) {
                throw new Error(`Order with id ${id} not found`);
            }

            await this.itemRepository.delete(order.item_id);
            await conn.run(DELETE_ORDER_BY_ID, [id]);
            conn.run("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to delete order", error as Error);
            conn && conn.run("ROLLBACK TRANSACTION");
            throw new DbException("Failed to delete order", error as Error);
        }
    }

}