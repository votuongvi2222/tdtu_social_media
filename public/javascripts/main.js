

function FileDetails() {
  var fi = document.getElementsByClassName("file")[0];
  if (fi.files.length > 0) {
    $("#files-detail").append(function () {
      var str = "";
      for (var i = 0; i <= fi.files.length - 1; i++) {
        var fname = fi.files.item(i).name; // THE NAME OF THE FILE.
        var fsize = fi.files.item(i).size; // THE SIZE OF THE FILE.
        str += fname + `<br>`;
      }
      return str;
    });
  } else {
    alert("Please select a file.");
  }
}

/*! Image Map Resizer (imageMapResizer.min.js ) - v1.0.10 - 2019-04-10
 *  Desc: Resize HTML imageMap to scaled image.
 *  Copyright: (c) 2019 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

!(function () {
  "use strict";
  function r() {
    function e() {
      var r = {
          width: u.width / u.naturalWidth,
          height: u.height / u.naturalHeight,
        },
        a = {
          width: parseInt(
            window.getComputedStyle(u, null).getPropertyValue("padding-left"),
            10
          ),
          height: parseInt(
            window.getComputedStyle(u, null).getPropertyValue("padding-top"),
            10
          ),
        };
      i.forEach(function (e, t) {
        var n = 0;
        o[t].coords = e
          .split(",")
          .map(function (e) {
            var t = 1 == (n = 1 - n) ? "width" : "height";
            return a[t] + Math.floor(Number(e) * r[t]);
          })
          .join(",");
      });
    }
    function t(e) {
      return e.coords.replace(/ *, */g, ",").replace(/ +/g, ",");
    }
    function n() {
      clearTimeout(d), (d = setTimeout(e, 250));
    }
    function r(e) {
      return document.querySelector('img[usemap="' + e + '"]');
    }
    var a = this,
      o = null,
      i = null,
      u = null,
      d = null;
    "function" != typeof a._resize
      ? ((o = a.getElementsByTagName("area")),
        (i = Array.prototype.map.call(o, t)),
        (u = r("#" + a.name) || r(a.name)),
        (a._resize = e),
        u.addEventListener("load", e, !1),
        window.addEventListener("focus", e, !1),
        window.addEventListener("resize", n, !1),
        window.addEventListener("readystatechange", e, !1),
        document.addEventListener("fullscreenchange", e, !1),
        (u.width === u.naturalWidth && u.height === u.naturalHeight) || e())
      : a._resize();
  }
  function e() {
    function t(e) {
      e &&
        (!(function (e) {
          if (!e.tagName)
            throw new TypeError("Object is not a valid DOM element");
          if ("MAP" !== e.tagName.toUpperCase())
            throw new TypeError(
              "Expected <MAP> tag, found <" + e.tagName + ">."
            );
        })(e),
        r.call(e),
        n.push(e));
    }
    var n;
    return function (e) {
      switch (((n = []), typeof e)) {
        case "undefined":
        case "string":
          Array.prototype.forEach.call(
            document.querySelectorAll(e || "map"),
            t
          );
          break;
        case "object":
          t(e);
          break;
        default:
          throw new TypeError("Unexpected data type (" + typeof e + ").");
      }
      return n;
    };
  }
  "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e())
    : (window.imageMapResize = e()),
    "jQuery" in window &&
      (window.jQuery.fn.imageMapResize = function () {
        return this.filter("map").each(r).end();
      });
})();

