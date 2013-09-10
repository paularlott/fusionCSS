/*
 Copyright (c) 2013 fusionCSS. All rights reserved.
 @link http://fusionCSS.com
*/
window.fusionLib||(window.$fl=window.fusionLib=jQuery);
fusionLib.fn.extend({tabs:function(f){var c,b={};this.find(".tabs li a").each(function(){var e=$fl(this),d=e.attr("href").replace(/^.*#/,""),a=$fl("#"+d);if(void 0==c||void 0!=f&&f==d)c=d;e.parent().attr("aria-selected",!1);a.addClass("tabhidepanel").attr("aria-expanded",!1);b[d]=[e,a];e.bind("click",function(a){b[c][1].addClass("tabhidepanel").attr("aria-expanded",!1);b[d][1].removeClass("tabhidepanel").attr("aria-expanded",!0);b[c][0].removeClass("active").parent().attr("aria-selected",!1);b[d][0].addClass("active").parent().attr("aria-selected",
!0);c=d;a.preventDefault();a.stopPropagation();return!1})});b[c][0].addClass("active").parent().attr("aria-selected",!0);b[c][1].removeClass("tabhidepanel").attr("aria-expanded",!0);for(var a=this[0];a;){if("FORM"==a.tagName){var g=function(){for(var a in b)if(b[a][1].find(".validation").hasClass("failed")){b[a][0].trigger("click");break}};$fl(a).bind("formValidationFailed",g).addClass("tabwidgetcontainer");g();break}a=a.parentNode}return this}});
