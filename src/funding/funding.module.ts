import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from './funding.entity';
import { Brands } from 'src/brands/brands.entity';
import { Uploads } from 'src/uploads/uploads.entity';
import { UploadsController } from 'src/uploads/uploads.controller';
import { UploadsService } from 'src/uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, Brands, Uploads])],
  controllers: [FundingController, UploadsController],
  providers: [FundingService, UploadsService],
})
export class FundingModule {}
