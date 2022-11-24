
// F1 월간 수온 계산 함수
const F_T = (M, R) => {
    return 17.51 + 4.468 * Math.sin(2*Math.PI*M/10.91 + 2.998)
}

// F2 TGC 계산 함수
// 개체 중량 계산시 필요 값 (?)
const F_TGC = (T, W) => {
    if(W <= 60){
        return (2.6984 - 0.01899*W)
    } else if (W <= 570) {
        return 1.5
    } else{
        return 0.63
    }
}

// F3  개체중량 계산 함수 g
const F_w = (T, TGC, W) => {
    return Math.pow((TGC*T)/1000 + Math.cbrt(W), 3)
}

// F4 FR 계산 함수 
// 사료공급률 %
const F_FR = (T, W) => {
    const a = 269.0695
    const b = 1.8856318 * Math.sqrt(W)*Math.log(W)
    const c = 11.330227 * Math.pow(Math.log(W),2)
    const d = 23.009662 * Math.sqrt(W)
    const e = 61.730341 * (Math.log(W))
    const f = 156.36983 / Math.sqrt(W)
    const g = 63.204949 * (Math.log(W)) / W
    const h = 9.9181621 * (Math.log(T))
    const i = 98.878697 / (Math.log(T))
    const result = Math.pow(Math.exp(1), (a + b + c - d - e - f - g -h - i))
    return result
}

// F5 FV 게산 함수
// 총 사료 공급량 kg
const F_FV = (FR, W, TF) => {
    return W * FR * (TF / Math.pow(10,5))
}

// F6 Wg (중증량) 구하는 계산 (W2 현재 무게, W1 전날 무게)
const F_Wg = (W2, W1) => {
    return W2 - W1
}

// F7 FCR 계산 함수
// 개체수, 사료공급량 적용 값 (?)
const F_FCR = (TF, Wg, FV) => {
    const divisor = Wg * FV
    if(divisor === 0){
        return 0       
    } else{
        return (FV / (Wg * TF)) * 1000
    }
}

// F8 FCR 적용 다음날 증체량
const F_Wgid = (OF, FCR, TF) => {
    const divisor = FCR * TF
    if(divisor === 0){
        return 0    
    } else{
        if(OF <= 1){
            return (OF / (FCR * TF)) *1000
        } else {
            return (1/(FCR * TF)) * 1000
        }
    }
}

// F9 Wgid 추정 증체량 + 개체 중량
// d 일 이후 중량
// 첫째날 null
// 둘째날 W(개체중량) + Wgid(추정 증체량)
// 이후 Wgid(전날 추정 개체중량) + Wgid(추정 증체량)
const F_Wid = (W, Wgid) =>{
    return W + Wgid
}


// 총 증중량
const F_TWg = (Wg, TF) => {
    return Wg*TF/1000
}


const F_Death = (W, TF) => {
    if(W <= 20){
        if(TF <= 22.5){
            return -0.2335*W + 0.1217*TF - 9.27
        } else {
            return 40.3472 / (1 + Math.pow((W-29.8634)/4.5791, 2)) * (1 + Math.pow((TF-269.644)/82.4761, 2)) 
        }
    } else if(W <= 50){
        if(TF <= 22.5){
            return -0.6578*W - 0.1814*TF + 0.013*Math.pow(W, 2) + 0.0008*Math.pow(TF, 2) + 17.8231
        } else {
            return -6.4346*W - 0.2503*TF + 0.1552*Math.pow(W, 2) + 0.0011*Math.pow(TF, 2) + 78.9149
        }
    } else if(W <= 300){
        if(TF <= 22.5){
            return -0.4471*W - 0.2197*TF + 0.0093*Math.pow(W, 2) + 0.0008*Math.pow(TF, 2) + 20.914
        } else {
            return -6.801*W - 0.2157*TF + 0.1523*Math.pow(W, 2) + 0.0008*Math.pow(TF, 2) + 88.7348
        }
    } else if(W <= 750){
        if(TF <= 22.5){
            return -0.385*W - 0.1605*TF + 0.0079*Math.pow(W, 2) + 0.0006*Math.pow(TF, 2) + 15.4024
        } else {
            return -5.0021*W - 0.2259*TF + 0.1111*Math.pow(W, 2) + 0.0008*Math.pow(TF, 2) + 71.0974
        }
    } else {    // W >= 751
        if(TF <= 22.5){
            return -1.2263*W - 0.1304*TF + 0.0286*Math.pow(W, 2) + 0.0005*Math.pow(TF, 2) + 21.557
        } else {
            return 23.82 / (1 + Math.pow((W-30.3221)/4.5325, 2)) * (1 + Math.pow((TF-288.5188)/61.5403, 2)) 
        }
    }
}

