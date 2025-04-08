import { Injectable, HttpException, NotFoundException ,ConflictException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Profile } from './entities/profile.entity';
// import { Profile } from 'src/profile/entities/profile.entity';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
  private createUserDto: Repository<User>,
    @InjectRepository(Profile)
    private createProfileDto: Repository<Profile>,
    private jwtService: JwtService,
  ) { }
  async addUser(createUserDto: CreateUserDto,createProfileDto:CreateProfileDto) {

    // create profile
    createUserDto.profile = createUserDto.profile ?? {}

    let profile = this.createProfileDto.create(createUserDto.profile);
    await this.createProfileDto.save(profile);

    // const addProfile = this.createProfileDto.create(createProfileDto);
    // check if email already exists 

    const { email } = createUserDto;
    const existingUser = await this.createUserDto.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    
    const payload = { email: 'user.email', id: 'user.id', username: 'user.username' };

    // create new user 
    const add = this.createUserDto.create(createUserDto);
    // set user profile
    add.profile = profile

    return {
      user: await this.createUserDto.save(add),
      // profile:await this.createProfileDto.save(addProfile),
      access_token: this.jwtService.sign(payload)
    };
  }

  // async createUser(userDto:CreateUserDto){
  //   // create profile
  //     userDto.profile = userDto.profile ??{}
  //   let profile = this.createProfileDto.create(userDto.profile);
  //   await this.createProfileDto.save(profile);

  //   // create new project 
  //   let user =this.createUserDto.create(userDto)

  //   // set user profile
  //   user.profile =profile

  //   // save the user object 
  //  return await this.createUserDto.save(user);

  // }

  async findAll() {
    return await this.createUserDto.find(
      {relations:['profile']}
    );
  }
  async findEmail(email: string) {
    const userEmail = await this.createUserDto.findOneBy({ email });
    if (!userEmail) {
      throw new ConflictException('Email already exists');
    }
    return userEmail;
    }

    async user (headers:any){
      const authorizationHeader = headers.authorization;
      if (authorizationHeader) {
    const token = authorizationHeader.replace('Berrer ', '');
    
    const secret = process.env.JWTSecret;
    
    try{
      const decoded =this.jwtService.verify(token);
      let id = decoded["id"];
      let user =await this.createUserDto.findOneBy({id});
    
      return { id: id, name: user?.userName, email: user?.email } ;
    }
    catch (error) {
      throw new HttpException('invalid token', 401);
      } 
    }else{
      throw new HttpException('invalid or missing Berer token' ,401);
    }
    }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const findEmail = await this.createUserDto.findOne({ where: { email: email } });

    return findEmail
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const userResult = await this.createUserDto.delete(id);
    const profileResult = await this.createProfileDto.delete(id);

    if (userResult.affected === 0) {
      throw new NotFoundException(`user record with ID ${id} not found`);
    }

    const Userresult = await this.createUserDto.delete(id)
    const Profileresult = await this.createProfileDto.delete(id)
    return {
      message: `user record with ID ${id} deleted successfully`,

    };

  }
}
