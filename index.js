let modal = document.getElementById("modal");
let message_error = document.getElementsByClassName("message-error")[0];

function registro_usuario(){  
    let input = document.getElementById("name-user");
    modal.classList.add("active");
    if(localStorage.getItem("name") != null){
        input.value = localStorage.getItem("name");
    }else{
        input.value = "";
    }
}

function comenzar_juego(){
    let input = document.getElementById("name-user");
    if(input.value == "") message_error.classList.add("active");
    else{
        localStorage.setItem("name", input.value);
        window.location.href = "ta-te-ti.html";
    }
}

const btnSwitch = document.querySelector('#switch');

btnSwitch.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	btnSwitch.classList.toggle('active');
    let theme = document.body.classList.contains('dark') ? "dark" : "light";
    localStorage.setItem("theme", theme);
    console.log(theme);
});

if(localStorage.getItem("theme") != null){
    if(localStorage.getItem("theme") == "dark"){
        document.body.classList.add("dark");
        btnSwitch.classList.add("active");
    }
}

function cerrar_modal(){
    modal.classList.remove("active")
}

//Si se pulsa fuera de la ventana modal, se cierra
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove("active");
    }
}