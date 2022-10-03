"use strict"

const { env_var } = require("../env_var");

const halibutDAO = require("../model/simulator/halibutDAO");

const { paging } = require('./tool/paging');

const { fun } = require('./function/halibut');


const main = async (req, res) => {
    if(req.session.s_user_key){
        const parameters = {
            user_key: req.params.user_key,
            url: env_var.HOST
        }
        // if(env_var.HOST === "localhost"){
        //     parameters.url += ":" + env_var.S_PORT;
        // }

        console.log(req.session.s_user_key)
        console.log(req.params.user_key)

        req.session.admin_key = 1

        req.session.save(function(){
            console.log("저장 성공")
        })
        
        if(req.session.admin_key == 1){
            req.session.s_user_key = parameters.user_key
        }

        console.log(req.session.s_user_key)
        console.log(req.params.user_key)

        if(parameters.user_key == req.session.s_user_key){
            res.render(`../views/simulator/halibut.ejs`, {parameters});
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

    const result = await halibutDAO.show.all(user_key);

    res.send(result);
}


const set = {}

set.temp = async (req, res) => {

    const temper_json = JSON.parse(req.body.json)
    const user_key = req.session.s_user_key;

    // 기존 데이터 삭제
    await halibutDAO.clear(user_key)


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
        await halibutDAO.set.Temp(temper_json[i], user_key)
    }

    let result = await halibutDAO.get.Temp(user_key)

    res.send(result);
}

set.TF = async (req, res) => {
    const user_key = req.session.s_user_key;

    // TF는 모든 값이 동일
    const TF = req.body.TF;
    await halibutDAO.set.TF(TF, user_key);

    // 날짜마다 다른 값 들
    let Wg = []     // 개체 중량 g
    let TWg = []    // 총 중량 kg
    let FV = []     // 권장 사료량 kg

    let TGC = []    // 
    let FR = []     // 사료 공급률 %


    const Temp = await halibutDAO.get.Temp(user_key);

    // 초기 중량값은 입력값
    Wg[0] = req.body.early_W;

    


    for(let i=0; i<Temp.length; i++) {

        let parameters = {
            user_key: user_key
        };


        if(i != 0){
            Wg[i] = fun.F_w(Temp[i-1]['Temp'], TGC[i-1], Wg[i-1])    
        }

        TWg[i] = Wg[i]*TF/1000
        TGC[i] = fun.F_TGC("", Wg[i])
        FR[i] = fun.F_FR(Temp[i]['Temp'], Wg[i])
        FV[i] = fun.F_FV(FR[i], Wg[i], TF)


        parameters.Wg = Wg[i]
        parameters.TWg = TWg[i]
        parameters.FV = FV[i]
        parameters.day = i+1
        

        // console.log(parameters);
        // result.push(parameters);

        await halibutDAO.set.FV(parameters);
    }

    // 1일차 Wig, TWig, OF는 Wg, TWg, FV와 동일하게 세팅
    let Wig_set = {
        OF: FV[0],
        Wig: Wg[0],
        TWig: Wg[0]*TF/1000,
        user_key: user_key,
        day: 1
    }
    await halibutDAO.set.Wig(Wig_set);

    let result = await halibutDAO.show.first(user_key);
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

    let Wig         // 개체중량 (FCR 적용)
    let TWig        // 총중량



    // day 기준 당일[0], 다음 날[1] 값(day, Wg, TF, FV) 가져오기
    let halibut_data = await halibutDAO.get.requireI(user_key, day++);


    // 다음날
    TF = halibut_data[1]['TF']
    Wg_sub = halibut_data[1]['Wg'] - halibut_data[0]['Wg']
    FV = halibut_data[1]['FV']

    FCR = fun.F_FCR(TF, Wg_sub, FV)

    Wgid = fun.F_Wgid(OF, FCR, TF)

    Wig = fun.F_Wid(halibut_data[0]['Wig'], Wgid);
    
    TWig = Wig*TF/1000

    


    let parameters = {
        OF: OF,
        Wig: Wig,
        TWig: TWig,
        day: day,
        user_key: user_key
    }

    console.log(parameters);

    await halibutDAO.set.Wig(parameters)

    let result = await halibutDAO.show.nextDay(parameters)

    console.log(result)

    res.send(result[0])
}

module.exports = {
    main,
    show,
    set,
}