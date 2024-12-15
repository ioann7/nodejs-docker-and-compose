import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
