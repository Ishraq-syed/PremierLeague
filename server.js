const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config({path: './config.env'});
const app = require('./src/app');

const encodedPassword = encodeURIComponent(process.env.PASSWORD);
const DB = process.env.DATABASE.replace('<PASSWORD>', encodedPassword);

//const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => {
    console.log('Database connection Successful!');
});



const port = process.env.port || 8000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}!!`)
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection!!', err);
    server.close(()=> {
        console.log('Shutting Down!!');
        process.exit(1);
    });
})

