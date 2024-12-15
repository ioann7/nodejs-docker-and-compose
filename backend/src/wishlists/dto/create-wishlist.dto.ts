import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Length(1, 1500)
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  itemsId: number[];
}
