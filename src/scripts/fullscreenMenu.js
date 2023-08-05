;(function() {
  const openButton = document.querySelector('.hamburger');
  const closeButton = document.querySelector('.fullscreen-menu__close');
  const fMenu = document.querySelector('.fullscreen-menu');

  openButton.addEventListener('click', e => {
    e.preventDefault();

    fMenu.style.top = 0;
    fMenu.style.opacity = 1;
  });

  closeButton.addEventListener('click', e => {
    e.preventDefault();

    fMenu.style.top = "-100%";
    fMenu.style.opacity = 0;
  });
})()

