"use client";

import React, { useState, useEffect } from "react";
import { Share2, CirclePlus, Forward } from "lucide-react";
import { useAppContext } from "@/utils/AppContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Header({ initIsSharing }: HeaderProps) {
    const pathname = usePathname();
    const { triggerAction } = useAppContext();
    const [isSharing, setIsSharing] = useState(initIsSharing);

    useEffect(() => {
        setIsSharing(pathname.startsWith("/notes/"));
    }, [pathname]);

    const handleSaveAndShare = () => {
        triggerAction("handleSaveAndShare");
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast("Share link copied");
        } catch (error) {
            toast("Share link copied failed");
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight cursor-pointer hover:text-gray-700 transition-colors duration-200">
                            <Link href={"/"}>MOMOLO NOTE</Link>
                        </h1>
                        <div className="hidden md:flex items-center">
                            <span className="text-sm text-gray-500">
                                <Link href={"/donate"}>Ủng Hộ</Link>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Link
                            href={"/"}
                            className="cursor-pointer px-3 sm:px-4 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center sm:space-x-2 text-xs sm:text-sm font-medium"
                        >
                            <CirclePlus size={16} />
                            <span className="hidden sm:inline">New Note</span>
                        </Link>

                        {isSharing ? (
                            <button
                                onClick={handleShare}
                                className="cursor-pointer px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center sm:space-x-2 text-xs sm:text-sm font-medium"
                            >
                                <Forward size={16} />
                                <span className="hidden sm:inline">
                                    Share Link
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveAndShare}
                                className="cursor-pointer px-3 sm:px-4 py-1.5 bg-green-900 text-white rounded-md hover:bg-green-800 transition-colors duration-200 flex items-center justify-center sm:space-x-2 text-xs sm:text-sm font-medium"
                            >
                                <Share2 size={16} />
                                <span className="hidden sm:inline">
                                    Save to Share
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
