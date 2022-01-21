import Event from '../../Models/Event.js'
import Booking from '../../Models/Booking.js'

export const eventsResolver = async () => {
    const allEvents = await Event.find({});
    return allEvents;
}

export const eventResolver = async (parent, args) => {
    const singleEvent = await Event.findById(args._id)
    return singleEvent;
}

export const bookingsResolver = async () => {
    const allBookings = await Booking.find({});
    return allBookings
}

// export const bookingResolver = async (parent, args) => {
//     const singleBook = await Booking.find({event: args.event})
//     return singleBook;
// }

export const ticketResolver = async ( parent, args ) => {
    const Book = await Booking.find({ user: args.user})
    return Book;
}