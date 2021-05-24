// a (very) simple ID generator
class Generator {
  constructor() {
    this.id = -1;
  }

  next() {
    // simply increment id with each call to next
    // to make sure that each call returns a unique id
    this.id += 1;
    return this.id;
  }
}

module.exports = Generator;