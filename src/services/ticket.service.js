import TicketModel from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(ticketData) {
        const ticket = new TicketModel(ticketData);
        return await ticket.save();
    }
}

export default new TicketService();