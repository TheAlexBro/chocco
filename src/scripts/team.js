;(function() {
  $('.team__title').on('click', e => {
    e.preventDefault();
    
    const $this = $(e.currentTarget);
    const containerList = $this.closest('.team__list');
    const elemContainer = $this.closest('.team__item');
  
    if (elemContainer.hasClass('team--active')) {
      closeEveryItem(containerList);
    } else {
      closeEveryItem(containerList);
      openItem($this);
    };
  });
  
  const openItem = item => {
    const container = item.closest('.team__item');
    const contentBlock = container.find('.team__content');
    const textBlock = contentBlock.find('.team__content-block');
    const reqHeight = textBlock.height();
  
    container.addClass('team--active');
    contentBlock.height(reqHeight);
  };
  
  const closeEveryItem = container => {
    const items = container.find('.team__content');
    const itemContainer = container.find('.team__item');
  
    itemContainer.removeClass('team--active');
    items.height(0);
  }
})()