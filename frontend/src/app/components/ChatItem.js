"use client"
import { useRouter } from "next/navigation";




export default function ChatItem({nombre, foto, descripcion, id_chat, id_user, global}) {

    const router = useRouter();

    function irAlChat(){

        router.push(`/chat?id_chat=${id_chat}&&id_user=${id_user}&&global=${global}`)

    }


    return(
        <button onClick={irAlChat}>
            <img src={foto}></img>
            
            <div>
                <h3>{nombre}</h3>
                
                <p>{descripcion}</p>
            </div>
        </button>
        
    );
}
