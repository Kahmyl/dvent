import Event from '../Models/Event.js'

export const eventQuery = async (parent, args) => {
    const singleEvent = await Event.findById(args._id)
    return singleEvent;
}