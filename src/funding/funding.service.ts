import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from './funding.entity';
import { Brands } from 'src/brands/brands.entity';
import { Repository } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { SearchFundingDto } from './dto/search-funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,
    @InjectRepository(Brands)
    private brandRepository: Repository<Brands>,
    private uploadsService: UploadsService,
  ) {}

  // 1. Create
  async saveFunding(
    sentData: CreateFundingDto,
    files: Express.Multer.File[],
  ): Promise<Funding> {
    const targetBrand = await this.brandRepository.findOne({
      where: { id: sentData.brandId },
    });

    if (!targetBrand) {
      throw new NotFoundException(`선택한 브랜드는 없는 브랜드입니다.`);
    }

    const createdFunding = await this.fundingRepository.save({
      ...sentData,
      brandId: targetBrand.id,
    });

    console.log(createdFunding);

    if (!createdFunding)
      throw new NotFoundException(`펀딩을 생성할 수 없습니다.`);

    // 파일 업로드
    if (files?.length > 0) {
      for (let i = 0; i < files?.length; i++) {
        await this.uploadsService.uploadFileWithFundingId(
          files[i],
          createdFunding.id,
        );
      }
    }

    return createdFunding;
  }

  // 2. Read
  async findFundingById(id: number): Promise<Funding> {
    const funding = await this.fundingRepository.findOne({ where: { id } });
    if (!funding)
      throw new NotFoundException(`펀딩을 찾을 수 없습니다. : ${id}`);
    return funding;
  }

  async findFundingResById(id: number) {
    const funding = await this.fundingRepository.findOne({
      where: { id },
      relations: ['brands', 'user', 'uploads'],
    });
    if (!funding)
      throw new NotFoundException(`펀딩을 찾을 수 없습니다. : ${id}`);

    return {
      id: funding.id,
      starterId: funding.user.id,
      starter: funding.user.name,
      brandId: funding.brandId,
      brand: funding.brands.name,
      brandImage: funding.brands.uploads?.url || null,
      minPrice: funding.minPrice,
      curPrice: funding.curPrice,
      minMember: funding.minMember,
      curMember: funding.curMember,
      deadline: funding.deadline,
      status: funding.status,
      description: funding.description,
      menuImages: funding.uploads.map((img) => ({
        id: img.id,
        url: img.url,
      })),
      createdAt: funding.createdAt,
    };
  }

  async findAllFundings(query: SearchFundingDto) {
    const fundings = query?.status
      ? await this.fundingRepository.find({
          where: {
            status: query.status,
          },
          order: {
            createdAt: 'DESC',
          },
          relations: ['brands', 'user', 'uploads'],
        })
      : await this.fundingRepository.find({
          order: {
            createdAt: 'DESC',
          },
          relations: ['brands', 'user', 'uploads'],
        });

    if (!fundings) throw new NotFoundException(`펀딩을 불러올 수 없습니다.`);

    return fundings.map((funding) => ({
      id: funding.id,
      starterId: funding.user.id,
      starter: funding.user.name,
      brandId: funding.brandId,
      brand: funding.brands?.name || null,
      brandImage: funding.brands?.uploads?.url || null,
      minPrice: funding.minPrice,
      curPrice: funding.curPrice,
      minMember: funding.minMember,
      curMember: funding.curMember,
      deadline: funding.deadline,
      status: funding.status,
      description: funding.description,
      createdAt: funding.createdAt,
    }));
  }

  // 3. Updata
  async updateFunding(id: number, newFunding: UpdateFundingDto): Promise<void> {
    const funding = await this.fundingRepository.findOne({
      where: { id },
    });

    if (!funding) {
      throw new NotFoundException(`펀딩을 찾을 수 없습니다. : ${id}`);
    }
    if (funding.status !== 1) {
      throw new NotFoundException('펀딩은 진행 중일 때만 수정이 가능합니다.');
    }
    // if (funding.starter !== newFunding.starter) {
    //   throw new NotFoundException('펀딩을 만든 사용자만 수정할 수 있습니다.');
    // }

    const targetBarnd = await this.brandRepository.findOne({
      where: { id: newFunding.brandId },
    });

    if (!targetBarnd) {
      throw new NotFoundException(`선택한 브랜드는 없는 브랜드입니다.`);
    }

    if (funding.brandId !== newFunding.brandId) {
      newFunding.brandId = targetBarnd.id;
      newFunding.brand = targetBarnd.name;
    }

    await this.fundingRepository.update(id, newFunding);
  }

  // 4. Delete
  async deleteFundingById(id: number): Promise<number> {
    const affectedRowsCnt = (await this.fundingRepository.delete(id)).affected;
    if (affectedRowsCnt === 0)
      throw new NotFoundException(`삭제할 펀딩을 찾을 수 없습니다.`);
    return HttpStatus.ACCEPTED;
  }
}
