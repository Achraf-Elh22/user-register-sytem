const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

// Config file
dotenv.config({ path: 'config.env' });

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully 👍👍'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App Running on port ${PORT}`));

// TODO:
//   _ Build the basic structure [*]
//   _ Build the structure of signUp & logIn Routes [*]
//   _ Build the DB Schema [*]
//   _ Build the signUp Routes Logic [*]
//   _ Add Validators to the Schema [*]
//   _ Set up JWT [*]
//   _ Send the Token as cookies [*]
//   _ Login [*]
//   _ Protect the dashboard [*]
//   _ Logout [*]
//   _ FEATURE: reset password []
//   _ Do research on who to make this app more secure[]
