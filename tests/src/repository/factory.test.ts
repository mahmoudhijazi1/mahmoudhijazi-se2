import { DBMode, RepositoryFactory } from "../../../src/repository/repository.factory";
import { ItemCategory } from "../../../src/model/IItem";

describe("RepositoryFactory", () => {
    describe("create", () => {
        it("should create a SQLite cake repository", async () => {
            const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
            expect(repo).toBeDefined();
            expect(repo.create).toBeDefined();
            expect(repo.get).toBeDefined();
            expect(repo.getAll).toBeDefined();
            expect(repo.update).toBeDefined();
            expect(repo.delete).toBeDefined();
        });

        it("should create a FILE cake repository", async () => {
            const repo = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);
            expect(repo).toBeDefined();
            expect(repo.create).toBeDefined();
            expect(repo.get).toBeDefined();
            expect(repo.getAll).toBeDefined();
            expect(repo.update).toBeDefined();
            expect(repo.delete).toBeDefined();
        });

        it("should throw error for unsupported category in SQLITE mode", async () => {
            try {
                await RepositoryFactory.create(DBMode.SQLITE, "book" as ItemCategory);
                throw new Error("Should have thrown an error");
            } catch (error: any) {
                expect(error.message).toContain("Unsupported category");
            }
        });

        it("should throw error for unsupported category in FILE mode", async () => {
            try {
                await RepositoryFactory.create(DBMode.FILE, "book" as ItemCategory);
                throw new Error("Should have thrown an error");
            } catch (error: any) {
                expect(error.message).toContain("Unsupported category");
            }
        });
    });
});
