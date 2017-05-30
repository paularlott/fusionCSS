/**
 * Copyright (c) 2013 - 2016 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 * @version 3.0.8
 */
!function(){var a=window.jQuery||window.fusionLib,e=0,t="",s=!1;a.fn.tabWidget||(a.fn.tabWidget=function(a){function e(){for(var a in l)if(l[a][1].find(".validation").hasClass("failed")){l[a][0].trigger("click");var e=$("label.validationError").first().attr("for");setTimeout(function(){$("#"+e).focus()},100);break}}var t,s,n=this[0].id,l={};if("1"!=this.attr("data-tabs-enabled")){this.attr("data-tabs-enabled","1"),null!=(s=this.attr("data-tabs-active"))&&(t=s),this.find(".tabs li").each(function(){var e,s,i=$(this);i.parent().parent()[0].id==n&&(null==(e=i.attr("data-tabpanel"))&&(e=i.find("a").attr("href").replace(/^.*#/,"")),s=$("#"+e),(void 0==t||void 0!=a&&a==e)&&(t=e),e!=t&&s.addClass("tabhidepanel").attr("aria-expanded",!1),i.parent().attr("aria-selected",!1),l[e]=[i,s],i.on("click",function(a){return l[t][1].addClass("tabhidepanel").attr("aria-expanded",!1),l[e][1].removeClass("tabhidepanel").attr("aria-expanded",!0),l[t][0].removeClass("active").parent().attr("aria-selected",!1),l[e][0].addClass("active").parent().attr("aria-selected",!0),t=e,i.trigger("fcss:tabclick"),a.preventDefault(),a.stopPropagation(),!1}))}),void 0!=t&&(l[t][0].addClass("active").parent().attr("aria-selected",!0),l[t][1].removeClass("tabhidepanel").attr("aria-expanded",!0));for(var i=this[0];i;){if("FORM"==i.tagName){$(i).on("formValidationFailed",e).addClass("tabwidgetcontainer"),e();break}i=i.parentNode}}return this}),a.fn.extend({toastShow:function(a,n,l,i,o){var r=0;return s||($("body").append('<div id="toast" role="alert" aria-hidden="true"></div>'),s=!0),t=a,l&&(n='<a href="#">'+l+"</a>"+n),e?(clearTimeout(e),e=0,r=300):$("#toast").hasClass("exposed")&&(r=300),$("#toast").removeClass("exposed").removeClass("success").removeClass("error").removeClass("warning").removeClass("accent").removeClass("primary").attr("aria-hidden",!0),setTimeout(function(){$("#toast").html(n).addClass("exposed").addClass(a).attr("aria-hidden",!1),l&&$("#toast a").on("click",function(a){e&&(clearTimeout(e),e=0),$("#toast").removeClass("exposed").attr("aria-hidden",!0),i&&i(),a.preventDefault()}),(!l&&o!==!1||o===!0)&&(e=setTimeout(function(){$("#toast").removeClass("exposed").removeClass(a).attr("aria-hidden",!0),e=0},5e3))},r),this},toastHide:function(){e&&(clearTimeout(e),e=0),$("#toast").removeClass("exposed").removeClass(t).attr("aria-hidden",!0)}}),a.toastShow=a.fn.toastShow,a.toastHide=a.fn.toastHide,$(document).ready(function(){function a(){var e=$(window);e.scrollTop()>0&&(e.scrollTop(Math.max(0,e.scrollTop()-Math.max(10,e.scrollTop()/20))),window.setTimeout(a,10))}function e(){var a=$(this),e=$("#"+a.attr("id")+"-label"),t=a.attr("type");"checkbox"!=t&&"submit"!=t&&"file"!=t&&a.on("focus",function(){e.addClass("focused")}).on("blur",function(){e.removeClass("focused")})}function t(){var a=$(this),e=a.attr("type");if("disabled"!=a.attr("data-floating-label")&&!a.hasClass("hasFloatingLabel")&&"checkbox"!=e&&"submit"!=e&&"file"!=e){var t=$("#"+a.attr("id")+"-label");t.length&&(a.is("textarea")&&t.addClass("floatTextarea"),a.addClass("hasFloatingLabel"),a.on("focus",function(){t.removeClass("floatDown").addClass("floatUp")}).on("blur",function(){a.is("select")||a.val()||a.hasClass("keepPlaceholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")}).on("change",function(){t.removeClass("focused"),a.is("select")||a.val()||a.hasClass("keepPlaceholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")}),a.hasClass("keepPlaceholder")||a.attr("placeholder",""),a.trigger("blur"))}}function s(){var a=$(this);a.hasClass("hform")||(a.find("input").each(t),a.find("textarea").each(t),a.find(".selectControl select").each(t))}$(".tabwidget").each(function(){$(this).tabWidget()}),$(".uploadButton input").on("change",function(a){$(this).parent().find("span").html($(this).val().split(/(\\|\/)/g).pop())}),$("table.responsive").each(function(a,e){$(e).wrap('<div class="responsiveTableWrapper" />'),$(e).wrap('<div class="responsiveTableWrapperInner" />')}),$("#viewSlideInMenu").length&&($("body").append('<div id="slideInMenuOverlay"></div>'),$("#slideInMenu").length||($("body").append('<div id="slideInMenu" role="menu"></div>'),$(".slideInMenu").each(function(a){var e="",t="";"ul"==this.nodeName.toLowerCase()&&(e="<ul>",t="</ul>"),$(this).hasClass("slideInMenuRootOnly")?($("#slideInMenuOverlay").html(e+$(this).html()+t).find("li ul").remove(),$("#slideInMenu").append($("#slideInMenuOverlay").html())):$("#slideInMenu").append(e+$(this).html()+t)})),$("#slideInMenu").attr("aria-hidden",!0),$("#slideInMenuOverlay").html("").on("click",function(a){$("#slideInMenu").removeClass("slideInMenuShow").attr("aria-hidden",!0),$("#slideInMenuOverlay").removeClass("slideInMenuShow"),$("body").removeClass("disableScroll")}),$("#viewSlideInMenu").on("click",function(a){$("body").addClass("disableScroll"),$("#slideInMenuOverlay").addClass("slideInMenuShow"),$("#slideInMenu").addClass("slideInMenuShow").attr("aria-hidden",!1)}));var n=$("#scrollToTop");n.length&&(n.on("click",a),$(window).on("scroll",function(){$(this).scrollTop()>(null!=n.attr("data-showat")?n.attr("data-showat"):600)?n.removeClass("hide"):n.addClass("hide")})),$(".floatingLabels form").each(s),$("form.floatingLabels").each(s),$("form").each(function(){var a=$(this);a.hasClass("hform")||(a.find("input").each(e),a.find("textarea").each(e),a.find("select").each(e))}),setTimeout(function(){$(document.activeElement).trigger("focus")},100);var l=!1;$(".fam").each(function(){var a=$(this),e=a.find("ul");e.attr("aria-hidden",!e.hasClass("exposed")),a.find("ul.alwaysOpen").length||a.find("a").first().on("click",function(a){e.hasClass("exposed")?e.removeClass("exposed").attr("aria-hidden",!0):($(".fam ul").removeClass("exposed").attr("aria-hidden",!0),e.addClass("exposed").attr("aria-hidden",!1)),a.preventDefault()}).attr("data-fam-menu",1),l=!0}),l&&$(document).on("click",function(a){var e=$(a.target);"HTML"!=a.target.nodeName&&(e.attr("data-fam-menu")||e.hasClass("leave-open")||e.parent().attr("data-fam-menu")||e.parent().hasClass("leave-open"))||$(".fam ul").removeClass("exposed").attr("aria-hidden",!0)})});var n=a.fn.val;a.fn.val=function(e){if(void 0===e)return n.call(this);var t=a(this[0]),s=a("#"+t.attr("id")+"-label");return"checkbox"!=t.attr("type")&&("string"!=typeof e||e.length?s.removeClass("floatDown").addClass("floatUp"):s.addClass("floatDown").removeClass("floatUp")),n.call(this,e)};var l=a.fn.focus;a.fn.focus=function(){l.call(this);var e=a(this[0]),t=a("#"+e.attr("id")+"-label");return e.hasClass("hasFloatingLabel")&&"checkbox"!=e.attr("type")&&(t.removeClass("floatDown").addClass("floatUp"),t.addClass("focused")),this}}();