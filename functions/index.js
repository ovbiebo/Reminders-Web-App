const functions = require('firebase-functions');
const app = require('express')();

const {getAllReminders} = require('./APIs/reminders');

app.get("/reminders", getAllReminders);

exports.api = functions.https.onRequest(app);