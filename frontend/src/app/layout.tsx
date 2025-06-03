import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppContextProvider } from "@/utils/AppContext";
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer";
import HeaderWrapper from "@/components/HeaderWrapper";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Momolo Note - Ghi Chú Nhanh Online",
    description:
        "Ứng dụng ghi chú Momolo Note nhanh online, dễ sử dụng, hỗ trợ lưu trữ và chia sẻ ghi chú mọi lúc, mọi nơi. Nhẹ nhàng, sạch, sáng và thanh lịch.",
    keywords: [
        "ghi chú nhanh momolo Note",
        "momolo Note note online",
        "momolo note",
        "momolo",
        "ứng dụng ghi chú momolo Note",
        "lưu trữ ghi chú momolo Note",
    ],
    openGraph: {
        title: "Momolo Note - Ghi Chú Nhanh Online",
        description: "Ứng dụng ghi chú nhanh, lưu trữ và chia sẻ dễ dàng!",
        url: "https://momolo.io.vn/",
        type: "website",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
                width: 800,
                height: 600,
                alt: "Logo Momolo Note",
            },
        ],
    },

    robots: "index, follow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AppContextProvider>
                    <NextTopLoader />
                    <ToastContainer
                        position="top-center"
                        autoClose={1200}
                        hideProgressBar
                        closeOnClick
                        pauseOnHover={false}
                        closeButton={false}
                        draggable={false}
                        toastClassName="toast-mini"
                    />
                    <HeaderWrapper />
                    {children}
                    <Footer />
                </AppContextProvider>
            </body>
        </html>
    );
}
