"use client"
import {  useState } from 'react';
import Input from "./components/Input"
import Boton from './components/Boton';
import { useRouter } from "next/navigation";


export default function Home() {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");
  const [foto, setFoto] = useState("https://i.pinimg.com/474x/3c/13/98/3c139858ade16fe6bf2b3c8f7f2cd0fd.jpg?nii=t");


  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const router = useRouter();

  

  function logear() {



    fetch(`http://localhost:4000/login?correo=${correo}&contra=${contra}`)
    .then(response => response.json())
    .then(data => {

      if(data.ok){

        router.push(`/menuDeChats?id_user=${data.respuesta[0].id_user}&&correo=${data.respuesta[0].correo}`)
        
      }else{
        alert("El usuario no existe")

      }
    });

  }


  function registrar(){

    if(correo=="" || contra == "" || usuario == "" || foto == ""){

      alert("Datos invalidos")
      return
    }


    const user ={
      usuario: usuario,
      correo: correo,
      contra: contra, 
      foto: foto
    }

    
    fetch('http://localhost:4000/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {

      if(!data.ok){
        
        alert("El usuario ya existe")

      }else{
        logear()
        
      }

    });

  }







  function mostrar(){
    setMostrarRegistro(true)
    
  }


  return (
    <div>
      <Input tipo="text" funcion={setCorreo} text="Ingrese su correo"></Input>
      <Input tipo="password" funcion={setContra} text="Ingrese su contraseña"></Input>

      <Boton funcion={logear} text="Iniciar sesion"></Boton>

      <div>

        {!mostrarRegistro &&
          <Boton funcion={mostrar} text="Crear cuenta"></Boton>
          
        }

        {mostrarRegistro &&

          <div>

            <Input tipo="text" funcion={setUsuario} text="Ingrese su usuario"></Input>          
            <Input tipo="text" funcion={setFoto} text="Url de tu imagen"></Input>          
            <img src={foto}></img>
            <Boton funcion={registrar} text="Registrarse"></Boton>  

          </div>
        }
      </div>


    </div>
  );
}
          