(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/users/users.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "users-module__MIXvaW__active",
  "cancel": "users-module__MIXvaW__cancel",
  "cardAccessPages": "users-module__MIXvaW__cardAccessPages",
  "cardAction": "users-module__MIXvaW__cardAction",
  "cardActions": "users-module__MIXvaW__cardActions",
  "cardBody": "users-module__MIXvaW__cardBody",
  "cardDate": "users-module__MIXvaW__cardDate",
  "cardError": "users-module__MIXvaW__cardError",
  "cardField": "users-module__MIXvaW__cardField",
  "cardHeader": "users-module__MIXvaW__cardHeader",
  "cardLabel": "users-module__MIXvaW__cardLabel",
  "cardLoading": "users-module__MIXvaW__cardLoading",
  "cardStatus": "users-module__MIXvaW__cardStatus",
  "cardUserInfo": "users-module__MIXvaW__cardUserInfo",
  "cardUserName": "users-module__MIXvaW__cardUserName",
  "cardUsername": "users-module__MIXvaW__cardUsername",
  "cardValue": "users-module__MIXvaW__cardValue",
  "editing": "users-module__MIXvaW__editing",
  "error": "users-module__MIXvaW__error",
  "form-error": "users-module__MIXvaW__form-error",
  "form-fieldset": "users-module__MIXvaW__form-fieldset",
  "form-help": "users-module__MIXvaW__form-help",
  "form-label": "users-module__MIXvaW__form-label",
  "form-legend": "users-module__MIXvaW__form-legend",
  "loading-spinner": "users-module__MIXvaW__loading-spinner",
  "mobileCard": "users-module__MIXvaW__mobileCard",
  "mobileEditAction": "users-module__MIXvaW__mobileEditAction",
  "mobileEditActions": "users-module__MIXvaW__mobileEditActions",
  "mobileEditCheckbox": "users-module__MIXvaW__mobileEditCheckbox",
  "mobileEditCheckboxGrid": "users-module__MIXvaW__mobileEditCheckboxGrid",
  "mobileEditCheckboxText": "users-module__MIXvaW__mobileEditCheckboxText",
  "mobileEditField": "users-module__MIXvaW__mobileEditField",
  "mobileEditForm": "users-module__MIXvaW__mobileEditForm",
  "mobileEditGrid": "users-module__MIXvaW__mobileEditGrid",
  "mobileEditInput": "users-module__MIXvaW__mobileEditInput",
  "mobileEditLabel": "users-module__MIXvaW__mobileEditLabel",
  "mobileEmptyDescription": "users-module__MIXvaW__mobileEmptyDescription",
  "mobileEmptyIcon": "users-module__MIXvaW__mobileEmptyIcon",
  "mobileEmptyState": "users-module__MIXvaW__mobileEmptyState",
  "mobileEmptyTitle": "users-module__MIXvaW__mobileEmptyTitle",
  "mobileErrorMessage": "users-module__MIXvaW__mobileErrorMessage",
  "mobileTableToggle": "users-module__MIXvaW__mobileTableToggle",
  "multiSelectDropdown": "users-module__MIXvaW__multiSelectDropdown",
  "multiSelectInput": "users-module__MIXvaW__multiSelectInput",
  "multiSelectOption": "users-module__MIXvaW__multiSelectOption",
  "multiSelectOptions": "users-module__MIXvaW__multiSelectOptions",
  "multiSelectRemove": "users-module__MIXvaW__multiSelectRemove",
  "multiSelectTag": "users-module__MIXvaW__multiSelectTag",
  "multiSelectTags": "users-module__MIXvaW__multiSelectTags",
  "primary": "users-module__MIXvaW__primary",
  "primary-action": "users-module__MIXvaW__primary-action",
  "required-asterisk": "users-module__MIXvaW__required-asterisk",
  "save": "users-module__MIXvaW__save",
  "secondary": "users-module__MIXvaW__secondary",
  "spin": "users-module__MIXvaW__spin",
  "sr-only": "users-module__MIXvaW__sr-only",
  "success": "users-module__MIXvaW__success",
  "themed-button": "users-module__MIXvaW__themed-button",
  "toggleButton": "users-module__MIXvaW__toggleButton",
  "usersContainer": "users-module__MIXvaW__usersContainer",
  "warning": "users-module__MIXvaW__warning",
});
}),
"[project]/src/components/LoadingAnimation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
const LoadingAnimation = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = ({ type = 'spinner', size = 'medium', color = 'primary', text = '', overlay = false, fullScreen = false })=>{
    const renderAnimation = ()=>{
        switch(type){
            case 'spinner':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-spinner loading-${size} loading-${color}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "spinner-circle"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LoadingAnimation.tsx",
                        lineNumber: 28,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 27,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'dots':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-dots loading-${size} loading-${color}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dot dot-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dot dot-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 36,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dot dot-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 37,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'pulse':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-pulse loading-${size} loading-${color}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pulse-circle pulse-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pulse-circle pulse-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pulse-circle pulse-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 43,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'bars':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-bars loading-${size} loading-${color}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bar bar-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bar bar-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bar bar-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bar bar-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bar bar-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'wave':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-wave loading-${size} loading-${color}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wave-bar wave-1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wave-bar wave-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wave-bar wave-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wave-bar wave-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wave-bar wave-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'skeleton':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-skeleton loading-${size}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "skeleton-line skeleton-title"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "skeleton-line skeleton-text"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "skeleton-line skeleton-text short"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LoadingAnimation.tsx",
                            lineNumber: 77,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `loading-spinner loading-${size} loading-${color}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "spinner-circle"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LoadingAnimation.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 83,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `loading-container ${overlay ? 'loading-overlay' : ''} ${fullScreen ? 'loading-fullscreen' : ''}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "loading-content",
            children: [
                renderAnimation(),
                text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "loading-text",
                    children: text
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingAnimation.tsx",
                    lineNumber: 94,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LoadingAnimation.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingAnimation.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    return content;
});
_c1 = LoadingAnimation;
LoadingAnimation.displayName = 'LoadingAnimation';
const __TURBOPACK__default__export__ = LoadingAnimation;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoadingAnimation$memo");
__turbopack_context__.k.register(_c1, "LoadingAnimation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/LoadingButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingAnimation.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const LoadingButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = ({ loading = false, loadingText = 'Loading...', children, variant = 'primary', size = 'medium', fullWidth = false, className = '', disabled, ...props })=>{
    const buttonClasses = [
        'loading-button',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full-width' : '',
        loading ? 'btn-loading' : '',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: buttonClasses,
        disabled: disabled || loading,
        ...props,
        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "btn-loading-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    type: "spinner",
                    size: "small",
                    color: variant === 'primary' ? 'primary' : 'secondary'
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingButton.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "btn-loading-text",
                    children: loadingText
                }, void 0, false, {
                    fileName: "[project]/src/components/LoadingButton.tsx",
                    lineNumber: 49,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/LoadingButton.tsx",
            lineNumber: 43,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : children
    }, void 0, false, {
        fileName: "[project]/src/components/LoadingButton.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = LoadingButton;
LoadingButton.displayName = 'LoadingButton';
const __TURBOPACK__default__export__ = LoadingButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoadingButton$memo");
__turbopack_context__.k.register(_c1, "LoadingButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PageLoader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingAnimation.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const PageLoader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = ({ loading, children, loadingText = 'Loading...', type = 'pulse', overlay = false, minHeight = '200px' })=>{
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-loader",
            style: {
                minHeight: overlay ? '100vh' : minHeight
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                type: type,
                size: "large",
                color: "primary",
                text: loadingText,
                overlay: overlay,
                fullScreen: overlay
            }, void 0, false, {
                fileName: "[project]/src/components/PageLoader.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/PageLoader.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
});
_c1 = PageLoader;
PageLoader.displayName = 'PageLoader';
const __TURBOPACK__default__export__ = PageLoader;
var _c, _c1;
__turbopack_context__.k.register(_c, "PageLoader$memo");
__turbopack_context__.k.register(_c1, "PageLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useLoading.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useLoading",
    ()=>useLoading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const useLoading = (initialStates = {})=>{
    _s();
    const [loadingStates, setLoadingStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialStates);
    const setLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[setLoading]": (key, isLoading)=>{
            setLoadingStates({
                "useLoading.useCallback[setLoading]": (prev)=>({
                        ...prev,
                        [key]: isLoading
                    })
            }["useLoading.useCallback[setLoading]"]);
        }
    }["useLoading.useCallback[setLoading]"], []);
    const startLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[startLoading]": (key)=>{
            setLoading(key, true);
        }
    }["useLoading.useCallback[startLoading]"], [
        setLoading
    ]);
    const stopLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[stopLoading]": (key)=>{
            setLoading(key, false);
        }
    }["useLoading.useCallback[stopLoading]"], [
        setLoading
    ]);
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[isLoading]": (key)=>{
            return loadingStates[key] || false;
        }
    }["useLoading.useCallback[isLoading]"], [
        loadingStates
    ]);
    const isAnyLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[isAnyLoading]": ()=>{
            return Object.values(loadingStates).some({
                "useLoading.useCallback[isAnyLoading]": (loading)=>loading
            }["useLoading.useCallback[isAnyLoading]"]);
        }
    }["useLoading.useCallback[isAnyLoading]"], [
        loadingStates
    ]);
    const resetLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLoading.useCallback[resetLoading]": ()=>{
            setLoadingStates({});
        }
    }["useLoading.useCallback[resetLoading]"], []);
    return {
        loadingStates,
        setLoading,
        startLoading,
        stopLoading,
        isLoading,
        isAnyLoading,
        resetLoading
    };
};
_s(useLoading, "8rszb1f+rdCglrjVe2CdS9BoiWA=");
const __TURBOPACK__default__export__ = useLoading;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/users/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/users/users.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoadingButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PageLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PageLoader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLoading$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useLoading.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/navigation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
const UsersPage = ()=>{
    _s();
    // Require authentication and access to 'users' page
    const { user, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRequireAuth"])('users');
    // Loading states management
    const { startLoading, stopLoading, isLoading: isActionLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLoading$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoading"])();
    // State management
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [processing, setProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddForm, setShowAddForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isMobileView, setIsMobileView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [windowWidth, setWindowWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [newUser, setNewUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        accessPages: []
    });
    // Available pages for access control - automatically synced with sidebar navigation
    const availablePages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UsersPage.useMemo[availablePages]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvailablePages"])()
    }["UsersPage.useMemo[availablePages]"], []);
    // Show loading state while checking authentication
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/users/page.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-subtitle",
                        children: "Please wait while we verify your access"
                    }, void 0, false, {
                        fileName: "[project]/src/app/users/page.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/users/page.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/app/users/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Fetch users from API
    const fetchUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[fetchUsers]": async ()=>{
            try {
                setLoading(true);
                const response = await fetch('/api/users', {
                    cache: 'no-store'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.map({
                        "UsersPage.useCallback[fetchUsers]": (user)=>({
                                ...user,
                                isEditing: false
                            })
                    }["UsersPage.useCallback[fetchUsers]"]));
                } else {
                    throw new Error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setErrors({
                    fetch: 'Failed to load users. Please refresh the page.'
                });
            } finally{
                setLoading(false);
            }
        }
    }["UsersPage.useCallback[fetchUsers]"], []);
    // Load users on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersPage.useEffect": ()=>{
            fetchUsers();
        }
    }["UsersPage.useEffect"], [
        fetchUsers
    ]);
    // Handle window resize for responsive behavior
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersPage.useEffect": ()=>{
            const handleResize = {
                "UsersPage.useEffect.handleResize": ()=>{
                    const width = window.innerWidth;
                    setWindowWidth(width);
                    setIsMobileView(width < 640);
                }
            }["UsersPage.useEffect.handleResize"];
            // Set initial size
            handleResize();
            window.addEventListener('resize', handleResize);
            return ({
                "UsersPage.useEffect": ()=>window.removeEventListener('resize', handleResize)
            })["UsersPage.useEffect"];
        }
    }["UsersPage.useEffect"], []);
    // Auto-clear error messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersPage.useEffect": ()=>{
            if (errors.action || errors.fetch) {
                const timer = setTimeout({
                    "UsersPage.useEffect.timer": ()=>{
                        setErrors({
                            "UsersPage.useEffect.timer": (prev)=>({
                                    ...prev,
                                    action: '',
                                    fetch: ''
                                })
                        }["UsersPage.useEffect.timer"]);
                    }
                }["UsersPage.useEffect.timer"], 5000);
                return ({
                    "UsersPage.useEffect": ()=>clearTimeout(timer)
                })["UsersPage.useEffect"];
            }
        }
    }["UsersPage.useEffect"], [
        errors.action,
        errors.fetch
    ]);
    // Enhanced form validation
    const validateForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[validateForm]": ()=>{
            const newErrors = {};
            if (!newUser.name.trim()) {
                newErrors.name = 'Name is required';
            } else if (newUser.name.length < 2) {
                newErrors.name = 'Name must be at least 2 characters';
            }
            if (!newUser.username.trim()) {
                newErrors.username = 'Username is required';
            } else if (newUser.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(newUser.username)) {
                newErrors.username = 'Username can only contain letters, numbers, and underscores';
            } else if (users.some({
                "UsersPage.useCallback[validateForm]": (u)=>u.username.toLowerCase() === newUser.username.toLowerCase()
            }["UsersPage.useCallback[validateForm]"])) {
                newErrors.username = 'Username already exists';
            }
            if (!newUser.password) {
                newErrors.password = 'Password is required';
            } else if (newUser.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            if (newUser.password !== newUser.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (newUser.accessPages.length === 0) {
                newErrors.accessPages = 'Please select at least one access page';
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
    }["UsersPage.useCallback[validateForm]"], [
        newUser,
        users
    ]);
    // Validate edit form (read-only validation - doesn't set errors)
    const isEditFormValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[isEditFormValid]": (userId)=>{
            const editUserData = editData[userId];
            if (!editUserData) return false;
            // Check all validation rules without setting errors
            if (!editUserData.name.trim() || editUserData.name.length < 2) return false;
            if (!editUserData.username.trim() || editUserData.username.length < 3) return false;
            if (!/^[a-zA-Z0-9_]+$/.test(editUserData.username)) return false;
            if (users.some({
                "UsersPage.useCallback[isEditFormValid]": (u)=>u.id !== userId && u.username.toLowerCase() === editUserData.username.toLowerCase()
            }["UsersPage.useCallback[isEditFormValid]"])) return false;
            if (!editUserData.password || editUserData.password.length < 6) return false;
            if (editUserData.accessPages.length === 0) return false;
            return true;
        }
    }["UsersPage.useCallback[isEditFormValid]"], [
        editData,
        users
    ]);
    // Validate edit form and set errors (use this for form submission)
    const validateEditForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[validateEditForm]": (userId)=>{
            const editUserData = editData[userId];
            if (!editUserData) return false;
            const newErrors = {};
            if (!editUserData.name.trim()) {
                newErrors[`edit_name_${userId}`] = 'Name is required';
            } else if (editUserData.name.length < 2) {
                newErrors[`edit_name_${userId}`] = 'Name must be at least 2 characters';
            }
            if (!editUserData.username.trim()) {
                newErrors[`edit_username_${userId}`] = 'Username is required';
            } else if (editUserData.username.length < 3) {
                newErrors[`edit_username_${userId}`] = 'Username must be at least 3 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(editUserData.username)) {
                newErrors[`edit_username_${userId}`] = 'Username can only contain letters, numbers, and underscores';
            } else if (users.some({
                "UsersPage.useCallback[validateEditForm]": (u)=>u.id !== userId && u.username.toLowerCase() === editUserData.username.toLowerCase()
            }["UsersPage.useCallback[validateEditForm]"])) {
                newErrors[`edit_username_${userId}`] = 'Username already exists';
            }
            if (!editUserData.password) {
                newErrors[`edit_password_${userId}`] = 'Password is required';
            } else if (editUserData.password.length < 6) {
                newErrors[`edit_password_${userId}`] = 'Password must be at least 6 characters';
            }
            if (editUserData.accessPages.length === 0) {
                newErrors[`edit_access_${userId}`] = 'Please select at least one access page';
            }
            setErrors({
                "UsersPage.useCallback[validateEditForm]": (prev)=>({
                        ...prev,
                        ...newErrors
                    })
            }["UsersPage.useCallback[validateEditForm]"]);
            return Object.keys(newErrors).length === 0;
        }
    }["UsersPage.useCallback[validateEditForm]"], [
        editData,
        users
    ]);
    // Reset form to initial state
    const resetForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[resetForm]": ()=>{
            setNewUser({
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                accessPages: []
            });
            setErrors({});
            setShowAddForm(false);
        }
    }["UsersPage.useCallback[resetForm]"], []);
    // Enhanced add user function
    const handleAddUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[handleAddUser]": async (e)=>{
            e.preventDefault();
            if (!validateForm()) return;
            setProcessing(-1);
            startLoading('addUser');
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newUser.name.trim(),
                        username: newUser.username.trim(),
                        password: newUser.password,
                        accessPages: newUser.accessPages
                    })
                });
                if (response.ok) {
                    await fetchUsers();
                    resetForm();
                } else {
                    const errorData = await response.json();
                    setErrors({
                        submit: errorData.error || 'Failed to create user'
                    });
                }
            } catch (error) {
                console.error('Error creating user:', error);
                setErrors({
                    submit: 'Network error. Please try again.'
                });
            } finally{
                setProcessing(null);
                stopLoading('addUser');
            }
        }
    }["UsersPage.useCallback[handleAddUser]"], [
        newUser,
        validateForm,
        fetchUsers,
        resetForm
    ]);
    // Start editing a user
    const startEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[startEdit]": (user)=>{
            setEditData({
                "UsersPage.useCallback[startEdit]": (prev)=>({
                        ...prev,
                        [user.id]: {
                            name: user.name,
                            username: user.username,
                            password: '',
                            accessPages: [
                                ...user.accessPages
                            ]
                        }
                    })
            }["UsersPage.useCallback[startEdit]"]);
            setUsers({
                "UsersPage.useCallback[startEdit]": (prevUsers)=>prevUsers.map({
                        "UsersPage.useCallback[startEdit]": (u)=>({
                                ...u,
                                isEditing: u.id === user.id ? true : false // Close other edit modes
                            })
                    }["UsersPage.useCallback[startEdit]"])
            }["UsersPage.useCallback[startEdit]"]);
            setErrors({}); // Clear any existing errors
        }
    }["UsersPage.useCallback[startEdit]"], []);
    // Cancel editing
    const cancelEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[cancelEdit]": (userId)=>{
            setUsers({
                "UsersPage.useCallback[cancelEdit]": (prevUsers)=>prevUsers.map({
                        "UsersPage.useCallback[cancelEdit]": (u)=>u.id === userId ? {
                                ...u,
                                isEditing: false
                            } : u
                    }["UsersPage.useCallback[cancelEdit]"])
            }["UsersPage.useCallback[cancelEdit]"]);
            setEditData({
                "UsersPage.useCallback[cancelEdit]": (prev)=>{
                    const newEditData = {
                        ...prev
                    };
                    delete newEditData[userId];
                    return newEditData;
                }
            }["UsersPage.useCallback[cancelEdit]"]);
            // Clear edit-specific errors
            setErrors({
                "UsersPage.useCallback[cancelEdit]": (prev)=>{
                    const newErrors = {
                        ...prev
                    };
                    Object.keys(newErrors).forEach({
                        "UsersPage.useCallback[cancelEdit]": (key)=>{
                            if (key.includes(`_${userId}`)) {
                                delete newErrors[key];
                            }
                        }
                    }["UsersPage.useCallback[cancelEdit]"]);
                    return newErrors;
                }
            }["UsersPage.useCallback[cancelEdit]"]);
        }
    }["UsersPage.useCallback[cancelEdit]"], []);
    // Save user edit
    const saveEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[saveEdit]": async (userId)=>{
            if (!validateEditForm(userId)) return;
            const editUserData = editData[userId];
            setProcessing(userId);
            startLoading(`editUser_${userId}`);
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: editUserData.name.trim(),
                        username: editUserData.username.trim(),
                        password: editUserData.password,
                        accessPages: editUserData.accessPages,
                        isActive: users.find({
                            "UsersPage.useCallback[saveEdit]": (u)=>u.id === userId
                        }["UsersPage.useCallback[saveEdit]"])?.isActive || true
                    })
                });
                if (response.ok) {
                    await fetchUsers();
                    cancelEdit(userId);
                } else {
                    const errorData = await response.json();
                    setErrors({
                        "UsersPage.useCallback[saveEdit]": (prev)=>({
                                ...prev,
                                [`edit_submit_${userId}`]: errorData.error || 'Failed to update user'
                            })
                    }["UsersPage.useCallback[saveEdit]"]);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                setErrors({
                    "UsersPage.useCallback[saveEdit]": (prev)=>({
                            ...prev,
                            [`edit_submit_${userId}`]: 'Network error. Please try again.'
                        })
                }["UsersPage.useCallback[saveEdit]"]);
            } finally{
                setProcessing(null);
                stopLoading(`editUser_${userId}`);
            }
        }
    }["UsersPage.useCallback[saveEdit]"], [
        editData,
        validateEditForm,
        users,
        fetchUsers,
        cancelEdit
    ]);
    // Toggle edit mode for a user
    const toggleEditMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[toggleEditMode]": (userId)=>{
            const user = users.find({
                "UsersPage.useCallback[toggleEditMode].user": (u)=>u.id === userId
            }["UsersPage.useCallback[toggleEditMode].user"]);
            if (!user) return;
            if (user.isEditing) {
                cancelEdit(userId);
            } else {
                startEdit(user);
            }
        }
    }["UsersPage.useCallback[toggleEditMode]"], [
        users,
        cancelEdit,
        startEdit
    ]);
    // Enhanced toggle user status with optimistic updates
    const toggleUserStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[toggleUserStatus]": async (userId)=>{
            const user = users.find({
                "UsersPage.useCallback[toggleUserStatus].user": (u)=>u.id === userId
            }["UsersPage.useCallback[toggleUserStatus].user"]);
            if (!user || processing === userId) return;
            setProcessing(userId);
            startLoading(`toggleStatus_${userId}`);
            // Optimistic update
            setUsers({
                "UsersPage.useCallback[toggleUserStatus]": (prevUsers)=>prevUsers.map({
                        "UsersPage.useCallback[toggleUserStatus]": (u)=>u.id === userId ? {
                                ...u,
                                isActive: !u.isActive
                            } : u
                    }["UsersPage.useCallback[toggleUserStatus]"])
            }["UsersPage.useCallback[toggleUserStatus]"]);
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...user,
                        isActive: !user.isActive
                    })
                });
                if (!response.ok) {
                    // Revert optimistic update on failure
                    setUsers({
                        "UsersPage.useCallback[toggleUserStatus]": (prevUsers)=>prevUsers.map({
                                "UsersPage.useCallback[toggleUserStatus]": (u)=>u.id === userId ? {
                                        ...u,
                                        isActive: user.isActive
                                    } : u
                            }["UsersPage.useCallback[toggleUserStatus]"])
                    }["UsersPage.useCallback[toggleUserStatus]"]);
                    throw new Error('Failed to update user status');
                }
            } catch (error) {
                console.error('Error updating user status:', error);
                setErrors({
                    action: 'Failed to update user status'
                });
            } finally{
                setProcessing(null);
                stopLoading(`toggleStatus_${userId}`);
            }
        }
    }["UsersPage.useCallback[toggleUserStatus]"], [
        users,
        processing
    ]);
    // Enhanced delete user with confirmation
    const deleteUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[deleteUser]": async (userId, userName)=>{
            if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
                return;
            }
            setProcessing(userId);
            startLoading(`deleteUser_${userId}`);
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    // Optimistic update - remove user immediately
                    setUsers({
                        "UsersPage.useCallback[deleteUser]": (prevUsers)=>prevUsers.filter({
                                "UsersPage.useCallback[deleteUser]": (user)=>user.id !== userId
                            }["UsersPage.useCallback[deleteUser]"])
                    }["UsersPage.useCallback[deleteUser]"]);
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setErrors({
                    action: 'Failed to delete user'
                });
                await fetchUsers(); // Refresh on error
            } finally{
                setProcessing(null);
                stopLoading(`deleteUser_${userId}`);
            }
        }
    }["UsersPage.useCallback[deleteUser]"], [
        processing,
        fetchUsers
    ]);
    // Handle access page selection for new user
    const handleAccessPageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[handleAccessPageChange]": (pageId, checked)=>{
            setNewUser({
                "UsersPage.useCallback[handleAccessPageChange]": (prev)=>({
                        ...prev,
                        accessPages: checked ? [
                            ...prev.accessPages,
                            pageId
                        ] : prev.accessPages.filter({
                            "UsersPage.useCallback[handleAccessPageChange]": (p)=>p !== pageId
                        }["UsersPage.useCallback[handleAccessPageChange]"])
                    })
            }["UsersPage.useCallback[handleAccessPageChange]"]);
        }
    }["UsersPage.useCallback[handleAccessPageChange]"], []);
    // Handle access page selection for edit user
    const handleEditAccessPageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersPage.useCallback[handleEditAccessPageChange]": (userId, pageId, checked)=>{
            setEditData({
                "UsersPage.useCallback[handleEditAccessPageChange]": (prev)=>({
                        ...prev,
                        [userId]: {
                            ...prev[userId],
                            accessPages: checked ? [
                                ...prev[userId].accessPages,
                                pageId
                            ] : prev[userId].accessPages.filter({
                                "UsersPage.useCallback[handleEditAccessPageChange]": (p)=>p !== pageId
                            }["UsersPage.useCallback[handleEditAccessPageChange]"])
                        }
                    })
            }["UsersPage.useCallback[handleEditAccessPageChange]"]);
        }
    }["UsersPage.useCallback[handleEditAccessPageChange]"], []);
    // Mobile Card Component for Users - memoized for performance
    const UserCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ user })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileCard} ${user.isEditing ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editing : ''} ${processing === user.id ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLoading : ''}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardHeader,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardUserInfo,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardUserName,
                                    children: user.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardUsername,
                                    children: [
                                        "@",
                                        user.username
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 477,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 475,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardStatus,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `status-badge ${user.isActive ? 'active' : 'inactive'}`,
                                children: user.isActive ? 'Active' : 'Inactive'
                            }, void 0, false, {
                                fileName: "[project]/src/app/users/page.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 479,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/users/page.tsx",
                    lineNumber: 474,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditForm,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditGrid,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditLabel,
                                            children: "Name *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 490,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditInput,
                                            value: editData[user.id]?.name || '',
                                            onChange: (e)=>setEditData((prev)=>({
                                                        ...prev,
                                                        [user.id]: {
                                                            ...prev[user.id],
                                                            name: e.target.value
                                                        }
                                                    })),
                                            placeholder: "Enter name",
                                            disabled: processing === user.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 491,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        errors[`edit_name_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "error-text",
                                            children: errors[`edit_name_${user.id}`]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 503,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 489,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditLabel,
                                            children: "Username *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 508,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditInput,
                                            value: editData[user.id]?.username || '',
                                            onChange: (e)=>setEditData((prev)=>({
                                                        ...prev,
                                                        [user.id]: {
                                                            ...prev[user.id],
                                                            username: e.target.value
                                                        }
                                                    })),
                                            placeholder: "Enter username",
                                            disabled: processing === user.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 509,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        errors[`edit_username_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "error-text",
                                            children: errors[`edit_username_${user.id}`]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 521,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 507,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditLabel,
                                            children: "New Password *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 526,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditInput,
                                            value: editData[user.id]?.password || '',
                                            onChange: (e)=>setEditData((prev)=>({
                                                        ...prev,
                                                        [user.id]: {
                                                            ...prev[user.id],
                                                            password: e.target.value
                                                        }
                                                    })),
                                            placeholder: "New password",
                                            disabled: processing === user.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 527,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        errors[`edit_password_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "error-text",
                                            children: errors[`edit_password_${user.id}`]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 539,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 525,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditLabel,
                                            children: "Access Pages *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 544,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectDropdown,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectInput,
                                                    placeholder: "Search pages...",
                                                    value: editData[user.id]?.accessSearch || '',
                                                    onChange: (e)=>setEditData((prev)=>({
                                                                ...prev,
                                                                [user.id]: {
                                                                    ...prev[user.id],
                                                                    accessSearch: e.target.value
                                                                }
                                                            })),
                                                    disabled: processing === user.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectOptions,
                                                    children: availablePages.filter((page)=>{
                                                        const search = editData[user.id]?.accessSearch || '';
                                                        return !editData[user.id]?.accessPages?.includes(page.id) && (search === '' || page.name.toLowerCase().includes(search.toLowerCase()) || page.id.toLowerCase().includes(search.toLowerCase()));
                                                    }).map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectOption,
                                                            onClick: ()=>setEditData((prev)=>({
                                                                        ...prev,
                                                                        [user.id]: {
                                                                            ...prev[user.id],
                                                                            accessPages: [
                                                                                ...prev[user.id]?.accessPages || [],
                                                                                page.id
                                                                            ],
                                                                            accessSearch: ''
                                                                        }
                                                                    })),
                                                            children: page.name
                                                        }, page.id, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 565,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectTags,
                                                    children: (editData[user.id]?.accessPages || []).map((pageId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectTag,
                                                            children: [
                                                                availablePages.find((p)=>p.id === pageId)?.name || pageId,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectRemove,
                                                                    onClick: ()=>setEditData((prev)=>({
                                                                                ...prev,
                                                                                [user.id]: {
                                                                                    ...prev[user.id],
                                                                                    accessPages: prev[user.id].accessPages.filter((p)=>p !== pageId)
                                                                                }
                                                                            })),
                                                                    disabled: processing === user.id,
                                                                    children: "✕"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 585,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, pageId, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 583,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 545,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        errors[`edit_access_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "error-text",
                                            children: errors[`edit_access_${user.id}`]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 602,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 488,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditActions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditAction} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].save}`,
                                    onClick: ()=>saveEdit(user.id),
                                    disabled: processing === user.id || !isEditFormValid(user.id),
                                    loading: isActionLoading(`editUser_${user.id}`),
                                    loadingText: "Saving...",
                                    children: "✓ Save Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 608,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEditAction} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cancel}`,
                                    onClick: ()=>cancelEdit(user.id),
                                    disabled: processing === user.id,
                                    children: "✕ Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 617,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 607,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        errors[`edit_submit_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileErrorMessage,
                            children: errors[`edit_submit_${user.id}`]
                        }, void 0, false, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 626,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/users/page.tsx",
                    lineNumber: 487,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardBody,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLabel,
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 633,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardValue,
                                            children: "••••••••"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 634,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 632,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLabel,
                                            children: "Access Pages"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 637,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardValue} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardAccessPages}`,
                                            children: user.accessPages.map((pageId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "access-tag",
                                                    children: availablePages.find((p)=>p.id === pageId)?.name || pageId
                                                }, pageId, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 640,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 638,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 636,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardField,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardLabel,
                                            children: "Created"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 647,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardValue} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardDate}`,
                                            children: new Date(user.createdAt).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 646,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 631,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardActions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardAction} ${user.isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].warning : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success}`,
                                    onClick: ()=>toggleUserStatus(user.id),
                                    title: user.isActive ? 'Deactivate User' : 'Activate User',
                                    disabled: processing === user.id,
                                    loading: isActionLoading(`toggleStatus_${user.id}`),
                                    loadingText: user.isActive ? 'Deactivating...' : 'Activating...',
                                    children: user.isActive ? '⏸️ Deactivate' : '▶️ Activate'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 655,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardAction} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].primary}`,
                                    onClick: ()=>toggleEditMode(user.id),
                                    title: "Edit User",
                                    disabled: processing !== null,
                                    children: "✏️ Edit"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 665,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardAction} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error}`,
                                    onClick: ()=>deleteUser(user.id, user.name),
                                    title: "Delete User",
                                    disabled: processing === user.id,
                                    loading: isActionLoading(`deleteUser_${user.id}`),
                                    loadingText: "Deleting...",
                                    children: "🗑️ Delete"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 673,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 654,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/users/page.tsx",
            lineNumber: 473,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)));
    UserCard.displayName = 'UserCard';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PageLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        loading: loading,
        loadingText: "Loading users...",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `page-container ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].usersContainer}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Users Management"
                        }, void 0, false, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 695,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "page-subtitle",
                            children: "Manage user accounts and permissions"
                        }, void 0, false, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 696,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/users/page.tsx",
                    lineNumber: 694,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-content",
                    children: [
                        (errors.fetch || errors.action) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-banner",
                            children: [
                                errors.fetch || errors.action,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "error-close",
                                    onClick: ()=>setErrors({}),
                                    title: "Close error",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 704,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 702,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "users-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "themed-button",
                                    onClick: ()=>setShowAddForm(!showAddForm),
                                    disabled: processing !== null,
                                    children: showAddForm ? '✕ Cancel' : '+ Add New User'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 716,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "themed-button secondary",
                                    onClick: fetchUsers,
                                    disabled: loading || processing !== null,
                                    title: "Refresh users list",
                                    loading: loading,
                                    loadingText: "Loading...",
                                    children: "↻ Refresh"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 723,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 715,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        windowWidth > 0 && windowWidth < 768 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileTableToggle,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleButton} ${!isMobileView ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                                    onClick: ()=>setIsMobileView(false),
                                    children: "📊 Table View"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 738,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].toggleButton} ${isMobileView ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ''}`,
                                    onClick: ()=>setIsMobileView(true),
                                    children: "📱 Card View"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 744,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 737,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        showAddForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "add-user-form",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Add New User"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 756,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleAddUser,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "name",
                                                            className: "form-label",
                                                            children: [
                                                                "Full Name ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "required-asterisk",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 761,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 760,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "name",
                                                            type: "text",
                                                            className: "themed-input",
                                                            value: newUser.name,
                                                            onChange: (e)=>setNewUser({
                                                                    ...newUser,
                                                                    name: e.target.value
                                                                }),
                                                            placeholder: "Enter full name",
                                                            disabled: processing === -1,
                                                            autoComplete: "name",
                                                            "aria-describedby": errors.name ? "name-error" : undefined,
                                                            "aria-invalid": errors.name ? "true" : "false"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 763,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            id: "name-error",
                                                            className: "error-text",
                                                            role: "alert",
                                                            children: errors.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 776,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 759,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "username",
                                                            className: "form-label",
                                                            children: [
                                                                "Username ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "required-asterisk",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 784,
                                                                    columnNumber: 30
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 783,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "username",
                                                            type: "text",
                                                            className: "themed-input",
                                                            value: newUser.username,
                                                            onChange: (e)=>setNewUser({
                                                                    ...newUser,
                                                                    username: e.target.value
                                                                }),
                                                            placeholder: "Enter username",
                                                            disabled: processing === -1,
                                                            autoComplete: "username",
                                                            "aria-describedby": errors.username ? "username-error" : undefined,
                                                            "aria-invalid": errors.username ? "true" : "false"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 786,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        errors.username && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            id: "username-error",
                                                            className: "error-text",
                                                            role: "alert",
                                                            children: errors.username
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 799,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "password",
                                                            className: "form-label",
                                                            children: [
                                                                "Password ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "required-asterisk",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 807,
                                                                    columnNumber: 30
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "password",
                                                            type: "password",
                                                            className: "themed-input",
                                                            value: newUser.password,
                                                            onChange: (e)=>setNewUser({
                                                                    ...newUser,
                                                                    password: e.target.value
                                                                }),
                                                            placeholder: "Enter secure password",
                                                            disabled: processing === -1,
                                                            autoComplete: "new-password",
                                                            "aria-describedby": errors.password ? "password-error" : "password-help",
                                                            "aria-invalid": errors.password ? "true" : "false"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 809,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            id: "password-help",
                                                            className: "form-help",
                                                            children: "Minimum 6 characters required"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 821,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            id: "password-error",
                                                            className: "error-text",
                                                            role: "alert",
                                                            children: errors.password
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 825,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "confirmPassword",
                                                            className: "form-label",
                                                            children: [
                                                                "Confirm Password ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "required-asterisk",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 833,
                                                                    columnNumber: 38
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 832,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "confirmPassword",
                                                            type: "password",
                                                            className: "themed-input",
                                                            value: newUser.confirmPassword,
                                                            onChange: (e)=>setNewUser({
                                                                    ...newUser,
                                                                    confirmPassword: e.target.value
                                                                }),
                                                            placeholder: "Confirm your password",
                                                            disabled: processing === -1,
                                                            autoComplete: "new-password",
                                                            "aria-describedby": errors.confirmPassword ? "confirm-password-error" : undefined,
                                                            "aria-invalid": errors.confirmPassword ? "true" : "false"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        errors.confirmPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            id: "confirm-password-error",
                                                            className: "error-text",
                                                            role: "alert",
                                                            children: errors.confirmPassword
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 848,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 831,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 758,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                                className: "form-fieldset",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                                        className: "form-legend",
                                                        children: [
                                                            "Access Permissions ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "required-asterisk",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 858,
                                                                columnNumber: 40
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/users/page.tsx",
                                                        lineNumber: 857,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "access-pages-grid",
                                                        role: "group",
                                                        "aria-labelledby": "access-pages-label",
                                                        children: availablePages.map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "checkbox-label",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: newUser.accessPages.includes(page.id),
                                                                        onChange: (e)=>handleAccessPageChange(page.id, e.target.checked),
                                                                        disabled: processing === -1,
                                                                        "aria-describedby": `access-${page.id}-desc`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 863,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "checkbox-text",
                                                                        children: page.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 870,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        id: `access-${page.id}-desc`,
                                                                        className: "sr-only",
                                                                        children: [
                                                                            "Grant access to ",
                                                                            page.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 871,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, page.id, true, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 862,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/users/page.tsx",
                                                        lineNumber: 860,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    errors.accessPages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "error-text",
                                                        role: "alert",
                                                        children: errors.accessPages
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/users/page.tsx",
                                                        lineNumber: 878,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/users/page.tsx",
                                                lineNumber: 856,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 855,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        errors.submit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "error-text form-error",
                                            role: "alert",
                                            children: errors.submit
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 886,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoadingButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    type: "submit",
                                                    className: "themed-button primary-action",
                                                    disabled: processing === -1,
                                                    loading: isActionLoading('addUser'),
                                                    loadingText: "Creating User...",
                                                    "aria-describedby": "create-user-help",
                                                    children: "✓ Create User"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: "themed-button secondary",
                                                    onClick: resetForm,
                                                    disabled: processing === -1,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            "aria-hidden": "true",
                                                            children: "✕"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 908,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 909,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 902,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 891,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            id: "create-user-help",
                                            className: "form-help",
                                            children: "All required fields must be completed to create a user account"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 912,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 757,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 755,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "users-list",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: [
                                        "Current Users (",
                                        users.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 921,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "loading-message",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Loading users..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/users/page.tsx",
                                        lineNumber: 924,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 923,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)) : users.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEmptyState,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEmptyIcon,
                                            children: "👥"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 928,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEmptyTitle,
                                            children: "No Users Found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 929,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mobileEmptyDescription,
                                            children: "Get started by adding your first user account."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 930,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/users/page.tsx",
                                    lineNumber: 927,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: (windowWidth < 640 || isMobileView) && windowWidth > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mobile-cards-container",
                                        children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserCard, {
                                                user: user
                                            }, user.id, false, {
                                                fileName: "[project]/src/app/users/page.tsx",
                                                lineNumber: 940,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/users/page.tsx",
                                        lineNumber: 938,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)) : /* Desktop Table View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `users-table-container ${windowWidth > 1200 ? '' : 'scrollable'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "users-table",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 949,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Username"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 950,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Password"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 951,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Access Pages"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 952,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Status"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 953,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Created"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 954,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                children: "Actions"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                lineNumber: 955,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/users/page.tsx",
                                                        lineNumber: 948,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 947,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: user.isEditing ? 'editing' : '',
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "edit-field",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                className: "edit-input",
                                                                                value: editData[user.id]?.name || '',
                                                                                onChange: (e)=>setEditData((prev)=>({
                                                                                            ...prev,
                                                                                            [user.id]: {
                                                                                                ...prev[user.id],
                                                                                                name: e.target.value
                                                                                            }
                                                                                        })),
                                                                                placeholder: "Enter name",
                                                                                disabled: processing === user.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 965,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            errors[`edit_name_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "error-text",
                                                                                children: errors[`edit_name_${user.id}`]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 977,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 964,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "user-info",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "user-name",
                                                                            children: user.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/users/page.tsx",
                                                                            lineNumber: 982,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 981,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 962,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "edit-field",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                className: "edit-input",
                                                                                value: editData[user.id]?.username || '',
                                                                                onChange: (e)=>setEditData((prev)=>({
                                                                                            ...prev,
                                                                                            [user.id]: {
                                                                                                ...prev[user.id],
                                                                                                username: e.target.value
                                                                                            }
                                                                                        })),
                                                                                placeholder: "Enter username",
                                                                                disabled: processing === user.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 991,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            errors[`edit_username_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "error-text",
                                                                                children: errors[`edit_username_${user.id}`]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1003,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 990,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "username",
                                                                        children: [
                                                                            "@",
                                                                            user.username
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1007,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 988,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "edit-field",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "password",
                                                                                className: "edit-input",
                                                                                value: editData[user.id]?.password || '',
                                                                                onChange: (e)=>setEditData((prev)=>({
                                                                                            ...prev,
                                                                                            [user.id]: {
                                                                                                ...prev[user.id],
                                                                                                password: e.target.value
                                                                                            }
                                                                                        })),
                                                                                placeholder: "New password",
                                                                                disabled: processing === user.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1015,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            errors[`edit_password_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "error-text",
                                                                                children: errors[`edit_password_${user.id}`]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1027,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1014,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "password-hidden",
                                                                        children: "••••••••"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1031,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 1012,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "edit-field",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectDropdown,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectInput,
                                                                                        placeholder: "Search pages...",
                                                                                        value: editData[user.id]?.accessSearch || '',
                                                                                        onChange: (e)=>setEditData((prev)=>({
                                                                                                    ...prev,
                                                                                                    [user.id]: {
                                                                                                        ...prev[user.id],
                                                                                                        accessSearch: e.target.value
                                                                                                    }
                                                                                                })),
                                                                                        disabled: processing === user.id
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1040,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectOptions,
                                                                                        children: availablePages.filter((page)=>{
                                                                                            const search = editData[user.id]?.accessSearch || '';
                                                                                            return !editData[user.id]?.accessPages?.includes(page.id) && (search === '' || page.name.toLowerCase().includes(search.toLowerCase()) || page.id.toLowerCase().includes(search.toLowerCase()));
                                                                                        }).map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectOption,
                                                                                                onClick: ()=>setEditData((prev)=>({
                                                                                                            ...prev,
                                                                                                            [user.id]: {
                                                                                                                ...prev[user.id],
                                                                                                                accessPages: [
                                                                                                                    ...prev[user.id]?.accessPages || [],
                                                                                                                    page.id
                                                                                                                ],
                                                                                                                accessSearch: ''
                                                                                                            }
                                                                                                        })),
                                                                                                children: page.name
                                                                                            }, page.id, false, {
                                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                                lineNumber: 1059,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1051,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectTags,
                                                                                        children: (editData[user.id]?.accessPages || []).map((pageId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectTag,
                                                                                                children: [
                                                                                                    availablePages.find((p)=>p.id === pageId)?.name || pageId,
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        type: "button",
                                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$users$2f$users$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].multiSelectRemove,
                                                                                                        onClick: ()=>setEditData((prev)=>({
                                                                                                                    ...prev,
                                                                                                                    [user.id]: {
                                                                                                                        ...prev[user.id],
                                                                                                                        accessPages: prev[user.id].accessPages.filter((p)=>p !== pageId)
                                                                                                                    }
                                                                                                                })),
                                                                                                        disabled: processing === user.id,
                                                                                                        children: "✕"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                                        lineNumber: 1079,
                                                                                                        columnNumber: 37
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, pageId, true, {
                                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                                lineNumber: 1077,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1075,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1039,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            errors[`edit_access_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "error-text",
                                                                                children: errors[`edit_access_${user.id}`]
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1096,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1038,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "access-tags",
                                                                        children: user.accessPages.map((pageId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "access-tag",
                                                                                children: availablePages.find((p)=>p.id === pageId)?.name || pageId
                                                                            }, pageId, false, {
                                                                                fileName: "[project]/src/app/users/page.tsx",
                                                                                lineNumber: 1102,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1100,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 1036,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `status-badge ${user.isActive ? 'active' : 'inactive'} ${processing === user.id ? 'processing' : ''}`,
                                                                        children: user.isActive ? 'Active' : 'Inactive'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                        lineNumber: 1112,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 1111,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: new Date(user.createdAt).toLocaleDateString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 1118,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "user-actions",
                                                                            children: user.isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn save-btn",
                                                                                        onClick: ()=>saveEdit(user.id),
                                                                                        title: "Save Changes",
                                                                                        disabled: processing === user.id,
                                                                                        children: processing === user.id ? '⏳' : '✓'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1125,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn cancel-btn",
                                                                                        onClick: ()=>cancelEdit(user.id),
                                                                                        title: "Cancel Edit",
                                                                                        disabled: processing === user.id,
                                                                                        children: "✕"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1133,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn toggle-btn",
                                                                                        onClick: ()=>toggleUserStatus(user.id),
                                                                                        title: user.isActive ? 'Deactivate User' : 'Activate User',
                                                                                        disabled: processing === user.id,
                                                                                        children: processing === user.id ? '⏳' : user.isActive ? '⏸️' : '▶️'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1144,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn edit-btn",
                                                                                        onClick: ()=>toggleEditMode(user.id),
                                                                                        title: "Edit User",
                                                                                        disabled: processing !== null,
                                                                                        children: "✏️"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1152,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn delete-btn",
                                                                                        onClick: ()=>deleteUser(user.id, user.name),
                                                                                        title: "Delete User",
                                                                                        disabled: processing === user.id,
                                                                                        children: processing === user.id ? '⏳' : '🗑️'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/users/page.tsx",
                                                                                        lineNumber: 1160,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/users/page.tsx",
                                                                            lineNumber: 1122,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        errors[`edit_submit_${user.id}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "error-text",
                                                                            children: errors[`edit_submit_${user.id}`]
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/users/page.tsx",
                                                                            lineNumber: 1172,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/users/page.tsx",
                                                                    lineNumber: 1121,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, user.id, true, {
                                                            fileName: "[project]/src/app/users/page.tsx",
                                                            lineNumber: 960,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/users/page.tsx",
                                                    lineNumber: 958,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/users/page.tsx",
                                            lineNumber: 946,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/users/page.tsx",
                                        lineNumber: 945,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/users/page.tsx",
                            lineNumber: 920,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/users/page.tsx",
                    lineNumber: 699,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/users/page.tsx",
            lineNumber: 693,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/users/page.tsx",
        lineNumber: 692,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(UsersPage, "SGDyAjUHHWPLpRuRqivSlVlEfAU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRequireAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLoading$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLoading"]
    ];
});
_c = UsersPage;
const __TURBOPACK__default__export__ = UsersPage;
var _c;
__turbopack_context__.k.register(_c, "UsersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d3a850f0._.js.map