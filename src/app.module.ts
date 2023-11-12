import { Module } from '@nestjs/common';
import { FundingModule } from './funding/funding.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySqlConfigModule } from './db/config.module';
import { MySqlConfigService } from './db/config.service';
import { BillModule } from './bill/bill.module';
import { AttendantModule } from './attendant/attendant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { AttendantMenuInfoModule } from './attendantMenuInfo/attendantMenuInfo.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    FundingModule,
    BillModule,
    AttendantModule,
    UserModule,
    BrandsModule,
    UploadsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    TypeOrmModule.forRootAsync({
      imports: [MySqlConfigModule],
      useClass: MySqlConfigService,
      inject: [MySqlConfigService],
    }),
    AuthModule,
    AttendantMenuInfoModule,
  ],
})
export class AppModule {}
