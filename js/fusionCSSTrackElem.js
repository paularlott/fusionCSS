/**
 * Copyright (c) 2013 - 2019 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 * @version 3.2.1
 */
!function(){var a=[],c=$(window).scrollTop(),s=[];function h(t,e){c>=a[t].top&&a[t].before?(a[t].before=!1,a[t].handler.call(a[t].element,e,a[t]),a[t].element.trigger("pointReached",[e])):c<a[t].top&&!a[t].before&&(a[t].before=!0,a[t].handler.call(a[t].element,e,a[t]),a[t].element.trigger("pointReached",[e]))}function n(t){var e=t.offset;if(t.stoppedBy)for(var s=t.stoppedBy;e+=s.outerHeight(!0),s=s[0]._stickyOpts?s[0]._stickyOpts.stoppedBy:null;);return e}$.fn.extend({trackPoint:function(t){var n=(t=t||{}).offset?t.offset:0,o=t.handler?t.handler:function(){},i=t.onBeforeResize?t.onBeforeResize:function(){},r=t.onAfterResize?t.onAfterResize:function(){},f="string"==typeof n&&n.match(/%$/)?"%":"px";return this.each(function(){var t=$(this),e="%"==f?parseInt(n)/100*$(window).height():parseInt(n),s={element:t,top:t.offset().top-e,before:!0,offset:n,offsetPixels:e,handler:o,onBeforeResize:i,onAfterResize:r};a.push(s),t.wrap('<div class="trackPointWrapper"></div>'),s.top<=c&&h(a.length-1,"down"),a.sort(function(t,e){return e.top-t.top})})},trackPointSetOffset:function(n){var o="string"==typeof n&&n.match(/%$/)?"%":"px";return this.each(function(){for(var t=0;t<a.length;t++)if(this===a[t].element[0]){var e=a[t].top,s="%"==o?parseInt(n)/100*$(window).height():parseInt(n);a[t].top=a[t].element.offset().top-s,a[t].offset=n,a[t].offsetPixels=s,e!=a[t].top&&h(t,a[t].top>e?"up":"down");break}})}}),$(window).on("scroll",function(){var t=$(window).scrollTop(),e=c<t?"down":"up";if(t!=c){c=t;for(var s=0;s<a.length;s++)h(s,e)}}).on("resize",function(){for(var t=0;t<a.length;t++){a[t].onBeforeResize.call(a[t].element,a[t]);var e=a[t].top,s="%"==("string"==typeof a[t].offset&&a[t].offset.match(/%$/)?"%":"px")?parseInt(a[t].offset)/100*$(window).height():parseInt(a[t].offset);a[t].top=a[t].element.offset().top-s,a[t].offsetPixels=s,e!=a[t].top&&h(t,a[t].top>e?"up":"down"),a[t].onAfterResize.call(a[t].element,a[t])}}),$.fn.extend({stickyOnScroll:function(e){return(e=e||{}).stuckClass=e.stuckClass?e.stuckClass:"stuck",e.handler=e.handler?e.handler:function(){},e.minWidth=e.minWidth?e.minWidth:null,e.maxWidth=e.maxWidth?e.maxWidth:null,e.offset=e.offset?e.offset:0,e.stuck=!1,e.stoppedBy=e.stoppedBy?e.stoppedBy:null,this.each(function(){var t=$(this);t[0]._stickyOpts=e,t.trackPoint({handler:function(t,e){var s=this[0]._stickyOpts;"down"==t?(s.stuck=!0,this.parent().height(this.outerHeight(!0)),this.addClass(s.stuckClass).css("top",e.offsetPixels+"px"),s.handler.call(this,"stuck"),this.trigger("stuck")):"up"==t&&(s.stuck=!1,this.parent().height(""),this.removeClass(s.stuckClass),s.handler.call(this,"unstuck"),this.trigger("unstuck"))},onBeforeResize:function(){this[0]._stickyOpts.stuck&&(this.parent().height(""),this.removeClass(e.stuckClass)),this.trackPointSetOffset(n(this[0]._stickyOpts))},onAfterResize:function(t){this[0]._stickyOpts.stuck&&(this.parent().height(this.outerHeight(!0)),this.addClass(e.stuckClass).css("top",t.offsetPixels+"px"))},offset:n(e)}),t.parent().addClass("stickyWrapper"),s.push(t)})},stickyOnScrollOffset:function(t){return this.each(function(){this._stickyOpts.offset=t,$(this).trackPointSetOffset(n(this._stickyOpts))})}})}();