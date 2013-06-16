$(function () {
  function resize () {
    var footerHeight = $('.site-footer').height()
      , padding = $('.site-wrapper').innerHeight()
                - $('.site-wrapper').height()
                + 50

    $('.site-wrapper').css('min-height', $(window).height() - footerHeight - padding)
  }

  $(window).on('resize', resize)
  resize()
})
