import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePayDto } from './dto/create-pay.dto';
import { Pay } from 'src/pays/entities/pay.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import PayOS = require('@payos/node');
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { GetDonorsDto } from 'src/pays/dto/get-donors.dto';

// Đánh dấu class là một service của NestJS, cho phép inject vào các thành phần khác
@Injectable()
export class PaysService {
  // Inject repository của Pay và ConfigService để thao tác với database và truy cập cấu hình
  constructor(
    @InjectRepository(Pay)
    private readonly paysRepository: Repository<Pay>,
    private readonly configService: ConfigService,
  ) {}

  // Phương thức tạo link thanh toán cho một khoản donate
  async create(data: CreatePayDto) {
    try {
      const clientId = this.configService.get<string>('PAYOS_CLIENT_ID');
      const apiKey = this.configService.get<string>('PAYOS_API_KEY');
      const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');

      if (!clientId || !apiKey || !checksumKey) {
        throw new Error('Thiếu cấu hình PayOS trong biến môi trường');
      }

      const payos = new PayOS(clientId, apiKey, checksumKey);

      const requestData: IRequestData = {
        orderCode: Date.now() + Math.floor(Math.random() * 1000),
        amount: data.money,
        description: 'Donate To Website',
        cancelUrl: `${this.configService.get<string>('FRONT_END_DOMAIN')}/donate`,
        returnUrl: `${this.configService.get<string>('FRONT_END_DOMAIN')}/donate`,
      };

      const paymentLinkData = await payos.createPaymentLink(requestData);

      // Tìm bản ghi dựa trên username
      const existingUser = await this.paysRepository.findOne({
        where: { username: data.username },
      });

      let result;
      if (!existingUser) {
        // Tạo bản ghi mới nếu không tìm thấy
        const newUser = this.paysRepository.create({
          username: data.username,
          money: data.money,
          totalDonations: 0,
          donationCount: 0,
          status: paymentLinkData.status,
          paymentLinkId: paymentLinkData.paymentLinkId,
          amount: paymentLinkData.amount,
          orderCode: requestData.orderCode,
        });
        result = await this.paysRepository.save(newUser);
      } else {
        // Cập nhật bản ghi hiện có
        existingUser.money = data.money;
        existingUser.status = paymentLinkData.status;
        existingUser.paymentLinkId = paymentLinkData.paymentLinkId;
        existingUser.amount = paymentLinkData.amount;
        existingUser.orderCode = requestData.orderCode;
        result = await this.paysRepository.save(existingUser);
      }

      if (!result) {
        throw new BadRequestException('Không lưu được vào Database');
      }

      return {
        checkoutUrl: paymentLinkData.checkoutUrl,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi Donate: ' + error.message);
    }
  }

  async receiveHook(data) {
    try {
      const hookData = data?.data || data;

      if (!hookData.paymentLinkId && !hookData.orderCode) {
        console.warn('Webhook test/gửi thiếu thông tin. Bỏ qua.');
        return {
          success: false,
          message: 'Thiếu thông tin để xử lý (có thể chỉ là ping test)',
        };
      }

      const paymentRecord = await this.paysRepository.findOne({
        where: [
          { paymentLinkId: hookData.paymentLinkId },
          { orderCode: hookData.orderCode },
        ],
      });

      if (!paymentRecord) {
        console.warn('Không tìm thấy bản ghi tương ứng', hookData);
        return {
          success: false,
          message: 'Không tìm thấy bản ghi thanh toán',
        };
      }

      // Tìm bản ghi duy nhất dựa trên username
      const userRecord = await this.paysRepository.findOne({
        where: { username: paymentRecord.username },
      });

      if (!userRecord) {
        return {
          success: false,
          message: 'Không tìm thấy bản ghi người dùng',
        };
      }

      if (
        data.code === '00' &&
        hookData.paymentLinkId === paymentRecord.paymentLinkId &&
        hookData.amount === paymentRecord.amount
      ) {
        if (userRecord.status !== 'PAID') {
          userRecord.totalDonations += paymentRecord.money;
          userRecord.donationCount += 1;
          userRecord.status = 'PAID';
          userRecord.transactionDateTime = hookData.transactionDateTime;
          userRecord.reference = hookData.reference;

          await this.paysRepository.save(userRecord);

          // Xóa bản ghi tạm nếu nó không cần thiết
          if (userRecord.id !== paymentRecord.id) {
            await this.paysRepository.delete(paymentRecord.id);
          }

          return {
            success: true,
            message: 'Xử lý thanh toán thành công',
          };
        } else {
          userRecord.totalDonations += paymentRecord.money;
          userRecord.donationCount += 1;
          await this.paysRepository.save(userRecord);

          // Xóa bản ghi tạm
          if (userRecord.id !== paymentRecord.id) {
            await this.paysRepository.delete(paymentRecord.id);
          }

          return {
            success: true,
            message: 'Thanh toán đã được xử lý và cộng dồn',
          };
        }
      } else {
        userRecord.status = 'FAILED';
        await this.paysRepository.save(userRecord);

        return {
          success: false,
          message: 'Thanh toán thất bại hoặc bị hủy',
        };
      }
    } catch (error) {
      console.error('Lỗi trong receiveHook:', error);
      return {
        success: false,
        message: 'Lỗi nội bộ khi xử lý webhook',
      };
    }
  }

  // Phương thức lấy danh sách donors với phân trang và thống kê
  async findAll(query: GetDonorsDto): Promise<PaginatedDonorsResponse> {
    try {
      // Xử lý tham số phân trang, đảm bảo page >= 1 và limit trong khoảng [1, 100]
      const page = Math.max(1, query.page || 1);
      const limit = Math.min(100, Math.max(1, query.limit || 10));
      const skip = (page - 1) * limit;

      // Lấy danh sách donors đã thanh toán thành công, sắp xếp theo thời gian tạo (ASC)
      const [donors, totalItems] = await this.paysRepository.findAndCount({
        where: [{ status: 'PAID' }, { donationCount: Not(0) }], // Chỉ lấy bản ghi có trạng thái PAID và donationCount != 0
        select: [
          'id',
          'username',
          'totalDonations',
          'donationCount',
          'createdAt',
          'updatedAt',
        ], // Chỉ lấy các trường cần thiết
        order: {
          createdAt: 'ASC', // Sắp xếp theo thời gian tạo (donate trước lên đầu)
        },
        skip, // Bỏ qua số bản ghi theo phân trang
        take: limit, // Giới hạn số bản ghi mỗi trang
      });

      // Tính toán thông tin phân trang
      const totalPages = Math.ceil(totalItems / limit);
      const hasNext = page < totalPages; // Có trang tiếp theo không
      const hasPrev = page > 1; // Có trang trước đó không

      // Tính toán thống kê (số lượng donors, số lần donate, tổng số tiền)
      const summaryQuery = await this.paysRepository
        .createQueryBuilder('pays')
        .select('COUNT(DISTINCT pays.id)', 'totalDonors') // Đếm số donors duy nhất
        .addSelect('SUM(pays.donationCount)', 'totalDonationsCount') // Tổng số lần donate
        .addSelect('SUM(pays.totalDonations)', 'totalAmountCount') // Tổng số tiền donate
        .where(
          'pays.status = :status OR pays.donationCount != :donationCount',
          {
            status: 'PAID',
            donationCount: 0,
          },
        )
        .getRawOne();

      // Chuẩn hóa dữ liệu thống kê
      const summary = {
        totalDonors: parseInt(summaryQuery.totalDonors) || 0,
        totalDonationsCount: parseInt(summaryQuery.totalDonationsCount) || 0,
        totalAmountCount: parseFloat(summaryQuery.totalAmountCount) || 0,
      };

      // Trả về kết quả với danh sách donors, thông tin phân trang và thống kê
      return {
        data: donors.map((donor, index) => ({
          ...donor,
          // Có thể thêm số thứ tự nếu cần
          // rank: skip + index + 1,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNext,
          hasPrev,
        },
        summary,
      };
    } catch (error) {
      // Ghi log lỗi và ném ngoại lệ
      console.error('Lỗi trong findAll:', error);
      throw new BadRequestException(
        'Lỗi khi lấy danh sách donors: ' + error.message,
      );
    }
  }
}
