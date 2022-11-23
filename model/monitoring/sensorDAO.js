const {db} = require('../../config/dbconn');

// const insert = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`INSERT INTO sensor (user_key, PH, RTD, EC, DO) values(?, ?, ?, ?, ?);`, [parameters.user_key, parameters.PH, parameters.RTD, parameters.EC, parameters.DO], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }

const insert_PH = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO sensor_PH (user_key, PH) values(?, ?);`, [parameters.user_key, parameters.PH], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const insert_RTD = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO sensor_RTD (user_key, RTD) values(?, ?);`, [parameters.user_key, parameters.RTD], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const insert_SALT = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO sensor_SALT (user_key, SALT) values(?, ?);`, [parameters.user_key, parameters.SALT], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const insert_DO = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`INSERT INTO sensor_DO (user_key, DO) values(?, ?);`, [parameters.user_key, parameters.DO], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


const before_PH = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT PH, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_PH WHERE user_key=? ORDER BY date DESC LIMIT 15;`, [parameters.user_key], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const before_RTD = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT RTD, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_RTD WHERE user_key=? ORDER BY date DESC LIMIT 15;`, [parameters.user_key], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const before_SALT = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT SALT, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_SALT WHERE user_key=? ORDER BY date DESC LIMIT 15;`, [parameters.user_key], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const before_DO = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT DO, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_DO WHERE user_key=? ORDER BY date DESC LIMIT 15;`, [parameters.user_key], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}




const log = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM ${parameters.table} WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [ parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}
const log_cnt = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT COUNT(*) as cnt FROM ${parameters.table} WHERE user_key=? AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}

const log_down = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT ${parameters.sensor}_key as no, ${parameters.sensor}, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM ${parameters.table} WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC;`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}



const log_del = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`DELETE FROM ${parameters.table} WHERE (user_key=?) AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}



// const log_RTD = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_RTD WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }
// const log_RTD_cnt = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT COUNT(*) as cnt FROM sensor_RTD WHERE user_key=? AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }

// const log_SALT = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_SALT WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }
// const log_SALT_cnt = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT COUNT(*) as cnt FROM sensor_SALT WHERE user_key=? AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }

// const log_DO = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT *, DATE_FORMAT(date, '%Y-%m-%d %T') as date FROM sensor_DO WHERE (user_key=?) AND (date > ? AND date < ?) ORDER BY date DESC LIMIT ?, ?`, [parameters.user_key, parameters.date_start, parameters.date_end, parameters.offset, parameters.limit], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }
// const log_DO_cnt = (parameters) =>{
//     return new Promise((resolve, reject) =>{
//         db.query(`SELECT COUNT(*) as cnt FROM sensor_DO WHERE user_key=? AND (date > ? AND date < ?);`, [parameters.user_key, parameters.date_start, parameters.date_end], (err, db_data) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve(db_data);
//             }
//         })
//     })
// }










module.exports = {
    insert_PH,
    insert_RTD,
    insert_SALT,
    insert_DO,

    before_PH,
    before_RTD,
    before_SALT,
    before_DO,

    log,
    log_cnt,
    log_down,
    log_del
}