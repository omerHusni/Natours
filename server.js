/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION , the app crashed 💥💥💥 ...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//DB connection and some Validation
//mongoose.connect return a promise and we must handle it with then
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connnected seccesfully !');
  });

//Server listening to the port
const port = 8080;
const server = app.listen(port, () => {
  console.log(`hello from the server ${port}... 🔥🔥🔥`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION , the app crashed 💥💥💥 ...');
  server.close(() => process.exit(1));
});
