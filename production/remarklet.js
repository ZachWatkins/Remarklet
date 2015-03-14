requirejs.config({paths:{jquery:"jquery-2.1.3",jqueryui:"jquery-ui",stylesheet:"stylesheet",storedobject:"storedobject",duplicate:"duplicate",prompt:"prompt"},shim:{rangyinputs:{deps:["jquery"]}}}),require(["jquery","jqueryui","rangyinputs","stylesheet","storedobject","duplicate","prompt"],function(e,t,r,a,o,s,i){function n(e,t,r){function a(e,t){return e+Math.floor(Math.random()*(t-e))}var o=1e9,s=a(o,9999999999),i=a(1e7,99999999),n=a(o,2147483647),l=(new Date).getTime(),c=window.location,d=new Image,m="//www.google-analytics.com/__utm.gif?utmwv=1.3&utmn="+s+"&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn="+t+"&utmr="+c+"&utmp="+r+"&utmac="+e+"&utmcc=__utma%3D"+i+"."+n+"."+l+"."+l+"."+l+".2%3B%2B__utmb%3D"+i+"%3B%2B__utmc%3D"+i+"%3B%2B__utmz%3D"+i+"."+l+".2.2.utmccn%3D(referral)%7Cutmcsr%3D"+c.host+"%7Cutmcct%3D"+c.pathname+"%7Cutmcmd%3Dreferral%3B%2B__utmv%3D"+i+".-%3B";d.src=m}var l,e=jQuery,c=(window.URL&&URL.createObjectURL.bind(URL)||window.webkitURL&&webkitURL.createObjectURL.bind(webkitURL)||window.createObjectURL,e(window)),d=e("body"),m={},u=!1,p="drag",g=!1,f=!1,h={clipboard:null,pageSavedState:"",fileRead:!1,editcounter:0},k={File:{Export:1,Save:1,Restore:1},View:{Grid:1,Outlines:1,CSS:1},Insert:{Image:1,Note:1,HTML:1},Help:1},y={Grid:{Size:"100px",Division:5,Background:"transparent",Lines:"#fff"},CSS_Editor:{Indentation:"    ","Font Size":"12pt",Update:500},Export:{"Disable Javascript":!0,"Show Browser Info":!1,"Require Absolute URLs":!0}},b={menuwrapper:e('<div id="remarklet-menu"></div>'),csswindow:e('<div id="remarklet-ui-usercss" class="remarklet-dont-edit"></div>'),csstextarea:e('<textarea name="remarklet-usercss-editor" id="remarklet-usercss-editor" class="emmet emmet-syntax-css"></textarea>'),newimageform:e('<label>Make a placeholder</label><input type="text" value="300x200" id="remarklet-imgdimensions" name="imgdimensions" autofocus="autofocus"> <input type="text" value="#cccccc" id="remarklet-bgcolor" name="bgcolor"> <input type="text" value="#000000" id="remarklet-textcolor" name="textcolor"> <input type="text" value="Image (300x200)" id="remarklet-text" name="imgtext"><br /><label>Enter image url</label><input name="imgurl" id="remarklet-url" type="text" value="http://placehold.it/"><br><label>Add local image <span title="This image will be converted to a Data URI." class="remarklet-hovernote">?</span></label><input name="file" id="remarklet-file" type="file"/>'),newnoteform:e('<label>Enter note text</label><textarea name="notetext" id="remarklet-text" type="text" autofocus="autofocus" cols="48" rows="13">Enter your note\'s text here.</textarea>'),newhtmlform:e('<label>Enter HTML</label><textarea name="remarkletinserthtml" id="remarklet-text" class="emmet emmet-syntax-html" type="text" autofocus="autofocus" cols="48" rows="13">Enter your code here.</textarea>'),help:e('<div id="remarklet-ui-help"><div>Helpful Hints For Using <a target="_blank" onclick="event.stopPropagation();" href="https://remarklet.com">Remarklet</a><div><p>Thanks for using this bookmarklet! Here are some tips to help you get the most out of it:</p><p>Drag elements around with your mouse by holding down the left mouse button while your cursor is hovered over an element and then moving it around. The new position of the element is added to the User CSS stylesheet, which you can access directly from the menu under View => CSS. This CSS editor is equipped with some shortcuts of its own, similar to Emmet. Hold the ctrl key and press the up or down arrows while your cursor is near a number to increase or decrease that number by 1. Press the tab key immediately after writing a CSS property to insert ": " and get to writing the value a little quicker.</p><div>Drag Mode Shortcuts<ol><li>Text Mode: <span title="T key" class="key">T</span></li><li>Drag Mode: <span title="V key" class="key">V</span></li><li>Resize Element: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Alt key" class="key">Alt</span> + <span title="T key" class="key">T</span></li><li>Finish Resizing Element: <span title="Enter key" class="key">Enter</span></li><li>Nudge Element: (<span title="Control key" class="key">Ctrl</span>) <span title="Arrow keys" class="key">&larr;</span>,<span title="Arrow keys" class="key">&uarr;</span>,<span title="Arrow keys" class="key">&rarr;</span>,<span title="Arrow keys" class="key">&darr;</span></li><li>Delete Element: <span title="Delete key" class="key">Delete</span></li></ol></div><div>Text Mode Shortcuts<ol><li>Return to Drag Mode: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Enter key" class="key">Enter</span></li></ol></div></div></div></div>'),gridoverlay:e('<div id="remarklet-grid"></div>'),usercss:e(0===e("#remarklet-usercss").length?'<style id="remarklet-usercss" type="text/css"></style>':"#remarklet-usercss"),box:e(0===e("#remarklet-box").length?'<div id="remarklet-box"></div>':"#remarklet-box")},v={bodyElements:{mouseover:function(t){if(!g){var r=l=e(this).addClass("remarklet-target");switch(p){case"drag":this.className.search(/ui-(resizable|wrapper)/)<0&&r.draggable(w);break;case"text":r.attr("contenteditable","true")}var a=this.tagName.toLowerCase();void 0!==r.attr("id")&&(a+="#",a+=this.id),a+=".remarklet-",a+=r.data("remarklet"),b.csswindow.attr("data-remarklet-selector",a),t.stopPropagation()}},mouseout:function(t){if(!g){var r=e(this).removeClass("remarklet-target");e(".ui-draggable").draggable("destroy"),"text"==p&&r.removeAttr("contenteditable"),t.stopPropagation()}},mousedown:function(t){1==t.which&&(l=e(this),"text"==p&&(u=e(this)),t.stopPropagation())},click:function(e){"A"==this.tagName&&e.preventDefault()},mousemove:function(e){S.update(e)},toggle:function(e){var t;if("on"==e)for(t in v.bodyElements)"toggle"!=t&&d.on(t,".remarklet",v.bodyElements[t]);else for(t in v.bodyElements)"toggle"!=t&&d.off(t,".remarklet",v.bodyElements[t])}},window:function(t){if(!(t.target.id.indexOf("remarklet")>=0))if("drag"==p)switch(t.keyCode){case 67:t.ctrlKey&&(m.clipboard=l);break;case 84:t.ctrlKey?t.altKey&&(e(".ui-resizable,.ui-wrapper").each(function(){var t=e(this);void 0!=t.resizable("instance")&&t.trigger("resizestop").resizable("destroy")}),l.resizable(x)):(v.switchmode("text"),t.preventDefault());break;case 86:if(t.ctrlKey){h.editcounter++,m.clipboard.draggable("instance")&&m.clipboard.draggable("destroy");var r=m.clipboard.removeClass("remarklet-target").get(0),a=s.create(r,r,{id:"","class":"remarklet remarklet-"+h.editcounter});e(a).data("remarklet",h.editcounter)}break;case 13:if(e(".ui-resizable").length>0){var o=e(".ui-resizable"),i=o.attr("style").replace(/(resize|position|right|bottom): (auto|none|static);\s?/g,"").replace(/(-?\d+)\.\d+px/g,"$1px");o.resizable("destroy"),v.finishChangingElement(o,i,!0)}break;case 46:l.remove();break;case 37:t.ctrlKey?l.css("left","-=10"):l.css("left","-=1"),t.preventDefault();break;case 38:t.ctrlKey?l.css("top","-=10"):l.css("top","-=1"),t.preventDefault();break;case 39:t.ctrlKey?l.css("left","+=10"):l.css("left","+=1"),t.preventDefault();break;case 40:t.ctrlKey?l.css("top","+=10"):l.css("top","+=1"),t.preventDefault()}else switch(t.keyCode){case 86:u||(v.switchmode("drag"),t.preventDefault());break;case 13:t.ctrlKey&&(v.switchmode("drag"),t.preventDefault(),t.stopPropagation())}},userCSSEditorKeyHandler:function(e){e.stopPropagation();var t={9:1,13:1,38:1,40:1,219:1,222:1};if(t[e.keyCode]){var r,a,o,s,i,n=b.csstextarea,l=n.getSelection(),c=n.val().charAt(l.start-1),d=n.val(),m=d.charAt(l.start);switch(e.keyCode){case 9:0===l.length&&(e.preventDefault(),c.match(/\w/)?n.insertText(": ",l.start,"collapseToEnd"):n.insertText(y.CSS_Editor.Indentation,l.start,"collapseToEnd"));break;case 13:0===l.length&&c.match(/;|{/)&&(e.preventDefault(),i="\n"+y.CSS_Editor.Indentation,n.insertText(i,l.start,"collapseToEnd"),"{"==c&&"}"==m&&(i="\n",n.insertText(i,l.start+y.CSS_Editor.Indentation.length+1,"collapseToStart")));break;case 38:if(e.ctrlKey&&(r=[],a=l.start,d.charAt(l.start-1).match(/\d/)||d.charAt(l.start).match(/\d/))){for(;d.charAt(a-1).match(/\d/);)a--;for(o=a;d.charAt(a).match(/\d/);)r.push(d.charAt(a)),a++;s=a-1,r=parseInt(r.join(""))+1,n.setSelection(o,s+1).replaceSelectedText(r,"select").setSelection(o,s+1),e.preventDefault()}break;case 40:if(e.ctrlKey&&(r=[],a=l.start,d.charAt(l.start-1).match(/\d/)||d.charAt(l.start).match(/\d/))){for(;d.charAt(a-1).match(/\d/);)a--;for(o=a;d.charAt(a).match(/\d/);)r.push(d.charAt(a)),a++;s=a-1,r=parseInt(r.join(""))-1,n.setSelection(o,s+1).replaceSelectedText(r,"select").setSelection(o,s+1),e.preventDefault()}break;case 219:e.shiftKey&&(""===m||m.match(/\n/))&&n.insertText("}",l.start,"collapseToStart")}}f!==!1&&window.clearTimeout(f),f=window.setTimeout(function(){b.csstextarea.trigger("stoptyping"),f=!1},500)},updateUserCSS:function(){a.setString(b.csstextarea.val())},updateUserCSSUI:function(){b.csstextarea.val(a.getString())},switchmode:function(t){d.removeClass("remarklet-"+p+"mode").addClass("remarklet-"+t+"mode"),p=t,"drag"==t?(d.find("*[contenteditable]").removeAttr("contenteditable"),u=!1,l.draggable(w),e('<input type="text" style="width:1px;height:1px;background-color:transparent;border:0 none;opacity:0;position:fixed;top:0;left:0;" />').appendTo(d).focus().blur().remove()):"text"==t&&(void 0!==l&&l.attr("contenteditable","true"),e(".ui-draggable").draggable("destroy"))},finishChangingElement:function(e,t,r){t=t.replace(/(-?\d+)\.\d+px/g,"$1px"),a.setRule(".remarklet-"+e.data("remarklet"),t),v.updateUserCSSUI(),r&&e.removeAttr("style")}},w={start:function(t){g=!0,l=e(t.target),d.off("mousemove",S.update)},stop:function(t){var r=e(t.target),a=r.attr("style").replace(/(right|bottom): auto;\s?/g,""),o=!1;g=!1,S.update(t),d.on("mousemove",S.update),void 0!=r.resizable("instance")?a=a.replace(/\s?overflow: hidden;\s?/," "):o=!0,v.finishChangingElement(r,a,!1)}},x={start:function(t){l=e(t.target),d.off("mousemove",S.update),e(".ui-wrapper").each(function(){if(this!=t.target){var r=this.style.cssText.replace(/\s?overflow: hidden;\s?/," "),a=e(this);v.finishChangingElement(a,r,!1),a.resizable("destroy")}})},stop:function(t){var r=e(t.target),a=r.attr("style").replace(/(right|bottom): auto;\s?/g,""),o=!1;g=!1,S.update(t),d.on("mousemove",S.update),void 0!=r.resizable("instance")?a=a.replace(/\s?overflow: hidden;\s?/," "):o=!0,v.finishChangingElement(r,a,!1)}},S={x:null,y:null,update:function(e){S.x=e.pageX-b.box.offset().left,S.y=e.pageY}},C={File:{Export:function(){var t,r="data:text/html;charset=UTF-8,",o=location.pathname.split("/");b.usercss.html(a.getString()),o.pop(),o=o.join("/"),document.doctype&&""===document.doctype.publicId?t="<!DOCTYPE html>":document.doctype?(t="<!DOCTYPE ",t+=document.doctype.name.toUpperCase(),t+=' PUBLIC "',t+=document.doctype.publicId,t+='" "',t+=document.doctype.systemId,t+='">'):t=document.all[0].text,t+=document.documentElement.outerHTML,e('script[src*="remarklet.com/rm/scripts"],link[href*="remarklet.com/rm/scripts"]').add(b.retained).each(function(){t=t.replace(this.outerHTML,"")}),t=t.replace(/.overflowRulerX > .firebug[^{]+{[^}]+}|.overflowRulerY\s>\s.firebug[^{]+{[^}]+}/gi,"").replace(/(src|href)=("|')\/\//g,"$1=$2"+location.protocol).replace(/(src|href)=("|')(\/|(?=[^:]{6}))/gi,"$1=$2"+location.protocol+"//"+location.hostname+o+"/").replace(/<script/gi,"<!-- script").replace(/<\/script>/gi,"</script -->").replace(/url\(&quot;/gi,"url(").replace(/.(a-z){3}&quot;\)/gi,"$1)").replace(/url\(\//gi,"url("+location.protocol+"//"+location.hostname+o+"/").replace(/\sremarklet-show-(grid|outlines|usercss)\s/g," ").replace(/\s?remarklet-show-(grid|outlines|usercss)\s?|\s/g," "),r+=encodeURIComponent(t),window.open(r,"Exported From Remarklet","")},Save:function(){m.pageSavedState="",d.children().not(b.retained).each(function(){m.pageSavedState+=this.outerHTML.replace(/<script/gi,"<!-- script").replace(/<\/script>/gi,"</script -->")})},Restore:function(){""!==m.pageSavedState&&(d.children().not(b.retained).remove(),d.prepend(m.pageSavedState),b.usercss=e("#remarklet-usercss"),b.box=e("#remarklet-box"))}},View:{Grid:function(){d.toggleClass("remarklet-show-grid")},Outlines:function(){d.toggleClass("remarklet-show-outlines")},CSS:function(){d.toggleClass("remarklet-show-usercss"),d.hasClass("remarklet-show-usercss")?b.csstextarea.focus():b.csstextarea.blur()},Preferences:function(){d.toggleClass("remarklet-show-preferences")}},Insert:{Image:function(){i.open({form:b.newimageform,init:function(){i.get.window().find("#remarklet-file").on("change",function(){i.get.submit().attr("disabled",!0);var e=new FileReader;e.onloadend=function(){i.get.submit().removeAttr("disabled"),h.fileRead=e.result},e.readAsDataURL(this.files[0])}),d.off("mousemove",S.update)},callback:function(t){i.get.window().find("#remarklet-file").off("change"),h.editcounter++;var r,a=h.editcounter,o=["position:absolute;left:",S.x,"px;top:",S.y,"px;z-index:2147483647;"].join("");t.imgurl.length>1&&"http://placehold.it/"!=t.imgurl?r=['<img src="',t.imgurl,'" class="remarklet-newimg" style="',o,'" />']:h.fileRead!==!1?(r=['<img class="remarklet-newimg" src="',h.fileRead,'" style="',o,'" />'],h.fileRead=!1):r=['<div class="remarklet-newimg" style="',o,"font:normal 16px Arial,Helvetica,sans-serif;color:",t.textcolor,";background-color:",t.bgcolor,";width:",t.imgdimensions.toLowerCase().split("x")[0],"px;height:",t.imgdimensions.toLowerCase().split("x")[1],'px;">',t.imgtext,"</div>"],r=r.join(""),e(r).data("remarklet",a).addClass("remarklet remarklet-"+a).appendTo(b.box),d.on("mousemove",S.update)}})},Note:function(){i.open({form:b.newnoteform,init:function(){d.off("mousemove",S.update)},callback:function(t){h.editcounter++;var r,a=8*t.notetext.length,o=h.editcounter;a>500&&(a=500),r=['<div class="remarklet-note" style="position: absolute; z-index: 2147483647; background-color: #feff81; padding: 10px; font-family: monospace; box-shadow: 0 3px 5px #000; word-wrap: break-word; left:',S.x,"px;top:",S.y,"px;width:",a,'px">',t.notetext,"</div>"].join(""),e(r).data("remarklet",o).addClass("remarklet remarklet-"+o).appendTo(b.box),d.on("mousemove",S.update)}})},HTML:function(){i.open({form:b.newhtmlform,init:function(){d.off("mousemove",S.update)},callback:function(t){h.editcounter++;var r,a=h.editcounter;r=['<div class="remarklet-usercode" style="position:absolute;left:',S.x,"px;top:",S.y,'px;">',t.remarkletinserthtml,"</div>"].join(""),e(r).data("remarklet",a).addClass("remarklet remarklet-"+a).appendTo(b.box).css({width:function(){return this.clientWidth+1},height:function(){return this.clientHeight+1}}),d.on("mousemove",S.update)}})}},Help:function(){d.toggleClass("remarklet-show-help")}};b.build=function(){var t,r,a,o,s,n=k,l=C;for(t in n){if(o=e("<li>"+t+"</li>"),a=n[t],"object"==typeof a){s=e('<ol class="remarklet-submenu"></ol>');for(r in a)e('<li class="remarklet-menu-'+r.toLowerCase()+'">'+r+"</li>").on("click",l[t][r]).appendTo(s);o.append(s)}else o.on("click",l[t]);o.appendTo(b.menuwrapper).wrap('<ol class="remarklet-menuitem"></ol>')}b.csstextarea.on("keydown",v.userCSSEditorKeyHandler),b.help.on("click",C.Help),b.csstextarea.on("stoptyping",v.updateUserCSS),c.on("keydown",v.window),b.box.add(b.usercss).appendTo(d),b.retained=b.gridoverlay.add(b.csswindow.append(b.csstextarea)).add(b.help).add(i.get.window()).add(b.preferences).add(b.menuwrapper).appendTo(d)},m.init=function(){var t=0;e(".remarklet").each(function(){var e=parseInt(this.className.match(/remarklet-([0-9]+)/)[1]);e>t&&(t=e)}),d.find("*:not(:hidden,.remarklet)").each(function(){t++;var r=t;e(this).data("remarklet",r).addClass("remarklet remarklet-"+r)}),h.editcounter=t,i.init("remarklet"),a.init({element:b.usercss.get(0),indent:y.CSS_Editor.Indentation}),s.init({element:b.usercss.get(0),indent:y.CSS_Editor.Indentation}),b.build(),v.bodyElements.toggle("on")},m.init(),n("UA-44858109-1","remarklet.com","/files/remarklet.js")});