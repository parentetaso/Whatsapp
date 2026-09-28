

export default function Input({funcion, text, tipo, teclado, valor = ""}) {

    const update = (event) => {
        funcion(event.target.value)
    }

    return(
        <input
            type={tipo}
            onChange={update}
            onKeyDown={teclado}
            value={valor}
            placeholder={text}
        ></input>

    );
}