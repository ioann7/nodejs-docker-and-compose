import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsUrl, Length, Max } from 'class-validator';
import { BaseModel } from '../../core/entities/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity('wishlists')
export class Wishlist extends BaseModel {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Max(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, 'wishlists')
  @JoinTable()
  items: Wish[];
}
