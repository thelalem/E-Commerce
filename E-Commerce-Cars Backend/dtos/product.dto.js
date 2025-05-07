export class ProductResponseDTO {
    constructor({ _id, name, description, price, category, location, imageUrl, seller, createdAt }) {
        this.id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.seller = seller;
        this.createdAt = createdAt;
    }
}
