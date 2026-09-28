"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import ChatList from "../components/ChatList"
import Input from "../components/Input"
import Boton from '../components/Boton';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function chatsPage() {
    const searchParams = useSearchParams();
    const id_user = searchParams.get("id_user")
    const correo_user = searchParams.get("correo")


    const [chats, setChats] = useState([]);

    const [mostrarPopup, setMostrarPopup] = useState(false);
    
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("https://i.pinimg.com/474x/3c/13/98/3c139858ade16fe6bf2b3c8f7f2cd0fd.jpg?nii=t");
    
    const [correo, setCorreo] = useState("");
    const [correos, setCorreos] = useState([correo_user]);
    
    useEffect(() => {
        
  
        fetch(`http://localhost:4000/chats?id_user=${id_user}`)
            .then(response => response.json())
            .then(data =>{ 
                
                
                setChats(data)
                console.log(data)
            })
            


    }, [ ]);



    

    function renderizarCorreos() {
        const lista = correos.map((data, indice) => (
            <li key={indice}>
                <p>{data}</p>
            </li>
        ))
        return lista    


    }

    function updateCorreos() {
        const copia = [];
        correos.forEach((c) => copia.push(c));
        copia.push(correo);
        setCorreos(copia);
    }





    function crearChat() {
        const chat = {
            nombre: nombre,
            descripcion: descripcion,
            foto: imagen,
            correos: correos,
            global: false
        }

        fetch('http://localhost:4000/crearChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chat)
        })
        .then(response => response.json())
        .then(data => {

            if (data.ok) {
                setChats((chatsActuales) => [...chatsActuales, data.chat]);
                setCorreos([correo_user])
                setMostrarPopup(false);
            }else{
                alert("Alguno de los correos no es valido")
                setCorreos([correo_user])
                setMostrarPopup(false);

            }

        })
        
    }


    return (
        <>
            <ChatList chats={chats} id_user={id_user}></ChatList>

            <Boton funcion={() => setMostrarPopup(true)} text="Crear"></Boton>  
            <Popup
            open={mostrarPopup}
            onClose={() => setMostrarPopup(false)}
            modal
            >
                
                <Input tipo="text" funcion={setNombre} text="Nombre"></Input>          
                <Input tipo="text" funcion={setDescripcion} text="Descripcion"></Input>          
                <Input tipo="text" funcion={setImagen} text="Foto"></Input>          

                <img src={imagen}></img>
                <div>

                    <h3>Integrantas:</h3>
                    <ul>
                        {renderizarCorreos()}

                    </ul>
                </div>
                <Input tipo="text" funcion={setCorreo} text="Correo"></Input>


                <Boton funcion={updateCorreos} text="Añadir"></Boton>
                <Boton funcion={crearChat} text="Crear"></Boton>  
            </Popup>
        </>
    );
}
