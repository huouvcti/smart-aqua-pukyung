const SocketIO = require('socket.io');

const app = require('../app');

const sensorDAO = require('../model/monitoring/sensorDAO');

const socketio = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    // namespace
    // const sensor = io.of('/sensor');

    io.on('connection',  async (socket) => {
        let room = "";
    
        console.log("sensor 접속");

        // disconnect
        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    
        // err
        socket.on('error', (err) => {
            console.log(err);
        });
        
        let send_cnt;
        await socket.on('join', async (data) => {
            room = data.room;

            socket.join(room)
            console.log(room + " join")

            send_cnt=0;

            parameters = {
                user_key: room
            }

            if(parameters.user_key != undefined){
                const data_PH = await sensorDAO.before_PH(parameters);
                const data_RTD = await sensorDAO.before_RTD(parameters);
                const data_SALT = await sensorDAO.before_SALT(parameters);
                const data_DO = await sensorDAO.before_DO(parameters);
                await socket.emit("sensor_before_PH", data_PH)
                await socket.emit("sensor_before_RTD", data_RTD)
                await socket.emit("sensor_before_SALT", data_SALT)
                await socket.emit("sensor_before_DO", data_DO)
            }
            
            
        })

        socket.on('on', async (data) =>{
            io.in(room).emit('ctrl_on', data);
        })
        socket.on('off', async (data) =>{
            io.in(room).emit('ctrl_off', data);
        })




        socket.on('sensor_send', async (data) =>{
            data.user_key = room;
            console.log(data);

            send_cnt++;


            if(parseFloat(data.PH) > 0){
                await sensorDAO.insert_PH(data);
                data.PH = parseFloat(data.PH);
                
            } else{
                data.PH = null;
            }

            if(parseFloat(data.RTD) > -1023){
                await sensorDAO.insert_RTD(data);
                data.RTD = parseFloat(data.RTD);
            } else{
                data.RTD = null;
            }

            if(parseFloat(data.SALT) > 0){  // 임의
                await sensorDAO.insert_SALT(data);
                data.SALT = parseFloat(data.SALT);
            } else{
                data.SALT = null;
            }
            
            if(parseFloat(data.DO) < 38){
                await sensorDAO.insert_DO(data);
                data.DO = parseFloat(data.DO);
            } else{
                data.DO = null;
            }

            const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
            const time = new Date().toTimeString().split(" ")[0];
            data.date = date + ' ' + time

            console.log(data);
            io.in(room).emit('sensor_update', data);
        })


    });
 };

module.exports = {socketio}



// io.on('connection', (socket) => {
//     // const req = socket.request;
//     console.log("socket connected");

//     // disconnect
//     socket.on('disconnect', () => {
//         console.log('socket disconnected');
//         clearInterval(socket.interval);
//     });

//     // err
//     socket.on('error', (err) => {
//         console.log(err);
//     });
// });