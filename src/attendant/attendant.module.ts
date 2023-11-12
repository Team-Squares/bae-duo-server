import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendant as AttendantEntity } from './attendant.entity';
import { AttendantMenuInfo as AttendantMenuInfoEntity } from 'src/attendantMenuInfo/attendantMenuInfo.entity';
import { Funding as FundingEntity } from 'src/funding/funding.entity';
import { AttendantController } from './attendant.controller';
import { AttendantMenuInfoController } from 'src/attendantMenuInfo/attendantMenuInfo.controller';
import { FundingController } from 'src/funding/funding.controller';
import { AttendantService } from './attendant.service';
import { AttendantMenuInfoService } from 'src/attendantMenuInfo/attendantMenuInfo.service';
import { FundingService } from 'src/funding/funding.service';
import { Brands as BrandsEntity } from 'src/brands/brands.entity';
import { BrandsController } from 'src/brands/brands.controller';
import { BrandsService } from 'src/brands/brands.service';
import { UploadsService } from 'src/uploads/uploads.service';
import { Uploads as UploadsEntity } from 'src/uploads/uploads.entity';
import { UploadsController } from 'src/uploads/uploads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendantEntity,
      AttendantMenuInfoEntity,
      FundingEntity,
      BrandsEntity,
      UploadsEntity,
    ]),
  ],
  controllers: [
    AttendantController,
    AttendantMenuInfoController,
    FundingController,
    BrandsController,
    UploadsController,
  ],
  providers: [
    AttendantService,
    AttendantMenuInfoService,
    FundingService,
    BrandsService,
    UploadsService,
  ],
})
export class AttendantModule {}
