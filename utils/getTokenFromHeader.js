//get token from header
//.authorization to get value from auth key
//.split(" ") to make array of bearer, token
//[1] to get the token
// ?. to check if have each of them 
export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token === undefined){
        return "No token found";
    } else {
        return token;
    };
};
