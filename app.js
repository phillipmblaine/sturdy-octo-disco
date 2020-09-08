require("dotenv").config();
let express = require('express');
let app = express();

// require imports stuff
let sequelize = require('./db');

sequelize.sync();
// sequelize.sync({ force: true });

// use is a method from Express framework, creates route to access any functions at the provided endpoint of a controller
app.use(require('./middleware/headers'));

app.use(express.json());

let log = require('./controllers/log-controller');

let user = require('./controllers/user-controller');

// app.use('/test', function (req, res) {
//     res.send('This is a message from the test endpoint on the server.')
// })

app.use('/user', user);

// if we imported validate-session, anything below validate-session would require a token to access (protected), this method won't be used but is here for reference
// app.use(require('./middleware/validate-session'));

app.use('/log', log);

app.listen(3000, function () {
    console.log('App is listening on port 3000.');
})