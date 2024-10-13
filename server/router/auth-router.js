const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers");
const signupSchema = require("../validator/auth-validator");
const Schema = require("../validator/contact-validator");
const schemaMiddleware = require("../middleware/validate-middleware");
const Otp = require("../validator/otp-validator");
const authToken = require("../middleware/auth-token");
const otpMiddleware = require("../middleware/otpMiddleware");
const firebaseValidator = require("../middleware/firbase-validator");

// two ways to write the same thing
// router.get("/", (req, res) => {
//   res.status(200).send("from the auth-router.js file");
// });
// but this is the preferred way


router
  .route("/register")
  .post(schemaMiddleware(signupSchema), authControllers.register);
router
  .route("/login")
  .post(authControllers.login);
router
  .route("/validateUser")
  .post(schemaMiddleware(Schema.emailSchema), otpMiddleware(), authControllers.otp);
router
  .route("/validateOtp")
  .post(schemaMiddleware(Otp.otpSchema), otpMiddleware(), authControllers.validateOtp);
router
  .route("/forgotPassword")
  .post(schemaMiddleware(Schema.emailSchema), authControllers.forgotPassword);
router
  .route("/validatePassResetOTP")
  .post(schemaMiddleware(Otp.resetOtpSchema), authControllers.validatePassResetOTP);
router
  .route("/loginWithSocialMedia")
  .post(firebaseValidator, authControllers.loginWithSocialMedia);
router
  .route("/tokenValidation")
  .post(authToken,(req,res)=>{
    res.status(200).json({msg:"Token is valid",isAdmin:req.user.isAdmin});
  });

module.exports = router;
