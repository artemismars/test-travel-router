const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../models");
/**
 * @swagger
 * tags:
 *  name: User
 *  description: 유저 테이블에 관련된 라우팅
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - nickname
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The auto generated id of user
 *        email:
 *          type: string
 *          description: user email
 *        nickname:
 *          type: string
 *          description: user nickname
 *        password:
 *          type: string
 *          description: password encrypted by bcryptjs
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *        example: example@example.com
 *      nickname:
 *        type: string
 *        example: example
 *      password:
 *        type: string
 *        example: 123123
 * @swagger
 *  /users:
 *      get:
 *          tags:
 *          - User
 *          summary: get all users
 *          responses:
 *              200:
 *                  description: successful access
 *              400:
 *                  description: Failed
 */

router.get("/users", async (req, res) => {
  try {
  } catch (error) {}
});

/**
 * @swagger
 * /signup/1:
 *  post:
 *    tags:
 *    - User
 *    summary: 중복 이메일 확인
 *    produces:
 *    - application/json
 *    requestBody:
 *      description: request body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *          example:
 *            email: example@example.com
 *    responses:
 *      200:
 *        description: 사용 가능한 이메일입니다.
 *      400 :
 *        description: 이미 가입된 이메일입니다.
 */

router.post("/signup/1", auth.doubleCheck, (req, res) => {
  try {
    if (res.locals.user === null)
      res.json({ message: "사용 가능한 이메일입니다." });
    else throw new Error("이미 가입된 메일입니다.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /signup/2:
 *    post:
 *      tags:
 *      - User
 *      summary: store user account into db
 *      produces:
 *      - application/json
 *      requestBody:
 *        description: request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example:
 *              email: example@example.com
 *              nickname: example
 *              password: '123123'
 *      responses:
 *        200:
 *          description: successful signup
 *        400:
 *          description: Faild
 */
router.post("/signup/2", auth.emailVerification, async (req, res) => {
  try {
    // 회원 이메일 중복 확인 버튼 클릭하고 회원가입 진행하는 건지 곧바로 회원가입 시도하는 것인지 감지하기 위한 if문
    if (res.locals.user) {
      const user = await db.User.create(res.locals.user);
      console.log(user);
      res.json({
        message: "가입하신 이메일로 인증 링크를 발송했습니다.",
        user: res.locals.user,
      });
    } else {
      throw new Error("비정상적 접근입니다.");
    }
  } catch (error) {
    res.status(400).json({ error: error.messasge });
  }
});
/**
 * @swagger
 * /signup/:verificationToken:
 *  get:
 *    tags:
 *    - User
 *    summary: generate email verification token
 *    parameters:
 *      - in: path
 *        name: verificationToken
 *        schema:
 *          type: string
 *        required: true
 *        description: Verify Email Verification Token
 *
 */
router.get("/signup/:verificationToken", async (req, res) => {
  try {
    const token = req.params.verificationToken;
    const user = await db.User.findOne({
      attributes: ["id", "verificationToken"],
      where: {
        verificationToken: token,
      },
    });
    await user.update({ isVerified: true });
    await user.save();
    res.json({ message: "인증 완료되었습니다. 이제 로그인 하실 수 있습니다." });
  } catch (error) {
    res.json({ error: error.message });
  }
});

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *    - User
 *    summary: user login
 *    produces:
 *      application/json
 *      application/xml
 *    requestBody:
 *      description: request body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *          example:
 *            email: example@example.com
 *            password: 123123
 *    responses:
 *      200:
 *        description: successful login
 *      400:
 *        description: failed to login
 */

router.post("/login", async (req, res) => {
  try {
    const user = db.User.findOne({
      attributes: ["email", "nickname", "password", "isVerified"],
      where: {
        email: req.body.email,
      },
    });
    if (user.isVerified) {
      res.json({ isVerified: true });
    } else {
      throw new Error({ isVerified: false });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
