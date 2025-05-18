// src/models/Ticket.js
class Ticket {
    constructor(id, vendorId) {
        this.id = id;
        this.vendorId = vendorId;
        this.createdAt = new Date();
        this.status = 'available'; // available, sold
    }
}

module.exports = Ticket;