$(document).ready(function () {
  //search noti
  $('#search-input').focus(function(){
    if (this.value == this.defaultValue) 
      this.value = '';
  })
  $('#search-input').blur(function(){
    if(this.value=='')
      this.value=this.defaultValue;
  })
  // file upload detail
  $('#files-detail').hide();
  $('#show_file_detail-btn').click(function(){
    $('#files-detail').toggle();
    if($('#files-detail').css('display') == 'none')
      $("#show_file_detail-btn").text('Show details');
    else
      $("#show_file_detail-btn").text('Hide details');
    $("#files-detail").text('');
    FileDetails();
  })
  // comment on post
  $(".list-comment").hide();
  $("#down_post1.bi.bi-caret-down-fill").click(function () {
    $("#list-comments1 > .list-comment").toggle();
    $("#down_post1.bi.bi-caret-down-fill").toggle();
    $("#up_post1.bi.bi-caret-up-fill").toggle();
  });
  $("#up_post1.bi.bi-caret-up-fill").click(function () {
    $("#list-comments1 >.list-comment").toggle();
    $("#down_post1.bi.bi-caret-down-fill").toggle();
    $("#up_post1.bi.bi-caret-up-fill").toggle();
  });
  $("#down_post2.bi.bi-caret-down-fill").click(function () {
    $("#list-comments2 >.list-comment").toggle();
    $("#down_post2.bi.bi-caret-down-fill").toggle();
    $("#up_post2.bi.bi-caret-up-fill").toggle();
  });
  $("#up_post2.bi.bi-caret-up-fill").click(function () {
    $("#list-comments2 >.list-comment").toggle();
    $("#down_post2.bi.bi-caret-down-fill").toggle();
    $("#up_post2.bi.bi-caret-up-fill").toggle();
  });

  $(".infocenter_mobile_click").on("click", function () {
    $(".navigation_mobile ul").toggle();
  });
  
  $(".tooltip-btn").click(function () {
    $(".hidden").toggle();
  });
  $(".close-icon").click(function () {
    $(".hidden").toggle();
  });
  $(".class-alter-icon").click(function () {
    $(".class-alter-icon ul").toggle();
  });
  $(".post-alter-icon").click(function () {
    $(".post-alter-icon ul").toggle();
  });
  $(".add_upload_button_js").click(function () {
    $("li.poll_li_1").css("display", "list-item");
  });
  
  $(".question_poll_item").on("click", ".del-poll-li", () => {
    $("li.poll_li_1").css("display", "none");
    $("#show_file_detail-btn").css("display", "none");
    $("#show_file_detail-btn").text('Hide details');
    $("#files-detail").text("");
    $(".file").val("");
    var fi = document.getElementsByClassName("file")[0];
    $(".fakefile button").text("Total files: " + fi.files.length);
  });
  $("textarea.comment-input").keypress(function (e) {
    var char = e.keyCode || e.which;
    if (char == 13) {
      $(this).attr("rows", $(this).rows + 1);
      console.log($(this).rows);
    }
  });
  // tooltip
  $('[data-toggle="tooltip"]').tooltip();


  $("body").on("change", "input[type=file]", function () {
    var fi = document.getElementsByClassName("file")[0];
    $(".fakefile button").text("Total files: " + fi.files.length);
    $('#show_file_detail-btn').click();
    $(".show-files-detail").css("display", "block");
  });
  $("#selectAllAss").click(function () {
    $(".assignment-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("#selectAllMat").click(function () {
    $(".material-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("#selectAllAnn").click(function () {
    $(".announ-visibility input[type=checkbox]").prop(
      "checked",
      $(this).prop("checked")
    );
  });
  $("button").click(function () {
    var array = [];
    $("input:checkbox[name=type]:checked").each(function () {
      array.push($(this).val());
    });
    $("#GFG_DOWN").text(array);
  });
  $(".add_category_btn").click(function () {
    if ($("#add-new-category").val() != "") {
      $option = $("<option></option>");
      $option.val($("#add-new-category").val());
      $option.text($option.val());
      $("#category").append($option);
    }
  });
  // Emoji selector 
  tinymce.init({
    selector: "#messageInput",
    plugins: "autoresize link lists emoticons",
    toolbar:
        "bold italic underline strikethrough | forecolor | numlist bullist | link blockquote emoticons",
    menubar: false,
    statusbar: false,
    width: "100%",
    toolbar_location: "bottom",
    autoresize_bottom_margin: 0,
    contextmenu: false,
    setup: (ed) => {
        editor = ed;
    },
  });

  // toolbar
  $('.toolbar-btn').click(function(){
    $(this).toggleClass('focused');
  })
  // editor 
  $('#post_editor-expand').hide();

  $('#post_content_editor-textarea').focus(function(){
    $('#editor_title-textarea').addClass('focused');
    $('.content_editor_focus-line').addClass('focused');
  
  })
  $('#post_content_editor-textarea').blur(function(){
    var textboxContent = $.trim($('#post_content_editor-textarea').text());
    if(textboxContent == '')
      $('#editor_title-textarea').removeClass('focused');
      $('.content_editor_focus-line').removeClass('focused');

  })
  $('body').on('DOMSubtreeModified', '#post_content_editor-textarea', function(){
    // console.log('changed');
    var textboxContent = $.trim($('#post_content_editor-textarea').text());
    if(textboxContent != '')
      $('#upload_post-tab').removeClass('empty');
    else
      $('#upload_post-tab').addClass('empty');
  })
  $('#cancel_post-tab').click(function(){
    $('#post_editor-expand').hide();
    $('#post_editor-btn').show();
    $('#post_content_editor-textarea').innerText = '';
  })
  $('#post_editor-btn').click(function(){
    $('#post_editor-expand').show();
    $('#post_editor-btn').hide();
    $('#post_content_editor-textarea').focus();
  })
  //image map 
  $("map").imageMapResize();

  $('#accept_limit_people-btn').click(function(){
    $('#staticBackdrop').hide();
  })
});
//# sourceMappingURL=imageMapResizer.map





