const express = require('express');
const router = express.Router();
const validate = require("../middleware/validate-middleware");
const Schema = require("../validator/contact-validator");
const contactController = require("../controllers/contact.-controllers");



router
.route('/contact')
.post(validate(Schema.contactSchema), contactController.constactForm)

router
.route('/subscribeEmail')   
.post(validate(Schema.emailSchema), contactController.subscribeEmail)

router
.route('/bugReport')
.post(validate(Schema.bugReportSchema), contactController.bugReport)


module.exports = router;