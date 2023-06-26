;(function() {
  const findBlockByAlias = (alias) => {
    return $('.reviews__item').filter((ndx, item) => {
      return $(item).attr('data-linked-with') == alias;
    });
  };
  
  const findByAutor = (mean) => {
    return $('.autor-mobile').filter((ndx, item) => {
      return $(item).attr('data-author') == mean;
    });
  };
  
  $('.reviews_switcher__link').on('click', e => {
    e.preventDefault();
  
    const $this = $(e.currentTarget);
    const target = $this.attr('data-open');
    const itemToShow = findBlockByAlias(target);
    const curItem = $this.closest('.reviews_switcher__item');
  
    const mobileAutor = $this.attr('data-author');
    const autorToShow = findByAutor(target);
  
    itemToShow.addClass('reviews__item--active').siblings().removeClass('reviews__item--active');
    curItem.addClass('reviews_switcher__item--active').siblings().removeClass('reviews_switcher__item--active');  
    autorToShow.addClass('reviews__author--active').siblings().removeClass('reviews__author--active');
  });
})()