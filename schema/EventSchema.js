import Event from '../Models/Event.js'

export const eventResolver = async (parents, args) => {
    const allEvents = await Event.find({});
    return allEvents;
}