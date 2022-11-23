"use strict"
const { env_var } = require("../env_var");

const userDAO = require('../model/simulator/userDAO');

const { paging } = require('./tool/paging');

const main = async (req, res) => {
    if(req.session.s_user_key){
        const parameters = {
            user_key: req.session.s_user_key,
            url: env_var.HOST
        }

        if(env_var.HOST === "localhost"){
            parameters.url += ":" + env_var.S_PORT;
        }
        res.render('../views/simulator/main.ejs', {info: parameters});
    } else{
        res.send("<script>location.href='/simulator/login';</script>");
    }
    
}


/*
* 로그인 처리
*/

const login = async (req, res) => {
    if(req.session.s_user_key){
        res.send("<script>location.href='/simulator';</script>");
    } else{
        res.render('../views/simulator/login.ejs');
    }
}

const loginProcess = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await userDAO.userCheck(parameters);
    if(db_data.length != 0){
        req.session.s_user_key = db_data[0].user_key;
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/simulator';</script>");
        })
    } else{
        delete req.session.s_user_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/simulator/login';</script>");
    }
}

const logoutProcess = async (req, res) => {
    delete req.session.s_user_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/simulator/login';</script>");
}




module.exports = {
    main,

    login,
    loginProcess,
    logoutProcess,
}