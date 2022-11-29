var express = require('express');
var router = express.Router();

const simulatorCtrl = require("../controller/simulatorCtrl");

const halibutCtrl = require("../controller/halibutCtrl");
const eelCtrl = require("../controller/eelCtrl");

const adminCtrl = require("../controller/simulator_adminCtrl");



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

router.post('/halibut/set/clear', halibutCtrl.set.clear);
router.post('/halibut/set/clearAll', halibutCtrl.set.clearAll);


router.get('/eel/:user_key', eelCtrl.main);

router.get('/eel/show/all', eelCtrl.show.all);

router.post('/eel/set/temp', eelCtrl.set.temp);
router.post('/eel/set/TF', eelCtrl.set.TF);
router.post('/eel/set/OF', eelCtrl.set.OF);

router.post('/eel/set/clear', eelCtrl.set.clear);
router.post('/eel/set/clearAll', eelCtrl.set.clearAll);


router.get('/admin', adminCtrl.main);

router.route("/admin/login")
    .get(adminCtrl.login)
    .post(adminCtrl.loginProcess);
router.get("/admin/logout", adminCtrl.logoutProcess);


module.exports = router;