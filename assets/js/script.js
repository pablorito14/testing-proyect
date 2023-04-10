let menu_open = false 

const btn_menu = document.getElementById('btn-menu');
btn_menu.addEventListener('click', () => {
  
  if(menu_open === false){
    document.getElementById('menu').style.display = 'grid';
  } else {
    document.getElementById('menu').style.display = 'none'
  }

  menu_open = !menu_open;
})

