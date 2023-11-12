import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill as BillEntity } from './bill.entity';
import { AttendantModule } from 'src/attendant/attendant.module';
import { AttendantMenuInfo as AttendantMenuInfoEntity } from 'src/attendantMenuInfo/attendantMenuInfo.entity';
import { Attendant as AttendantEntity } from 'src/attendant/attendant.entity';
import { AttendantController } from 'src/attendant/attendant.controller';
import { AttendantMenuInfoController } from 'src/attendantMenuInfo/attendantMenuInfo.controller';
import { AttendantService } from 'src/attendant/attendant.service';
import { AttendantMenuInfoService } from 'src/attendantMenuInfo/attendantMenuInfo.service';
import { Funding as FundingEntity } from 'src/funding/funding.entity';
import { FundingController } from 'src/funding/funding.controller';
import { FundingService } from 'src/funding/funding.service';
import { Brands as BrandsEntity } from 'src/brands/brands.entity';
import { BrandsController } from 'src/brands/brands.controller';
import { BrandsService } from 'src/brands/brands.service';
import { UploadsService } from 'src/uploads/uploads.service';
import { Uploads as UploadsEntity } from 'src/uploads/uploads.entity';
import { UploadsController } from 'src/uploads/uploads.controller';

@Module({
  imports: [
    AttendantModule,
    TypeOrmModule.forFeature([
      BillEntity,
      AttendantEntity,
      AttendantMenuInfoEntity,
      FundingEntity,
      BrandsEntity,
      UploadsEntity,
    ]),
  ],
  controllers: [
    BillController,
    AttendantController,
    AttendantMenuInfoController,
    FundingController,
    BrandsController,
    UploadsController,
  ],
  providers: [
    BillService,
    AttendantService,
    AttendantMenuInfoService,
    FundingService,
    BrandsService,
    UploadsService,
  ],
})
export class BillModule {}
