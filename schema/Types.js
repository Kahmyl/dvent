import graphql from 'graphql';
import User from '../Models/User.js'
import Event from '../Models/Event.js'
import pkg from 'graphql-iso-date';


const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLFloat, GraphQLID} = graphql
const { GraphQLDateTime } = pkg;

export const BookingType = new GraphQLObjectType({
    name: 'Booking',
    fields: () => ({
        _id: {type: GraphQLID},
        event: {
            type: EventType,
            async resolve(parent, args){
                const eventBooked = await Event.findById(parent.event);
                return eventBooked;
            }
        },
        user: {
            type: UserType,
            async resolve(parent, args){
                const userBooked = await User.findById(parent.user);
                return userBooked;
            }
        },
        createdAt: {type: GraphQLDateTime},
        updatedAt: {type: GraphQLDateTime}
    })
})

export const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        _id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        price: {type: GraphQLFloat},
        date: {type: GraphQLDateTime},
        user: {
            type: UserType,
            async resolve(parent, args){
                const eventUser = await User.findById(parent.user);
                return eventUser;
            }
        }
    })
});

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLID},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        token: {type: GraphQLString},
        tokenExpiration: {type: GraphQLInt},
        date: {type: GraphQLDateTime},
        events:{
            type: new GraphQLList(EventType),
            async resolve(parent, args){
                const userEvent = await Event.find({user: parent._id});
                return userEvent;
            }
        }
    })
});

export const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        userId: {type: GraphQLID},
        username:{type: GraphQLString},
        token: {type: GraphQLString},
        tokenExpiration: {type: GraphQLInt},
    })
})