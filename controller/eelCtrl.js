"use strict"

const { env_var } = require("../env_var");

const eelDAO = require("../model/simulator/eelDAO");

const { paging } = require('./tool/paging');

const { fun } = require('./function/eel');


const main = async (req, res) => {
    const parameters = {
        user_key: req.params.user_key,
        url: env_var.HOST
    }

    if(req.session.s_admin_key){
        req.session.s_user_key = parameters.user_key
        res.render(`../views/simulator/eel.ejs`, {parameters});
    }else if(req.session.s_user_key){
        // if(env_var.HOST === "localhost"){
        //     parameters.url += ":" + env_var.S_PORT;
        // }
        if(parameters.user_key == req.session.s_user_key){
            res.render(`../views/simulator/eel.ejs`, {parameters});
        }else{
            res.send(`<script>alert('잘못된 접근'); location.href='/simulator';</script>`);
        }
    } else{
        res.send("<script>location.href='/simulator/login';</script>");
    }
}

const show = {}

show.all = async (req, res) => {
    const user_key = req.session.s_user_key;

    const result = await eelDAO.show.all(user_key);

    res.send(result);
}


const set = {}

set.temp = async (req, res) => {

    const temper_json = JSON.parse(req.body.json)
    const user_key = req.session.s_user_key;

    // 기존 데이터 삭제
    await eelDAO.clear(user_key)


    // property name 변경
    const property_name = ['day', 'month', 'Temp']
    let size = (temper_json.length <= 365) ? temper_json.length : 365;
    
    for(let i=0; i<size; i++){
        let j=0;
        for(let prop in temper_json[i]){
            // console.log(prop);
            temper_json[i][property_name[j++]] = temper_json[i][prop]
            delete temper_json[i][prop];
        }

        // 한 줄씩 DB 저장
        await eelDAO.set.Temp(temper_json[i], user_key)
    }

    let result = await eelDAO.get.Temp(user_key)

    res.send(result);
}

set.TF = async (req, res) => {
    const user_key = req.session.s_user_key;

    // TF는 모든 값이 동일
    const TF = req.body.TF;
    await eelDAO.set.TF(TF, user_key);

    // 날짜마다 다른 값 들
    let Wg = []     // 개체 중량 g
    let TWg = []    // 총 중량 kg
    let FV = []     // 권장 사료량 kg
    let death = []  // 폐사율 %

    let TGC = []    // 
    let FR = []     // 사료 공급률 %


    const Temp = await eelDAO.get.Temp(user_key);

    // 초기 중량값은 입력값
    Wg[0] = req.body.early_W;

    for(let i=0; i<Temp.length; i++) {

        let parameters = {
            user_key: user_key
        };


        // code는 일단 임의값
        if(i != 0){
            Wg[i] = fun.F_w(Temp[i-1]['Temp'], Wg[i-1], "H")    
        }

        TWg[i] = Wg[i]*TF/1000

        FV[i] = fun.F_FV(Wg[i], TF)
        death[i] = 0
        


        parameters.Wg = Wg[i]
        parameters.TWg = TWg[i]
        parameters.FV = FV[i]
        parameters.death = death[i]

        parameters.day = i+1
        
        

        // console.log(parameters);
        // result.push(parameters);

        await eelDAO.set.FV(parameters);
    }

    // 1일차 Wig, TWig, OF는 Wg, TWg, FV와 동일하게 세팅
    let Wig_set = {
        OF: FV[0],
        Wig: Wg[1],
        TWig: Wg[1]*TF/1000,
        user_key: user_key,
        day: 1
    }
    await eelDAO.set.Wig(Wig_set);

    let result = await eelDAO.show.first(user_key);
    console.log(result);

    res.send(result);
}


set.OF = async (req, res) => {
    const user_key = req.session.s_user_key;

    const OF = req.body.OF;
    let day = req.body.day

    let FCR         // FCR
    let Wg_sub      // 현재 - 전날 개체중량
    let FV          // 권장 사료량
    let TF          // 총 마리수
    let Wgid        // FCR 적용 증체량

    let W

    let Wig         // 개체중량 (FCR 적용)
    let TWig        // 총중량

    let dwg

    let death

    const Temp = await eelDAO.get.Temp(user_key);


    // day 기준 당일[0], 다음 날[1] 값(day, Wg, TF, FV) 가져오기
    let eel_data = await eelDAO.get.requireI(user_key, day++);


    // 다음날
    TF = eel_data[1]['TF']
    W = eel_data[1]['Wg'];
    Wg_sub = eel_data[1]['Wg'] - eel_data[0]['Wg']
    FV = eel_data[1]['FV']




    dwg = fun.F_dwg(W, Wg_sub, TF, OF)

    

    Wig = fun.F_Wig(eel_data[0]['Wig'], dwg)

    console.log(eel_data[0]['Wig'], dwg, Wig)
    
    TWig = Wig*TF/1000

    
    death = fun.F_death(Wig, OF, FV)



    // 적정 사료 공급시 개체증량 * 1.1 이 넘지 않도록 
    if(Wig > eel_data[1]['Wg']*1.1){
        Wig = eel_data[1]['Wg']*1.1
    }

    // 사료 미공급시 폐사 발생 x
    if(OF < FV || OF == 0){
        death = eel_data[1]['death']
    }

    // 폐사율은 0~100 사이값
    if(death > 100){
        death = 100
    } else if(death < 0){
        death = 0
    }

    // 총 중량 폐사율 반영
    TWig = Wig*(TF - TF*(death*0.01))/1000
    


    let parameters = {
        OF: OF,
        Wig: Wig,
        TWig: TWig,
        death: death,
        day: day,
        user_key: user_key
    }

    console.log(parameters);

    await eelDAO.set.Wig(parameters)

    let result = await eelDAO.show.nextDay(parameters)

    console.log(result)

    res.send(result[0])
}


set.clear = async (req, res) => {
    const user_key = req.session.s_user_key;

    // 기존 데이터 삭제
    await eelDAO.clear(user_key)

    res.send({result: "success"})
}

set.clearAll = async (req, res) => {
    // 전체 데이터 삭제
    await eelDAO.clear()

    res.send({result: "success"})
}


module.exports = {
    main,
    show,
    set,
}