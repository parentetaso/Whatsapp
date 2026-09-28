
import ChatItem from "./ChatItem"



export default function ChatList({chats, id_user}) {


    let items = []
    
    for (let i = 0; i < chats.length; i++) {
        const element = chats[i];
        

        items.push(

            <ChatItem key={i} 
            nombre={element.nombre}
            foto={element.foto}
            descripcion={element.descripcion}
            id_chat={element.id_chat}
            global={element.global}
            id_user={id_user}
            
            
             
            ></ChatItem>
        );
    }

    console.log(items)



    return(
        <>
            {chats.length!=0? 
            items : 
            <p>No hay chats</p>
            }
        </>
        
    );
}
