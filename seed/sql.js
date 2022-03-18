const dropUser = `DROP TABLE users`;
const createUser = `CREATE TABLE users (
    id int AUTO_INCREMENT,
    email VARCHAR(25),
    nickname VARCHAR(25),
    password VARCHAR(60),
    isVerified BOOLEAN DEFAULT false,
    emailToken VARCHAR(100),
    PRIMARY KEY (id)
)`;

module.exports = { dropUser, createUser };
