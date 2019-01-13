/* eslint-env jquery, browser */
$(document).ready(() => {
  const animateShow = (el, beforeCallback = () => {}, callback = () => {}) => {
    $('.current-progress-text').removeClass('current-progress-text');
    $('#loading-img').show();
    setTimeout(() => {
      $('#loading-img').hide();
      el.css('opacity', 0);
      el.show();
      el.addClass('current-progress-text');
      beforeCallback();
      el.animate(
        {
          opacity: 100,
        },
        750,
        callback,
      );
    }, 1000);
  };
  const showEncryptedAddress = () => {
    $('#encrypted-address-input').val(
      sha256($('#address-input').val()).slice(0, 16),
    );
    animateShow($('#encrypted-address-container'), () => {
      $('#encrypted-address-input').addClass('current-progress-text');
    });
  };
  $('#address-input').keyup($.debounce(1500, showEncryptedAddress));

  $('#safu-form').submit((event) => {
    event.preventDefault();

    if (
      $('#encrypted-address-input')
        .val()
        .trim() === ''
    ) {
      return;
    }

    $.ajax({
      type: 'GET',
      url: `http://localhost:8000/${$('#currency-input').find(':selected').text()}/${$('#address-input').val()}/score`,
      dataType: 'json',
      success: (result) => {
        $('#check-button').hide();
        $('.address-inputed').text($('#encrypted-address-input').val());
        $('.score').text(result.score);
        if (result.score > 50) {
          $('#address-safu-success').hide();
          $('#address-safu-error').show();
        } else {
          $('#address-safu-success').show();
          $('#address-safu-error').hide();
        }
        animateShow($('#address-safu-result'), () => {
          $('#new-query-button').show();
          $('#new-query-button').animate({
            opacity: 100,
          });
        });
      },
    });
  });
});
