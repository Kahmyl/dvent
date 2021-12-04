import graphql from 'graphql';
import bcrypt from 'bcrypt'
import User from '../Models/User.js'
import Event from '../Models/Event.js'
import Booking from '../Models/Booking.js'
import jwt from 'jsonwebtoken'

import { EventType, UserType, LoginType, BookingType} from './Types.js'


const {GraphQLObjectType,  GraphQLString, GraphQLList, GraphQLNonNull, GraphQLSchema, GraphQLFloat, GraphQLID} = graphql


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event: {
            type: EventType,
            args:{_id: { type: GraphQLID}},
            async resolve(parent, args){
                const singleEvent = await Event.findById(args._id)
                return singleEvent;
            }
        },
        events: {
            type: new GraphQLList(EventType),
            async resolve(){
                const allEvents = await Event.find({});
                return allEvents;
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(){
                return User.find({});
            }
        },

        bookings: {
            type: new GraphQLList(BookingType),
            async resolve(parent, args, req){
                if (!req.isAuth){
                    throw new Error('Not Logged in')
                }
                const allBookings = await Booking.find({});
                return allBookings
            }
        },

        validated: {
            type: UserType,
            args:{_id: { type: GraphQLID}},
            async resolve(parent, args, req){
                const payload = jwt.verify(req.cookies.token, 'secret123');
                if (payload){
                    const singleEvent = await User.findById(payload.userId)
                    return singleEvent;
                }
            }
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

            async resolve(parent, args, res) {
                const user = await User.findOne({username: args.username})
                const user1 = await User.findOne({email: args.email})
                if(user) {
                    throw new Error('Username taken')
                }
                else if(user1){
                    throw new Error('Email already exists')
                }else{
                    const user = await new User({
                        username: args.username,
                        email: args.email,
                        password: args.password
                    });
                    const storeUser = await user.save()
                    if (storeUser){
                        const token = await jwt.sign({userId:user._id, username: user.username, email:user.email}, 'secret123',  {
                            expiresIn: '1h'
                        })
                        const userDetails = await ({
                            username: user.username,
                            email: user.email,
                            token: token,
                            tokenExpiration: 1
                        });
                        return userDetails
                    }
                } 
            }
        },

        loginUser: {
            type: LoginType,
            args: {
                identity: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            async resolve(parent, args, context) {
                const user = await User.findOne({email: args.identity}) || await User.findOne({username: args.identity}) ;
                if (!user){
                    throw new Error('Email or Username does not exist')
                }else{
                    const isMatch = await bcrypt.compare(args.password, user.password);
                    if (!isMatch) {
                        throw new Error('Incorrect password')
                    } else {
                        const token = await jwt.sign({userId:user._id, username: user.username, email:user.email}, 'secret123', {
                            expiresIn: '1h'
                        })
                        const userDetails = await ({
                            username: user.username,
                            userId: user._id,
                            token: token,
                            tokenExpiration: 1
                        });
                        return userDetails
                    }
                }
            }   
        },

        createEvent: {
            type: EventType,
            args: {
                title: {type: new GraphQLNonNull( GraphQLString)},
                description: {type: new GraphQLNonNull( GraphQLString)},
                price: {type: new GraphQLNonNull( GraphQLFloat)},
                user:{type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args, req) {
                if (!req.isAuth){
                    throw new Error('Not Logged in')
                }
                let event = new Event({
                    title: args.title,
                    description: args.description,
                    price: args.price,
                    user: args.user
                });
                const storeEvent = await event.save()
                return storeEvent;
            }
        },

        BookEvents: {
            type: BookingType,
            args: {
                user:{type: new GraphQLNonNull(GraphQLID)},
                event:{type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args, req) {
                if (!req.isAuth){
                    throw new Error('Not Logged in')
                }
                let booking = new Booking({
                    event: args.event,
                    user: args.user
                });
                const storeBooking = await booking.save()
                return storeBooking;
            }
        },
        UnBook: {
            type: BookingType,
            args: {
                BookingId: {type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args, req){
                if (!req.isAuth){
                    throw new Error('Not Logged in')
                }
                await Booking.deleteOne({_id: args.BookingId});
                const message = 'Unbooked';
                return message;
            }
        }
    }
})



const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default schema
