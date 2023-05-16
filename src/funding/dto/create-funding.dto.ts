export class CreateFundingDto {
  starter: string;
  brandId: number;
  deadline: Date;
  minPrice?: number | null;
  minMember?: number | null;
  description?: string | null;
}
