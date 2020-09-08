const Sequelize = require('sequelize');
const sequelize = new Sequelize('workout-log', 'postgres', process.env.PASS,
    {
        host: 'localhost',
        dialect: 'postgres'
    });

sequelize.authenticate()
    .then(
        function () {
            console.log('Connected to the workout-log postgres database.');
        },
        function (error) {
            console.log(error);
        }
    );

module.exports = sequelize;