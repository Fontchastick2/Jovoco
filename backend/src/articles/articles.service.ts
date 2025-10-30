import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(article: Partial<Article>): Promise<Article> {
    const newArticle = this.articlesRepository.create(article);
    return this.articlesRepository.save(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findById(articleId: string): Promise<Article | null> {
    return this.articlesRepository.findOne({ where: { articleId } });
  }

  async findByCategory(category: string): Promise<Article[]> {
    return this.articlesRepository.find({ where: { category } });
  }

  async update(articleId: string, updateData: Partial<Article>): Promise<Article | null> {
    await this.articlesRepository.update(articleId, updateData);
    return this.findById(articleId);
  }

  async delete(articleId: string): Promise<void> {
    await this.articlesRepository.delete(articleId);
  }
}
