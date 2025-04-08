import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private createProfileDto: Repository<Profile>,

  ) { }
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }


  async remove(id: string): Promise<{ message: string }> {
    const result = await this.createProfileDto.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Library record with ID ${id} not found`);

    }

    const newresult = await this.createProfileDto.delete(id)
    return {
      message: `Library record with ID ${id} deleted successfully`,


    };
  }
}
