
const fun = {};


// F1 월간 수온 계산 함수
// fun.F_T = (M, R) => {
//     return 17.51 + 4.468 * Math.sin(2*Math.PI*M/10.91 + 2.998)
// }


fun.F_TGC = (W, code) => {
    let a, b
    if(code == 'H'){
        a = 1.485994996
        b = -0.22172083
    } else if(code == 'M'){
        a = 0.906639046
        b = -0.13519991
    } else {    // code == 'L'
        a = 0.730868202
        b = -0.16988243
    }

    let TGC = a * Math.pow(W, b)

    return TGC
}

fun.F_FU = (W) => {
    return 1000/W
}

fun.F_FR = (FU) => {
    if(FU >= 500){
        return 15
    } else {
        return 0.0066*FU
    }
}

fun.F_FV = (W, TF) => {
    let PF = TF * 0.1
    
    let FU = fun.F_FU(W)
    let FR = fun.F_FR(FU)

    let FV = W * PF * FR / 1000

    return FV
}

fun.F_FCR = (FV, TF, Wg_sub) => {
    let PF = TF * 0.1
    let FCR = FV / (PF*Wg_sub/1000)

    return FCR
}

fun.F_dwg = (W, Wg_sub, TF, OF) => {
    let FV = fun.F_FV(W, TF)
    let FCR_1 = fun.F_FCR(FV, TF, Wg_sub)
    let PF = TF * 0.1

    let dwg
    if(OF <= 1){
        dwg = FV*OF / (FCR_1 * PF) * 1000
    } else {
        dwg = FV*1 / (FCR_1 * PF) * 1000
    }

    return dwg
}

fun.F_w = (T, W, code) => {
    let TGC = fun.F_TGC(W, code)

    return Math.pow((TGC * T/1000 + Math.pow(W, 1/3)), 3)   

    // if (OF >= 1.0){
    //     return Math.pow((TGC * T/1000 + Math.pow(W, 1/3)), 3)    
    // } else {
    //     return W + dwgi
    // }
}

fun.F_Wig = (W, dwg) => {
    return W + dwg
}

fun.F_death = (W, OF, FV) => {
    let overFeed = OF/FV

    let natural_death = 3.61 * Math.log(W) - 6.1812

    let overFeed_death = -0.0323*W - 0.3556*overFeed + 0.0014*Math.pow(overFeed, 2) + 24.6954

    return natural_death + overFeed_death
}





module.exports = {
    fun
}

