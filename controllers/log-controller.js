let express = require('express');
let router = express.Router();

// importing validate-session so that this controller can use protected routes
let validateSession = require('../middleware/validate-session');

// alternatively, I can assign require('../db') to a variable and use that in place of the require db in const Log
const Log = require('../db').import('../models/log');

// router.get('/practice', validateSession, function (req, res) {
//     res.send('This is a practice route.')
// })

// log creation
// post: create a workout log with descriptions, definitions, results, and owner properties
router.post('/', validateSession, (req, res) => {
    const logEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner_id: req.user.id
    };
    Log.create(logEntry)
        .then(log => {
            res.status(200).json({
                log: log,
                message: `log entry created.`
            })
        })
        .catch(error => res.status(500).json({ error: error }))
})

// get: get all logs for the user who is logged in (requires login)
router.get('/', validateSession, (req, res) => {
    Log.findAll({
        where: // finds all logs that match the current user's id
        {
            owner_id: req.user.id
        }
    })
        .then(logs => {
            res.status(200).json({
                logs: logs,
                message: `${logs.length} log(s) found.`
            })
        })
        .catch(error => res.status(500).json({ error: error }))
});

// Search for and get an individual log by its id for the user who is logged in (requires login)
router.get('/:id', validateSession, (req, res) => {
    let logId = req.params.id // req.params.id points to the id in the URL, this id represents the id of the log the user wants to search for
    Log.findAll({ // findOne can work too, there should only be one entry per logId
        where:
        {
            owner_id: req.user.id, // matches the current user's id, the search must be a log the current user created (can't search for logs from other users)
            id: logId // matches the logId with id in the database
        }
    })
        .then(log => res.status(200).json(log))
        .catch(error => res.status(500).json({ error: error }))
});

// put: allow individual logs to be updated by a user
router.put('/:id', validateSession, (req, res) => {
    const updateLog = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result
    };
    const query = {
        where:
        {
            id: req.params.id,
            owner_id: req.user.id // req.user.id comes from user id in validateSession, possible to limit users to only update own logs (this update currently allows users to only update own logs)
        }
    };
    Log.update(updateLog, query)
        .then((logs) => res.status(200).json(logs))
        .catch((error) => res.status(500).json({ error: error }));
})

// delete: allow individual logs to be deleted by a user
router.delete('/:id', validateSession, (req, res) => {
    const query = {
        where:
        {
            id: req.params.id, // req.params.id points to the id in the URL, the 
            // owner_id: req.user.id // req.user.id comes from the user id in validateSession, possible to limit users to be able to delete only the user's own logs (for now, any logged in user can delete)
        }
    };
    Log.destroy(query)
        .then(
            onSuccess = (recordsChanged) => {
                if (recordsChanged !== 0) {
                    res.status(200).json({
                        message: "Log deleted.",
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                } else {
                    res.status(202).json({
                        message: 'Record was already removed',
                        numberOfRecordsChanged: `${recordsChanged} record(s) was/were changed.`
                    })
                }
            }
        )
        .catch((error) => res.status(500).json({ error: error }));
});

module.exports = router;

// get: get all logs (requires login)
// router.get('/', validateSession, (req, res) => {
//     Log.findAll()
//         .then(logs => res.status(200).json(logs))
//         .catch(error => res.status(500).json({ error: error }))
// });

// get: get all of an individual user's logs by a given id in req.params.id (requires login)
// router.get('/:id', validateSession, (req, res) => {
//     let id = req.params.id // req.params.id points to the id in the URL
//     Log.findAll({
//         where: // finds all where the params id matches the database owner_id
//         {
//             owner_id: id
//         }
//     })
//         .then(logs => res.status(200).json(logs))
//         .catch(error => res.status(500).json({ error: error }))
// });