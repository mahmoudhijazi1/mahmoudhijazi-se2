import { Cake, IdentifiableCake } from "../../model/cake.model";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repostiroyException";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { ISqliteCake, SQLiteCakeMapper } from "../../mappers/cake.mapper";

const tableName = ItemCategory.CAKE;
const CREATE_TABLE = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        flavor TEXT NOT NULL,
        filling TEXT NOT NULL,
        size INTEGER NOT NULL,
        layers INTEGER NOT NULL,
        frostingType TEXT NOT NULL,
        frostingFlavor TEXT NOT NULL,
        decorationType TEXT NOT NULL,
        decorationColor TEXT NOT NULL,
        customMessage TEXT,
        shape TEXT NOT NULL,
        allergies TEXT,
        specialIngredients TEXT,
        packagingType TEXT NOT NULL
    )
`;

const INSERT_CAKE = `INSERT INTO ${tableName} (id, type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

const SELECT_CAKE_BY_ID = `SELECT * FROM ${tableName} WHERE id = ?`;

const SELECT_ALL_CAKES = `SELECT * FROM ${tableName}`;

const DELETE_CAKE_BY_ID = `DELETE FROM ${tableName} WHERE id = ?`;

const UPDATE_CAKE_BY_ID = `UPDATE ${tableName} SET type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frostingType = ?, frostingFlavor = ?, decorationType = ?, decorationColor = ?, customMessage = ?, shape = ?, allergies = ?, specialIngredients = ?, packagingType = ? WHERE id = ?`;



export class CakeOrderRepository implements IRepository<IdentifiableCake>, Initializable {


    async init() {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("cake table initialized")

        } catch (error: unknown) {
            throw new InitializationException("Failed to initialize Cake Table", error as Error)
        }
    }


    async create(item: IdentifiableCake): Promise<id> {

        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(INSERT_CAKE,[item.getId(), item.getType(), item.getFlavor(), item.getFilling(), item.getSize(), item.getLayers(), item.getFrostingType(), item.getFrostingFlavor(), item.getDecorationType(), item.getDecorationColor(), item.getCustomMessage(), item.getShape(), item.getAllergies(), item.getSpecialIngredients(), item.getPackagingType()]);
            return item.getId();

        } catch (error: unknown) {
            logger.error("Failed to create cake item", error as Error)
            throw new DbException("Failed to create cake item", error as Error)
        }

        // transaction
        //      insert data into order table
        //      insert data into ( item: cake,book..) table
        // commit
        // return order id
    }
    async get(id: id): Promise<IdentifiableCake> {
        try {
            const conn = await ConnectionManager.getConnection();
            const row = await conn.get<ISqliteCake>(SELECT_CAKE_BY_ID, [id]);
            if (!row) {
                throw new ItemNotFoundException("Cake item not found");
            }
            // logger.info("Retrieved cake item: %o", row);
            return new SQLiteCakeMapper().map(row); //TODO must remove and map
        } catch (error: unknown) {
            logger.error("Failed to retrieve cake item", error as Error);
            throw new DbException("Failed to retrieve cake item", error as Error);
        }
    }
    async getAll(): Promise<IdentifiableCake[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const rows = await conn.all<ISqliteCake[]>(SELECT_ALL_CAKES);
            return rows.map((row) => new SQLiteCakeMapper().map(row));
        } catch (error: unknown) {
            logger.error("Failed to retrieve all cake items", error as Error);
            throw new DbException("Failed to retrieve all cake items", error as Error);
        }
    }
    async update(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE_BY_ID, [item.getType(), item.getFlavor(), item.getFilling(), item.getSize(), item.getLayers(), item.getFrostingType(), item.getFrostingFlavor(), item.getDecorationType(), item.getDecorationColor(), item.getCustomMessage(), item.getShape(), item.getAllergies(), item.getSpecialIngredients(), item.getPackagingType(), item.getId()]);
        } catch (error: unknown) {
            logger.error("Failed to update cake item", error as Error);
            throw new DbException("Failed to update cake item", error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_CAKE_BY_ID, [id]);
        } catch (error: unknown) {
            logger.error("Failed to delete cake item", error as Error);
            throw new DbException("Failed to delete cake item", error as Error);
        }
    }

}