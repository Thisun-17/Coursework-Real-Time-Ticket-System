// src/models/TicketPool.js
const Ticket = require('./Ticket');
const logger = require('../utils/logger');

class TicketPool {
    constructor(maxCapacity, totalTickets) {
        this.tickets = [];
        this.maxCapacity = maxCapacity;
        this.totalTickets = totalTickets;
        this.ticketsProduced = 0;
        this.ticketsSold = 0;
    }

    async addTicket(vendorId) {
        if (this.ticketsProduced >= this.totalTickets ||
            this.tickets.length >= this.maxCapacity) {
            return false;
        }

        const ticket = new Ticket(++this.ticketsProduced, vendorId);
        this.tickets.push(ticket);
        logger.info(`Ticket #${ticket.id} added by vendor ${vendorId}`);
        return true;
    }

    async removeTicket(customerId, isVip = false) {
        if (this.tickets.length === 0) {
            return null;
        }

        let ticket;
        if (isVip) {
            ticket = this.tickets.shift(); // VIP gets first ticket
        } else {
            ticket = this.tickets.pop(); // Regular customer gets last ticket
        }

        if (ticket) {
            this.ticketsSold++;
            ticket.status = 'sold';
            logger.info(`Ticket #${ticket.id} sold to ${customerId} (VIP: ${isVip})`);
        }

        return ticket;
    }

    getStatistics() {
        return {
            available: this.tickets.length,
            produced: this.ticketsProduced,
            sold: this.ticketsSold,
            isComplete: this.ticketsSold >= this.totalTickets
        };
    }
}

module.exports = TicketPool;