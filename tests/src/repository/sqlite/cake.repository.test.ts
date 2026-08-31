import { CakeOrderRepository } from "../../../../src/repository/sqlite/cake.order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "../../../../src/model/builder/cake.builder";
import { ConnectionManager } from "../../../../src/repository/sqlite/ConnectionManager";
import { DbException, InitializationException } from "../../../../src/util/exceptions/repostiroyException";

describe("CakeOrderRepository (SQLite)", () => {
    let repository: CakeOrderRepository;

    beforeEach(async () => {
        repository = new CakeOrderRepository();
    });

    describe("init", () => {
        it("should initialize successfully", async () => {
            await repository.init();
            expect(repository).toBeDefined();
        });
    });

    describe("create and retrieve", () => {
        beforeEach(async () => {
            await repository.init();
        });

        afterEach(async () => {
            try {
                const conn = await ConnectionManager.getConnection();
                await conn.exec("DROP TABLE IF EXISTS cake");
            } catch (error) {
                // Ignore
            }
        });

        it("should create a cake and retrieve it", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
                .setId("test-cake-1")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Chocolate Cake")
                        .setFlavor("Chocolate")
                        .setFilling("Chocolate")
                        .setSize(1)
                        .setLayers(1)
                        .setFrostingType("Buttercream")
                        .setFrostingFlavor("Chocolate")
                        .setDecorationType("Sprinkles")
                        .setDecorationColor("Brown")
                        .setCustomMessage("Happy Birthday")
                        .setShape("Round")
                        .setAllergies("None")
                        .setSpecialIngredients("None")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            const id = await repository.create(cake);
            expect(id).toBe("test-cake-1");

            const retrieved = await repository.get("test-cake-1");
            expect(retrieved).toBeDefined();
            expect(retrieved.getId()).toBe("test-cake-1");
            expect(retrieved.getType()).toBe("Chocolate Cake");
        });

        it("should get all cakes", async () => {
            const cake1 = IdentifiableCakeBuilder.newBuilder()
                .setId("cake-1")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Chocolate Cake")
                        .setFlavor("Chocolate")
                        .setFilling("Chocolate")
                        .setSize(1)
                        .setLayers(1)
                        .setFrostingType("Buttercream")
                        .setFrostingFlavor("Chocolate")
                        .setDecorationType("Sprinkles")
                        .setDecorationColor("Brown")
                        .setCustomMessage("Happy Birthday")
                        .setShape("Round")
                        .setAllergies("None")
                        .setSpecialIngredients("None")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            const cake2 = IdentifiableCakeBuilder.newBuilder()
                .setId("cake-2")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Vanilla Cake")
                        .setFlavor("Vanilla")
                        .setFilling("Vanilla")
                        .setSize(2)
                        .setLayers(2)
                        .setFrostingType("Cream Cheese")
                        .setFrostingFlavor("Vanilla")
                        .setDecorationType("Fondant")
                        .setDecorationColor("White")
                        .setCustomMessage("Congratulations")
                        .setShape("Square")
                        .setAllergies("Nuts")
                        .setSpecialIngredients("Almond Extract")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            await repository.create(cake1);
            await repository.create(cake2);

            const allCakes = await repository.getAll();
            expect(allCakes.length).toBe(2);
        });

        it("should update a cake", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
                .setId("test-cake-1")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Chocolate Cake")
                        .setFlavor("Chocolate")
                        .setFilling("Chocolate")
                        .setSize(1)
                        .setLayers(1)
                        .setFrostingType("Buttercream")
                        .setFrostingFlavor("Chocolate")
                        .setDecorationType("Sprinkles")
                        .setDecorationColor("Brown")
                        .setCustomMessage("Happy Birthday")
                        .setShape("Round")
                        .setAllergies("None")
                        .setSpecialIngredients("None")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            await repository.create(cake);

            const updatedCake = IdentifiableCakeBuilder.newBuilder()
                .setId("test-cake-1")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Vanilla Cake")
                        .setFlavor("Vanilla")
                        .setFilling("Vanilla")
                        .setSize(2)
                        .setLayers(2)
                        .setFrostingType("Cream Cheese")
                        .setFrostingFlavor("Vanilla")
                        .setDecorationType("Fondant")
                        .setDecorationColor("White")
                        .setCustomMessage("Updated")
                        .setShape("Square")
                        .setAllergies("Nuts")
                        .setSpecialIngredients("Almond Extract")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            await repository.update(updatedCake);

            const retrieved = await repository.get("test-cake-1");
            expect(retrieved.getType()).toBe("Vanilla Cake");
            expect(retrieved.getFlavor()).toBe("Vanilla");
        });

        it("should delete a cake", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
                .setId("test-cake-1")
                .setCake(
                    CakeBuilder.newBuilder()
                        .setType("Chocolate Cake")
                        .setFlavor("Chocolate")
                        .setFilling("Chocolate")
                        .setSize(1)
                        .setLayers(1)
                        .setFrostingType("Buttercream")
                        .setFrostingFlavor("Chocolate")
                        .setDecorationType("Sprinkles")
                        .setDecorationColor("Brown")
                        .setCustomMessage("Happy Birthday")
                        .setShape("Round")
                        .setAllergies("None")
                        .setSpecialIngredients("None")
                        .setPackagingType("Box")
                        .build()
                )
                .build();

            await repository.create(cake);
            await repository.delete("test-cake-1");

            const allCakes = await repository.getAll();
            expect(allCakes.length).toBe(0);
        });
    });
});
