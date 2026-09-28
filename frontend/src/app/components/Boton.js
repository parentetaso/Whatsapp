

export default function Boton({funcion, text}) {


    return(
        <button onClick={funcion}>{text}</button>

    );
}