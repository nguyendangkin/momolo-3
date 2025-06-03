export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="text-center text-gray-400 text-xs font-medium tracking-tight space-y-2">
                    <p>
                        © 2025 MOMOLO NOTE • Phát triển bởi{" "}
                        <span className="hover:text-gray-600 transition-colors duration-200">
                            ongchin
                        </span>
                    </p>
                    <p>
                        Liên hệ:{" "}
                        <a
                            href="kinnguyendang@gmail.com"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 underline"
                        >
                            kinnguyendang@gmail.com
                        </a>{" "}
                    </p>
                        <p>
                        <a
                            href="https://momolo.io.vn/donate/"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 underline"
                        >
                            kinnguyendang@gmail.com
                        </a>{" "}
                    </p>
                </div>
            </div>
        </footer>
    );
}
