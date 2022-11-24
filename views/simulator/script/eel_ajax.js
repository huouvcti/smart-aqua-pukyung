let maxSize = 0;


// 새로고침시 유지
$(document).ready(function() {
    $.ajax ({
        type:'GET',
        dataType:'json',
        url:`/simulator/eel/show/all`,
        success : function(result) {

            console.log(result)

            maxSize = result.length;
            // if(result.legnth == 0){
            //     // 아무것도 없을 때  
            // }
            if(result[0]['Temp'] != null){
                // 날짜와 수온까지 입력했을 때
                draw_Temp(result);
            }
            if(result[0]['TF'] != null){
                // 초기 중량, 총 마리 수까지 입력했을 때
                draw_result(result);
            }if(result[1]['OF'] != null){
                // 모든 값을 입력했을 때
                for(let i=1; i<result.length; i++){
                    if(result[i]['OF'] != null){
                        drawAdd_result(result[i]);
                    }
                }
            }

        },
        error : function(err) {
            console.log(err)
        }
    });

});




// 엑셀 업로드 후 수온 그래프 그리기
function readExcel() {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            console.log('SheetName: ' + sheetName);
            
            let temper_json = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            console.log(temper_json)
            
            $.ajax ({
                type:'POST',
                dataType:'json',
                data: {json: JSON.stringify(temper_json)},
                url:`/simulator/eel/set/temp`,
                success : function(result){
                    alert("파일 업로드 성공")
                    draw_Temp(result);
                },
                error : function(err) {
                    console.log(err)
                }
            });
        })

        
    };
    reader.readAsBinaryString(input.files[0]);
}

// 초기 중량, 총 마리수 입력 시 그래프 업데이트
function early_set(){
    let early_TF = document.getElementById("early_TF").value
    let early_W = document.getElementById("early_W").value

    if(chart_Temp == undefined){
        alert("기간별 수온 파일을 먼저 업로드 해주세요.")
    } else if(early_TF == "" || early_W == ""){
        alert("총 마리수와 초기 중량 값을 입력해주세요")
    } else{
        $.ajax ({
            type:'POST',
            dataType:'json',
            data: {TF: early_TF, early_W: early_W},
            url:`/simulator/eel/set/TF`,
            success : function(result){
                alert("초기값 입력 완료");
                draw_result(result);
            },
            error : function(err) {
                console.log(err)
            }
        });
    }
}




// 
function nextResult(){
    let nextOF = document.getElementById("nextOF").value
    let day = document.getElementById("day")
    let day_value = document.getElementById("day").innerText

    if(chart_Temp == undefined){
        alert("기간별 수온 파일을 먼저 업로드 해주세요.")
    } else if(chart_Wg == undefined){
        alert("총 마리수와 초기 중량 값을 입력해주세요")
    } else if(Number(day_value) >= maxSize){
        alert("기간 종료")
    }else if(nextOF == ""){
        console.log(day_value)
        alert("사료공급량을 입력해주세요")
    }else{
        $.ajax ({
            type:'POST',
            dataType:'json',
            data: {OF: nextOF, day: day_value},
            url:`/simulator/eel/set/OF`,
            success : function(result){
                alert("사료 공급 완료");
                drawAdd_result(result)
            },
            error : function(err) {
                console.log(err)
            }
        });
    }

}

