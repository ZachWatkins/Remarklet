define(["stylesheet"],function(e){var t,o={},r=function(e){var t=e.tagName.toLowerCase();return""!==e.id&&(t+="#",t+=e.id),""!==e.className&&(t+=".",t+=e.className.replace(/\s+/g,".")),t},n=function(e,t){for(var o,n=t.parentNode,a=e.parentNode,c=r(t);n!=a;)o=c,c=r(n),c+=" ",c+=o,n=n.parentNode;return c},a=function(e,t,o){e=e.split(":");var r,n,a,c=e[0],l=e.length>1?":"+e[1]:null,i=document.querySelector(c),s=window.getComputedStyle(i,l),u=window.getComputedStyle(i.parentNode,null),d=window.getComputedStyle(o,l),p="";if(l){if(s.content==d.content&&"none"==s.content)return;d=window.getComputedStyle(i,null),p+="content: ",p+=s.content,p+=";"}for(var g=0,b=s.length;b>g;g++)if(r=!1,n=s[g],a=s.getPropertyValue(n),a!=d.getPropertyValue(n)){switch(n){case"outline-color":case"-webkit-text-emphasis-color":case"-webkit-text-fill-color":case"-webkit-text-stroke-color":case"-moz-text-decoration-color":case"-webkit-text-decoration-color":a==s.color&&(r=!0);break;case"border-bottom-color":case"border-left-color":case"border-right-color":case"border-top-color":(""===s.borderWidth||"0px"==s.borderWidth)&&(r=!0);break;case"-moz-column-rule-color":case"-webkit-column-rule-color":"0px"==s.getPropertyValue(n.replace("color","width"))&&(r=!0);break;case"-moz-text-decoration-line":case"-webkit-text-decoration-line":a==s.textDecoration&&(r=!0);break;case"-moz-column-gap":case"-webkit-column-gap":"auto"==s.getPropertyValue(n.replace("gap","count"))&&"auto"==s.getPropertyValue(n.replace("gap","width"))&&(r=!0);break;case"transform-origin":case"perspective-origin":"none"==s.getPropertyValue(n.replace("-origin",""))&&(r=!0);break;case"-webkit-text-decorations-in-effect":r=!0;break;case"content":r=!0}r||u.getPropertyValue(n)==a&&d.getPropertyValue(n)==a||(p+=n,p+=":",p+=a,p+=";")}return p};return{init:function(o){e.init(o),t=e.setRule},create:function(e,c,l){var i,s,u,d="string"==typeof e?document.querySelector(e):e,p=[],g=d.querySelectorAll("*"),b=d.cloneNode(!0),f=g.length;l&&(l.id&&(b.id=l.id),l["class"]&&(b.className=l["class"])),u=r(b),"string"==typeof c?document.querySelector(c).appendChild(b):c.nextSibling?c.parentNode.insertBefore(b,c.nextSibling):c.parentNode.appendChild(b),p.push(r(d));for(var m=0;f>m;m++)p.push(n(d,g[m]));f=p.length;for(var w=0;f>w;w++)i=p[w],s=u+p[w].replace(p[0],""),void 0===o[s]&&(t(s,a(i,c,b)),t(s+":before",a(i+":before",c,b)),t(s+":after",a(i+":after",c,b)));return b}}});