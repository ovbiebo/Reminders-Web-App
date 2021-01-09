const functions = require('firebase-functions');
const express = require('express');
const app = express();
const auth = require("./utils/auth");

const {getAllReminders, addReminder, getReminder, deleteReminder, editReminder} = require('./APIs/reminders');

//reminders use cases
app.get("/reminders", auth, getAllReminders);
app.post("/reminder", auth, addReminder);
app.get("/reminder/:reminderId", auth, getReminder);
app.delete("/reminder/:reminderId", auth, deleteReminder);
app.put("/reminder/:reminderId", auth, editReminder);

//user profile use cases
const {
    loginUser,
    registerUser,
    uploadProfilePhoto,
    getUserDetails,
    updateUserDetails
} = require('./APIs/users');

app.post("/login", loginUser);
app.post("/register", registerUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetails);
app.put("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);