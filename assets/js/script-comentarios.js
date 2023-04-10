// menu oculto = false // menu visible = true
// por defecto el menu esta oculto
let menu_open = false 

// buscamos en el DOM el boton del menu
const btn_menu = document.getElementById('btn-menu');

// escuchamos el evento click
btn_menu.addEventListener('click', () => {
  
  if(menu_open === false){
    // si el menu esta cerrado
    // lo mostramos poniendo display: grid;
    document.getElementById('menu').style.display = 'grid';
  } else {
    // si el menu esta abierto
    // lo ocultamos poniendo display: none
    document.getElementById('menu').style.display = 'none'
  }

  // alternamos el valor de menu.
  // si estaba oculto (false) lo cambiamos a visible (true)
  // y si estaba visible (true) lo cambiamos aoculto (false)
  menu_open = !menu_open;
})

