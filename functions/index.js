const functions = require('firebase-functions');
const express = require('express');
const app = express();

const {getAllReminders, addReminder, deleteReminder, editReminder} = require('./APIs/reminders');

app.get("/reminders", getAllReminders);
app.post("/reminder", addReminder);
app.delete("/reminder/:reminderId", deleteReminder);
app.put("/reminder/:reminderId", editReminder);

const {loginUser, registerUser} = require('./APIs/users');

app.post("/login", loginUser);
app.post("/register", registerUser);

exports.api = functions.https.onRequest(app);