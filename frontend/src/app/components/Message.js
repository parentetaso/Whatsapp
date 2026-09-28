

export default function Message({contenido, foto, usuario, id_user, id_user_Logeado}) {

    



    const fotoValida = typeof foto === "string" && foto.trim() !== "";

    return(
        <>
            
            {id_user==id_user_Logeado?
                <div className="enviado">
                    {fotoValida && <img src={foto} alt={`avatar de ${usuario ?? ""}`} />}

                    <p><strong>{usuario ? `${usuario}: ` : ""}</strong>{contenido}</p>
                </div> 
                :
                <div className="recibido">
                    {fotoValida && <img src={foto} alt={`avatar de ${usuario ?? ""}`} />}

                    <p><strong>{usuario ? `${usuario}: ` : ""}</strong>{contenido}</p>
                </div>
        
            }


        </>
        
    );
}
