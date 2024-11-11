"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/memoize-one";
exports.ids = ["vendor-chunks/memoize-one"];
exports.modules = {

/***/ "(ssr)/./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ memoizeOne)\n/* harmony export */ });\nvar safeIsNaN = Number.isNaN ||\n    function ponyfill(value) {\n        return typeof value === 'number' && value !== value;\n    };\nfunction isEqual(first, second) {\n    if (first === second) {\n        return true;\n    }\n    if (safeIsNaN(first) && safeIsNaN(second)) {\n        return true;\n    }\n    return false;\n}\nfunction areInputsEqual(newInputs, lastInputs) {\n    if (newInputs.length !== lastInputs.length) {\n        return false;\n    }\n    for (var i = 0; i < newInputs.length; i++) {\n        if (!isEqual(newInputs[i], lastInputs[i])) {\n            return false;\n        }\n    }\n    return true;\n}\n\nfunction memoizeOne(resultFn, isEqual) {\n    if (isEqual === void 0) { isEqual = areInputsEqual; }\n    var cache = null;\n    function memoized() {\n        var newArgs = [];\n        for (var _i = 0; _i < arguments.length; _i++) {\n            newArgs[_i] = arguments[_i];\n        }\n        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {\n            return cache.lastResult;\n        }\n        var lastResult = resultFn.apply(this, newArgs);\n        cache = {\n            lastResult: lastResult,\n            lastArgs: newArgs,\n            lastThis: this,\n        };\n        return lastResult;\n    }\n    memoized.clear = function clear() {\n        cache = null;\n    };\n    return memoized;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVtb2l6ZS1vbmUvZGlzdC9tZW1vaXplLW9uZS5lc20uanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsdUJBQXVCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcmVlLW5leHRhZG1pbi1uZXh0anMvLi9ub2RlX21vZHVsZXMvbWVtb2l6ZS1vbmUvZGlzdC9tZW1vaXplLW9uZS5lc20uanM/ZGVjOSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2FmZUlzTmFOID0gTnVtYmVyLmlzTmFOIHx8XG4gICAgZnVuY3Rpb24gcG9ueWZpbGwodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgdmFsdWUgIT09IHZhbHVlO1xuICAgIH07XG5mdW5jdGlvbiBpc0VxdWFsKGZpcnN0LCBzZWNvbmQpIHtcbiAgICBpZiAoZmlyc3QgPT09IHNlY29uZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHNhZmVJc05hTihmaXJzdCkgJiYgc2FmZUlzTmFOKHNlY29uZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGFyZUlucHV0c0VxdWFsKG5ld0lucHV0cywgbGFzdElucHV0cykge1xuICAgIGlmIChuZXdJbnB1dHMubGVuZ3RoICE9PSBsYXN0SW5wdXRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3SW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaXNFcXVhbChuZXdJbnB1dHNbaV0sIGxhc3RJbnB1dHNbaV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1lbW9pemVPbmUocmVzdWx0Rm4sIGlzRXF1YWwpIHtcbiAgICBpZiAoaXNFcXVhbCA9PT0gdm9pZCAwKSB7IGlzRXF1YWwgPSBhcmVJbnB1dHNFcXVhbDsgfVxuICAgIHZhciBjYWNoZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gbWVtb2l6ZWQoKSB7XG4gICAgICAgIHZhciBuZXdBcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBuZXdBcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhY2hlICYmIGNhY2hlLmxhc3RUaGlzID09PSB0aGlzICYmIGlzRXF1YWwobmV3QXJncywgY2FjaGUubGFzdEFyZ3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGUubGFzdFJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IHJlc3VsdEZuLmFwcGx5KHRoaXMsIG5ld0FyZ3MpO1xuICAgICAgICBjYWNoZSA9IHtcbiAgICAgICAgICAgIGxhc3RSZXN1bHQ6IGxhc3RSZXN1bHQsXG4gICAgICAgICAgICBsYXN0QXJnczogbmV3QXJncyxcbiAgICAgICAgICAgIGxhc3RUaGlzOiB0aGlzLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgICB9XG4gICAgbWVtb2l6ZWQuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgY2FjaGUgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG5leHBvcnQgeyBtZW1vaXplT25lIGFzIGRlZmF1bHQgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/memoize-one/dist/memoize-one.esm.js\n");

/***/ })

};
;