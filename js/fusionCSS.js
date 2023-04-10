(()=>{
/**
 * fusionCSS JavaScript to implement tabs, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2023 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
var a;
/**
 * fusionCSS JavaScript to implement Floating Action Menus, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2023 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
jQuery((function(){var a=!1;$(".fam").each((function(){var e=$(this),t=e.find("ul");t.attr("aria-hidden",!t.hasClass("exposed")),e.find("ul.alwaysOpen").length||e.find("a").first().on("click",(function(a){t.hasClass("exposed")?t.removeClass("exposed").attr("aria-hidden",!0):($(".fam ul").removeClass("exposed").attr("aria-hidden",!0),t.addClass("exposed").attr("aria-hidden",!1)),a.preventDefault()})).attr("data-fam-menu",1),a=!0})),a&&$(document).on("click",(function(a){var e=$(a.target);"HTML"!=a.target.nodeName&&(e.attr("data-fam-menu")||e.hasClass("leave-open")||e.parent().attr("data-fam-menu")||e.parent().hasClass("leave-open"))||$(".fam ul").removeClass("exposed").attr("aria-hidden",!0)}))})),
/**
 * fusionCSS JavaScript to implement floating labels, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2023 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
jQuery((function(){function a(){var a=$(this),e=$("#"+a.attr("id")+"-label"),t=a.attr("type");"checkbox"!=t&&"submit"!=t&&"file"!=t&&a.on("focus",(function(){e.addClass("focused")})).on("blur",(function(){e.removeClass("focused")}))}function e(){var a=$(this),e=a.attr("type");if("disabled"!=a.attr("data-floating-label")&&!a.hasClass("hasFloatingLabel")&&"checkbox"!=e&&"submit"!=e&&"file"!=e){var t=$("#"+a.attr("id")+"-label");t.length&&(a.is("textarea")&&t.addClass("floatTextarea"),a.addClass("hasFloatingLabel"),a.on("focus",(function(){t.removeClass("floatDown").addClass("floatUp"),null!=a.attr("data-placeholder")&&a.attr("placeholder",a.attr("data-placeholder"))})).on("blur",(function(){a.is("select")||a.val()||a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp"),null!=a.attr("data-placeholder")&&a.attr("placeholder","")})).on("change",(function(){t.removeClass("focused"),a.is("select")||a.val()||a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")?t.removeClass("floatDown").addClass("floatUp"):t.addClass("floatDown").removeClass("floatUp")})),a.hasClass("keepPlaceholder")||a.attr("data-keep-placeholder")||null!=a.attr("placeholder")&&(a.closest(".placeholderOnFocus").length&&a.attr("data-placeholder",a.attr("placeholder")),a.attr("placeholder","")),a.trigger("blur"))}}var t=$.fn.val;$.fn.val=function(a){if(void 0===a)return t.call(this);var e=$(this[0]),s=$("#"+e.attr("id")+"-label");return e.hasClass("hasFloatingLabel")&&"checkbox"!=e.attr("type")&&("string"!=typeof a||a.length||e.is("select")||document.activeElement==this[0]?(s.removeClass("floatDown").addClass("floatUp"),null!=e.attr("data-placeholder")&&e.attr("placeholder",e.attr("data-placeholder"))):(s.addClass("floatDown").removeClass("floatUp"),null!=e.attr("data-placeholder")&&e.attr("placeholder",""))),t.call(this,a)};var s=$.fn.focus;function l(){var a=$(this);a.hasClass("hform")||(a.find("input").each(e),a.find("textarea").each(e),a.find(".selectControl select").each(e))}$.fn.focus=function(){s.call(this);var a=$(this[0]),e=$("#"+a.attr("id")+"-label");return a.hasClass("hasFloatingLabel")&&"checkbox"!=a.attr("type")&&(e.removeClass("floatDown").addClass("floatUp"),e.addClass("focused"),null!=a.attr("data-placeholder")&&a.attr("placeholder",a.attr("data-placeholder"))),this},$(".floatingLabels form").each(l),$("form.floatingLabels").each(l),$("form").each((function(){var e=$(this);e.hasClass("hform")||(e.find("input").each(a),e.find("textarea").each(a),e.find("select").each(a))})),setTimeout((function(){$(document.activeElement).trigger("focus")}),100)})),
/**
 * fusionCSS JavaScript to implement slide in menus, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2023 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
jQuery((function(){$("#viewSlideInMenu").length&&($("body").append('<div id="slideInMenuOverlay"></div>'),$("#slideInMenu").length||($("body").append('<div id="slideInMenu" role="menu"></div>'),$(".slideInMenu").each((function(a){var e="",t="";"ul"==this.nodeName.toLowerCase()&&(e="<ul>",t="</ul>"),$(this).hasClass("slideInMenuRootOnly")?($("#slideInMenuOverlay").html(e+$(this).html()+t).find("li ul").remove(),$("#slideInMenu").append($("#slideInMenuOverlay").html())):$("#slideInMenu").append(e+$(this).html()+t)}))),$("#slideInMenu").attr("aria-hidden",!0).addClass("slideInMenuLoaded"),$("body").on("click",(function(a){var e=$(a.target);(e.closest("#closeSlideInMenu").length||!e.closest("#slideInMenu").length&&!e.closest("#viewSlideInMenu").length)&&($("#slideInMenu").removeClass("slideInMenuShow").attr("aria-hidden",!0),$("#slideInMenuOverlay").removeClass("slideInMenuShow"),$("body").removeClass("disableScroll").removeClass("slideInMenuOpen"))})),$("#viewSlideInMenu").on("click",(function(a){$("#slideInMenuOverlay").addClass("slideInMenuShow"),$("#slideInMenu").addClass("slideInMenuShow").attr("aria-hidden",!1),$("body").addClass("disableScroll").addClass("slideInMenuOpen")})))})),a=0,$.fn.tabWidget=function(e){var t,s,l={},i=this,n=i.find(".tabs").first(),r=a++,o="1"===i.attr("data-tabs-save-active");if("1"!==i.attr("data-tabs-enabled")){if(i.attr("data-tabs-enabled","1"),"1"===i.attr("data-tabs-hide-wrap")){n.append('<li role="menubar" class="tabsMenu">&nbsp;<ul style="display: none"></ul></li>');var d=n.find(".tabsMenu"),c=d.find("ul");function h(){var a=n.width(),e=0;e+=d.width()+parseInt(d.css("margin-left"))+parseInt(d.css("margin-right"))+parseInt(d.css("padding-left"))+parseInt(d.css("padding-right")),n.find("li").show(),c.find("li").hide();var t=c.find("li"),s=0;n.find("li").each((function(l){var i=$(this);"tab"===i.attr("role")&&(e+=i.width()+parseInt(i.css("margin-left"))+parseInt(i.css("margin-right"))+parseInt(i.css("padding-left"))+parseInt(i.css("padding-right")))>=a&&($(this).hide(),t.eq(l).show(),s++)})),s?d.show():(d.hide(),c.hide())}n.find("li").each((function(){var a=$(this);if("tab"===a.attr("role")){var e,t=a[0].cloneNode(!0);null==(e=t.getAttribute("data-tabpanel"))&&(e=$(t).find("a").attr("href").replace(/^.*#/,"")),t.setAttribute("role","menuitem"),t.setAttribute("data-tab-name",e),c[0].appendChild(t)}})),$(window).on("resize",h),h(),d.on("click",(function(){"block"===c.css("display")?c.hide():c.show()})),$("body").on("click",(function(a){$(a.target).closest(".tabsMenu").length||c.hide()}))}if(null!=(s=this.attr("data-tabs-active"))&&(t=s),o){var f=JSON.parse(sessionStorage.getItem("flTabsState"));null!==f&&f.href===window.location.href?f.active[r]&&(t=f.active[r]):sessionStorage.removeItem("flTabsState")}n.find("li").each((function(){var a,s,i=$(this);"tab"===i.attr("role")&&(null==(a=i.attr("data-tabpanel"))&&(a=i.find("a").attr("href").replace(/^.*#/,"")),s=$("#"+a),(void 0===t||void 0!==e&&e===a)&&(t=a),a!==t?s.addClass("tabhidepanel").attr("aria-expanded",!1):s.addClass("tabshowpanel").attr("aria-expanded",!0),i.attr("aria-selected",!1),l[a]=[i,s],i.attr("data-tab-name",a))})),n.find("li").on("click",(function(a){var e=$(a.target).closest("li").attr("data-tab-name");if(e){if(l[t][1].addClass("tabhidepanel").removeClass("tabshowpanel").attr("aria-expanded",!1),l[e][1].removeClass("tabhidepanel").addClass("tabshowpanel").attr("aria-expanded",!0),l[t][0].removeClass("active").attr("aria-selected",!1),l[e][0].addClass("active").attr("aria-selected",!0),t=e,n.find(".tabsMenu ul").hide(),n.trigger("fcss:tabclick",{tabName:e}),o){var s=JSON.parse(sessionStorage.getItem("flTabsState"));s&&s.href===window.location.href||(s={href:window.location.href,active:[]}),s.active[r]=e,sessionStorage.setItem("flTabsState",JSON.stringify(s))}return a.preventDefault(),a.stopPropagation(),!1}})),void 0!==t&&(l[t][0].addClass("active").attr("aria-selected",!0),l[t][1].removeClass("tabhidepanel").addClass("tabshowpanel").attr("aria-expanded",!0));var u=i.closest("form");if(u.length){function p(){for(var a in l)if(l[a][1].find(".validation").hasClass("failed")){l[a][0].trigger("click");var e=$("label.validationError").first().attr("for");setTimeout((function(){$("#"+e).focus()}),100);break}}u.on("formValidationFailed",p).addClass("tabwidgetcontainer"),p()}}return i},jQuery((function(){$(".tabwidget").each((function(){$(this).tabWidget()}))})),
/**
 * fusionCSS JavaScript helpers to implement toast popups, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
$.fn.extend({toastTimer:0,toastClass:"",toastHasHTML:!1,toastShow:function(a,e,t,s,l){var i=0;this.toastHasHTML||($("body").append('<div id="toast" role="alert" aria-hidden="true"></div>'),this.toastHasHTML=!0),this.toastClass=a,t&&(e='<a href="#">'+t+"</a>"+e),this.toastTimer?(clearTimeout(this.toastTimer),this.toastTimer=0,i=300):$("#toast").hasClass("exposed")&&(i=300);var n=$("#toast");return n.removeClass("exposed").removeClass("success").removeClass("error").removeClass("warning").removeClass("accent").removeClass("primary").attr("aria-hidden",!0),setTimeout((function(){n.html(e).addClass("exposed").addClass(a).attr("aria-hidden",!1),t&&n.find("a").on("click",(function(a){this.toastTimer&&(clearTimeout(this.toastTimer),this.toastTimer=0),n.removeClass("exposed").attr("aria-hidden",!0),s&&s(),a.preventDefault()})),(!t&&!1!==l||!0===l)&&(this.toastTimer=setTimeout((function(){n.removeClass("exposed").removeClass(a).attr("aria-hidden",!0),this.toastTimer=0}),5e3))}),i),this},toastHide:function(){this.toastTimer&&(clearTimeout(this.toastTimer),this.toastTimer=0),$("#toast").removeClass("exposed").removeClass(this.toastClass).attr("aria-hidden",!0)}}),$.toastShow=$.fn.toastShow,$.toastHide=$.fn.toastHide,
/**
 * fusionCSS JavaScript to implement various utilities, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2023 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */
jQuery((function(){var a=$("#scrollToTop");if(a.length){a.on("click",(function a(){var e=$(window);e.scrollTop()>0&&(e.scrollTop(Math.max(0,e.scrollTop()-Math.max(10,e.scrollTop()/20))),window.setTimeout(a,10))})),$(window).on("scroll",(function(){$(this).scrollTop()>(null!=a.attr("data-showat")?a.attr("data-showat"):600)?a.removeClass("hide"):a.addClass("hide")})).trigger("scroll")}$(".uploadButton input").on("change",(function(a){$(this).parent().find("span").html($(this).val().split(/(\\|\/)/g).pop())})),$("table.responsive").each((function(a,e){$(e).wrap('<div class="responsiveTableWrapper" />'),$(e).wrap('<div class="responsiveTableWrapperInner" />')}))}))})();
//# sourceMappingURL=fusionCSS.js.map
