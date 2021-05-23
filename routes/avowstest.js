const express = require('express')

const router = express.Router()

const {
    items,
    User,
    addUser,
    addOrder,
    getOrder
} = require("../controllers/avowstest")

router.get("/items", items);
router.post("/User", User);
router.post("/addUser", addUser);
router.post("/addOrder", addOrder);
router.post("/getOrder", getOrder);

module.exports = router;