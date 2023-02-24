let theme = localStorage.getItem("theme");
if(theme === "dark"){
    document.body.classList.add('dark');
}else{
    document.body.classList.remove('dark');
}


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
let resultado = null;

function mostrar_mensaje(mensajes){
    let contenedor_mensaje = document.getElementsByClassName('mensajes')[0];
    contenedor_mensaje.firstElementChild.innerText = mensajes;
    contenedor_mensaje.classList.add('activo');
    setTimeout(() => {
        contenedor_mensaje.classList.remove('activo');
    }, 2000) 
}

function usuario_jugando(event){
    temporizador();
    let tablero = document.getElementsByClassName('tabla')[0];
    tablero.classList.add('deshabilitar');
    let id_casillero = event.target.id;
    if (estado_juego[id_casillero] === ""){
        dibujar_casillero_seleccionado(id_casillero, "X");
        estado_juego[id_casillero] = "X";
        if(validar_ganador() === ""){

            maquina_jugando();
        }
    }else{
        mostrar_mensaje("Casillero ocupado");
        tablero.classList.remove('deshabilitar');
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
        let numero_aleatorio = buscar_casillero_vacio();
        if (numero_aleatorio !== null){
            dibujar_casillero_seleccionado(numero_aleatorio, "O");
            estado_juego[numero_aleatorio] = "O";
            if(validar_ganador() === "" || estado_juego.length === 0){
                mostrar_mensaje("Te toca a vos !")
                let tablero = document.getElementsByClassName('tabla')[0];
                tablero.classList.remove('deshabilitar');
                temporizador();
            }else{
                mostrar_mensaje("Gano la maquina");
            }
        }
    }, 1000);
}

function dibujar_casillero_seleccionado(casillero, jugador){
    let elemento = document.getElementById(casillero);
    let etiqueta = document.createElement('span');
    etiqueta.classList.add('material-symbols-outlined');
    etiqueta.style.fontSize = "100px";
    etiqueta.style.color = "#181818";
    etiqueta.style.fontWeight = "900";
    if (jugador === "X") etiqueta.innerText = "close";
    else etiqueta.innerText = "radio_button_unchecked";
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
                    document.getElementById(casilla).style.backgroundColor = "white";
                    document.getElementById(casilla).style.color = "black";                    
                }
                let tabla = document.getElementsByClassName('tabla')[0];
                tabla.classList.add('deshabilitar');
                if(localStorage.getItem('puntos') === null){
                    localStorage.setItem('puntos', 500);
                }else{
                    localStorage.setItem('puntos', parseInt(localStorage.getItem('puntos')) + 500);
                }
                // localStorage.setItem('puntos', puntos);
                resultado = "Ganaste";
                mostrar_mensaje('Ganaste');
                ranking_ganador();
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
                if(localStorage.getItem('puntos') === null){
                    localStorage.setItem('puntos', 0);
                }else{
                    let puntos = parseInt(localStorage.getItem('puntos'));
                    if(puntos >= 50){
                        puntos -= 50;
                        localStorage.setItem('puntos', puntos);
                    }else{
                        puntos = 0;
                        localStorage.setItem('puntos', puntos);
                    }
                }
                resultado = "Perdiste";
                ranking_ganador();
                reiniciar_juego();
                return "O";
            }
            if(!estado_juego.includes("")){
                if(localStorage.getItem('puntos') === null){
                    localStorage.setItem('puntos', 0);
                }else{
                    let puntos = parseInt(localStorage.getItem('puntos'));
                    if(puntos >= 50){
                        puntos -= 50;
                        localStorage.setItem('puntos', puntos);
                    }else{
                        puntos = 0;
                        localStorage.setItem('puntos', puntos);
                    }
                }
                resultado = "Empate";
                ranking_ganador();
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
    element_timer.style.color = "white";
    let totalMinutes = tiempo * 60 * 1000;
    let fecha_futura = new Date(new Date().getTime() + totalMinutes)
    id_interal = setInterval(() => {
        let fecha_actual = new Date();
        let tiempo_restante = fecha_futura - fecha_actual;
        let minutos = Math.floor(tiempo_restante / 1000 / 60);
        if(minutos < 10) minutos = "0" + minutos;
        let segundos = Math.floor(tiempo_restante / 1000 % 60);
        if (segundos < 10){
            segundos = "0" + segundos;
            element_timer.style.color = "red";
        }
        element_timer.innerText = `${minutos}:${segundos}`;
        
        if(minutos === "00" && segundos === "00"){
            clearInterval(id_interal);
            mostrar_mensaje('Se termino el tiempo');
            let numero_al_azar = buscar_casillero_vacio();
            dibujar_casillero_seleccionado(numero_al_azar, "X");
            estado_juego[numero_al_azar] = "X";
            if(validar_ganador() === ""){
                setTimeout(() => {
                    maquina_jugando();
                }, 1000);
            }
        }
    }, 1000);
}  

