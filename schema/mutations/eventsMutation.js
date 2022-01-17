import Event from "../../Models/Event.js";

export const createEventResolver = async (parent, args, req) => {
    let event = new Event({
        title: args.title,
        description: args.description,
        price: args.price,
        date: new Date(args.date),
        user: args.user,
        image: args.image
    });
    const storeEvent = await event.save()
    return storeEvent;
}