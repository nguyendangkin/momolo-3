interface INote {
    content: string;
}

type HeaderProps = {
    initIsSharing: boolean;
};

// Types based on your API response
interface Donor {
    id: number;
    username: string;
    totalDonations: number;
    donationCount: number;
    createdAt: string;
    updatedAt: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface SummaryInfo {
    totalDonors: number;
    totalDonationsCount: number;
    totalAmountCount: number;
}

interface ApiData {
    data: Donor[];
    pagination: PaginationInfo;
    summary: SummaryInfo;
}

// Pagination component
type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
};
