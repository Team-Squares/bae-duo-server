import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAttendantDto, UpdateAttendantDto } from './attendant.dto';
import { AttendantService } from './attendant.service';
import { AttendantType } from './attendant.type';
import { AttendantMenuInfoService } from 'src/attendantMenuInfo/attendantMenuInfo.service';
import { FundingService } from 'src/funding/funding.service';

@Controller('attendant')
export class AttendantController {
  constructor(
    private attendantService: AttendantService,
    private attendantMenuInfoService: AttendantMenuInfoService,
    private fundingService: FundingService,
  ) {}

  convertStringToJSON = (string: string) => {
    const regex = /['`]/g;
    return string.replace(regex, '"');
  };

  @Post()
  async saveAttendant(@Body() sentData: CreateAttendantDto) {
    const menuInfos = JSON.parse(this.convertStringToJSON(sentData.menuInfo));
    const targetFunding = await this.fundingService.findFundingById(
      sentData.fundingId,
    );
    const result = await this.attendantService.saveAttendant(sentData);
    targetFunding['curMember'] += 1;
    menuInfos.forEach((menuInfo) => {
      menuInfo['attendantId'] = result.id;
      menuInfo['userId'] = result.userId;
      targetFunding['curPrice'] += menuInfo.menuPrice;
    });
    const putTargetFunding = await this.fundingService.updateFunding(
      targetFunding,
    );
    const createdMenuInfo =
      await this.attendantMenuInfoService.saveAttendantMenuInfo(menuInfos);
    result['menuInfo'] = createdMenuInfo;
    return result;
  }

  @Get('/')
  async findAllAttendants(): Promise<AttendantType[]> {
    return await this.attendantService.findAllAttendants();
  }

  @Get('/:attendantId')
  async findAttendantByUserId(
    @Param('attendantId') attendantId: number,
  ): Promise<AttendantType> {
    return this.attendantService.findAttendantById(attendantId);
  }

  @Get('/fundingId/:fundingId')
  async findAttendantsByFundingId(
    @Param('fundingId') fundingId: number,
  ): Promise<AttendantType[]> {
    return this.attendantService.findAttendantsByFundingId(fundingId);
  }

  // TODO patch 로직 짜기
  @Put('/')
  async updateAttendant(
    @Body() newAttendantData: UpdateAttendantDto,
  ): Promise<AttendantType> {
    const menuInfos = JSON.parse(
      this.convertStringToJSON(newAttendantData.menuInfo),
    );
    return this.attendantService.updateAttendant(newAttendantData, menuInfos);
  }

  @Delete('/:id')
  deleteAttendantById(@Param('id') id: number): Promise<number> {
    return this.attendantService.deleteAttendant(id);
  }
}
