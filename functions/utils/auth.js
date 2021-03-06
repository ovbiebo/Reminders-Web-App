const {database, admin} = require("./admin");

module.exports = (request, response, next) => {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return response.status(403).json({ error: 'Unauthorized' });
    }
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            request.user = decodedToken;
            return database.collection('Users').doc(request.user.uid).get();
        })
        .then((user) => {
            request.user.username = user.data().username;
            request.user.imageUrl = user.data().imageUrl;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token', err);
            return response.status(403).json(err);
        });
}