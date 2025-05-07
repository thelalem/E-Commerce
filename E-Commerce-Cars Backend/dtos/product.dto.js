// Request DTO for creating or updating a product
export class ProductRequestDTO {
    constructor({ name, description, price, category, location, imageUrl, seller, stock }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.seller = seller;
        this.stock = stock;
    }
}

// Response DTO for returning product data
export class ProductResponseDTO {
    constructor({ _id, name, description, price, category, location, imageUrl, seller, stock, createdAt }) {
        this.id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.seller = seller;
        this.stock = stock;
        this.createdAt = createdAt;
    }
}
