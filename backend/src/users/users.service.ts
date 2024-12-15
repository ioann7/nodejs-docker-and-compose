import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashCreate } from '../core/utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  protected allUserFields: string[] = [
    'id',
    'createdAt',
    'updatedAt',
    'username',
    'about',
    'avatar',
    'email',
    'password',
    'wishes',
  ];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashCreate(password),
    });

    return this.usersRepository.save(user);
  }

  protected cleanUser(
    user: User | null,
    withPassword = false,
    withEmail = false,
  ) {
    if (!user) {
      return;
    }
    if (!withPassword) {
      delete user.password;
    }
    if (!withEmail) {
      delete user.email;
    }
  }

  async findById(
    id: number,
    withPassword = false,
    withEmail = false,
  ): Promise<User> | null {
    const user = await this.usersRepository.findOneOrFail({
      where: { id },
      select: this.allUserFields as FindOptionsSelect<User>,
    });
    this.cleanUser(user, withPassword, withEmail);
    return user;
  }

  async findByUsername(
    username: string,
    withPassword = false,
    withEmail = false,
  ): Promise<User> | null {
    const user = await this.usersRepository.findOneOrFail({
      where: { username },
      select: this.allUserFields as FindOptionsSelect<User>,
    });
    this.cleanUser(user, withPassword, withEmail);
    return user;
  }

  async findManyByQuery(query: string) {
    const users = await this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
    users.forEach((user) => this.cleanUser(user));
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;
    const user = await this.findById(id);

    if (password) {
      updateUserDto.password = await hashCreate(password);
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
    this.cleanUser(updatedUser);
    return updatedUser;
  }
}
