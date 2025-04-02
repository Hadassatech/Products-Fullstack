
class Product {
    constructor(id, name, description, price, created_at, user_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.created_at = created_at;
        this.user_id = user_id;
    }
}
module.exports = Product;
