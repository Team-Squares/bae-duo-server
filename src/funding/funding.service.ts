import { Injectable } from '@nestjs/common';
import { Funding } from './funding.model';
import { CreateFundingDto } from './dto/create-funding.dto';
import { v1 as uuid } from 'uuid';

@Injectable()
export class FundingService {
  private funding: Funding[] = [];

  getAllFundings(): Funding[] {
    return this.funding;
  }

  createFunding(createFundingDto: CreateFundingDto) {
    const {
      brand,
      deadline,
      min_member,
      cur_price,
      starter,
      total_price,
      status,
    } = createFundingDto;
    const funding: Funding = {
      id: uuid(),
      starter,
      brand,
      total_price,
      cur_price,
      deadline,
      min_member,
      status,
      cur_member: 0,
    };
    this.funding.push(funding);
    return funding;
  }

  getFundingById(id: string): Funding {
    return this.funding.find((funding) => funding.id === id);
  }

  deletefunding(id: string): void {
    this.funding = this.funding.filter((funding) => funding.id !== id);
  }
}
