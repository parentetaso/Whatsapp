
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const { realizarQuery } = require('./modulos/mysql');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

let contador = 0;

io.on("connection", (socket) => {
  const req = socket.request;

  socket.on("joinRoom", (data) => {
    if (req.session.room != undefined && req.session.room.length > 0) {
      socket.leave(req.session.room);
    }
    req.session.room = data.room;
    socket.join(req.session.room);

    io.to(req.session.room).emit("chat-messages", {
      user: req.session.user,
      room: req.session.room,
    });
  });

  socket.on("pingAll", (data) => {
    console.log("PING ALL: ", data);
    io.emit("pingAll", { event: "Ping to all", message: data });
  });

  socket.on("sendMessage", (data) => {
    console("SALA: ", data)
    io.to(req.session.room).emit("newMessage", {
      room: req.session.room,
      message: data,
    });
  });

  socket.on("eventoPersonalizado", () => {
    contador++;
    socket.emit("respuestaPersonalizada", { contador });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
});

app.get('/', function(req, res){
    res.status(200).send({ 
        message: 'Funciona'
    });
});







// ==================================================================================================




app.get('/usuarios', async function(req,res){
try {

  let respuesta;


  if (req.query.id_user != undefined) {

    respuesta = await realizarQuery(`
      SELECT *
      FROM Usuarios 
      WHERE id_user=${req.query.id_user}
    `)

  } else {

    respuesta = await realizarQuery(`
      SELECT * 
      FROM Usuarios
    `);

  }    

  res.send(respuesta[0]);

} catch (error) {
  console.log(error.message);
    
}
})

app.get('/login', async function(req,res){
  try {
    
    let respuesta;

    respuesta = await realizarQuery(`
      SELECT * 
      FROM Usuarios 
      WHERE correo = "${req.query.correo}" AND contra="${req.query.contra}"
    `)
    console.log(respuesta)
    if (respuesta.length>0) {
      
      res.send({
        ok: true,
        respuesta: respuesta
      });
    }else{
      res.send({
        ok: false,
        respuesta: respuesta
      });
    }
    

  } catch (error) {
    console.log(error.message);
  

  }
})

app.post('/registrar', async function(req,res) {
  try {


    let existe = await realizarQuery(`
      SELECT * 
      FROM Usuarios 
      WHERE correo = "${req.body.correo}" OR usuario = "${req.body.usuario}"
    `);
 


    if (existe.length > 0){
      res.send({ok: false});

    } else{
      
      await realizarQuery(`
      INSERT INTO Usuarios (usuario, correo, contra, foto) 
      VALUES ("${req.body.usuario}", 
        "${req.body.correo}", 
        "${req.body.contra}", 
        "${req.body.foto}");
      `)
        
      let newId = await realizarQuery(`
        SELECT max(id_user) AS "id_user"
        FROM Usuarios 
      `);
      console.log(newId)
      let globalId = await realizarQuery(`
        SELECT id_chat 
        FROM Chats
        WHERE global= true  
      `);
      await realizarQuery(`
        INSERT INTO ChatsPorUsuarios (id_chat, id_user)
        VALUES (${globalId[0].id_chat}, ${newId[0].id_user})
      `);


      res.send({ok: true});

    }


  } catch (error) {
    
    console.log(error.message);
      
      
  }
})















app.get('/chats', async function(req,res){
  try {
    
    let respuesta;

    respuesta = await realizarQuery(`
      SELECT Chats.*
      FROM Chats
      INNER JOIN ChatsPorUsuarios ON Chats.id_chat = ChatsPorUsuarios.id_chat
      WHERE ChatsPorUsuarios.id_user = ${req.query.id_user};
    `)
      

    console.log(respuesta)
    res.send(respuesta);

  } catch (error) {
    console.log(error.message);
  

  }
})

app.post('/crearChat', async function(req, res) {
  try {

    let ids = []

    for (let i = 0; i < req.body.correos.length; i++) {
      const element = req.body.correos[i];
      
      let existe = await realizarQuery(`
        SELECT id_user 
        FROM Usuarios 
        WHERE correo = "${element}"
      `);
      if(existe.length == 0){
        return  res.send({ ok: false });
      }else{
        ids.push(existe[0].id_user)
      }

    }

    console.log(ids)

    await realizarQuery(`
      INSERT INTO Chats (nombre, descripcion, foto, global)
      VALUES (
        "${req.body.nombre}",
        "${req.body.descripcion}",
        "${req.body.foto}",
        ${req.body.global}
      )
    `);
    
    let chat = await realizarQuery(`
      SELECT * 
      FROM Chats 
      WHERE nombre = "${req.body.nombre}"
    `);

    for (let id_user of ids) {

      await realizarQuery(`
        INSERT INTO ChatsPorUsuarios (id_chat, id_user)
        VALUES (${chat[0].id_chat}, ${id_user})
      `);

    }
    console.log(chat[0])
    
    res.send({ 
      ok: true, 
      chat: chat[0] });

  } catch (error) {
    console.log(error.message);
      
  }
});













app.get('/mensajes', async function(req, res) {
    try {

      let respuesta = await realizarQuery(`
        SELECT Mensajes.contenido, Usuarios.foto, Usuarios.usuario, Mensajes.id_user
        FROM Mensajes
        INNER JOIN Usuarios ON Mensajes.id_user = Usuarios.id_user
        WHERE Mensajes.id_chat = ${req.query.id_chat};
      `);
        console.log(respuesta)
      res.send(respuesta);

    } catch (error) {
        console.log(error.message);
    }
});


app.post('/crearMensaje', async function(req, res) {
  try {

    await realizarQuery(`
      INSERT INTO Mensajes (contenido, id_chat, id_user)
      VALUES (
        "${req.body.contenido}",
        "${req.body.id_chat}",
        "${req.body.id_user}"
      )
    `);

    
    res.send({ok: true});

  } catch (error) {
    console.log(error.message);
      
  }
});

