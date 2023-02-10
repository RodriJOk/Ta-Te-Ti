let estado_juego = ["", "", "", "", "", "", "", "", ""];
let formasDeGanar = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let id_interal = null;

function mostrar_mensaje(mensajes){
    let contenedor_mensaje = document.getElementsByClassName('mensajes')[0];
    contenedor_mensaje.firstElementChild.innerText = mensajes;
    contenedor_mensaje.classList.add('activo');
    setTimeout(() => {
        contenedor_mensaje.classList.remove('activo');
    }, 2000) 
}

function usuario_jugando(event){
    let tablero = document.getElementsByClassName('tabla')[0];
    tablero.classList.add('deshabilitar');
    let id_casillero = event.target.id;
    if (estado_juego[id_casillero] === ""){
        dibujar_casillero_seleccionado(id_casillero, "X");
        estado_juego[id_casillero] = "X";
        if(validar_ganador() === ""){
            maquina_jugando();
        }
    }
}

function maquina_jugando(){
    if(!estado_juego.includes("")){
        mostrar_mensaje("Empate");
        reiniciar_juego();
        return;
    }
    clearInterval(id_interal);
    mostrar_mensaje("Espera un momento, la maquina esta jugando");
    setTimeout(() => {
        let numero_aleatorio = Math.floor(Math.random() * 9);
        if (estado_juego[numero_aleatorio] === ""){
            dibujar_casillero_seleccionado(numero_aleatorio, "O");
            estado_juego[numero_aleatorio] = "O";
            if(validar_ganador() === ""){
                mostrar_mensaje("Te toca a vos !")
                let tablero = document.getElementsByClassName('tabla')[0];
                tablero.classList.remove('deshabilitar');
                temporizador();
            }else{
                mostrar_mensaje("Gano la maquina");
            }
        }
        else{
            maquina_jugando();
        }
    }, 1000);
}

function dibujar_casillero_seleccionado(casillero, jugador){
    let elemento = document.getElementById(casillero);
    let etiqueta = document.createElement('span');
    etiqueta.classList.add('material-symbols-outlined');
    etiqueta.style.fontSize = "100px";
    if (jugador === "X"){
        etiqueta.innerText = "close";
    }else{
        etiqueta.innerText = "radio_button_unchecked";
    }
    elemento.appendChild(etiqueta);

}

function validar_ganador(){
    for (let i = 0; i < formasDeGanar.length; i++) {
        let formaDeGanar = formasDeGanar[i];
        let posiciones = formaDeGanar.map(posicion => estado_juego[posicion]);
        if (posiciones[0] === posiciones[1] && posiciones[1] === posiciones[2]) {
            if (posiciones[0] === "X") {
                for (let i = 0; i < formaDeGanar.length; i++) {
                    let casilla = formaDeGanar[i];
                    document.getElementById(casilla).style.backgroundColor = "black";
                    document.getElementById(casilla).style.color = "white";
                }
                let tabla = document.getElementsByClassName('tabla')[0];
                tabla.classList.add('deshabilitar');
                mostrar_mensaje('Ganaste');
                reiniciar_juego();
                return "X";
                
            } else if (posiciones[0] === "O") {
                mostrar_mensaje('Gano la maquina');
                for (let i = 0; i < formaDeGanar.length; i++) {
                    let casilla = formaDeGanar[i];
                    document.getElementById(casilla).style.backgroundColor = "black";
                    document.getElementById(casilla).style.color = "white";
                }
                let tabla = document.getElementsByClassName('tabla')[0];
                tabla.classList.add('deshabilitar');
                reiniciar_juego();
                return "O";
            }
            if(!estado_juego.includes("")){
                mostrar_mensaje('Empate');
                reiniciar_juego();
            }
        }
    }
    return "";
}

function temporizador(){
    clearInterval(id_interal);
    let tiempo = 1;
    let element_timer = document.getElementById('timer');
    let totalMinutes = tiempo * 60 * 1000;
    let fecha_futura = new Date(new Date().getTime() + totalMinutes)
    id_interal = setInterval(() => {
        let fecha_actual = new Date();
        let tiempo_restante = fecha_futura - fecha_actual;
        let minutos = Math.floor(tiempo_restante / 1000 / 60);
        let segundos = Math.floor(tiempo_restante / 1000 % 60);
        element_timer.innerText = `${minutos}:${segundos}`;
        
        if(minutos === 0 && segundos === 0){
            clearInterval(id_interal);
            mostrar_mensaje('Se termino el tiempo');
            let numero_aleatorio = Math.floor(Math.random() * 9);
            if (estado_juego[numero_aleatorio] === ""){
                dibujar_casillero_seleccionado(numero_aleatorio, "O");
                estado_juego[numero_aleatorio] = "O";
                if(validar_ganador() === ""){
                    mostrar_mensaje("Gano la maquina");
                }
            }
            else{
                maquina_jugando();
            }
        }
    }, 1000);
}  

function reiniciar_juego(){
    clearInterval(id_interal);
    let tabla = document.getElementsByClassName('tabla')[0];
    tabla.classList.add('deshabilitar');
    let boton_reiniciar = document.getElementsByClassName('jugar_de_nuevo_container')[0];
    boton_reiniciar.classList.add('active');
}

mostrar_mensaje("Comienza el juego. Te toca a vos !");
temporizador();