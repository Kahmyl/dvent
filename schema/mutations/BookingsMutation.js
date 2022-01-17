import Booking from "../../Models/Booking.js";

export const BookEventsResolver = async (parent, args, req) => {
    let booking = new Booking({
        event: args.event,
        user: args.user
    });
    const storeBooking = await booking.save()
    return storeBooking;
}