import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post()
  async create(@Body() article: Partial<Article>): Promise<Article> {
    return this.articlesService.create(article);
  }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(':articleId')
  async findById(@Param('articleId') articleId: string): Promise<Article | null> {
    return this.articlesService.findById(articleId);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<Article[]> {
    return this.articlesService.findByCategory(category);
  }

  @Put(':articleId')
  async update(
    @Param('articleId') articleId: string,
    @Body() updateData: Partial<Article>,
  ): Promise<Article | null> {
    return this.articlesService.update(articleId, updateData);
  }

  @Delete(':articleId')
  async delete(@Param('articleId') articleId: string): Promise<void> {
    return this.articlesService.delete(articleId);
  }
}
