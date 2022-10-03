"use strict";

const express = require('express');
const router = express.Router();

const monitoringCtrl = require("../controller/monitoringCtrl");


router.get("/", monitoringCtrl.main);

router.get("/send", monitoringCtrl.sensorSend);

router.route("/login")
    .get(monitoringCtrl.login)
    .post(monitoringCtrl.loginProcess);
router.get("/logout", monitoringCtrl.logoutProcess)


router.get("/log/:sensor", monitoringCtrl.log)
router.get("/log/down/:sensor", monitoringCtrl.log_down)
router.get("/log/del/:sensor", monitoringCtrl.log_del)


module.exports = router;