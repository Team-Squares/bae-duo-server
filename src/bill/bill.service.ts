import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill as BillEntity } from './bill.entity';
import { CreateBillDto } from './bill.dto';
import { Repository } from 'typeorm';
import { billType, priceInfoType } from './biil.type';
import { AttendantService } from 'src/attendant/attendant.service';
import { AttendantType } from 'src/attendant/attendant.type';
import { FundingService } from 'src/funding/funding.service';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(BillEntity)
    private billRepository: Repository<BillEntity>,
    private attendantService: AttendantService,
    private fundingService: FundingService,
  ) {}

  async saveBill(sentData: CreateBillDto): Promise<BillEntity> {
    const instance = await this.billRepository.save(sentData);
    if (!instance) throw new NotFoundException(`주문서를 생성할 수 없습니다.`);
    return instance;
  }

  async findAllBills(): Promise<billType[]> {
    const bills = await this.billRepository.find();

    const billsWithPriceInfos: billType[] = await Promise.all(
      bills.map(async (bill) => {
        const attendants =
          await this.attendantService.findAttendantsByFundingId(bill.fundingId);
        return {
          ...bill,
          priceInfo: this.getPriceInfoFromAttendants(bill, attendants),
        };
      }),
    );
    if (!billsWithPriceInfos)
      throw new NotFoundException(`주문서를 찾을 수 없습니다.`);
    return billsWithPriceInfos;
  }

  async findBillById(id: number): Promise<billType> {
    const bill = await this.billRepository.findOne({ where: { id } });
    const attendants = await this.attendantService.findAttendantsByFundingId(
      bill.fundingId,
    );
    const billWithPriceInfo: billType = {
      ...bill,
      priceInfo: this.getPriceInfoFromAttendants(bill, attendants),
    };
    if (!billWithPriceInfo)
      throw new NotFoundException(`주문서를 찾을 수 없습니다.`);
    return billWithPriceInfo;
  }

  async findBillByfundingId(fundingId: number): Promise<billType> {
    const bill = await this.billRepository.findOne({ where: { fundingId } });
    const attendants = await this.attendantService.findAttendantsByFundingId(
      fundingId,
    );
    const billWithPriceInfo: billType = {
      ...bill,
      priceInfo: this.getPriceInfoFromAttendants(bill, attendants),
    };
    if (!billWithPriceInfo)
      throw new NotFoundException(`주문서를 찾을 수 없습니다.`);
    return billWithPriceInfo;
  }

  async deleteBillById(id: number): Promise<number> {
    const targetFundingId = (
      await this.billRepository.findOne({
        where: { id },
      })
    ).fundingId;
    const affectedRowsCnt = (await this.billRepository.delete(id)).affected;
    if (affectedRowsCnt === 0)
      throw new NotFoundException(`삭제할 주문서를 찾을 수 없습니다.`);
    await this.fundingService.deleteFundingById(targetFundingId);
    const targetAttendants =
      await this.attendantService.findAttendantsByFundingId(targetFundingId);
    targetAttendants.forEach(async (attendant) => {
      await this.attendantService.deleteAttendant(attendant.id);
    });
    return HttpStatus.ACCEPTED;
  }

  async deleteBillByFundingId(fundingId: number): Promise<number> {
    const targetBill = await this.billRepository.findOne({
      where: { fundingId },
    });
    const affectedRowsCnt = (await this.billRepository.delete(targetBill.id))
      .affected;
    if (affectedRowsCnt === 0)
      throw new NotFoundException(`삭제할 주문서를 찾을 수 없습니다.`);
    await this.fundingService.deleteFundingById(fundingId);
    const targetAttendants =
      await this.attendantService.findAttendantsByFundingId(fundingId);
    targetAttendants.forEach(async (attendant) => {
      await this.attendantService.deleteAttendant(attendant.id);
    });
    return HttpStatus.ACCEPTED;
  }

  getPriceInfoFromAttendants(
    bill: BillEntity,
    attendants: AttendantType[],
  ): priceInfoType[] {
    const priceInfo: priceInfoType[] = attendants.map((attendant) => {
      const totalMenuPrice = attendant.menuInfo.reduce(
        (acc, cur) => acc + cur.menuPrice,
        0,
      );
      const deliveryFeeByPerson = bill.deliveryFee / attendants.length;
      return {
        userId: attendant.userId,
        userName: attendant.userName,
        totalPrice: totalMenuPrice + deliveryFeeByPerson,
        hasPaid: attendant.hasPaid,
      };
    });
    return priceInfo;
  }
}
