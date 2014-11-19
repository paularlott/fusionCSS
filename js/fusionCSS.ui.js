/*
 Copyright (c) 2013 - 2014 fusionCSS. All rights reserved.
 @link http://fusionCSS.com
*/
window.fusionLib||(window.$fl=window.fusionLib=jQuery);
fusionLib.fn.extend({tabs:function(f){var d,b={};this.find(".tabpanels li").each(function(){$fl(this).addClass("tabhidepanel").attr("aria-expanded",!1)});this.find(".tabs li").each(function(){var a=$fl(this),c,e;null==(c=a.attr("data-tabpanel"))&&(c=a.find("a").attr("href").replace(/^.*#/,""));e=$fl("#"+c);if(void 0==d||void 0!=f&&f==c)d=c;a.parent().attr("aria-selected",!1);b[c]=[a,e];a.bind("click",function(a){b[d][1].addClass("tabhidepanel").attr("aria-expanded",!1);b[c][1].removeClass("tabhidepanel").attr("aria-expanded",
!0);b[d][0].removeClass("active").parent().attr("aria-selected",!1);b[c][0].addClass("active").parent().attr("aria-selected",!0);d=c;a.preventDefault();a.stopPropagation();return!1})});void 0!=d&&(b[d][0].addClass("active").parent().attr("aria-selected",!0),b[d][1].removeClass("tabhidepanel").attr("aria-expanded",!0));for(var e=this[0];e;){if("FORM"==e.tagName){var g=function(){for(var a in b)if(b[a][1].find(".validation").hasClass("failed")){b[a][0].trigger("click");break}};$fl(e).bind("formValidationFailed",
g).addClass("tabwidgetcontainer");g();break}e=e.parentNode}return this}});
