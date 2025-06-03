"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const isSharing = pathname.startsWith("/notes/");
    return <Header initIsSharing={isSharing} />;
}
