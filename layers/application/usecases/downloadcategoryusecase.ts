import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";

export class DownloadCategoryUseCase {
  private categoryRepo: CategoryRepository;

  constructor(categoryRepo: CategoryRepository) {
    this.categoryRepo = categoryRepo;
  }

  public async execute(category: Category) {
    this.categoryRepo.download(category);
  }
}
