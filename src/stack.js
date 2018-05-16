class Stack {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  pop() {
    this.items.length ? this.items.pop() : null;
  }

  last() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }
}

module.exports = Stack;
