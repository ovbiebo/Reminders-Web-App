const functions = require('firebase-functions');
const express = require('express');
const app = express();

const {getAllReminders, addReminder, deleteReminder, editReminder} = require('./APIs/reminders');

// middleware
app.use(express.json());
app.use(express.urlencoded());

app.get("/reminders", getAllReminders);
app.post("/reminder", addReminder);
app.delete("/reminder/:reminderId", deleteReminder);
app.put("/reminder/:reminderId", editReminder);

exports.api = functions.https.onRequest(app);