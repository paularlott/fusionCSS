/*
 Copyright (c) 2013 fusionCSS. All rights reserved.
 @link http://fusionCSS.com
*/
window.fusionLib||(window.$fl=window.fusionLib=jQuery);
$fl(document).ready(function(){$fl(".collapseMenu").each(function(a){var c='<option value="" selected="selected">Menu...</option>';$fl(this).find("a").each(function(){for(var a=$fl(this),e=0,d="",b=a.parent();null!=b[0];)"ul"==b[0].nodeName.toLowerCase()&&e++&&(d+=" - "),b=b.parent();c+='<option value="'+a.attr("href")+'">'+d+a.text()+"</option>"});$fl(this).addClass("hidden-phone").after('<select id="collapsedMenu'+a+'" class="visible-phone">'+c+"</select>");$fl("#collapsedMenu"+a).bind("change",
function(){window.location=$fl(this).val()})});$fl(".uploadButton input").bind("change",function(a){$fl(this).parent().find("span").html($fl(this).val().split(/(\\|\/)/g).pop())})});
