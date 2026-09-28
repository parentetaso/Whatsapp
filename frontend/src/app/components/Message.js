

export default function Message({contenido, foto, usuario, id_user, id_user_Logeado}) {

    



    return(
        <>
            
            {id_user==id_user_Logeado?
                <div className="enviado">
                    <img src={foto}></img>

                    <p>{usuario}: {contenido}</p>
                </div> 
                :
                <div className="recivido">
                    <img src={foto}></img>

                    <p>{usuario}: {contenido}</p>
                </div>
        
            }


        </>
        
    );
}
