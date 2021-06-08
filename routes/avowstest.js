const express = require('express')

const router = express.Router()

const authentication = require("../auth/auth")

const {
    items,
    login,
    getToken,
    getSales,
    User,
    addUser,
    addOrder,
    getOrder
} = require("../controllers/avowstest")

router.get("/items", items);
router.post("/login", login);
router.post("/getToken", getToken);
router.post("/getSales", authentication.tokenValid,getSales);
router.post("/User", User);
router.post("/addUser", addUser);
router.post("/addOrder", addOrder);
router.post("/getOrder", getOrder);

module.exports = router;