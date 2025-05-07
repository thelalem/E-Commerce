// Request DTO for creating or updating an order
export class OrderRequestDTO {
    constructor({ buyer, products, totalPrice, status }) {
        this.buyer = buyer;
        this.products = products;
        this.totalPrice = totalPrice;
        this.status = status;
    }
}

// Response DTO for returning order data
export class OrderResponseDTO {
    constructor({ _id, buyer, products, totalPrice, status, createdAt }) {
        this.id = _id;
        this.buyer = buyer;
        this.products = products;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
    }
}