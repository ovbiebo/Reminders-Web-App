const config = require("../utils/config");

const {database} = require("../utils/admin");

const {firestore} = require("firebase-admin/lib/firestore")

const firebase = require("firebase");
firebase.initializeApp(config);

const {validateLoginData, validateSignUpData} = require("../utils/validators");

exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const {valid, errors} = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(
        user.email,
        user.password
    )
        .then((userCredential) => {
            return userCredential.user.getIdToken();
        })
        .then((token) => {
            return response.json({token});
        })
        .catch((error) => {
            console.error(error);
            return response.status(403).json({
                general: 'invalid credentials, please try again'
            });
        })
}

exports.registerUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        country: request.body.country,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        username: request.body.username
    }

    const {valid, errors} = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    let userId, token;

    //creates user
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password
    )
        //gets user token
        .then((userCredential) => {
            userId = userCredential.user.uid;
            return userCredential.user.getIdToken();
        })
        //creates user document in collection
        .then((idToken) => {
            token = idToken;

            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                country: newUser.country,
                username: newUser.username,
                createdAt: firestore.Timestamp.fromDate(new Date()),
            }

            return database
                .collection("Users")
                .doc(userId)
                .set(userCredentials);
        })
        .then(() => {
            response.status(201).json({token})
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({email: 'Email already in use'});
            } else {
                return response.status(500).json({general: 'Something went wrong, please try again '});
            }
        })
}