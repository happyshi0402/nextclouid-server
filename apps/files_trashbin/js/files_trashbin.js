!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/js/",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1),n(2),n(3);window.OCA.Trashbin=OCA.Trashbin},function(e,n){OCA.Trashbin={},OCA.Trashbin.App={_initialized:!1,client:null,initialize:function(e){if(!this._initialized){this._initialized=!0,this.client=new OC.Files.Client({host:OC.getHost(),port:OC.getPort(),root:OC.linkToRemoteBase("dav")+"/trashbin/"+OC.getCurrentUser().uid,useHTTPS:"https"===OC.getProtocol()});var n=OC.Util.History.parseUrlQuery();this.fileList=new OCA.Trashbin.FileList($("#app-content-trashbin"),{fileActions:this._createFileActions(),detailsViewEnabled:!1,scrollTo:n.scrollto,config:OCA.Files.App.getFilesConfig(),multiSelectMenu:[{name:"restore",displayName:t("files_trashbin","Restore"),iconClass:"icon-history"},{name:"delete",displayName:t("files_trashbin","Delete permanently"),iconClass:"icon-delete"}],client:this.client,shown:!0})}},_createFileActions:function(){var e=this.client,n=new OCA.Files.FileActions;return n.register("dir","Open",OC.PERMISSION_READ,"",function(e,t){var n=t.fileList.getCurrentDirectory();t.fileList.changeDirectory(OC.joinPaths(n,e))}),n.setDefault("dir","Open"),n.registerAction({name:"Restore",displayName:t("files_trashbin","Restore"),type:OCA.Files.FileActions.TYPE_INLINE,mime:"all",permissions:OC.PERMISSION_READ,iconClass:"icon-history",actionHandler:function(n,i){var r=i.fileList,o=r.findFileEl(n);r.showFileBusyState(o,!0);var s=i.fileList.getCurrentDirectory();e.move(OC.joinPaths("trash",s,n),OC.joinPaths("restore",n),!0).then(r._removeCallback.bind(r,[n]),function(){r.showFileBusyState(o,!1),OC.Notification.show(t("files_trashbin","Error while restoring file from trashbin"))})}}),n.registerAction({name:"Delete",displayName:t("files_trashbin","Delete permanently"),mime:"all",permissions:OC.PERMISSION_READ,iconClass:"icon-delete",render:function(e,i,r){var o=n._makeActionLink(e,r);return o.attr("original-title",t("files_trashbin","Delete permanently")),o.children("img").attr("alt",t("files_trashbin","Delete permanently")),r.$file.find("td:last").append(o),o},actionHandler:function(n,i){var r=i.fileList;$(".tipsy").remove();var o=r.findFileEl(n);r.showFileBusyState(o,!0);var s=i.fileList.getCurrentDirectory();e.remove(OC.joinPaths("trash",s,n)).then(r._removeCallback.bind(r,[n]),function(){r.showFileBusyState(o,!1),OC.Notification.show(t("files_trashbin","Error while removing file from trashbin"))})}}),n}},$(document).ready(function(){$("#app-content-trashbin").one("show",function(){OCA.Trashbin.App.initialize($("#app-content-trashbin"))})})},function(e,n){!function(){var e=new RegExp(/^(.+)\.d[0-9]+$/),n="{http://nextcloud.org/ns}trashbin-filename",i="{http://nextcloud.org/ns}trashbin-deletion-time",r="{http://nextcloud.org/ns}trashbin-original-location";function o(t){t=OC.basename(t);var n=e.exec(t);return n&&n.length>1&&(t=n[1]),t}var s=function(e,t){this.client=t.client,this.initialize(e,t)};s.prototype=_.extend({},OCA.Files.FileList.prototype,{id:"trashbin",appName:t("files_trashbin","Deleted files"),client:null,initialize:function(){this.client.addFileInfoParser(function(e,t){var o=e.propStat[0].properties,s=o[r];return{displayName:o[n],mtime:1e3*parseInt(o[i],10),hasPreview:!0,path:s,extraData:s}});var e=OCA.Files.FileList.prototype.initialize.apply(this,arguments);return this.$el.find(".undelete").click("click",_.bind(this._onClickRestoreSelected,this)),this.setSort("mtime","desc"),this.breadcrumb._makeCrumbs=function(){for(var e=OCA.Files.BreadCrumb.prototype._makeCrumbs.apply(this,arguments),t=1;t<e.length;t++)e[t].name=o(e[t].name);return e},OC.Plugins.attach("OCA.Trashbin.FileList",this),e},getDirectoryPermissions:function(){return OC.PERMISSION_READ|OC.PERMISSION_DELETE},_setCurrentDir:function(e){OCA.Files.FileList.prototype._setCurrentDir.apply(this,arguments);var t=OC.basename(e);""!==t&&this.setPageTitle(o(t))},_createRow:function(){var e=OCA.Files.FileList.prototype._createRow.apply(this,arguments);return e.find("td.filesize").remove(),e},getAjaxUrl:function(e,t){var n="";return t&&(n="?"+OC.buildQueryString(t)),OC.filePath("files_trashbin","ajax",e+".php")+n},setupUploadEvents:function(){},linkTo:function(e){return OC.linkTo("files","index.php")+"?view=trashbin&dir="+encodeURIComponent(e).replace(/%2F/g,"/")},elementToFile:function(e){var t=OCA.Files.FileList.prototype.elementToFile(e);return"/"===this.getCurrentDirectory()&&(t.displayName=o(t.name)),delete t.size,t},updateEmptyContent:function(){var e=this.$fileList.find("tr:first").exists();this.$el.find("#emptycontent").toggleClass("hidden",e),this.$el.find("#filestable th").toggleClass("hidden",!e)},_removeCallback:function(e){for(var t,n=0;n<e.length;n++)t=this.remove(OC.basename(e[n]),{updateSummary:!1}),this.fileSummary.remove({type:t.attr("data-type"),size:t.attr("data-size")});this.fileSummary.update(),this.updateEmptyContent()},_onClickRestoreSelected:function(e){e.preventDefault();for(var n=this,i=_.pluck(this.getSelectedFiles(),"name"),r=0;r<i.length;r++){var o=this.findFileEl(i[r]);this.showFileBusyState(o,!0)}this.fileMultiSelectMenu.toggleLoading("restore",!0);var s=i.map(function(e){return n.client.move(OC.joinPaths("trash",n.getCurrentDirectory(),e),OC.joinPaths("restore",e),!0).then(function(){n._removeCallback([e])})});return Promise.all(s).then(function(){n.fileMultiSelectMenu.toggleLoading("restore",!1)},function(){OC.Notification.show(t("files_trashbin","Error while restoring files from trashbin"))})},_onClickDeleteSelected:function(e){e.preventDefault();for(var n=this,i=this.$el.find(".select-all").is(":checked"),r=_.pluck(this.getSelectedFiles(),"name"),o=0;o<r.length;o++){var s=this.findFileEl(r[o]);this.showFileBusyState(s,!0)}if(i)return this.client.remove(OC.joinPaths("trash",this.getCurrentDirectory())).then(function(){n.hideMask(),n.setFiles([])},function(){OC.Notification.show(t("files_trashbin","Error while emptying trashbin"))});this.fileMultiSelectMenu.toggleLoading("delete",!0);var a=r.map(function(e){return n.client.remove(OC.joinPaths("trash",n.getCurrentDirectory(),e)).then(function(){n._removeCallback([e])})});return Promise.all(a).then(function(){n.fileMultiSelectMenu.toggleLoading("delete",!1)},function(){OC.Notification.show(t("files_trashbin","Error while removing files from trashbin"))})},_onClickFile:function(e){return"httpd/unix-directory"!==$(this).parent().parent().data("mime")&&e.preventDefault(),OCA.Files.FileList.prototype._onClickFile.apply(this,arguments)},generatePreviewUrl:function(e){return OC.generateUrl("/apps/files_trashbin/preview?")+$.param(e)},getDownloadUrl:function(){return"#"},updateStorageStatistics:function(){},isSelectedDeletable:function(){return!0},_getWebdavProperties:function(){return[n,i,r].concat(this.filesClient.getPropfindProperties())},reload:function(){this._selectedFiles={},this._selectionSummary.clear(),this.$el.find(".select-all").prop("checked",!1),this.showMask(),this._reloadCall&&this._reloadCall.abort(),this._reloadCall=this.client.getFolderContents("trash/"+this.getCurrentDirectory(),{includeParent:!1,properties:this._getWebdavProperties()});var e=this.reloadCallback.bind(this);return this._reloadCall.then(e,e)},reloadCallback:function(e,n){return delete this._reloadCall,this.hideMask(),401!==e&&(403===e?(this.changeDirectory("/"),OC.Notification.show(t("files","This operation is forbidden")),!1):500===e?(this.changeDirectory("/"),OC.Notification.show(t("files","This directory is unavailable, please check the logs or contact the administrator")),!1):404===e?(this.changeDirectory("/"),!1):0===e||(this.setFiles(n),!0))}}),OCA.Trashbin.FileList=s}()},function(e,t,n){var i=n(4);"string"==typeof i&&(i=[[e.i,i,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};n(6)(i,r);i.locals&&(e.exports=i.locals)},function(e,t,n){(e.exports=n(5)(!1)).push([e.i,'/*\n * Copyright (c) 2014\n *\n * This file is licensed under the Affero General Public License version 3\n * or later.\n *\n * See the COPYING-README file.\n *\n */\n#app-content-trashbin tbody tr[data-type="file"] td a.name,\n#app-content-trashbin tbody tr[data-type="file"] td a.name span.nametext,\n#app-content-trashbin tbody tr[data-type="file"] td a.name span.nametext span {\n  cursor: default; }\n\n#app-content-trashbin .summary :last-child {\n  padding: 0; }\n\n#app-content-trashbin #filestable .summary .filesize {\n  display: none; }\n',""])},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",i=e[3];if(!i)return n;if(t&&"function"==typeof btoa){var r=(s=i,a=btoa(unescape(encodeURIComponent(JSON.stringify(s)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(l," */")),o=i.sources.map(function(e){return"/*# sourceURL=".concat(i.sourceRoot).concat(e," */")});return[n].concat(o).concat([r]).join("\n")}var s,a,l;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2],"{").concat(n,"}"):n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},r=0;r<this.length;r++){var o=this[r][0];null!=o&&(i[o]=!0)}for(var s=0;s<e.length;s++){var a=e[s];null!=a[0]&&i[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="(".concat(a[2],") and (").concat(n,")")),t.push(a))}},t}},function(e,t,n){var i,r,o={},s=(i=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=i.apply(this,arguments)),r}),a=function(e){var t={};return function(e,n){if("function"==typeof e)return e();if(void 0===t[e]){var i=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,n);if(window.HTMLIFrameElement&&i instanceof window.HTMLIFrameElement)try{i=i.contentDocument.head}catch(e){i=null}t[e]=i}return t[e]}}(),l=null,c=0,u=[],f=n(7);function h(e,t){for(var n=0;n<e.length;n++){var i=e[n],r=o[i.id];if(r){r.refs++;for(var s=0;s<r.parts.length;s++)r.parts[s](i.parts[s]);for(;s<i.parts.length;s++)r.parts.push(y(i.parts[s],t))}else{var a=[];for(s=0;s<i.parts.length;s++)a.push(y(i.parts[s],t));o[i.id]={id:i.id,refs:1,parts:a}}}}function p(e,t){for(var n=[],i={},r=0;r<e.length;r++){var o=e[r],s=t.base?o[0]+t.base:o[0],a={css:o[1],media:o[2],sourceMap:o[3]};i[s]?i[s].parts.push(a):n.push(i[s]={id:s,parts:[a]})}return n}function d(e,t){var n=a(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var i=u[u.length-1];if("top"===e.insertAt)i?i.nextSibling?n.insertBefore(t,i.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),u.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=a(e.insertAt.before,n);n.insertBefore(t,r)}}function m(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=u.indexOf(e);t>=0&&u.splice(t,1)}function b(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var i=function(){0;return n.nc}();i&&(e.attrs.nonce=i)}return v(t,e.attrs),d(e,t),t}function v(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function y(e,t){var n,i,r,o;if(t.transform&&e.css){if(!(o="function"==typeof t.transform?t.transform(e.css):t.transform.default(e.css)))return function(){};e.css=o}if(t.singleton){var s=c++;n=l||(l=b(t)),i=O.bind(null,n,s,!1),r=O.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",v(t,e.attrs),d(e,t),t}(t),i=function(e,t,n){var i=n.css,r=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||o)&&(i=f(i));r&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var s=new Blob([i],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}.bind(null,n,t),r=function(){m(n),n.href&&URL.revokeObjectURL(n.href)}):(n=b(t),i=function(e,t){var n=t.css,i=t.media;i&&e.setAttribute("media",i);if(e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}.bind(null,n),r=function(){m(n)});return i(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;i(e=t)}else r()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=s()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=p(e,t);return h(n,t),function(e){for(var i=[],r=0;r<n.length;r++){var s=n[r];(a=o[s.id]).refs--,i.push(a)}e&&h(p(e,t),t);for(r=0;r<i.length;r++){var a;if(0===(a=i[r]).refs){for(var l=0;l<a.parts.length;l++)a.parts[l]();delete o[a.id]}}}};var C,g=(C=[],function(e,t){return C[e]=t,C.filter(Boolean).join("\n")});function O(e,t,n,i){var r=n?"":i.css;if(e.styleSheet)e.styleSheet.cssText=g(t,r);else{var o=document.createTextNode(r),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(o,s[t]):e.appendChild(o)}}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,i=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var r,o=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?e:(r=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:i+o.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")})}}]);
//# sourceMappingURL=files_trashbin.js.map