require("dotenv").config();
const db = require("../config/db");
const { dropUser, createUser } = require("./sql");

(async () => {
  try {
    await db.query(dropUser);
    await db.query(createUser);
    console.log("seed");
  } catch (error) {
    console.log(error);
  }
})();
