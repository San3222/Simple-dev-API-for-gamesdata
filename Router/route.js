const express = require('express');
const router = express.Router();

const { signUp,login,get_All_User_data,add_User_data,update_User_data,delete_User_data } = require('../Controller/controller');


router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/").get(get_All_User_data);
router.route("/create").post(add_User_data);
router.route("/update/:games_id").patch(update_User_data);
router.route("/delete/:games_id").delete(delete_User_data);


module.exports = router;