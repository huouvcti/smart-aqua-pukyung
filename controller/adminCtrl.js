"use strict"
const { env_var } = require("../env_var");

// const adminDAO = require('../model/simulator/adminDAO');

const main = async (req, res) => {
    // if(req.session.s_admin_key){
    //     const parameters = {
    //         user_key: req.session.s_admin_key,
    //         url: env_var.HOST
    //     }

    //     if(env_var.HOST === "localhost"){
    //         parameters.url += ":" + env_var.S_PORT;
    //     }
    //     res.render('../views/simulator/main.ejs', {info: parameters});
    // } else{
    //     res.send("<script>location.href='/simulator/login';</script>");
    // }


    res.render('../views/simulator/admin.ejs', );
    
}




module.exports = {
    main,
}