(function () {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js?onload=start';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

function signInCallback(authResult) {
  
  var code = authResult['code'];

  if (code) {
    
    $('#signinButton').attr('style', 'display: none');

    $.ajax({
      type: 'POST',
      url: '/Account/Callback',
      data: { code: code },
      success: function(result) {
        window.location.href = '/';
      }
    });
  } else if (authResult['error']) {
    // There was an error.
    // Possible error codes:
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatially log in the user
    // console.log('There was an error: ' + authResult['error']);
  }
}