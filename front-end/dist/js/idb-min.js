"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,o){var r,i=new Promise(function(i,u){e(r=t[n].apply(t,o)).then(i,u)});return i.request=r,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return t(this[n],r,arguments)})})}function r(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function i(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return e=this[n],(o=t(e,r,arguments)).then(function(e){if(e)return new c(e,o.request)});var e,o})})}function u(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function p(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function a(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new p(n)}function f(e){this._db=e}n(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,o),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),s.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},n(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(s,"_store",IDBObjectStore,["deleteIndex"]),p.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},n(p,"_tx",["objectStoreNames","mode"]),r(p,"_tx",IDBTransaction,["abort"]),a.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},n(a,"_db",["name","version","objectStoreNames"]),r(a,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new p(this._db.transaction.apply(this._db,arguments))},n(f,"_db",["name","version","objectStoreNames"]),r(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,u].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),o=n[n.length-1],r=this._store||this._index,i=r[e].apply(r,n.slice(0,-1));i.onsuccess=function(){o(i.result)}})})}),[u,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){e?(o.push(e.value),void 0===t||o.length!=t?e.continue():r(o)):r(o)})})})});var d={open:function(e,n,o){var r=t(indexedDB,"open",[e,n]),i=r.request;return i.onupgradeneeded=function(e){o&&o(new a(i.result,e.oldVersion,i.transaction))},r.then(function(e){return new f(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=d,module.exports.default=module.exports):self.idb=d}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkYi5qcyJdLCJuYW1lcyI6WyJwcm9taXNpZnlSZXF1ZXN0IiwicmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25zdWNjZXNzIiwicmVzdWx0Iiwib25lcnJvciIsImVycm9yIiwicHJvbWlzaWZ5UmVxdWVzdENhbGwiLCJvYmoiLCJtZXRob2QiLCJhcmdzIiwicCIsImFwcGx5IiwidGhlbiIsInByb3h5UHJvcGVydGllcyIsIlByb3h5Q2xhc3MiLCJ0YXJnZXRQcm9wIiwicHJvcGVydGllcyIsImZvckVhY2giLCJwcm9wIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJwcm90b3R5cGUiLCJnZXQiLCJ0aGlzIiwic2V0IiwidmFsIiwicHJveHlSZXF1ZXN0TWV0aG9kcyIsIkNvbnN0cnVjdG9yIiwiYXJndW1lbnRzIiwicHJveHlNZXRob2RzIiwicHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyIsInZhbHVlIiwiQ3Vyc29yIiwiSW5kZXgiLCJpbmRleCIsIl9pbmRleCIsImN1cnNvciIsIl9jdXJzb3IiLCJfcmVxdWVzdCIsIk9iamVjdFN0b3JlIiwic3RvcmUiLCJfc3RvcmUiLCJUcmFuc2FjdGlvbiIsImlkYlRyYW5zYWN0aW9uIiwiX3R4IiwiY29tcGxldGUiLCJvbmNvbXBsZXRlIiwib25hYm9ydCIsIlVwZ3JhZGVEQiIsImRiIiwib2xkVmVyc2lvbiIsInRyYW5zYWN0aW9uIiwiX2RiIiwiREIiLCJJREJJbmRleCIsIklEQkN1cnNvciIsIm1ldGhvZE5hbWUiLCJjcmVhdGVJbmRleCIsIklEQk9iamVjdFN0b3JlIiwib2JqZWN0U3RvcmUiLCJJREJUcmFuc2FjdGlvbiIsImNyZWF0ZU9iamVjdFN0b3JlIiwiSURCRGF0YWJhc2UiLCJmdW5jTmFtZSIsInJlcGxhY2UiLCJhcnIiLCJBcnJheSIsInNsaWNlIiwiY2FsbCIsImNhbGxiYWNrIiwibGVuZ3RoIiwibmF0aXZlT2JqZWN0IiwiZ2V0QWxsIiwicXVlcnkiLCJjb3VudCIsImluc3RhbmNlIiwiaXRlbXMiLCJpdGVyYXRlQ3Vyc29yIiwicHVzaCIsInVuZGVmaW5lZCIsImNvbnRpbnVlIiwiZXhwIiwib3BlbiIsIm5hbWUiLCJ2ZXJzaW9uIiwidXBncmFkZUNhbGxiYWNrIiwiaW5kZXhlZERCIiwib251cGdyYWRlbmVlZGVkIiwiZXZlbnQiLCJkZWxldGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsInNlbGYiLCJpZGIiXSwibWFwcGluZ3MiOiJBQUFBLGNBRUMsV0FLQyxTQUFTQSxFQUFpQkMsR0FDeEIsT0FBTyxJQUFJQyxRQUFRLFNBQVNDLEVBQVNDLEdBQ25DSCxFQUFRSSxVQUFZLFdBQ2xCRixFQUFRRixFQUFRSyxTQUdsQkwsRUFBUU0sUUFBVSxXQUNoQkgsRUFBT0gsRUFBUU8sVUFLckIsU0FBU0MsRUFBcUJDLEVBQUtDLEVBQVFDLEdBQ3pDLElBQUlYLEVBQ0FZLEVBQUksSUFBSVgsUUFBUSxTQUFTQyxFQUFTQyxHQUVwQ0osRUFEQUMsRUFBVVMsRUFBSUMsR0FBUUcsTUFBTUosRUFBS0UsSUFDUEcsS0FBS1osRUFBU0MsS0FJMUMsT0FEQVMsRUFBRVosUUFBVUEsRUFDTFksRUFXVCxTQUFTRyxFQUFnQkMsRUFBWUMsRUFBWUMsR0FDL0NBLEVBQVdDLFFBQVEsU0FBU0MsR0FDMUJDLE9BQU9DLGVBQWVOLEVBQVdPLFVBQVdILEVBQU0sQ0FDaERJLElBQUssV0FDSCxPQUFPQyxLQUFLUixHQUFZRyxJQUUxQk0sSUFBSyxTQUFTQyxHQUNaRixLQUFLUixHQUFZRyxHQUFRTyxPQU1qQyxTQUFTQyxFQUFvQlosRUFBWUMsRUFBWVksRUFBYVgsR0FDaEVBLEVBQVdDLFFBQVEsU0FBU0MsR0FDcEJBLEtBQVFTLEVBQVlOLFlBQzFCUCxFQUFXTyxVQUFVSCxHQUFRLFdBQzNCLE9BQU9aLEVBQXFCaUIsS0FBS1IsR0FBYUcsRUFBTVUsZUFLMUQsU0FBU0MsRUFBYWYsRUFBWUMsRUFBWVksRUFBYVgsR0FDekRBLEVBQVdDLFFBQVEsU0FBU0MsR0FDcEJBLEtB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N0MsSUFBSUMsRUFBV3BELEtBQ1hxRCxFQUFRLEdBRVosT0FBTyxJQUFJN0UsUUFBUSxTQUFTQyxHQUMxQjJFLEVBQVNFLGNBQWNKLEVBQU8sU0FBU3JDLEdBQ2hDQSxHQUlMd0MsRUFBTUUsS0FBSzFDLEVBQU9MLFlBRUpnRCxJQUFWTCxHQUF1QkUsRUFBTU4sUUFBVUksRUFJM0N0QyxFQUFPNEMsV0FITGhGLEVBQVE0RSxJQU5SNUUsRUFBUTRFLFdBZWxCLElBQUlLLEVBQU0sQ0FDUkMsS0FBTSxTQUFTQyxFQUFNQyxFQUFTQyxHQUM1QixJQUFJM0UsRUFBSUosRUFBcUJnRixVQUFXLE9BQVEsQ0FBQ0gsRUFBTUMsSUFDbkR0RixFQUFVWSxFQUFFWixRQVFoQixPQU5BQSxFQUFReUYsZ0JBQWtCLFNBQVNDLEdBQzdCSCxHQUNGQSxFQUFnQixJQUFJckMsRUFBVWxELEVBQVFLLE9BQVFxRixFQUFNdEMsV0FBWXBELEVBQVFxRCxlQUlyRXpDLEVBQUVFLEtBQUssU0FBU3FDLEdBQ3JCLE9BQU8sSUFBSUksRUFBR0osTUFHbEJ3QyxPQUFRLFNBQVNOLEdBQ2YsT0FBTzdFLEVBQXFCZ0YsVUFBVyxpQkFBa0IsQ0FBQ0gsTUFJeEMsb0JBQVhPLFFBQ1RBLE9BQU9DLFFBQVVWLEVBQ2pCUyxPQUFPQyxRQUFRQyxRQUFVRixPQUFPQyxTQUdoQ0UsS0FBS0MsSUFBTWIsRUFyVGYiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgZnVuY3Rpb24gdG9BcnJheShhcnIpIHtcclxuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XHJcbiAgICB2YXIgcmVxdWVzdDtcclxuICAgIHZhciBwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xyXG4gICAgICBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHAucmVxdWVzdCA9IHJlcXVlc3Q7XHJcbiAgICByZXR1cm4gcDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb21pc2lmeUN1cnNvclJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XHJcbiAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcclxuICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcHJveHlQcm9wZXJ0aWVzKFByb3h5Q2xhc3MsIHRhcmdldFByb3AsIHByb3BlcnRpZXMpIHtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpc1t0YXJnZXRQcm9wXVtwcm9wXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICB0aGlzW3RhcmdldFByb3BdW3Byb3BdID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb3h5UmVxdWVzdE1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xyXG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwcm94eU1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xyXG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoUHJveHlDbGFzcywgdGFyZ2V0UHJvcCwgQ29uc3RydWN0b3IsIHByb3BlcnRpZXMpIHtcclxuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgIGlmICghKHByb3AgaW4gQ29uc3RydWN0b3IucHJvdG90eXBlKSkgcmV0dXJuO1xyXG4gICAgICBQcm94eUNsYXNzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbmRleChpbmRleCkge1xyXG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcclxuICB9XHJcblxyXG4gIHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcclxuICAgICduYW1lJyxcclxuICAgICdrZXlQYXRoJyxcclxuICAgICdtdWx0aUVudHJ5JyxcclxuICAgICd1bmlxdWUnXHJcbiAgXSk7XHJcblxyXG4gIHByb3h5UmVxdWVzdE1ldGhvZHMoSW5kZXgsICdfaW5kZXgnLCBJREJJbmRleCwgW1xyXG4gICAgJ2dldCcsXHJcbiAgICAnZ2V0S2V5JyxcclxuICAgICdnZXRBbGwnLFxyXG4gICAgJ2dldEFsbEtleXMnLFxyXG4gICAgJ2NvdW50J1xyXG4gIF0pO1xyXG5cclxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcclxuICAgICdvcGVuQ3Vyc29yJyxcclxuICAgICdvcGVuS2V5Q3Vyc29yJ1xyXG4gIF0pO1xyXG5cclxuICBmdW5jdGlvbiBDdXJzb3IoY3Vyc29yLCByZXF1ZXN0KSB7XHJcbiAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XHJcbiAgICB0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdDtcclxuICB9XHJcblxyXG4gIHByb3h5UHJvcGVydGllcyhDdXJzb3IsICdfY3Vyc29yJywgW1xyXG4gICAgJ2RpcmVjdGlvbicsXHJcbiAgICAna2V5JyxcclxuICAgICdwcmltYXJ5S2V5JyxcclxuICAgICd2YWx1ZSdcclxuICBdKTtcclxuXHJcbiAgcHJveHlSZXF1ZXN0TWV0aG9kcyhDdXJzb3IsICdfY3Vyc29yJywgSURCQ3Vyc29yLCBbXHJcbiAgICAndXBkYXRlJyxcclxuICAgICdkZWxldGUnXHJcbiAgXSk7XHJcblxyXG4gIC8vIHByb3h5ICduZXh0JyBtZXRob2RzXHJcbiAgWydhZHZhbmNlJywgJ2NvbnRpbnVlJywgJ2NvbnRpbnVlUHJpbWFyeUtleSddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSkge1xyXG4gICAgaWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xyXG4gICAgQ3Vyc29yLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3Vyc29yID0gdGhpcztcclxuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGN1cnNvci5fY3Vyc29yW21ldGhvZE5hbWVdLmFwcGx5KGN1cnNvci5fY3Vyc29yLCBhcmdzKTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgIHJldHVybiBuZXcgQ3Vyc29yKHZhbHVlLCBjdXJzb3IuX3JlcXVlc3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIE9iamVjdFN0b3JlKHN0b3JlKSB7XHJcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xyXG4gIH1cclxuXHJcbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IEluZGV4KHRoaXMuX3N0b3JlLmNyZWF0ZUluZGV4LmFwcGx5KHRoaXMuX3N0b3JlLCBhcmd1bWVudHMpKTtcclxuICB9O1xyXG5cclxuICBPYmplY3RTdG9yZS5wcm90b3R5cGUuaW5kZXggPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgSW5kZXgodGhpcy5fc3RvcmUuaW5kZXguYXBwbHkodGhpcy5fc3RvcmUsIGFyZ3VtZW50cykpO1xyXG4gIH07XHJcblxyXG4gIHByb3h5UHJvcGVydGllcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIFtcclxuICAgICduYW1lJyxcclxuICAgICdrZXlQYXRoJyxcclxuICAgICdpbmRleE5hbWVzJyxcclxuICAgICdhdXRvSW5jcmVtZW50J1xyXG4gIF0pO1xyXG5cclxuICBwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcclxuICAgICdwdXQnLFxyXG4gICAgJ2FkZCcsXHJcbiAgICAnZGVsZXRlJyxcclxuICAgICdjbGVhcicsXHJcbiAgICAnZ2V0JyxcclxuICAgICdnZXRBbGwnLFxyXG4gICAgJ2dldEtleScsXHJcbiAgICAnZ2V0QWxsS2V5cycsXHJcbiAgICAnY291bnQnXHJcbiAgXSk7XHJcblxyXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xyXG4gICAgJ29wZW5DdXJzb3InLFxyXG4gICAgJ29wZW5LZXlDdXJzb3InXHJcbiAgXSk7XHJcblxyXG4gIHByb3h5TWV0aG9kcyhPYmplY3RTdG9yZSwgJ19zdG9yZScsIElEQk9iamVjdFN0b3JlLCBbXHJcbiAgICAnZGVsZXRlSW5kZXgnXHJcbiAgXSk7XHJcblxyXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XHJcbiAgICB0aGlzLl90eCA9IGlkYlRyYW5zYWN0aW9uO1xyXG4gICAgdGhpcy5jb21wbGV0ZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmVqZWN0KGlkYlRyYW5zYWN0aW9uLmVycm9yKTtcclxuICAgICAgfTtcclxuICAgICAgaWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBPYmplY3RTdG9yZSh0aGlzLl90eC5vYmplY3RTdG9yZS5hcHBseSh0aGlzLl90eCwgYXJndW1lbnRzKSk7XHJcbiAgfTtcclxuXHJcbiAgcHJveHlQcm9wZXJ0aWVzKFRyYW5zYWN0aW9uLCAnX3R4JywgW1xyXG4gICAgJ29iamVjdFN0b3JlTmFtZXMnLFxyXG4gICAgJ21vZGUnXHJcbiAgXSk7XHJcblxyXG4gIHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXHJcbiAgICAnYWJvcnQnXHJcbiAgXSk7XHJcblxyXG4gIGZ1bmN0aW9uIFVwZ3JhZGVEQihkYiwgb2xkVmVyc2lvbiwgdHJhbnNhY3Rpb24pIHtcclxuICAgIHRoaXMuX2RiID0gZGI7XHJcbiAgICB0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xyXG4gICAgdGhpcy50cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XHJcbiAgfVxyXG5cclxuICBVcGdyYWRlREIucHJvdG90eXBlLmNyZWF0ZU9iamVjdFN0b3JlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gbmV3IE9iamVjdFN0b3JlKHRoaXMuX2RiLmNyZWF0ZU9iamVjdFN0b3JlLmFwcGx5KHRoaXMuX2RiLCBhcmd1bWVudHMpKTtcclxuICB9O1xyXG5cclxuICBwcm94eVByb3BlcnRpZXMoVXBncmFkZURCLCAnX2RiJywgW1xyXG4gICAgJ25hbWUnLFxyXG4gICAgJ3ZlcnNpb24nLFxyXG4gICAgJ29iamVjdFN0b3JlTmFtZXMnXHJcbiAgXSk7XHJcblxyXG4gIHByb3h5TWV0aG9kcyhVcGdyYWRlREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xyXG4gICAgJ2RlbGV0ZU9iamVjdFN0b3JlJyxcclxuICAgICdjbG9zZSdcclxuICBdKTtcclxuXHJcbiAgZnVuY3Rpb24gREIoZGIpIHtcclxuICAgIHRoaXMuX2RiID0gZGI7XHJcbiAgfVxyXG5cclxuICBEQi5wcm90b3R5cGUudHJhbnNhY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xyXG4gIH07XHJcblxyXG4gIHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcclxuICAgICduYW1lJyxcclxuICAgICd2ZXJzaW9uJyxcclxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xyXG4gIF0pO1xyXG5cclxuICBwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xyXG4gICAgJ2Nsb3NlJ1xyXG4gIF0pO1xyXG5cclxuICAvLyBBZGQgY3Vyc29yIGl0ZXJhdG9yc1xyXG4gIC8vIFRPRE86IHJlbW92ZSB0aGlzIG9uY2UgYnJvd3NlcnMgZG8gdGhlIHJpZ2h0IHRoaW5nIHdpdGggcHJvbWlzZXNcclxuICBbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcclxuICAgIFtPYmplY3RTdG9yZSwgSW5kZXhdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcclxuICAgICAgLy8gRG9uJ3QgY3JlYXRlIGl0ZXJhdGVLZXlDdXJzb3IgaWYgb3BlbktleUN1cnNvciBkb2Vzbid0IGV4aXN0LlxyXG4gICAgICBpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XHJcblxyXG4gICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGVbZnVuY05hbWUucmVwbGFjZSgnb3BlbicsICdpdGVyYXRlJyldID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciBuYXRpdmVPYmplY3QgPSB0aGlzLl9zdG9yZSB8fCB0aGlzLl9pbmRleDtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XHJcbiAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKHJlcXVlc3QucmVzdWx0KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIHBvbHlmaWxsIGdldEFsbFxyXG4gIFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcclxuICAgIGlmIChDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsKSByZXR1cm47XHJcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24ocXVlcnksIGNvdW50KSB7XHJcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XHJcbiAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuICAgICAgICBpbnN0YW5jZS5pdGVyYXRlQ3Vyc29yKHF1ZXJ5LCBmdW5jdGlvbihjdXJzb3IpIHtcclxuICAgICAgICAgIGlmICghY3Vyc29yKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgaWYgKGNvdW50ICE9PSB1bmRlZmluZWQgJiYgaXRlbXMubGVuZ3RoID09IGNvdW50KSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICB2YXIgZXhwID0ge1xyXG4gICAgb3BlbjogZnVuY3Rpb24obmFtZSwgdmVyc2lvbiwgdXBncmFkZUNhbGxiYWNrKSB7XHJcbiAgICAgIHZhciBwID0gcHJvbWlzaWZ5UmVxdWVzdENhbGwoaW5kZXhlZERCLCAnb3BlbicsIFtuYW1lLCB2ZXJzaW9uXSk7XHJcbiAgICAgIHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xyXG5cclxuICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGlmICh1cGdyYWRlQ2FsbGJhY2spIHtcclxuICAgICAgICAgIHVwZ3JhZGVDYWxsYmFjayhuZXcgVXBncmFkZURCKHJlcXVlc3QucmVzdWx0LCBldmVudC5vbGRWZXJzaW9uLCByZXF1ZXN0LnRyYW5zYWN0aW9uKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIHAudGhlbihmdW5jdGlvbihkYikge1xyXG4gICAgICAgIHJldHVybiBuZXcgREIoZGIpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBkZWxldGU6IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ2RlbGV0ZURhdGFiYXNlJywgW25hbWVdKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwO1xyXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHNlbGYuaWRiID0gZXhwO1xyXG4gIH1cclxufSgpKTtcclxuIl0sImZpbGUiOiJpZGItbWluLmpzIn0=
