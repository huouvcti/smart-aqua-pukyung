let chart_Temp
let chart_Wg
let chart_TWg
let chart_FV
let chart_death

// 수온 그래프 그리기 
const draw_Temp = (result) => {
    let Temp_data = [];

    for(let i=0; i<result.length; i++){
        let data = result[i]['Temp'];
        Temp_data.push(data);
    }

    chart_Temp = chart_draw(chart_Temp, '수온', Temp_data, '#00f', '°C',  'chart_Temp');

    chart_Temp.redraw()

    window.addEventListener('resize', draw_result, false)
}

// 4개 그래프 세팅
const draw_result = (result) => {
    let early_TF = document.getElementById("early_TF")
    let early_W = document.getElementById("early_W")
    let day = document.getElementById("day")

    let early_Btn = document.getElementById("early_Btn")
    

    early_TF.disabled = true;
    early_W.disabled = true;
    early_Btn.disabled = true;
    early_Btn.style.backgroundColor = "#aaa";

    let Wg_data = result[0]['Wg'];
    let TWg_data = result[0]['TWg'];
    let FV_data = result[0]['FV'];

    let death_data = null;
    
    

    chart_Wg = chart_draw2(chart_Wg, '개체중량', [Wg_data], '#f00', '개체중량(FCR)', [Wg_data], '#000', 'g', 'chart_Wg');
    chart_TWg = chart_draw2(chart_TWg, '총중량', [TWg_data], '#f00', '총중량(FCR)', [TWg_data], '#000', 'kg', 'chart_TWg');
    chart_FV = chart_draw2(chart_FV, '권장사료량', [FV_data], '#f00', '임의사료량', [FV_data], '#000', 'kg', 'chart_FV');

    chart_death = chart_draw(chart_death, '폐사율', [death_data], "#f00", '%', 'chart_death')


    chart_Wg.redraw()
    chart_TWg.redraw()
    chart_FV.redraw()
    chart_death.redraw();

    window.addEventListener('resize', draw_result, false)


    early_TF.value = result[0]['TF'];
    early_W.value = Wg_data
    day.innerText = 1;
}


const drawAdd_result = (result) => {
    console.log(result)
    let day = document.getElementById("day")
    let day_value = document.getElementById("day").innerText

    let Wg_data = result['Wg'];
    let Wig_data = result['Wig'];

    let TWg_data = result['TWg'];
    let TWig_data = result['TWig'];

    let FV_data = result['FV'];
    let OF_data = result['OF'];

    let death_data = result['death']


    chart_Wg.series[0].addPoint({
        y: Wg_data,
    });
    chart_Wg.series[1].addPoint({
        y: Wig_data
    })

    chart_TWg.series[0].addPoint({
        y: TWg_data,
    });
    chart_TWg.series[1].addPoint({
        y: TWig_data
    })

    chart_FV.series[0].addPoint({
        y: FV_data,
    });
    chart_FV.series[1].addPoint({
        y: OF_data
    })

    chart_death.series[0].addPoint({
        y: death_data
    })
    day.innerText = Number(day_value)+1
}


// 4개 그래프 
// const drawAll_result = (result) => {

//     let day = document.getElementById("day")
//     let day_value = 0;

//     let early_TF = document.getElementById("early_TF")
//     let early_W = document.getElementById("early_W")

//     let early_Btn = document.getElementById("early_Btn")

//     let Wg_data = [];
//     let Wig_data = [];

//     let TWg_data = [];
//     let TWig_data = [];

//     let FV_data = [];
//     let OF_data = [];

//     // 초기세팅 버튼 비활성화
//     early_TF.disabled = true;
//     early_W.disabled = true;
//     early_Btn.disabled = true;
//     early_Btn.style.backgroundColor = "#aaa";


//     for(let i=0; i<result.length; i++){
//         Wg_data.push(result[i]['Wg']);
//         Wig_data.push(result[i]['Wig']);
//         TWg_data.push(result[i]['TWg']);
//         TWig_data.push(result[i]['TWig']);
//         FV_data.push(result[i]['FV']);
//         OF_data.push(result[i]['OF']);

//         day_value++;
//     }


//     chart_Wg = chart_draw2(chart_Wg, '개체중량', Wg_data, '#f00', '개체중량(FCR)', Wig_data, '#000', 'g', 'chart_Wg');
//     chart_TWg = chart_draw2(chart_TWg, '총중량', TWg_data, '#f00', '총중량(FCR)', TWig_data, '#000', 'kg', 'chart_TWg');
//     chart_FV = chart_draw2(chart_FV, '권장사료량', FV_data, '#f00', '임의사료량', OF_data, '#000', 'kg', 'chart_FV');

//     chart_Wg.redraw()
//     chart_TWg.redraw()
//     chart_FV.redraw()

//     window.addEventListener('resize', draw_result, false)


//     early_TF.value = result[0]['TF'];
//     early_W.value = Wg_data
//     day.innerText = day_value-1;

    
// }