import { PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  @IsOptional()
  name: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  itemsId: number[];
}
