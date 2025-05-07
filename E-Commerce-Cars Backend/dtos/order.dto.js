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