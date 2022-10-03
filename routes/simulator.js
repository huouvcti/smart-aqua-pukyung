var express = require('express');
var router = express.Router();

const simulatorCtrl = require("../controller/simulatorCtrl");

const halibutCtrl = require("../controller/halibutCtrl");

const adminCtrl = require("../controller/adminCtrl");



router.get('/', simulatorCtrl.main);

router.route("/login")
    .get(simulatorCtrl.login)
    .post(simulatorCtrl.loginProcess);
router.get("/logout", simulatorCtrl.logoutProcess);

router.get('/halibut/:user_key', halibutCtrl.main);


router.get('/halibut/show/all', halibutCtrl.show.all);

router.post('/halibut/set/temp', halibutCtrl.set.temp);
router.post('/halibut/set/TF', halibutCtrl.set.TF);
router.post('/halibut/set/OF', halibutCtrl.set.OF);


router.get('/admin', adminCtrl.main);

module.exports = router;