// 윤년 계산
const leap_year = (y) => {
    if(y%4 == 0){
        if(y%400 != 0 && y%100 == 0){
            return false
        }
        else{
            return true
        }
    }
    else{
        return true
    }
}

// 날짜 변경 조정
const date_set = (year, month, day) => {
    switch (month){
        case 1: case 3: case 5: case 7:
        case 8: case 10:
            if(day > 31){
                month++;
                day = 1;
            }
            break;
        case 4: case 6: case 9: case 11:
            if(day > 30){
                month++;
                day = 1;
            }
            break;
        case 12:
            if(day > 31){
                year++;
                month = 1;
                day = 1;
            }
            break;
        case 2:
            if(leap_year(year)){ // 윤년
                if(day > 29){
                    month++;
                    day = 1;
                }
            } else{
                if(day > 28){
                    month++;
                    day = 1;
                }
            }
            break;
        default:
            break;
    }
    return [year, month, day];
}