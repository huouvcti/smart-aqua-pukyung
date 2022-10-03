"use strict"
const { env_var } = require("../env_var");

const userDAO = require('../model/monitoring/userDAO');
const sensorDAO = require('../model/monitoring/sensorDAO');

const { paging } = require('./tool/paging');

const dayjs = require("dayjs");
const fastcsv = require('fast-csv');
const fs = require('fs');


const main = async (req, res) => {
    if(req.session.user_key){
        const parameters = {
            user_key: req.session.user_key,
            url: env_var.HOST
        }

        if(env_var.HOST === "localhost"){
            parameters.url += ":" + env_var.S_PORT;
        }
        res.render('../views/monitoring/main.ejs', {parameters});
    } else{
        res.send("<script>location.href='/monitoring/login';</script>");
    }
    
}

const sensorSend = async (req, res) => {
    if(req.session.user_key){
        const parameters = {
            user_key: req.session.user_key,
            url: env_var.HOST
        }

        if(env_var.HOST === "localhost"){
            parameters.url += ":" + env_var.S_PORT;
        }
        res.render('../views/monitoring/sensorSend', {parameters})
    } else{
        res.send(location_login);
    }
}

/*
* 로그인 처리
*/
const login = async (req, res) => {
    if(req.session.user_key){
        res.send("<script>location.href='/monitoring';</script>");
    } else{
        res.render('../views/monitoring/login.ejs');
    }
}

const loginProcess = async (req, res) => {
    const parameters = {
        id: req.body.id,
        pw: req.body.pw
    }
    const db_data = await userDAO.userCheck(parameters);
    if(db_data.length != 0){
        req.session.user_key = db_data[0].user_key;
        req.session.save(function(){
            res.send("<script>alert('로그인 성공'); location.href='/monitoring';</script>");
        })
    } else{
        delete req.session.user_key;
        res.send("<script>alert(`로그인 실패 \n\n로그인페이지로 이동`); location.href='/monitoring/login';</script>");
    }
}

const logoutProcess = async (req, res) => {
    delete req.session.user_key;

    res.send("<script>alert(`로그아웃 성공`); location.href='/monitoring/login';</script>");
}


/*
* 로그 처리
*/

const log = async (req, res) => {
    // 페이징
    // 출처: 해양 ITRC 코드
    let currentPage = req.query.page;
    const pageSize = 10;
    const page = paging(currentPage, pageSize);

    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == undefined) ? "3000:01:01" : req.query.end,
        offset: page.offset,
        limit: page.limit,

        table: 'sensor_' + req.params.sensor
    }
    const pageCnt = await sensorDAO.log_cnt(parameters);
    const cnt = parseInt(pageCnt[0].cnt / pageSize);

    const db_data =  await sensorDAO.log(parameters);

    res.send({result:db_data, cnt});
}

const log_down = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == undefined) ? "3000:01:01" : req.query.end,

        sensor: req.params.sensor,
        table: 'sensor_' + req.params.sensor
    }

    const time = dayjs().format('YYYY-MM-DD-HHmmss');

    try{
        const db_data = await sensorDAO.log_down(parameters);

        const ws = await fs.createWriteStream(__dirname + '/../public/csv/' + time + '.csv');
        
        fastcsv.write(db_data, {headers: true})
            .on("finish", () => {
                console.log("file write success");
            })
            .pipe(ws);

        setTimeout(() => {
            res.download(__dirname + '/../public/csv/' + time + '.csv');
        }, 500)

    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
}

const log_del = async (req, res) => {
    const parameters = {
        user_key: req.session.user_key,
        date_start: (req.query.start == undefined) ? "1970:01:01" : req.query.start,
        date_end: (req.query.end == undefined) ? "3000:01:01" : req.query.end,
        table: 'sensor_' + req.params.sensor
    }

    await sensorDAO.log_del(parameters);
    res.send(`<script>location.href='/monitoring/#page3/${req.params.sensor}';</script>`)
}


module.exports = {
    main,
    sensorSend,

    login,
    loginProcess,
    logoutProcess,

    log,
    log_down,
    log_del
}