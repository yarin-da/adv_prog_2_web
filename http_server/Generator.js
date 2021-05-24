// a (very) simple ID generator
class Generator {
  constructor() {
    this.id = -1;
  }

  next() {
    this.id += 1;
    return this.id;
  }
}

module.exports = Generator;