import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/tickets';

const apiService = {
    getAllTickets: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching tickets:', error.message);
            throw error.response?.data || error.message;
        }
    },

    createTicket: async (ticketData) => {
        try {
            const response = await axios.post(API_BASE_URL, ticketData);
            return response.data;
        } catch (error) {
            console.error('Error creating ticket:', error.message);
            throw error.response?.data || error.message;
        }
    },
};

export default apiService;
