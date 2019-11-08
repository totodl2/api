module.exports = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
};
