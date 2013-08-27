/*
 Copyright (c) 2013 fusionCSS. All rights reserved.
 @link http://fusionCSS.com
*/
window.fusionLib||(window.$fl=window.fusionLib=jQuery);
$fl(document).ready(function(){$fl(".collapseMenu").each(function(a){var c='<option value="" selected="selected">Menu...</option>';$fl(this).find("a").each(function(){for(var d=$fl(this),a=0,e="",b=d.parent();null!=b[0];)"ul"==b[0].nodeName.toLowerCase()&&a++&&(e+=" - "),b=b.parent();c+='<option value="'+d.attr("href")+'">'+e+d.text()+"</option>"});$fl(this).addClass("hidden-phone").after('<select id="collapsedMenu'+a+'" class="visible-phone">'+c+"</select>");$fl("#collapsedMenu"+a).bind("change",
function(){window.location=$fl(this).val()})})});
