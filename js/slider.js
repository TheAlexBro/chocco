const slider = $(".slider__list").bxSlider({
  pager: false,
  responsive: true,
  controls: false,
  infiniteLoop: false,
  hideControlOnEnd: true
});

$('.arrow__prew').on('click', e => {
  e.preventDefault();
  slider.goToPrevSlide();
});

$('.arrow__next').on('click', e => {
  e.preventDefault();
  slider.goToNextSlide();
});

$('.compound__link').on('click', e => {
  e.preventDefault;
})