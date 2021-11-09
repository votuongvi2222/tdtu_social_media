

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

  // noti stream
  // noti header
  $('.noti-item .card-header').click(function(){
    $(this).toggleClass('active');
  });
  //image map 
  $("map").imageMapResize();

  $('#accept_limit_people-btn').click(function(){
    $('#staticBackdrop').hide();
  })
  $(window).scroll(function(e){
    var height = $(window).scrollTop();
    if(height > ($('.top-bar').outerHeight(true)+$('#header').outerHeight(true)+$('.banner').outerHeight(true)+$('#myTab').outerHeight(true)))
      $('#myTab').addClass('scroll');
    else
      $('#myTab').removeClass('scroll');

  })
});
//# sourceMappingURL=imageMapResizer.map
// ------------------------------------------------------------------------------
// ZABUTO CALENDAR PLG
if (typeof jQuery == "undefined") {
  throw new Error("jQuery is not loaded");
}
$.fn.zabuto_calendar = function (b) {
  var c = $.extend({}, $.fn.zabuto_calendar_defaults(), b);
  var a = $.fn.zabuto_calendar_language(c.language);
  c = $.extend({}, c, a);
  this.each(function () {
    var i = $(this);
    i.attr(
      "id",
      "zabuto_calendar_" + Math.floor(Math.random() * 99999).toString(36)
    );
    i.data("initYear", c.year);
    i.data("initMonth", c.month);
    i.data("monthLabels", c.month_labels);
    i.data("weekStartsOn", c.weekstartson);
    i.data("navIcons", c.nav_icon);
    i.data("dowLabels", c.dow_labels);
    i.data("showToday", c.today);
    i.data("showDays", c.show_days);
    i.data("showPrevious", c.show_previous);
    i.data("showNext", c.show_next);
    i.data("cellBorder", c.cell_border);
    i.data("jsonData", c.data);
    i.data("ajaxSettings", c.ajax);
    i.data("legendList", c.legend);
    i.data("actionFunction", c.action);
    i.data("actionNavFunction", c.action_nav);
    k();
    function k() {
      var x = parseInt(i.data("initYear"));
      var A = parseInt(i.data("initMonth")) - 1;
      var C = new Date(x, A, 1, 0, 0, 0, 0);
      i.data("initDate", C);
      var D = i.data("cellBorder") === true ? " table-bordered" : "";
      var B = $('<table class="table' + D + '"></table>');
      B = u(i, B, C.getFullYear(), C.getMonth());
      var w = f(i);
      var y = $('<div class="zabuto_calendar"></div>');
      y.append(B);
      y.append(w);
      i.append(y);
      var z = i.data("jsonData");
      if (false !== z) {
        p(i, C.getFullYear(), C.getMonth());
      }
    }
    function u(y, A, x, z) {
      var w = new Date(x, z, 1, 0, 0, 0, 0);
      y.data("currDate", w);
      A.empty();
      A = q(y, A, x, z);
      A = d(y, A);
      A = o(y, A, x, z);
      p(y, x, z);
      return A;
    }
    function f(y) {
      var w = $('<div class="legend" id="' + y.attr("id") + '_legend"></div>');
      var x = y.data("legendList");
      if (typeof x == "object" && x.length > 0) {
        $(x).each(function (C, E) {
          if (typeof E == "object") {
            if ("type" in E) {
              var D = "";
              if ("label" in E) {
                D = E.label;
              }
              switch (E.type) {
                case "text":
                  if (D !== "") {
                    var B = "";
                    if ("badge" in E) {
                      if (typeof E.classname === "undefined") {
                        var F = "badge-event";
                      } else {
                        var F = E.classname;
                      }
                      B =
                        '<span class="badge ' + F + '">' + E.badge + "</span> ";
                    }
                    w.append(
                      '<span class="legend-' + E.type + '">' + B + D + "</span>"
                    );
                  }
                  break;
                case "block":
                  if (D !== "") {
                    D = "<span>" + D + "</span>";
                  }
                  if (typeof E.classname === "undefined") {
                    var A = "event";
                  } else {
                    var A = "event-styled " + E.classname;
                  }
                  w.append(
                    '<span class="legend-' +
                      E.type +
                      '"><ul class="legend"><li class="' +
                      A +
                      '"></li></ul>' +
                      D +
                      "</span>"
                  );
                  break;
                case "list":
                  if (
                    "list" in E &&
                    typeof E.list == "object" &&
                    E.list.length > 0
                  ) {
                    var z = $('<ul class="legend"></ul>');
                    $(E.list).each(function (H, G) {
                      z.append('<li class="' + G + '"></li>');
                    });
                    w.append(z);
                  }
                  break;
                case "spacer":
                  w.append('<span class="legend-' + E.type + '"> </span>');
                  break;
              }
            }
          }
        });
      }
      return w;
    }
    function q(E, D, G, M) {
      var L = E.data("navIcons");
      var A = $(
        `<span><span class="glyphicon glyphicon-chevron-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
        </span></span>`
      );
      var Q = $(
        `<span><span class="glyphicon glyphicon-chevron-right">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        </span></span>`
      );
      if (typeof L === "object") {
        if ("prev" in L) {
          A.html(L.prev);
        }
        if ("next" in L) {
          Q.html(L.next);
        }
      }
      var K = E.data("showPrevious");
      if (typeof K === "number" || K === false) {
        K = n(E.data("showPrevious"), true);
      }
      var w = $('<div class="calendar-month-navigation"></div>');
      w.attr("id", E.attr("id") + "_nav-prev");
      w.data("navigation", "prev");
      if (K !== false) {
        var N = M - 1;
        var F = G;
        if (N == -1) {
          F = F - 1;
          N = 11;
        }
        w.data("to", { year: F, month: N + 1 });
        w.append(A);
        if (typeof E.data("actionNavFunction") === "function") {
          w.click(E.data("actionNavFunction"));
        }
        w.click(function (R) {
          u(E, D, F, N);
        });
      }
      var C = E.data("showNext");
      if (typeof C === "number" || C === false) {
        C = n(E.data("showNext"), false);
      }
      var z = $('<div class="calendar-month-navigation"></div>');
      z.attr("id", E.attr("id") + "_nav-next");
      z.data("navigation", "next");
      if (C !== false) {
        var x = M + 1;
        var P = G;
        if (x == 12) {
          P = P + 1;
          x = 0;
        }
        z.data("to", { year: P, month: x + 1 });
        z.append(Q);
        if (typeof E.data("actionNavFunction") === "function") {
          z.click(E.data("actionNavFunction"));
        }
        z.click(function (R) {
          u(E, D, P, x);
        });
      }
      var B = E.data("monthLabels");
      var J = $("<td></td>").append(w);
      var O = $("<td></td>").append(z);
      var H = $("<span>" + B[M] + " " + G + "</span>");
      H.dblclick(function () {
        var R = E.data("initDate");
        u(E, D, R.getFullYear(), R.getMonth());
      });
      var I = $('<td colspan="5"></td>');
      I.append(H);
      var y = $('<tr class="calendar-month-header"></tr>');
      y.append(J, I, O);
      D.append(y);
      return D;
    }
    function d(z, B) {
      if (z.data("showDays") === true) {
        var w = z.data("weekStartsOn");
        var x = z.data("dowLabels");
        if (w === 0) {
          var A = $.extend([], x);
          var C = new Array(A.pop());
          x = C.concat(A);
        }
        var y = $('<tr class="calendar-dow-header"></tr>');
        $(x).each(function (D, E) {
          y.append("<th>" + E + "</th>");
        });
        B.append(y);
      }
      return B;
    }
    function o(E, D, G, L) {
      var C = E.data("ajaxSettings");
      var F = r(G, L);
      var w = m(G, L);
      var B = h(G, L, 1);
      var N = h(G, L, w);
      var A = 1;
      var z = E.data("weekStartsOn");
      if (z === 0) {
        if (N == 6) {
          F++;
        }
        if (B == 6 && (N == 0 || N == 1 || N == 5)) {
          F--;
        }
        B++;
        if (B == 7) {
          B = 0;
        }
      }
      for (var y = 0; y < F; y++) {
        var x = $('<tr class="calendar-dow"></tr>');
        for (var I = 0; I < 7; I++) {
          if (I < B || A > w) {
            x.append("<td></td>");
          } else {
            var M = E.attr("id") + "_" + j(G, L, A);
            var K = M + "_day";
            var J = $('<div id="' + K + '" class="day" >' + A + "</div>");
            J.data("day", A);
            if (v(G, L, A)) {
              J.addClass("today");
              if (E.data("showToday") === true) {
                J.html('<span class="badge badge-today">' + A + "</span>");
              }
            }
            var H = $('<td id="' + M + '"></td>');
            H.append(J);
            H.data("date", j(G, L, A));
            H.data("hasEvent", false);
            if (typeof E.data("actionFunction") === "function") {
              H.addClass("dow-clickable");
              H.click(function () {
                E.data("selectedDate", $(this).data("date"));
              });
              H.click(E.data("actionFunction"));
            }
            x.append(H);
            A++;
          }
          if (I == 6) {
            B = 0;
          }
        }
        D.append(x);
      }
      return D;
    }
    function g(z, F, E, H) {
      var G = $(
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
      );
      var y = $(
        '<h4 class="modal-title" id="' + z + '_modal_title">' + F + "</h4>"
      );
      var I = $('<div class="modal-header"></div>');
      I.append(G);
      I.append(y);
      var D = $(
        '<div class="modal-body" id="' + z + '_modal_body">' + E + "</div>"
      );
      var C = $('<div class="modal-footer" id="' + z + '_modal_footer"></div>');
      if (typeof H !== "undefined") {
        var x = $("<div>" + H + "</div>");
        C.append(x);
      }
      var A = $('<div class="modal-content"></div>');
      A.append(I);
      A.append(D);
      A.append(C);
      var w = $('<div class="modal-dialog"></div>');
      w.append(A);
      var B = $(
        '<div class="modal fade" id="' +
          z +
          '_modal" tabindex="-1" role="dialog" aria-labelledby="' +
          z +
          '_modal_title" aria-hidden="true"></div>'
      );
      B.append(w);
      B.data("dateId", z);
      B.attr("dateId", z);
      return B;
    }
    function p(y, x, A) {
      var w = y.data("jsonData");
      var z = y.data("ajaxSettings");
      y.data("events", false);
      if (false !== w) {
        return l(y);
      } else {
        if (false !== z) {
          return s(y, x, A);
        }
      }
      return true;
    }
    function l(x) {
      var w = x.data("jsonData");
      x.data("events", w);
      e(x, "json");
      return true;
    }
    function s(x, w, A) {
      var z = x.data("ajaxSettings");
      if (typeof z != "object" || typeof z.url == "undefined") {
        alert("Invalid calendar event settings");
        return false;
      }
      var y = { year: w, month: A + 1 };
      $.ajax({ type: "GET", url: z.url, data: y, dataType: "json" }).done(
        function (B) {
          var C = [];
          $.each(B, function (E, D) {
            C.push(B[E]);
          });
          x.data("events", C);
          e(x, "ajax");
        }
      );
      return true;
    }
    function e(z, y) {
      var x = z.data("jsonData");
      var A = z.data("ajaxSettings");
      var w = z.data("events");
      if (w !== false) {
        $(w).each(function (F, H) {
          var B = z.attr("id") + "_" + H.date;
          var D = $("#" + B);
          var I = $("#" + B + "_day");
          D.data("hasEvent", true);
          if (typeof H.title !== "undefined") {
            D.attr("title", H.title);
          }
          if (typeof H.classname === "undefined") {
            D.addClass("event");
          } else {
            D.addClass("event-styled");
            I.addClass(H.classname);
          }
          if (typeof H.badge !== "undefined" && H.badge !== false) {
            var C = H.badge === true ? "" : " badge-" + H.badge;
            var E = I.data("day");
            I.html('<span class="badge badge-event' + C + '">' + E + "</span>");
          }
          if (typeof H.body !== "undefined") {
            var G = false;
            if (
              y === "json" &&
              typeof H.modal !== "undefined" &&
              H.modal === true
            ) {
              G = true;
            } else {
              if (y === "ajax" && "modal" in A && A.modal === true) {
                G = true;
              }
            }
            if (G === true) {
              D.addClass("event-clickable");
              var J = g(B, H.title, H.body, H.footer);
              $("body").append(J);
              $("#" + B).click(function () {
                $("#" + B + "_modal").modal();
              });
            }
          }
        });
      }
    }
    function v(y, z, x) {
      var A = new Date();
      var w = new Date(y, z, x);
      return w.toDateString() == A.toDateString();
    }
    function j(y, z, x) {
      var w, A;
      A = x < 10 ? "0" + x : x;
      w = z + 1;
      w = w < 10 ? "0" + w : w;
      return y + "-" + w + "-" + A;
    }
    function h(y, z, x) {
      var w = new Date(y, z, x, 0, 0, 0, 0);
      var A = w.getDay();
      if (A == 0) {
        A = 6;
      } else {
        A--;
      }
      return A;
    }
    function m(x, y) {
      var w = 28;
      while (t(x, y + 1, w + 1)) {
        w++;
      }
      return w;
    }
    function r(y, A) {
      var w = m(y, A);
      var C = h(y, A, 1);
      var z = h(y, A, w);
      var B = w;
      var x = C - z;
      if (x > 0) {
        B += x;
      }
      return Math.ceil(B / 7);
    }
    function t(z, w, x) {
      return (
        w > 0 &&
        w < 13 &&
        z > 0 &&
        z < 32768 &&
        x > 0 &&
        x <= new Date(z, w, 0).getDate()
      );
    }
    function n(y, A) {
      if (y === false) {
        y = 0;
      }
      var z = i.data("currDate");
      var x = i.data("initDate");
      var w;
      w = (x.getFullYear() - z.getFullYear()) * 12;
      w -= z.getMonth() + 1;
      w += x.getMonth();
      if (A === true) {
        if (w < parseInt(y) - 1) {
          return true;
        }
      } else {
        if (w >= 0 - parseInt(y)) {
          return true;
        }
      }
      return false;
    }
  });
  return this;
};
$.fn.zabuto_calendar_defaults = function () {
  var a = new Date();
  var c = a.getFullYear();
  var d = a.getMonth() + 1;
  var b = {
    language: false,
    year: c,
    month: d,
    show_previous: true,
    show_next: true,
    cell_border: false,
    today: true,
    show_days: true,
    weekstartson: 1,
    nav_icon: false,
    data: false,
    ajax: false,
    legend: false,
    action: false,
    action_nav: false,
  };
  return b;
};
$.fn.zabuto_calendar_language = function (a) {
  if (typeof a == "undefined" || a === false) {
    a = "en";
  }
  return {
      month_labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      dow_labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };
};

$(document).ready(function () {
  $("#demo").zabuto_calendar();
});



