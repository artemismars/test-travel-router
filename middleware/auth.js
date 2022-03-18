const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const db = require("../config/db");
const db = require("../models/index");

const doubleCheck = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      attributes: ["email"],
      where: {
        email: req.body.email,
      },
    });
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const emailVerification = async (req, res, next) => {
  try {
    let user = req.body;
    console.log(user);
    user.password = bcrypt.hashSync(user.password, 8);
    user.verificationToken = jwt.sign(user.email, process.env.JWT_SECRET);
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      auth: {
        user: process.env.ADMIN_USER,
        pass: process.env.ADMIN_PASS,
      },
    });
    transport.sendMail({
      from: process.env.ADMIN_USER,
      to: user.email,
      subject: "이메일 인증 링크 발송 메일",
      html: `
      <h1>회원 가입을 축하드립니다. 아래의 이메일 인증 링크를 클릭하여 회원가입을 완료해주시기 바랍니다.</h1>
      <a href='http://localhost:3000/signup/${user.verificationToken}'>이메일 인증 링크</a>
      `,
    });
    res.locals.user = user;
    next();
  } catch (error) {
    res.send({ error: error.message });
  }
};

const emailVerification2 = async (req, res, next) => {
  // try {
  //   console.log(`email verification start`);
  //   let user = req.body;
  //   const [rows, fields] = await db.query(
  //     "SELECT email FROM users WHERE email = ?",
  //     user.email
  //   );
  //   console.log("result:", rows);
  //   user.password = bcrypt.hashSync(user.password, 8);
  //   const transport = nodemailer.createTransport({
  //     service: "gmail",
  //     host: "smtp.gmail.com",
  //     auth: {
  //       user: process.env.ADMIN_USER,
  //       pass: process.env.ADMIN_PASS,
  //     },
  //   });
  //   user.emailToken = jwt.sign(user.email, process.env.JWT_SECRET);
  //   console.log(user.emailToken);
  //   await db.query(`INSERT INTO users SET ?`, user, (err, result) => {
  //     if (err) throw err;
  //     //return res.json({ message: "successfully signup!" });
  //     //   next();
  //   });
  //   transport
  //     .sendMail({
  //       from: `admin <${process.env.ADMIN_USER}>`,
  //       to: process.env.USER_EMAIL,
  //       subject: "Travel Route App Email verification link",
  //       html: `
  //               <a href='http://localhost:3000/verification/${user.emailToken}'>Email Verificatrion Link</a>
  //               `,
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  //   res.locals.user = user;
  //   console.log("here2");
  //   next();
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  // }
};

module.exports = {
  emailVerification,
  doubleCheck,
};
