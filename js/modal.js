const validateFields = (form, fieldsArray) => {
  fieldsArray.forEach(field => {
    field.removeClass('form__input--error');
    if (field.val().trim() == "") {
      field.addClass('form__input--error')
    }
  });

  const errorField = form.find('.form__input--error');

  return errorField.length == 0;
};

$('.form').submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $('#modal');
  const content = modal.find('.modal__content');

  modal.removeClass('error-modal');

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
   const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val()
      }
    });

    request.done(data => {
      // console.log(data);
      content.text(data.message);
    });

    request.fail(data => {
      //console.log(data);
      const meassage = data.responseJSON.meassage;
      content.text(meassage);
      modal.addClass('error-modal');
    });

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    });
  };
});

$('.app-submit-btn').on('click', e => {
  e.preventDefault();

  $.fancybox.close();
});