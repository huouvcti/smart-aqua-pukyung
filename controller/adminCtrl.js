"use strict"
const { env_var } = require("../env_var");

const userDAO = require('../model/simulator/userDAO');

const adminDAO = require('../model/simulator/adminDAO');

// const adminDAO = require('../model/simulator/adminDAO');

const main = async (req, res) => {
    console.log(req.session.s_admin_key)
    if(req.session.s_admin_key){
        const parameters = {
            user_key: req.session.sadmin_key,
            url: env_var.HOST
        }

        if(env_var.HOST === "localhost"){
            parameters.url += ":" + env_var.S_PORT;
        }
        res.render('../views/simulator/admin.ejs', {info: parameters});
    } else{
        res.send("<script>location.href='/simulator/admin/login';</script>");
    }
}

/*
* 로그인 처리
*/

const login = async (req, res) => {
    if(req.session.s_admin_key){
        res.send("<script>location.href='/simulator';</script>");
    } else{
        res.render('../views/simulator/admin_login.ejs');
    }
}

const loginProcess = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await adminDAO.userCheck(parameters);
    if(db_data.length != 0){
        req.session.s_admin_key = db_data[0].admin_key;
        console.log()
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/simulator/admin';</script>");
        })
    } else{
        delete req.session.s_user_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/simulator/admin/login';</script>");
    }
}

const logoutProcess = async (req, res) => {
    delete req.session.s_admin_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/simulator/admin/login';</script>");
}




module.exports = {
    main,
    login,
    loginProcess,
    logoutProcess
}