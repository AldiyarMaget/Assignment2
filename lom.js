$('#copyBtn').on('click', function(){
    const text = $('#textToCopy').text();
    navigator.clipboard.writeText(text).then(() => {
        const btn = $(this);
        $('#textToCopy').trigger('copy')
        btn.text('✅')
        $('#copyMessage').fadeIn(400).delay(1600)
        setTimeout(() => {
            btn.text('📋')
            $('#copyMessage').fadeOut(400)
        }, 2000)  
    }    
)
}
)
$(window).on('scroll', function() {
  $('.card-media-circular').each(function() {
    const img = $(this);
    const top = img.offset().top;
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    if (top < scrollTop + windowHeight) {
      img.attr('src', img.data('src'));
    }
  });
});