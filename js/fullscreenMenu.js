const body = document.body;

const openButton = document.querySelector('.hamburger');
const successModal = createModal('');

openButton.addEventListener('click', e => {
  e.preventDefault();

  body.appendChild(successModal);
});

function createModal(content) {
  const overlayElement = document.createElement('div');
  overlayElement.classList.add('overlay');

  const template = document.querySelector('#fullscreenOverlayTemplate');

  overlayElement.innerHTML = template.innerHTML;

  const closeButton = document.querySelector('.fullscreen-menu__close');

 /* 
  closeButton.addEventListener('click', e => {
    e.preventDefault();
  });
*/

  return overlayElement;
}