function reiniciar_juego(){
    clearInterval(id_interal);
    let tabla = document.getElementsByClassName('tabla')[0];
    tabla.classList.add('deshabilitar');
}

function buscar_casillero_vacio(){
    let casilleros_vacios = [];
    for (let i = 0; i < estado_juego.length; i++) {
        if(estado_juego[i] === ""){
            casilleros_vacios.push(i);
        }
    }
    let numero_aleatorio = Math.floor(Math.random() * casilleros_vacios.length);
    return casilleros_vacios[numero_aleatorio];
}
let nombre_jugador = document.getElementsByClassName('user-name')[0];
let text_jugador = document.getElementsByClassName('player-text')[0];
if(nombre_jugador.innerText === ""){
    let nombre = localStorage.getItem('name');
    if(nombre === null){
        nombre_jugador.value = "";
        text_jugador.display = "none";
    }else{
        nombre_jugador.value = nombre;
        text_jugador.display = "block";
    }
    nombre_jugador.innerText = nombre_jugador.value;
}

function ranking_ganador(){
    let modal = document.getElementById('modal');
    modal.classList.add('active');
    console.log(localStorage.getItem('puntos'));
    let nombre = localStorage.getItem('name');
    let puntaje = localStorage.getItem('puntos');
    let ranking  = document.getElementById('ranking');
    let simbolo = document.getElementById('simbolo');
    let result = document.getElementById('result');
    if(resultado === "Ganaste"){
        simbolo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="150" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>`
        result.innerText = "Ganaste";
        ranking.innerText = `¡Felicitaciones ${nombre}! con esta victoria haz sumado 500 puntos y tu ranking es ${puntaje}.`;
    }else if(resultado === "Perdiste"){
        simbolo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="150" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 493.4c-29.6 12-62.1 18.6-96 18.6s-66.4-6.6-96-18.6V288c0-8.8-7.2-16-16-16s-16 7.2-16 16V477.8C51.5 433.5 0 350.8 0 256C0 114.6 114.6 0 256 0S512 114.6 512 256c0 94.8-51.5 177.5-128 221.8V288c0-8.8-7.2-16-16-16s-16 7.2-16 16V493.4zM195.2 233.6c5.3 7.1 15.3 8.5 22.4 3.2s8.5-15.3 3.2-22.4c-30.4-40.5-91.2-40.5-121.6 0c-5.3 7.1-3.9 17.1 3.2 22.4s17.1 3.9 22.4-3.2c17.6-23.5 52.8-23.5 70.4 0zm121.6 0c17.6-23.5 52.8-23.5 70.4 0c5.3 7.1 15.3 8.5 22.4 3.2s8.5-15.3 3.2-22.4c-30.4-40.5-91.2-40.5-121.6 0c-5.3 7.1-3.9 17.1 3.2 22.4s17.1 3.9 22.4-3.2zM208 336v32c0 26.5 21.5 48 48 48s48-21.5 48-48V336c0-26.5-21.5-48-48-48s-48 21.5-48 48z"/></svg>`
        result.innerText = "Perdiste";
        ranking.innerText = `Lo sentimos ${nombre}, tu ranking es ${puntaje}.`;
    }else{
        simbolo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="150" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8V128h-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48V352h28.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16V352c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V128H16zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128V352c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V144c0-8.8-7.2-16-16-16H544zm32 208a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"/></svg>`
        result.innerText = "Empate";
        ranking.innerText = `Con este empate, ${nombre} tu ranking es ${puntaje}.`;
    }
}

mostrar_mensaje("Comienza el juego. Te toca a vos !");
temporizador();