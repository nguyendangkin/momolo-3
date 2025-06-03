"use client"; // Chỉ định đây là Client Component trong Next.js

import React, { useEffect, useState, useCallback } from "react";
import { Heart, Users, Gift } from "lucide-react"; // Import các biểu tượng từ thư viện Lucide
import { getAllDonates, submitDonation } from "@/actions/actions"; // Import các hàm action để lấy danh sách donate và gửi donate
import { toast } from "react-toastify"; // Import thư viện thông báo toast

// Component phân trang để hiển thị và điều hướng các trang danh sách donors
const Pagination: React.FC<PaginationProps> = ({
    currentPage, // Trang hiện tại
    totalPages, // Tổng số trang
    onPageChange, // Hàm xử lý khi thay đổi trang
    loading = false, // Trạng thái đang tải
}) => {
    // Hàm tạo danh sách các trang hiển thị (bao gồm dấu "..." nếu cần)
    const getVisiblePages = () => {
        const delta = 2; // Khoảng cách tối đa từ trang hiện tại đến các trang hiển thị
        const range = []; // Mảng lưu các số trang
        const rangeWithDots = []; // Mảng lưu các số trang và dấu "..."

        // Luôn thêm trang đầu tiên
        range.push(1);

        // Thêm các trang xung quanh trang hiện tại
        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        // Thêm trang cuối cùng nếu tổng số trang > 1
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Loại bỏ trùng lặp và sắp xếp
        const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

        // Thêm dấu "..." vào giữa các trang không liền kề
        for (let i = 0; i < uniqueRange.length; i++) {
            if (i > 0 && uniqueRange[i] - uniqueRange[i - 1] > 1) {
                rangeWithDots.push("...");
            }
            rangeWithDots.push(uniqueRange[i]);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages(); // Lấy danh sách trang hiển thị

    return (
        // Giao diện phân trang với các nút điều hướng
        <div className="flex items-center justify-center space-x-2 mt-12">
            {/* Nút "Trước" để chuyển về trang trước */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading} // Vô hiệu hóa nếu đang ở trang đầu hoặc đang tải
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Trước
            </button>

            {/* Hiển thị các nút trang hoặc dấu "..." */}
            {visiblePages.map((page, index) =>
                page === "..." ? (
                    <span
                        key={`dots-${index}`}
                        className="px-2 py-2 text-gray-400"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        disabled={loading} // Vô hiệu hóa khi đang tải
                        className={`w-8 h-8 text-sm transition-colors duration-200 ${
                            currentPage === page
                                ? "bg-gray-900 text-white" // Trang hiện tại có nền đen
                                : "text-gray-500 hover:text-gray-700"
                        } disabled:opacity-50`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Nút "Sau" để chuyển sang trang tiếp theo */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading} // Vô hiệu hóa nếu đang ở trang cuối hoặc đang tải
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                Sau
            </button>
        </div>
    );
};

// Component chính để hiển thị giao diện donate
export default function Donate() {
    // Khai báo các state để quản lý dữ liệu form và danh sách donors
    const [displayName, setDisplayName] = useState(""); // Tên hiển thị của người donate
    const [donationAmount, setDonationAmount] = useState(""); // Số tiền donate
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [data, setData] = useState<ApiData | null>(null); // Dữ liệu từ API
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi form
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState<string | null>(null); // Lỗi nếu có

    // Hàm lấy danh sách donate từ API
    const fetchDonations = useCallback(
        async (page: number, limit: number = 10) => {
            try {
                setLoading(true); // Bật trạng thái tải
                setError(null); // Xóa lỗi cũ
                const result = await getAllDonates(page, limit); // Gọi API lấy danh sách donate

                if (result.error) {
                    setError(result.error); // Lưu lỗi nếu có
                    return;
                }

                setData(result); // Lưu dữ liệu từ API
            } catch (err) {
                // Xử lý lỗi khi gọi API
                setError("Không thể tải dữ liệu. Vui lòng thử lại.");
                console.error("Error fetching donations:", err);
            } finally {
                setLoading(false); // Tắt trạng thái tải
            }
        },
        []
    );

    // Gọi hàm fetchDonations khi component được mount
    useEffect(() => {
        fetchDonations(1); // Lấy dữ liệu trang đầu tiên
    }, [fetchDonations]);

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = useCallback(
        (page: number) => {
            if (page === currentPage || loading) return; // Không làm gì nếu đang ở trang hiện tại hoặc đang tải

            setCurrentPage(page); // Cập nhật trang hiện tại
            fetchDonations(page); // Tải dữ liệu trang mới

            // Cuộn lên đầu danh sách
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [currentPage, loading, fetchDonations]
    );

    // Hàm định dạng số tiền nhập vào (thêm dấu chấm phân cách)
    const formatNumberInput = (value: string): string => {
        // Loại bỏ tất cả ký tự không phải số
        const numbers = value.replace(/\D/g, "");
        // Thêm dấu chấm phân cách mỗi 3 chữ số
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Hàm định dạng số tiền thành tiền tệ VNĐ
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Xử lý gửi form donate
    const handleSubmit = async () => {
        if (!displayName.trim() || !donationAmount.trim()) return; // Không gửi nếu thiếu thông tin

        setIsSubmitting(true); // Bật trạng thái gửi

        try {
            const result = await submitDonation(
                displayName.trim(),
                parseFloat(donationAmount.replace(/\./g, "")) // Loại bỏ dấu chấm để parse số tiền
            );

            if (result?.checkoutUrl) {
                // Reset form sau khi gửi thành công
                setDisplayName("");
                setDonationAmount("");

                // Làm mới dữ liệu để hiển thị donate mới
                await fetchDonations(1);
                setCurrentPage(1);
                window.location.href = result.checkoutUrl; // Chuyển hướng đến link thanh toán
            }
        } catch (error) {
            // Xử lý lỗi khi gửi donate
            console.error("Error submitting donation:", error);
            toast("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false); // Tắt trạng thái gửi
        }
    };

    // Trạng thái đang tải (hiển thị spinner khi chưa có dữ liệu)
    if (loading && !data) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Trạng thái lỗi (hiển thị thông báo lỗi nếu không có dữ liệu)
    if (error && !data) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchDonations(currentPage)}
                        className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors duration-200"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Kiểm tra nếu không có dữ liệu
    if (!data) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-gray-600" />
                        </div>
                        <h1 className="text-3xl font-light text-gray-900 mb-3">
                            Ủng Hộ
                        </h1>
                        <p className="text-gray-500 text-lg font-light">
                            Cảm ơn bạn đã đồng hành cùng chúng tôi
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Thống kê */}
                <div className="grid grid-cols-3 gap-8 mb-16">
                    {/* Số người ủng hộ */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-2xl font-light text-gray-900 mb-1">
                            {data.summary.totalDonors.toLocaleString("vi-VN")}
                        </div>
                        <div className="text-sm text-gray-500">
                            Người ủng hộ
                        </div>
                    </div>

                    {/* Số lượt ủng hộ */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-2xl font-light text-gray-900 mb-1">
                            {data.summary.totalDonationsCount.toLocaleString(
                                "vi-VN"
                            )}
                        </div>
                        <div className="text-sm text-gray-500">Lượt ủng hộ</div>
                    </div>

                    {/* Tổng số tiền */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-2xl font-light text-gray-900 mb-1">
                            {formatCurrency(data.summary.totalAmountCount)}
                        </div>
                        <div className="text-sm text-gray-500">
                            Tổng số tiền
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Form gửi donate */}
                    <div>
                        <h2 className="text-xl font-light text-gray-900 mb-8">
                            Gửi lời ủng hộ
                        </h2>

                        <div className="space-y-6">
                            {/* Trường nhập tên hiển thị */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-3 font-light">
                                    Tên hiển thị
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                    placeholder="Nhập tên của bạn"
                                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 focus:outline-none focus:border-gray-400 transition-colors duration-200 text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            {/* Trường nhập số tiền */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-3 font-light">
                                    Số tiền ủng hộ
                                </label>
                                <input
                                    type="text" // Sử dụng text để hỗ trợ định dạng số
                                    value={donationAmount}
                                    onChange={(e) => {
                                        const formatted = formatNumberInput(
                                            e.target.value
                                        );
                                        setDonationAmount(formatted);
                                    }}
                                    placeholder="Nhập số tiền"
                                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 focus:outline-none focus:border-gray-400 transition-colors duration-200 text-gray-900 placeholder-gray-400"
                                />
                            </div>

                            {/* Nút gửi donate */}
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting ||
                                    !displayName.trim() ||
                                    !donationAmount.trim()
                                } // Vô hiệu hóa khi đang gửi hoặc thiếu thông tin
                                className="w-full mt-8 bg-gray-900 text-white font-light py-4 px-8 hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                        Đang gửi...
                                    </div>
                                ) : (
                                    "Gửi ủng hộ"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Danh sách donors */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-light text-gray-900">
                                Danh sách ủng hộ
                            </h2>
                            {loading && (
                                <div className="w-4 h-4 border border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                            )}
                        </div>

                        {/* Hiển thị thông báo lỗi nếu có */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Hiển thị khi chưa có donate */}
                            {data.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">
                                        Chưa có ai ủng hộ
                                    </p>
                                </div>
                            ) : (
                                // Hiển thị danh sách donors
                                data.data.map((donor) => (
                                    <div
                                        key={donor.id}
                                        className="flex items-center justify-between py-4 border-b border-gray-50 last:border-b-0"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                                                <span className="text-gray-600 font-light text-xs">
                                                    #{donor.id}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-light text-gray-900 capitalize">
                                                    {donor.username}
                                                </div>
                                                <div className="text-sm text-gray-500 font-light">
                                                    {formatDate(
                                                        donor.createdAt
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-light text-gray-900">
                                                {formatCurrency(
                                                    donor.totalDonations
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 font-light">
                                                {donor.donationCount} lượt
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Hiển thị phân trang nếu có nhiều hơn 1 trang */}
                        {data.pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={data.pagination.currentPage}
                                totalPages={data.pagination.totalPages}
                                onPageChange={handlePageChange}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
