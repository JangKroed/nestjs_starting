import { InjectModel } from '@nestjs/mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { Cat } from './cats.schema';
import { Model, Types } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import { ReadOnlyCatDto } from './dto/cat.dto';
import { Comments, CommentsSchema } from 'src/comments/comments.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
  ) {}

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    cat.imgUrl = fileName;
    const newCat = await cat.save();
    console.log(newCat);
    return newCat.readOnlyData;
  }

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<Cat | null> {
    const cat = await this.catModel.findById(catId).select('-password');
    return cat;
  }

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

  async findAll() {
    // const CommentsModel = mongoose.model('comments', CommentsSchema);
    const result = await this.catModel
      .find()
      .populate({ path: 'comments', model: this.commentModel });
    return result;
  }
}
