import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import ScoreBoardRepositoryImpl from "@/layers/data/repositories/scoreboardrepository";
import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";
import ScoreBoardRepository from "@/layers/domain/repositories/scoreboardrepository";

export class DownloadCategoryUseCase {
  private categoryRepo: CategoryRepository;
  private scoreBoardRepo: ScoreBoardRepository;

  constructor() {
    this.categoryRepo = new CategoryRepositoryImpl();
    this.scoreBoardRepo = new ScoreBoardRepositoryImpl();
  }

  public async execute(
    category: Category,
    triggerCallback: () => void,
    successCallback: () => void,
  ) {
    triggerCallback();
    try {
      await this.scoreBoardRepo.deleteScoreBoardEntry(category.getId());
      await this.categoryRepo.deleteCategory(category.getName());
      await this.categoryRepo.download(category.getName());
    } catch (error) {
      throw new Error(`DownloadCategoryUseCase fail: ${error}`);
    } finally {
      successCallback();
    }
  }
}
