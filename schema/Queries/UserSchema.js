import User from "../../Models/User.js";

export const usersResolver = async () => {
    return User.find({});
}