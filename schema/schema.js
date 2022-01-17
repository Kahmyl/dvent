import graphql from 'graphql';
import { eventResolver, eventsResolver, bookingResolver, bookingsResolver, ticketResolver } from './Queries/EventSchema.js';
import { EventType, UserType, LoginType, BookingType} from './Types.js'
import { usersResolver } from './Queries/UserSchema.js';
import { loginResolver, createUserResolver, authResolver} from './mutations/usersMutation.js';
import { createEventResolver } from './mutations/eventsMutation.js';
import { BookEventsResolver } from './mutations/BookingsMutation.js';



const {GraphQLObjectType,  GraphQLString, GraphQLList, GraphQLNonNull, GraphQLSchema, GraphQLID} = graphql

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event: {
            type: EventType,
            args:{_id: { type: GraphQLID}},
            resolve: eventResolver
        },
        events: {
            type: new GraphQLList(EventType),
            resolve: eventsResolver
        },

        users: {
            type: new GraphQLList(UserType),
            resolve: usersResolver
        },

        user: {
            type:UserType,
            resolve: authResolver
        },

        bookings: {
            type: new GraphQLList(BookingType),
            resolve: bookingsResolver
        },

        booking: {
            type: BookingType,
            args:{
                event: { type: GraphQLID},
                user:  {type: GraphQLID}
            },
            resolve: bookingResolver
        },

        ticket: {
            type: new GraphQLList(BookingType),
            args:{
                user:  {type: GraphQLID}
            },
            resolve: ticketResolver
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                username: {type: new GraphQLNonNull( GraphQLString)},
                email: {type: new GraphQLNonNull( GraphQLString)},
                password: {type: new GraphQLNonNull( GraphQLString)}
            },

            resolve: createUserResolver
        },

        loginUser: {
            type: LoginType,
            args: {
                identity: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: loginResolver   
        },

        createEvent: {
            type: EventType,
            args: {
                title: {type: new GraphQLNonNull( GraphQLString)},
                description: {type: new GraphQLNonNull( GraphQLString)},
                image: {type: new GraphQLNonNull( GraphQLString)},
                price: {type: new GraphQLNonNull( GraphQLString)},
                date: {type: new GraphQLNonNull( GraphQLString)},
                user:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: createEventResolver
        },

        BookEvents: {
            type: BookingType,
            args: {
                user:{type: new GraphQLNonNull(GraphQLID)},
                event:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: BookEventsResolver
        }
    }
})



const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default schema
