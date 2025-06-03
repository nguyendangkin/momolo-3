interface IRequestData {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
  signature?: string;
  items?: { name: string; quantity: number; price: number }[];
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  expiredAt?: number;
}

interface DonorResponse {
  id: number;
  username: string;
  totalDonations: number;
  donationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedDonorsResponse {
  data: DonorResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalDonors: number;
    totalDonationsCount: number;
    totalAmountCount: number;
  };
}
