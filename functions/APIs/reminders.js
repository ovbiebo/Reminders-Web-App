const {database} = require('../utils/admin')

exports.getAllReminders = (request, response) => {
    database
        .collection('Reminders')
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