$(function () {

  $.ajax({
    url: "https://api.github.com/repos/" + ghuser + "/" + ghproject + "/commits",
    dataType: 'jsonp',
    success: function(json) {
      var latest = json[0],
          stamp = new Date(latest.committer.date),
          stampString = month[stamp.getMonth()] + ' ' + stamp.getDate() + ', ' + stamp.getFullYear();

      $('#latestCommitMessage').text(latest.commit.message);
      $('#latestCommitTime').text(stampString);
      $('#latestCommitURL').html(' - commit ' + latest.sha.substring(0, 6));
      $('#latestCommitURL').attr('href', "https://github.com" + latest.commit.tree.url);
    }
  });

  var month = new Array(12);
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";


  $(function () {
    $('.box-wrap').antiscroll();
  });

  $('pre code').addClass('prettyprint');
  prettyPrint();

  $('a.scroll').click(function (e) {
    e.preventDefault();

    var section = $(this).attr('href')
      , $scrollto = $(section + '-section');

    $('html,body').animate({
      scrollTop: $scrollto.offset().top
    });
  });

  $('.view-source').click(function(){
    var $obj = $(this).next('.code-wrap')
      , will = ($obj.css('display') == 'none') ? true : false;

    if(will){
      $('.view-source').text('Hide source');
    }else{
      $('.view-source').text('Show source');
    }

    $obj.toggle(200);

    if (will) {
      $('html,body').animate({
        scrollTop: $obj.offset().top
      });
    }

    var tag = $(this).siblings('.header').find('h1').text()
      , action = (will) ? 'opened' : 'closed'
      , note = 'User ' + action + ' ' + tag + '.';

    mpq.track('View Source clicked', {
      'tag': tag,
      'action': action,
      'mp_note': note
    });

    return false;
  });

  $('a.button.github').click(function () {
    mpq.track('Github Fork clicked');
  });

  $('.code-wrap').show();
});