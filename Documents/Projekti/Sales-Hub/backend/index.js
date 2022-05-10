const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const dotenv = require("dotenv");

// Environment config
dotenv.config();

// Import routes
const login = require("./routes/api/login");
const evaluations = require("./routes/api/evaluations");
const shopReports = require("./routes/api/shopReports");
const actionPlans = require("./routes/api/actionPlans");
const coachings = require("./routes/api/coachings");
const feedbacks = require("./routes/api/feedbacks");
const evaluation7P = require("./routes/api/7pEvaluations");
const users = require("./routes/api/users");
const shops = require("./routes/api/shops");
const regions = require("./routes/api/regions");

// Create express app server
const app = express();

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());

require("./config/passport")(passport);

// Connecting to the Mongo db
const db = require("./config/keys").mongoURI;
console.log(db);
mongoose
  .connect(db, {
    useMongoclient: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

// Cors middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Use routes
app.use("/api", login);
app.use("/api/evaluations", evaluations);
app.use("/api/shopReports", shopReports);
app.use("/api/actionPlans", actionPlans);
app.use("/api/coachings", coachings);
app.use("/api/feedbacks", feedbacks);
app.use("/api/7ps", evaluation7P);
app.use("/api/users", users);
app.use("/api/shops", shops);
app.use("/api/regions", regions);

// Server listener
const port = process.env.BPORT || 3002;

app.listen(port, () => console.log(`Server started to listen on port ${port}`));
