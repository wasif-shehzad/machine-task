require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV;

//Connection string is created from environment file.
let connectionString =
  "mongodb://" +
  process.env.DB_HOST +
  ":" +
  process.env.DB_PORT +
  "/" +
  process.env.DB_NAME;

// const mongoDB = connectionString;

// mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;

// db.on("error", function () {
//   console.log("Error connecting to DB");
// });

//Starting the server
// db.once("open", function () {
//   console.log("DB connected", connectionString);
//   app.listen(port, "0.0.0.0", function () {
//     console.log(`Server is running on ${port} and in ${environment} environment`);
//   });
// });

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected", connectionString);
  })
  .catch((err) => {
    console.log("Error connecting to DB: ", err.message);
  });

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is running on ${port} and in ${environment} environment`);
});
