import mongoose  from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    user: {type:Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date }
});


const Event = mongoose.model('Event', eventSchema);

export default Event