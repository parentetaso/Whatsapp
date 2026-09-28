

export default function Input({funcion, text, tipo}) {

    const update = (event) => {
        funcion(event.target.value)
    }
    return(
        <input type={tipo} onChange={update} placeholder={text}></input>

    );
}