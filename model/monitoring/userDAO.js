const {db} = require('../../config/dbconn');

const userCheck = (parameters) =>{
    return new Promise((resolve, reject) =>{
        db.query(`SELECT * FROM monitoring_user WHERE (id=? AND pw=?)`, [parameters.id, parameters.pw], (err, db_data) => {
            if(err) {
                reject(err);
            } else {
                resolve(db_data);
            }
        })
    })
}


module.exports = {
    userCheck
}