const functions = require('firebase-functions');
const express = require('express');
const app = express();

const {getAllReminders, addReminder, deleteReminder, editReminder} = require('./APIs/reminders');

app.get("/reminders", getAllReminders);
app.post("/reminder", addReminder);
app.delete("/reminder/:reminderId", deleteReminder);
app.put("/reminder/:reminderId", editReminder);

const {loginUser} = require('./APIs/users');

app.post("/login", loginUser);

exports.api = functions.https.onRequest(app);