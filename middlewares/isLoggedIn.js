import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken} from "../utils/verifyToken.js";
export const isLoggedIn = (req, res, next) => {
    //check if user is providing token in header
    const token = getTokenFromHeader(req);
    //verify token
    const decodedUser = verifyToken(token);
    if(!decodedUser) {
        throw new Error('Invalid/Expired token, please login again.')
    } else {
        //save user in req obj
        req.userAuthId = decodedUser?.id;
        next();
    }
}