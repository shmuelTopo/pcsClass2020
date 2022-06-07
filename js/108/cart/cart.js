module.exports = class Cart {
  constructor(cart) {
    this.items = cart?.items || {};
  }

  addItem(itemId, quantity) {
    //{ 1: 2, 2: 5 }
    const q = this.items[itemId] || 0;
    this.items[itemId] = q + quantity;
  }

  getItems() {
    return this.items;
  }
}