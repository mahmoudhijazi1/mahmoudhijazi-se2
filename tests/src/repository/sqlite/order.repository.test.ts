import { OrderRepository } from "../../../../src/repository/sqlite/order.repository";
import { CakeOrderRepository } from "../../../../src/repository/sqlite/cake.order.repository";
import { OrderBuilder, IdentifiableOrderItemBuilder } from "../../../../src/model/builder/order.builder";
import { CakeBuilder, IdentifiableCakeBuilder } from "../../../../src/model/builder/cake.builder";
import { ConnectionManager } from "../../../../src/repository/sqlite/ConnectionManager";
import { DbException } from "../../../../src/util/exceptions/repostiroyException";

describe("OrderRepository (SQLite)", () => {
    let orderRepository: OrderRepository;
    let cakeRepository: CakeOrderRepository;

    beforeEach(async () => {
        cakeRepository = new CakeOrderRepository();
        orderRepository = new OrderRepository(cakeRepository);
    });

    afterEach(async () => {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec("DROP TABLE IF EXISTS 'order'");
            await conn.exec("DROP TABLE IF EXISTS cake");
        } catch (error) {
            // Ignore
        }
    });

    describe("init and create", () => {
        beforeEach(async () => {
            await orderRepository.init();
        });

        it("should initialize and create an order", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
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

            const order = OrderBuilder.newBuilder()
                .setId("order-1")
                .setItem(cake)
                .setPrice(25)
                .setQuantity(1)
                .build();

            const orderItem = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order)
                .setItem(cake)
                .build();

            const id = await orderRepository.create(orderItem);
            expect(id).toBe("order-1");
        });

        it("should retrieve an order by ID", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
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

            const order = OrderBuilder.newBuilder()
                .setId("order-1")
                .setItem(cake)
                .setPrice(25)
                .setQuantity(1)
                .build();

            const orderItem = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order)
                .setItem(cake)
                .build();

            await orderRepository.create(orderItem);
            const retrieved = await orderRepository.get("order-1");

            expect(retrieved).toBeDefined();
            expect(retrieved.getId()).toBe("order-1");
            expect(retrieved.getPrice()).toBe(25);
            expect(retrieved.getQuantity()).toBe(1);
        });

        it("should get all orders", async () => {
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

            const order1 = OrderBuilder.newBuilder()
                .setId("order-1")
                .setItem(cake1)
                .setPrice(25)
                .setQuantity(1)
                .build();

            const order2 = OrderBuilder.newBuilder()
                .setId("order-2")
                .setItem(cake2)
                .setPrice(30)
                .setQuantity(2)
                .build();

            const orderItem1 = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order1)
                .setItem(cake1)
                .build();

            const orderItem2 = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order2)
                .setItem(cake2)
                .build();

            await orderRepository.create(orderItem1);
            await orderRepository.create(orderItem2);

            const allOrders = await orderRepository.getAll();
            expect(allOrders.length).toBe(2);
        });

        it("should update an order", async () => {
            const cake = IdentifiableCakeBuilder.newBuilder()
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

            const order = OrderBuilder.newBuilder()
                .setId("order-1")
                .setItem(cake)
                .setPrice(25)
                .setQuantity(1)
                .build();

            const orderItem = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(order)
                .setItem(cake)
                .build();

            await orderRepository.create(orderItem);

            const updatedOrder = OrderBuilder.newBuilder()
                .setId("order-1")
                .setItem(cake)
                .setPrice(35)
                .setQuantity(3)
                .build();

            const updatedOrderItem = IdentifiableOrderItemBuilder.newBuilder()
                .setOrder(updatedOrder)
                .setItem(cake)
                .build();

            await orderRepository.update(updatedOrderItem);

            const retrieved = await orderRepository.get("order-1");
            expect(retrieved.getPrice()).toBe(35);
            expect(retrieved.getQuantity()).toBe(3);
        });
    });
});
