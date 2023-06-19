import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { Cat } from './cats.schema';
import { Model } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import { ReadOnlyCatDto } from './dto/cat.dto';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email });
    return result ? true : false;
  }

  async create(cats: CatRequestDto): Promise<ReadOnlyCatDto> {
    const result = await this.catModel.create(cats);
    return result.readOnlyData;
  }
}
