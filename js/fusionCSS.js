/**
 * Copyright (c) 2013 - 2016 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 * @version 3.0.6
 */
window.fusionLib||(window.$fl=window.fusionLib=jQuery),function(){var a=0,e="",t=!1;fusionLib.fn.extend({tabs:function(a){function e(){for(var a in i)if(i[a][1].find(".validation").hasClass("failed")){i[a][0].trigger("click");break}}var t,l,s=this[0].id,i={};if("1"!=this.attr("data-tabs-enabled")){this.attr("data-tabs-enabled","1"),null!=(l=this.attr("data-tabs-active"))&&(t=l),this.find(".tabs li").each(function(){var e,l,n=$fl(this);n.parent().parent()[0].id==s&&(null==(e=n.attr("data-tabpanel"))&&(e=n.find("a").attr("href").replace(/^.*#/,"")),l=$fl("#"+e),(void 0==t||void 0!=a&&a==e)&&(t=e),e!=t&&l.addClass("tabhidepanel").attr("aria-expanded",!1),n.parent().attr("aria-selected",!1),i[e]=[n,l],n.bind("click",function(a){return i[t][1].addClass("tabhidepanel").attr("aria-expanded",!1),i[e][1].removeClass("tabhidepanel").attr("aria-expanded",!0),i[t][0].removeClass("active").parent().attr("aria-selected",!1),i[e][0].addClass("active").parent().attr("aria-selected",!0),t=e,n.trigger("fcss:tabclick"),a.preventDefault(),a.stopPropagation(),!1}))}),void 0!=t&&(i[t][0].addClass("active").parent().attr("aria-selected",!0),i[t][1].removeClass("tabhidepanel").attr("aria-expanded",!0));for(var n=this[0];n;){if("FORM"==n.tagName){$fl(n).bind("formValidationFailed",e).addClass("tabwidgetcontainer"),e();break}n=n.parentNode}}return this},toastShow:function(l,s,i,n,o){var d=0;return t||($fl("body").append('<div id="toast" role="alert" aria-hidden="true"></div>'),t=!0),e=l,i&&(s='<a href="#">'+i+"</a>"+s),a?(clearTimeout(a),a=0,d=300):$fl("#toast").hasClass("exposed")&&(d=300),$fl("#toast").removeClass("exposed").removeClass("success").removeClass("error").removeClass("warning").removeClass("accent").removeClass("primary").attr("aria-hidden",!0),setTimeout(function(){$fl("#toast").html(s).addClass("exposed").addClass(l).attr("aria-hidden",!1),i&&$fl("#toast a").bind("click",function(e){a&&(clearTimeout(a),a=0),$fl("#toast").removeClass("exposed").attr("aria-hidden",!0),n&&n(),e.preventDefault()}),(!i&&o!==!1||o===!0)&&(a=setTimeout(function(){$fl("#toast").removeClass("exposed").removeClass(l).attr("aria-hidden",!0),a=0},5e3))},d),this},toastHide:function(){a&&(clearTimeout(a),a=0),$fl("#toast").removeClass("exposed").removeClass(e).attr("aria-hidden",!0)}}),fusionLib.toastShow=fusionLib.fn.toastShow,fusionLib.toastHide=fusionLib.fn.toastHide,$fl(document).ready(function(){function a(){var e=$fl(window);e.scrollTop()>0&&(e.scrollTop(Math.max(0,e.scrollTop()-Math.max(10,e.scrollTop()/20))),window.setTimeout(a,10))}function e(){var a=$fl(this),e=$fl("#"+a.attr("id")+"-label"),t=a.attr("type");"checkbox"!=t&&"submit"!=t&&"file"!=t&&a.bind("focus",function(){e.addClass("focused")}).bind("blur",function(){e.removeClass("focused")})}function t(){var a=$fl(this),e=a.attr("type");if("disabled"!=a.attr("data-floating-label")&&!a.hasClass("hasFloatingLabel")&&"checkbox"!=e&&"submit"!=e&&"file"!=e){var t=$fl("#"+a.attr("id")+"-label");t.length&&(a.is("textarea")&&t.addClass("floatTextarea"),a.addClass("hasFloatingLabel"),a.bind("focus",function(){t.removeClass("floatDown").addClass("floatUp")}).bind("blur",function(){a.is("select")||a.val()||a.hasClass("keepPlaceholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")}).bind("change",function(){t.removeClass("focused"),a.is("select")||a.val()||a.hasClass("keepPlaceholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")}),a.hasClass("keepPlaceholder")||a.attr("placeholder",""),a.trigger("blur"))}}function l(){var a=$fl(this);a.hasClass("hform")||(a.find("input").each(t),a.find("textarea").each(t),a.find(".selectControl select").each(t))}$fl(".tabwidget").each(function(){$fl(this).tabs()}),$fl(".uploadButton input").bind("change",function(a){$fl(this).parent().find("span").html($fl(this).val().split(/(\\|\/)/g).pop())}),$fl("table.responsive").each(function(a,e){$fl(e).wrap('<div class="responsiveTableWrapper" />'),$fl(e).wrap('<div class="responsiveTableWrapperInner" />')}),$fl("#viewSlideInMenu").length&&($fl("body").append('<div id="slideInMenuOverlay"></div>'),$fl("#slideInMenu").length||($fl("body").append('<div id="slideInMenu" role="menu"></div>'),$fl(".slideInMenu").each(function(a){var e="",t="";"ul"==this.nodeName.toLowerCase()&&(e="<ul>",t="</ul>"),$fl(this).hasClass("slideInMenuRootOnly")?($fl("#slideInMenuOverlay").html(e+$fl(this).html()+t).find("li ul").remove(),$fl("#slideInMenu").append($fl("#slideInMenuOverlay").html())):$fl("#slideInMenu").append(e+$fl(this).html()+t)})),$fl("#slideInMenu").attr("aria-hidden",!0),$fl("#slideInMenuOverlay").html("").bind("click",function(a){$fl("#slideInMenu").removeClass("slideInMenuShow").attr("aria-hidden",!0),$fl("#slideInMenuOverlay").removeClass("slideInMenuShow"),$fl("body").removeClass("disableScroll")}),$fl("#viewSlideInMenu").bind("click",function(a){$fl("body").addClass("disableScroll"),$fl("#slideInMenuOverlay").addClass("slideInMenuShow"),$fl("#slideInMenu").addClass("slideInMenuShow").attr("aria-hidden",!1)}));var s=$fl("#scrollToTop");s.length&&(s.bind("click",a),$fl(window).bind("scroll",function(){$fl(this).scrollTop()>(null!=s.attr("data-showat")?s.attr("data-showat"):600)?s.removeClass("hide"):s.addClass("hide")})),$fl(".floatingLabels form").each(l),$fl("form.floatingLabels").each(l),$fl("form").each(function(){var a=$fl(this);a.hasClass("hform")||(a.find("input").each(e),a.find("textarea").each(e),a.find("select").each(e))}),setTimeout(function(){$fl(document.activeElement).trigger("focus")},100);var i=!1;$fl(".fam").each(function(){var a=$fl(this),e=a.find("ul");e.attr("aria-hidden",!e.hasClass("exposed")),a.find("a").first().bind("click",function(a){e.hasClass("exposed")?e.removeClass("exposed").attr("aria-hidden",!0):($fl(".fam ul").removeClass("exposed").attr("aria-hidden",!0),e.addClass("exposed").attr("aria-hidden",!1)),a.preventDefault()}).attr("data-fam-menu",1),i=!0}),i&&$fl(document).bind("click",function(a){var e=$fl(a.target);"HTML"!=a.target.nodeName&&(e.attr("data-fam-menu")||e.hasClass("leave-open")||e.parent().attr("data-fam-menu")||e.parent().hasClass("leave-open"))||$fl(".fam ul").removeClass("exposed").attr("aria-hidden",!0)})});var l=fusionLib.fn.val;fusionLib.fn.val=function(a){if("undefined"==typeof a)return l.call(this);var e=$fl(this[0]),t=$fl("#"+e.attr("id")+"-label");return"checkbox"!=e.attr("type")&&("string"!=typeof a||a.length?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")),l.call(this,a)};var s=fusionLib.fn.focus;fusionLib.fn.focus=function(){s.call(this);var a=$fl(this[0]),e=$fl("#"+a.attr("id")+"-label");return a.hasClass("hasFloatingLabel")&&"checkbox"!=a.attr("type")&&(e.removeClass("floatDown").addClass("floatUp"),e.addClass("focused")),this}}();