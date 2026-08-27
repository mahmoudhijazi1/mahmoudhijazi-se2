export class BookBuilder {
    private bookTitle!: string;
    private author!: string;
    private genre!: string;
    private format!: string;
    private language!: string;
    private publisher!: string;
    private specialEdition!: string;
    private packaging!: string;
    private price!: number;
    private quantity!: number;

    public static newBuilder():BookBuilder{
        return new BookBuilder();
    }

    public setBookTitle(bookTitle: string): this {
        this.bookTitle = bookTitle;
        return this;
    }

    public setAuthor(author: string): this {
        this.author = author;
        return this;
    }

    public setGenre(genre: string): this {
        this.genre = genre;
        return this;
    }

    public setFormat(format: string): this {
        this.format = format;
        return this;
    }

    public setLanguage(language: string): this {
        this.language = language;
        return this;
    }

    public setPublisher(publisher: string): this {
        this.publisher = publisher;
        return this;
    }

    public setSpecialEdition(specialEdition: string): this {
        this.specialEdition = specialEdition;
        return this;
    }

    public setPackaging(packaging: string): this {
        this.packaging = packaging;
        return this;
    }

    public setPrice(price: number): this {
        this.price = price;
        return this;
    }

    public setQuantity(quantity: number): this {
        this.quantity = quantity;
        return this;
    }

    public build() {
        const requiredProperties = [
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging,
            this.price,
            this.quantity,
        ];

        if (requiredProperties.some(property => property === undefined || property === null)) {
            throw new Error('All book properties are required.');
        }

        return {
            bookTitle: this.bookTitle,
            author: this.author,
            genre: this.genre,
            format: this.format,
            language: this.language,
            publisher: this.publisher,
            specialEdition: this.specialEdition,
            packaging: this.packaging,
            price: this.price,
            quantity: this.quantity,
        };
    }
}