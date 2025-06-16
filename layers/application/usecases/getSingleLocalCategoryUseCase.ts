import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";

export default class GetSingleLocalCategoryUseCase {
  private categoryRepository: CategoryRepository;
  constructor() {
    this.categoryRepository = new CategoryRepositoryImpl();
  }

  public async execute(id: number): Promise<Category> {
    return await this.categoryRepository.getSingleLocalCategory(id);
  }
}
