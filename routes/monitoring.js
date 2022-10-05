"use strict";

const express = require('express');
const router = express.Router();

const monitoringCtrl = require("../controller/monitoringCtrl");

const adminCtrl = require("../controller/monitoring_adminCtrl");


router.get("/", monitoringCtrl.main);

router.get("/send", monitoringCtrl.sensorSend);

router.route("/login")
    .get(monitoringCtrl.login)
    .post(monitoringCtrl.loginProcess);
router.get("/logout", monitoringCtrl.logoutProcess)


router.get("/log/:sensor", monitoringCtrl.log)
router.get("/log/down/:sensor", monitoringCtrl.log_down)
router.get("/log/del/:sensor", monitoringCtrl.log_del)


router.get('/admin', adminCtrl.main);

router.route("/admin/login")
    .get(adminCtrl.login)
    .post(adminCtrl.loginProcess);
router.get("/admin/logout", adminCtrl.logoutProcess);


module.exports = router;