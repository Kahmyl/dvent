import Event from '../Models/Event.js'

export const eventResolver = {
    Query: {
        events: async (root) => {
            const allEvents = await Event.find({});
            return allEvents;
        }
    }
}
