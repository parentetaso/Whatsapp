"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from "../hooks/useSocket";


import Message from "../components/Message";
import Input from "../components/Input"
import Boton from '../components/Boton';


function ChatPageInterno() {
    const searchParams = useSearchParams();
    const id_user = searchParams.get("id_user")
    const id_chat = searchParams.get("id_chat")

    let esGlobal = false
    if (searchParams.get("global") == 1) {
        esGlobal = true
    }

    
    const { socket } = useSocket();


    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [usuario, setUsuario] = useState({});
    const finRef = useRef(null);











    useEffect(() => {
        
        fetch(`http://localhost:4000/usuarios?id_user=${id_user}`)
        .then(response => response.json())
        .then(data =>{ 
            
            setUsuario(data)
    

            console.log(data)
        })  


        fetch(`http://localhost:4000/mensajes?id_chat=${id_chat}`)
        .then(response => response.json())
        .then(data =>{ 
            
            setMensajes(data)
            console.log(data)
        })
            
    }, []);



    useEffect(() => {
        
        if(socket){

            if(!esGlobal){
                socket.emit("joinRoom", { room: id_chat })

            }

        }

    }, [socket]);




    useEffect(() => {
        
        if(socket){



            if(!esGlobal){
                
                socket.on("newMessage", (data) => {
                    setMensajes((conversacion) => [...conversacion, data.message]);
                });
            }else{

                socket.on("pingAll", (data) => {
                    setMensajes((conversacion) => [...conversacion, data.message]);
                
                });
            }
        }

    }, [socket]);
    
    
    
    function enviar() {
        const msg = {
            contenido: mensaje, 
            id_user: id_user,
            id_chat: id_chat
        }


        fetch('http://localhost:4000/crearMensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msg)
        })
        .then(response => response.json())
        .then(data => {

            if (data.ok) {
                if(!esGlobal){

                    socket.emit("sendMessage", { 
                        contenido: mensaje, 
                        id_user: id_user,
                        foto: usuario.foto,
                        usuario: usuario.usuario,
    
                    })
                }else{
                    socket.emit("pingAll", { 
                        contenido: mensaje, 
                        id_user: id_user,
                        foto: usuario.foto,
                        usuario: usuario.usuario,
    
                    });

                }

            }else{
                alert("Error")

            }

        })

    }
 

    function renderizarMsg() {
        
        const lista = mensajes.map((data, indice) => (
            <Message
            key={indice}
            contenido = {data.contenido}
            foto = {data.foto}
            usuario = {data.usuario}
            id_user = {data.id_user}
            id_user_Logeado = {id_user}
            ></Message>
        ))


        return lista    


    }


    // Auto-scroll al ultimo mensaje
    useEffect(() => {
        if (finRef.current) {
            finRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [mensajes]);

    // Enviar con la tecla Enter y limpiar el campo
    function manejarTecla(event) {
        if (event.key === "Enter" && mensaje.trim() !== "") {
            enviar()
            setMensaje("")
        }
    }


    return (
        <>

            <div className="mensajes">
                {renderizarMsg()}
                <div ref={finRef}></div>

            </div>
            
            <div className="barraEntrada">
                <Input tipo="text" funcion={setMensaje} text="Mensaje" teclado={manejarTecla} valor={mensaje}></Input>          
                <Boton funcion={enviar} text="Enviar"></Boton>  
            </div>
 
        
        </>
    );
}

export default function chatPageWrapped() {
    return (
        <Suspense fallback={<p style={{ textAlign: "center", marginTop: "24px" }}>Cargando...</p>}>
            <ChatPageInterno />
        </Suspense>
    );
}
