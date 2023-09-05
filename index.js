const express = require ('express')
const app = express()
const sql = require('mssql')
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

http.listen (PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require ('socket.io')(http)

io.on('connection',(socket) => {
    
    console.log("Connected.....")
    socket.on('message', (msg) =>{
        socket.broadcast.emit('message', msg)
        console.log(msg)
            // Call the function to insert the message into the database
            abc({ userName:msg.user, userMsg: msg.message });
              })

         socket.on('user joined', (userName) => {
         io.emit('user joined', userName);
    });

    // socket.on('audio', (msg) => {
    //    io.emit('audio', msg);
    // });

    socket.on('disconnect', () => {
        if(userName){
           io.emit('user left', userName);
        }
     // Emit "user left" event
    });
    
   })

   // Configuration for your MS SQL Server
const config = {
    user: 'chat',
    password: '1234',
    server: 'DESKTOP-VD4VTO9', // or IP address
    database: 'chat',
    PORT : 1433,
    options: {
      trustedconnection: true,
      enableArithAort: true,
     // instancename: 'WIN-RVBJS380SPR\MSSQLSERVER1',
      trustServerCertificate:true,
      encrypt: true, // Use if your SQL Server requires SSL
    },
  };
  
  // Create a connection pool
  
  let abc=async function(msg){
      try{
            const pool = await sql.connect(config);
            console.log('connected')
            const request = pool.request()
            .query(`INSERT INTO chat_info ( userName, userMsg)
                     VALUES ('${msg.userName}', '${msg.userMsg}')`)  
            console.log('Chat message saved successfully');
         }catch(err){
  console.log(err.message)
      }
  }
  

