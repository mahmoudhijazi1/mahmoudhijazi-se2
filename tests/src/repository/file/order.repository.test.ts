import { CakeOrderRepository } from "../../../../src/repository/file/cake.order.repository";
import { IOrder } from "../../../../src/model/IOrder";
import { ItemNotFoundException, InvalidItemException } from "../../../../src/util/exceptions/repostiroyException";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

class MockCakeOrder implements IOrder {
    constructor(
        private id: string,
        private item: any,
        private price: number,
        private quantity: number
    ) { }

    getId(): string {
        return this.id;
    }

    getItem() {
        return this.item;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }
}

describe("CakeOrderRepository (File-based)", () => {
    let repository: CakeOrderRepository;
    let testFilePath: string;

    beforeEach(() => {
        // Use OS temp directory for test files
        testFilePath = path.join(os.tmpdir(), `test_cakes_${Date.now()}.csv`);
        repository = new CakeOrderRepository(testFilePath);
    });

    afterEach(() => {
        // Clean up test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    describe("repository interface", () => {
        it("should have all required methods", () => {
            expect(typeof repository.create).toBe("function");
            expect(typeof repository.get).toBe("function");
            expect(typeof repository.getAll).toBe("function");
            expect(typeof repository.update).toBe("function");
            expect(typeof repository.delete).toBe("function");
        });
    });
});