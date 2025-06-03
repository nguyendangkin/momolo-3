"use client";

import React, { useState } from "react";
import { Copy, Download } from "lucide-react";
import dynamic from "next/dynamic";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { toast } from "react-toastify";

const Editor = dynamic(
    () => import("react-simple-code-editor").then((mod) => mod.default),
    { ssr: false }
);

export default function ReadOnlyNotes(props: { content: string }) {
    const [fontSize, setFontSize] = useState(14);
    const [isCodeMode, setIsCodeMode] = useState(false);

    const noteContent = props?.content || "";

    const handleCopy = () => {
        navigator.clipboard.writeText(noteContent);
        toast("Copied!");
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([noteContent], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "momolo-note.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const editorBaseStyles = {
        fontSize: `${fontSize}px`,
        lineHeight: "1.75",
        minHeight: "500px",
        color: "#1f2a44",
        background: "white",
        borderRadius: "0.5rem",
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="lg:col-span-3">
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                        {/* Toolbar Section */}
                        <div className="flex flex-wrap items-center justify-between gap-y-3 sm:gap-y-4 p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                            {/* Left Side: Editor Type & Font Size */}
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                    {isCodeMode ? "Code View" : "Text View"}
                                </span>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <label className="text-xs text-gray-500 whitespace-nowrap">
                                        Font Size:
                                    </label>
                                    <select
                                        value={fontSize}
                                        onChange={(e) =>
                                            setFontSize(Number(e.target.value))
                                        }
                                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={12}>12px</option>
                                        <option value={14}>14px</option>
                                        <option value={16}>16px</option>
                                        <option value={18}>18px</option>
                                        <option value={20}>20px</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2">
                                <button
                                    onClick={handleCopy}
                                    className="cursor-pointer p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                    title="Copy"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="cursor-pointer p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                    title="Download file về máy"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() => setIsCodeMode(!isCodeMode)}
                                    className="cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
                                >
                                    {isCodeMode ? "Plain Text" : "Code Mode"}
                                </button>
                            </div>
                        </div>

                        {/* Editor Content Area */}
                        <div className="relative p-3 sm:p-6">
                            {isCodeMode ? (
                                <Editor
                                    value={noteContent}
                                    onValueChange={(code) => {}}
                                    highlight={(code) =>
                                        Prism.highlight(
                                            code,
                                            Prism.languages.javascript,
                                            "javascript"
                                        )
                                    }
                                    className="w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg font-mono min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                                    style={{
                                        ...editorBaseStyles,
                                        fontFamily:
                                            "'SF Mono', 'Menlo', 'Consolas', 'Monaco', monospace",
                                        cursor: "text",
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            !e.ctrlKey &&
                                            !e.metaKey &&
                                            e.key !== "ArrowUp" &&
                                            e.key !== "ArrowDown" &&
                                            e.key !== "ArrowLeft" &&
                                            e.key !== "ArrowRight" &&
                                            e.key !== "Home" &&
                                            e.key !== "End" &&
                                            e.key !== "PageUp" &&
                                            e.key !== "PageDown" &&
                                            e.key !== "Tab" &&
                                            !e.key.startsWith("F")
                                        ) {
                                            if (
                                                !(e.ctrlKey || e.metaKey) ||
                                                (e.key !== "c" &&
                                                    e.key !== "a" &&
                                                    e.key !== "v")
                                            ) {
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <textarea
                                    value={noteContent}
                                    onChange={() => {}}
                                    placeholder="Không có nội dung để hiển thị..."
                                    className="w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg resize-none font-sans cursor-text min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
                                    style={{
                                        ...editorBaseStyles,
                                        fontFamily:
                                            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                                    }}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            "ArrowUp",
                                            "ArrowDown",
                                            "ArrowLeft",
                                            "ArrowRight",
                                            "Home",
                                            "End",
                                            "PageUp",
                                            "PageDown",
                                            "Tab",
                                        ];

                                        if (
                                            (e.ctrlKey || e.metaKey) &&
                                            (e.key === "c" || e.key === "a")
                                        ) {
                                            return;
                                        }

                                        if (
                                            !allowedKeys.includes(e.key) &&
                                            !e.key.startsWith("F")
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="px-3 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 gap-1 sm:gap-0">
                                <span>
                                    {noteContent.length} ký tự •{" "}
                                    {noteContent.split("\n").length} dòng
                                </span>
                                <span>
                                    {isCodeMode
                                        ? "JavaScript Syntax"
                                        : "Plain Text"}{" "}
                                    • Read Only
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
