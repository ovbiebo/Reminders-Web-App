const {firestore} = require("firebase-admin/lib/firestore");
const {database} = require('../utils/admin')

exports.getAllReminders = (request, response) => {
    database
        .collection('Reminders')
        .where("owner", "==", request.user.uid)
        .orderBy('Start', "desc")
        .get()
        .then((data) => {
                let reminders = [];
                data.forEach((doc) => {
                    reminders.push({
                        reminderId: doc.id,
                        startTime: doc.data().Start,
                        endTime: doc.data().End,
                        subject: doc.data().Subject,
                    });
                });
                return response.json(reminders);
            }
        )
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
}

exports.getReminder = (request, response) => {
    const document = database
        .collection('Reminders')
        .doc(request.params.reminderId);

    document
        .get()
        .then((reminder) => {
            response.json({
                reminderId: reminder.id,
                startTime: reminder.data().Start,
                endTime: reminder.data().End,
                subject: reminder.data().Subject,
            });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
}

exports.addReminder = (request, response) => {
    if (request.body.subject.trim() === '') {
        return response.status(400).json({body: 'Must not be empty'});
    }

    const newReminder = {
        owner: request.user.uid,
        Start: firestore.Timestamp.fromDate(new Date()),
        End: firestore.Timestamp.fromDate(new Date()),
        Subject: request.body.subject
    }

    database.collection("Reminders")
        .add(newReminder)
        .then((docRef) => {
            const responseReminder = newReminder;
            responseReminder.id = docRef.id;
            return response.json(responseReminder);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
}

exports.deleteReminder = (request, response) => {

    const document = database.collection("Reminders").doc(request.params.reminderId);

    document
        .get()
        .then((docRef) => {
            if (!docRef.exists) {
                if(doc.data().owner !== request.user.uid){
                    return response.status(403).json({error:"UnAuthorized"})
                }
                return response.status(404).json({error: 'Reminder not found'});
            }
            return document.delete();
        })
        .then(() => {
            response.json({message: 'Delete successful'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
}

exports.editReminder = (request, response) => {

    const document = database.collection("Reminders").doc(request.params.reminderId);

    document
        .set(request.body, {merge: true})
        .then(() => {
            response.json({message: 'Update successful'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
}