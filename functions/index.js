const functions = require('firebase-functions');
const express = require('express');
const app = express();

const {getAllReminders, addReminder, deleteReminder, editReminder} = require('./APIs/reminders');

app.get("/reminders", getAllReminders);
app.post("/reminder", addReminder);
app.delete("/reminder/:reminderId", deleteReminder);
app.put("/reminder/:reminderId", editReminder);

const {
    loginUser,
    registerUser,
    uploadProfilePhoto,
    getUserDetails,
    updateUserDetails
} = require('./APIs/users');

const auth = require("./utils/auth");

app.post("/login", loginUser);
app.post("/register", registerUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetails);
app.put("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);