/**
 * Copyright (c) 2013 - 2019 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 * @version 3.2.1
 */
$(document).ready(function(){var t=!1;$(".fam").each(function(){var a=$(this),e=a.find("ul");e.attr("aria-hidden",!e.hasClass("exposed")),a.find("ul.alwaysOpen").length||a.find("a").first().on("click",function(a){e.hasClass("exposed")?e.removeClass("exposed").attr("aria-hidden",!0):($(".fam ul").removeClass("exposed").attr("aria-hidden",!0),e.addClass("exposed").attr("aria-hidden",!1)),a.preventDefault()}).attr("data-fam-menu",1),t=!0}),t&&$(document).on("click",function(a){var e=$(a.target);"HTML"!=a.target.nodeName&&(e.attr("data-fam-menu")||e.hasClass("leave-open")||e.parent().attr("data-fam-menu")||e.parent().hasClass("leave-open"))||$(".fam ul").removeClass("exposed").attr("aria-hidden",!0)})}),$(document).ready(function(){function e(){var a=$(this),e=$("#"+a.attr("id")+"-label"),t=a.attr("type");"checkbox"!=t&&"submit"!=t&&"file"!=t&&a.on("focus",function(){e.addClass("focused")}).on("blur",function(){e.removeClass("focused")})}function t(){var a=$(this),e=a.attr("type");if("disabled"!=a.attr("data-floating-label")&&!a.hasClass("hasFloatingLabel")&&"checkbox"!=e&&"submit"!=e&&"file"!=e){var t=$("#"+a.attr("id")+"-label");t.length&&(a.is("textarea")&&t.addClass("floatTextarea"),a.addClass("hasFloatingLabel"),a.on("focus",function(){t.removeClass("floatDown").addClass("floatUp"),null!=a.attr("data-placeholder")&&a.attr("placeholder",a.attr("data-placeholder"))}).on("blur",function(){a.is("select")||a.val()||a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp"),null!=a.attr("data-placeholder")&&a.attr("placeholder","")}).on("change",function(){t.removeClass("focused"),a.is("select")||a.val()||a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")}),a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")||null!=a.attr("placeholder")&&(a.closest(".placeholderOnFocus").length&&a.attr("data-placeholder",a.attr("placeholder")),a.attr("placeholder","")),a.trigger("blur"))}}var s=$.fn.val;$.fn.val=function(a){if(void 0===a)return s.call(this);var e=$(this[0]),t=$("#"+e.attr("id")+"-label");return e.hasClass("hasFloatingLabel")&&"checkbox"!=e.attr("type")&&("string"!=typeof a||a.length||e.is("select")||document.activeElement==this[0]?(t.removeClass("floatDown").addClass("floatUp"),null!=e.attr("data-placeholder")&&e.attr("placeholder",e.attr("data-placeholder"))):(t.addClass("floatDown").removeClass("floatUp"),null!=e.attr("data-placeholder")&&e.attr("placeholder",""))),s.call(this,a)};var l=$.fn.focus;function a(){var a=$(this);a.hasClass("hform")||(a.find("input").each(t),a.find("textarea").each(t),a.find(".selectControl select").each(t))}$.fn.focus=function(){l.call(this);var a=$(this[0]),e=$("#"+a.attr("id")+"-label");return a.hasClass("hasFloatingLabel")&&"checkbox"!=a.attr("type")&&(e.removeClass("floatDown").addClass("floatUp"),e.addClass("focused"),null!=a.attr("data-placeholder")&&a.attr("placeholder",a.attr("data-placeholder"))),this},$(".floatingLabels form").each(a),$("form.floatingLabels").each(a),$("form").each(function(){var a=$(this);a.hasClass("hform")||(a.find("input").each(e),a.find("textarea").each(e),a.find("select").each(e))}),setTimeout(function(){$(document.activeElement).trigger("focus")},100)}),$(document).ready(function(){$("#viewSlideInMenu").length&&($("body").append('<div id="slideInMenuOverlay"></div>'),$("#slideInMenu").length||($("body").append('<div id="slideInMenu" role="menu"></div>'),$(".slideInMenu").each(function(a){var e="",t="";"ul"==this.nodeName.toLowerCase()&&(e="<ul>",t="</ul>"),$(this).hasClass("slideInMenuRootOnly")?($("#slideInMenuOverlay").html(e+$(this).html()+t).find("li ul").remove(),$("#slideInMenu").append($("#slideInMenuOverlay").html())):$("#slideInMenu").append(e+$(this).html()+t)})),$("#slideInMenu").attr("aria-hidden",!0),$("#slideInMenuOverlay").html("").on("click",function(a){$("#slideInMenu").removeClass("slideInMenuShow").attr("aria-hidden",!0),$("#slideInMenuOverlay").removeClass("slideInMenuShow"),$("body").removeClass("disableScroll")}),$("#viewSlideInMenu").on("click",function(a){$("#slideInMenuOverlay").addClass("slideInMenuShow"),$("#slideInMenu").addClass("slideInMenuShow").attr("aria-hidden",!1)}))}),function(){var p=0;$.fn.tabWidget=function(s){var l,a,i={},e=this,n=e.find(".tabs").first(),r=p++,o="1"===e.attr("data-tabs-save-active");if("1"!==e.attr("data-tabs-enabled")){if(e.attr("data-tabs-enabled","1"),"1"===e.attr("data-tabs-hide-wrap")){n.append('<li role="menubar" class="tabsMenu">&nbsp;<ul style="display: none"></ul></li>');var d=n.find(".tabsMenu"),c=d.find("ul");function t(){var t=n.width(),s=0;s+=d.width()+parseInt(d.css("margin-left"))+parseInt(d.css("margin-right"))+parseInt(d.css("padding-left"))+parseInt(d.css("padding-right")),n.find("li").show(),c.find("li").hide();var l=c.find("li"),i=0;n.find("li").each(function(a){var e=$(this);"tab"===e.attr("role")&&(s+=e.width()+parseInt(e.css("margin-left"))+parseInt(e.css("margin-right"))+parseInt(e.css("padding-left"))+parseInt(e.css("padding-right")),t<=s&&($(this).hide(),l.eq(a).show(),i++))}),i?d.show():(d.hide(),c.hide())}n.find("li").each(function(){var a=$(this);if("tab"===a.attr("role")){var e,t=a[0].cloneNode(!0);null==(e=t.getAttribute("data-tabpanel"))&&(e=$(t).find("a").attr("href").replace(/^.*#/,"")),t.setAttribute("role","menuitem"),t.setAttribute("data-tab-name",e),c[0].appendChild(t)}}),$(window).on("resize",t),t(),d.on("click",function(){"block"===c.css("display")?c.hide():c.show()}),$("body").on("click",function(a){$(a.target).closest(".tabsMenu").length||c.hide()})}if(null!=(a=this.attr("data-tabs-active"))&&(l=a),o){var h=JSON.parse(sessionStorage.getItem("flTabsState"));null!==h&&h.href===window.location.href?h.active[r]&&(l=h.active[r]):sessionStorage.removeItem("flTabsState")}n.find("li").each(function(){var a,e,t=$(this);"tab"===t.attr("role")&&(null==(a=t.attr("data-tabpanel"))&&(a=t.find("a").attr("href").replace(/^.*#/,"")),e=$("#"+a),(void 0===l||void 0!==s&&s===a)&&(l=a),a!==l?e.addClass("tabhidepanel").attr("aria-expanded",!1):e.addClass("tabshowpanel").attr("aria-expanded",!0),t.attr("aria-selected",!1),i[a]=[t,e],t.attr("data-tab-name",a))}),n.find("li").on("click",function(a){var e=$(a.target).closest("li").attr("data-tab-name");if(e){if(i[l][1].addClass("tabhidepanel").removeClass("tabshowpanel").attr("aria-expanded",!1),i[e][1].removeClass("tabhidepanel").addClass("tabshowpanel").attr("aria-expanded",!0),i[l][0].removeClass("active").attr("aria-selected",!1),i[e][0].addClass("active").attr("aria-selected",!0),l=e,n.find(".tabsMenu ul").hide(),n.trigger("fcss:tabclick",{tabName:e}),o){var t=JSON.parse(sessionStorage.getItem("flTabsState"));t&&t.href===window.location.href||(t={href:window.location.href,active:[]}),t.active[r]=e,sessionStorage.setItem("flTabsState",JSON.stringify(t))}return a.preventDefault(),a.stopPropagation(),!1}}),void 0!==l&&(i[l][0].addClass("active").attr("aria-selected",!0),i[l][1].removeClass("tabhidepanel").addClass("tabshowpanel").attr("aria-expanded",!0));var f=e.closest("form");if(f.length){function u(){for(var a in i)if(i[a][1].find(".validation").hasClass("failed")){i[a][0].trigger("click");var e=$("label.validationError").first().attr("for");setTimeout(function(){$("#"+e).focus()},100);break}}f.on("formValidationFailed",u).addClass("tabwidgetcontainer"),u()}}return e}}(),$(document).ready(function(){$(".tabwidget").each(function(){$(this).tabWidget()})}),$.fn.extend({toastTimer:0,toastClass:"",toastHasHTML:!1,toastShow:function(a,e,t,s,l){var i=0;this.toastHasHTML||($("body").append('<div id="toast" role="alert" aria-hidden="true"></div>'),this.toastHasHTML=!0),this.toastClass=a,t&&(e='<a href="#">'+t+"</a>"+e),this.toastTimer?(clearTimeout(this.toastTimer),this.toastTimer=0,i=300):$("#toast").hasClass("exposed")&&(i=300);var n=$("#toast");return n.removeClass("exposed").removeClass("success").removeClass("error").removeClass("warning").removeClass("accent").removeClass("primary").attr("aria-hidden",!0),setTimeout(function(){n.html(e).addClass("exposed").addClass(a).attr("aria-hidden",!1),t&&n.find("a").on("click",function(a){this.toastTimer&&(clearTimeout(this.toastTimer),this.toastTimer=0),n.removeClass("exposed").attr("aria-hidden",!0),s&&s(),a.preventDefault()}),(t||!1===l)&&!0!==l||(this.toastTimer=setTimeout(function(){n.removeClass("exposed").removeClass(a).attr("aria-hidden",!0),this.toastTimer=0},5e3))},i),this},toastHide:function(){this.toastTimer&&(clearTimeout(this.toastTimer),this.toastTimer=0),$("#toast").removeClass("exposed").removeClass(this.toastClass).attr("aria-hidden",!0)}}),$.toastShow=$.fn.toastShow,$.toastHide=$.fn.toastHide,$(document).ready(function(){var a=$("#scrollToTop");if(a.length){a.on("click",function a(){var e=$(window);0<e.scrollTop()&&(e.scrollTop(Math.max(0,e.scrollTop()-Math.max(10,e.scrollTop()/20))),window.setTimeout(a,10))}),$(window).on("scroll",function(){$(this).scrollTop()>(null!=a.attr("data-showat")?a.attr("data-showat"):600)?a.removeClass("hide"):a.addClass("hide")})}$(".uploadButton input").on("change",function(a){$(this).parent().find("span").html($(this).val().split(/(\\|\/)/g).pop())}),$("table.responsive").each(function(a,e){$(e).wrap('<div class="responsiveTableWrapper" />'),$(e).wrap('<div class="responsiveTableWrapperInner" />')})});