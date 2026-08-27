import { IItem, ItemCategory } from "./IItem";

export class Toy implements IItem {
	private type: string;
	private ageGroup: string;
	private brand: string;
	private material: string;
	private batteryRequired: string;
	private educational: string;
	private price: number;
	private quantity: number;

	constructor(
		type: string,
		ageGroup: string,
		brand: string,
		material: string,
		batteryRequired: string,
		educational: string,
		price: number,
		quantity: number
	) {
		this.type = type;
		this.ageGroup = ageGroup;
		this.brand = brand;
		this.material = material;
		this.batteryRequired = batteryRequired;
		this.educational = educational;
		this.price = price;
		this.quantity = quantity;
	}

	getCategory(): ItemCategory {
		return ItemCategory.TOY;
	}

	getType(): string { return this.type; }
	getAgeGroup(): string { return this.ageGroup; }
	getBrand(): string { return this.brand; }
	getMaterial(): string { return this.material; }
	getBatteryRequired(): string { return this.batteryRequired; }
	getEducational(): string { return this.educational; }
	getPrice(): number { return this.price; }
	getQuantity(): number { return this.quantity; }
}
