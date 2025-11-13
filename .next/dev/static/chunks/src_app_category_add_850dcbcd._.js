(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/category/add/add.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "add-module__bv7hGW__button",
  "buttonGroup": "add-module__bv7hGW__buttonGroup",
  "cancelBtn": "add-module__bv7hGW__cancelBtn",
  "categoriesList": "add-module__bv7hGW__categoriesList",
  "categoryActions": "add-module__bv7hGW__categoryActions",
  "categoryInfo": "add-module__bv7hGW__categoryInfo",
  "categoryItem": "add-module__bv7hGW__categoryItem",
  "categoryItems": "add-module__bv7hGW__categoryItems",
  "categoryName": "add-module__bv7hGW__categoryName",
  "categoryUser": "add-module__bv7hGW__categoryUser",
  "container": "add-module__bv7hGW__container",
  "deleteBtn": "add-module__bv7hGW__deleteBtn",
  "editBtn": "add-module__bv7hGW__editBtn",
  "editButtons": "add-module__bv7hGW__editButtons",
  "editInput": "add-module__bv7hGW__editInput",
  "editMode": "add-module__bv7hGW__editMode",
  "error": "add-module__bv7hGW__error",
  "form": "add-module__bv7hGW__form",
  "input": "add-module__bv7hGW__input",
  "saveBtn": "add-module__bv7hGW__saveBtn",
  "subtitle": "add-module__bv7hGW__subtitle",
  "success": "add-module__bv7hGW__success",
  "title": "add-module__bv7hGW__title",
  "viewMode": "add-module__bv7hGW__viewMode",
});
}),
"[project]/src/app/category/add/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/category/add/add.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const AddCategoryPage = ()=>{
    _s();
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (!category.trim()) {
            setError('Category name is required');
            return;
        }
        try {
            // Get current user from localStorage
            const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            console.log('Current user from storage:', currentUser); // Debug log
            const headers = {
                'Content-Type': 'application/json'
            };
            if (currentUser) {
                headers['x-user-data'] = currentUser;
                console.log('Sending user data in header:', currentUser); // Debug log
            } else {
                console.log('No user data found in storage'); // Debug log
            }
            const res = await fetch('/api/category', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    category
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
                setCategory('');
            } else {
                setError(data.error || 'Failed to add category');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };
    // Load categories from database
    const loadCategories = async ()=>{
        setLoading(true);
        try {
            const res = await fetch('/api/category');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                setError('Failed to load categories');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    // Start editing a category
    const startEdit = (id, currentValue)=>{
        setEditingId(id);
        setEditValue(currentValue);
    };
    // Cancel editing
    const cancelEdit = ()=>{
        setEditingId(null);
        setEditValue('');
    };
    // Update category
    const updateCategory = async (id)=>{
        if (!editValue.trim()) {
            setError('Category name is required');
            return;
        }
        try {
            const res = await fetch('/api/category', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    category: editValue
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCategories(categories.map((cat)=>cat.id === id ? {
                        ...cat,
                        category: editValue
                    } : cat));
                cancelEdit();
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to update category');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };
    // Delete category
    const deleteCategory = async (id, categoryName)=>{
        if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            return;
        }
        try {
            const res = await fetch(`/api/category?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCategories(categories.filter((cat)=>cat.id !== id));
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to delete category');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                children: "Category Management"
            }, void 0, false, {
                fileName: "[project]/src/app/category/add/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].form,
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "themed-input",
                        placeholder: "Enter category name",
                        value: category,
                        onChange: (e)=>setCategory(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/src/app/category/add/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "themed-button primary-action",
                                children: "Add Category"
                            }, void 0, false, {
                                fileName: "[project]/src/app/category/add/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "themed-button secondary",
                                onClick: loadCategories,
                                disabled: loading,
                                children: loading ? 'Loading...' : 'Load Categories'
                            }, void 0, false, {
                                fileName: "[project]/src/app/category/add/page.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/category/add/page.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/category/add/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/category/add/page.tsx",
                lineNumber: 161,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].success,
                children: "Operation completed successfully!"
            }, void 0, false, {
                fileName: "[project]/src/app/category/add/page.tsx",
                lineNumber: 162,
                columnNumber: 19
            }, ("TURBOPACK compile-time value", void 0)),
            categories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoriesList,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].subtitle,
                        children: [
                            "Categories (",
                            categories.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/category/add/page.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryItems,
                        children: categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryItem,
                                children: editingId === cat.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editMode,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editInput,
                                            value: editValue,
                                            onChange: (e)=>setEditValue(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/category/add/page.tsx",
                                            lineNumber: 173,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].saveBtn,
                                                    onClick: ()=>updateCategory(cat.id),
                                                    children: "✓ Save"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cancelBtn,
                                                    onClick: cancelEdit,
                                                    children: "✕ Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/category/add/page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/category/add/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].viewMode,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryInfo,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryName,
                                                    children: cat.category
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryUser,
                                                    children: [
                                                        "by ",
                                                        cat.user
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/category/add/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].categoryActions,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].editBtn,
                                                    onClick: ()=>startEdit(cat.id, cat.category),
                                                    children: "✏️ Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 201,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$category$2f$add$2f$add$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                    onClick: ()=>deleteCategory(cat.id, cat.category),
                                                    children: "🗑️ Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/category/add/page.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/category/add/page.tsx",
                                            lineNumber: 200,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/category/add/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, cat.id, false, {
                                fileName: "[project]/src/app/category/add/page.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/app/category/add/page.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/category/add/page.tsx",
                lineNumber: 166,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/category/add/page.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AddCategoryPage, "HbgETWPXTk+NE+UaZsFQ99H/1MY=");
_c = AddCategoryPage;
const __TURBOPACK__default__export__ = AddCategoryPage;
var _c;
__turbopack_context__.k.register(_c, "AddCategoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_category_add_850dcbcd._.js.map