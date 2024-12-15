import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description: string;
}
