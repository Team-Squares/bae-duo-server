import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendantMenuInfoController } from './attendantMenuInfo.controller';
import { AttendantMenuInfoService } from './attendantMenuInfo.service';
import { AttendantMenuInfo as AttendantMenuInfoEntity } from './attendantMenuInfo.entity';

import { Funding as FundingEntity } from 'src/funding/funding.entity';
import { FundingController } from 'src/funding/funding.controller';
import { FundingService } from 'src/funding/funding.service';
import { Attendant as AttendantEntity } from 'src/attendant/attendant.entity';
import { AttendantController } from 'src/attendant/attendant.controller';
import { AttendantService } from 'src/attendant/attendant.service';
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
export class AttendantMenuInfoModule {}
