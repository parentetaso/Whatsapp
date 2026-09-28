"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { useSocket } from "../hooks/useSocket";


import Message from "../components/Message";
import Input from "../components/Input"
import Boton from '../components/Boton';


export default function chatPage() {
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


    return (
        <>

            <div>
                {renderizarMsg()}

            </div>
            
            <Input tipo="text" funcion={setMensaje} text="Mensaje"></Input>          
            <Boton funcion={enviar} text="Enviar"></Boton>  
        
 
        </>
    );
}