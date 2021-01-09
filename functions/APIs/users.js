const config = require("../utils/config");

const {database, admin} = require("../utils/admin");

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

//registers a new user allowing them to have the same username as another user
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
        //gets user token as user is signed in automatically
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
        //responds to client
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

deleteImage = (imageName) => {
    const storageBucket = admin.storage().bucket();
    const path = `${imageName}`
    return storageBucket.file(path).delete()
        .then(() => {
            return
        })
        .catch((error) => {
            return
        })
}

exports.uploadProfilePhoto = (request, response) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({headers: request.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({error: 'Wrong file type submitted'});
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${request.user.uid}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    });

    deleteImage(imageFileName);

    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                destination: `images/${imageFileName}`,
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/images/${imageFileName}?alt=media`;
                return database.doc(`/Users/${request.user.uid}`).set({
                    imageUrl
                }, {merge: true});
            })
            .then(() => {
                return response.json({message: 'Image uploaded successfully'});
            })
            .catch((error) => {
                console.error(error);
                return response.status(500).json({error: error.code});
            });
    });

    busboy.end(request.rawBody);
}

exports.getUserDetails = (request, response) => {
    let userData = {};
    database
        .collection("Users")
        .doc(request.user.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.userCredentials = doc.data();
                return response.json(userData);
            }
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({error: error.code});
        });
}

exports.updateUserDetails = (request, response) => {
    database
        .collection("Users")
        .doc(request.user.uid)
        .set(
            request.body,
            {merge: true}
        )
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({message: "Cannot Update the value"});
        });
}