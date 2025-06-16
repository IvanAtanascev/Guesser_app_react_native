import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import PictureRepositoryImpl from "@/layers/data/repositories/picturerepository";
import ScoreBoardRepositoryImpl from "@/layers/data/repositories/scoreboardrepository";
import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";
import PictureRepository from "@/layers/domain/repositories/picturerepository";
import ScoreBoardRepository from "@/layers/domain/repositories/scoreboardrepository";

export class DownloadCategoryUseCase {
  private categoryRepo: CategoryRepository;
  private scoreBoardRepo: ScoreBoardRepository;
  private pictureRepo: PictureRepository;

  constructor() {
    this.categoryRepo = new CategoryRepositoryImpl();
    this.scoreBoardRepo = new ScoreBoardRepositoryImpl();
    this.pictureRepo = new PictureRepositoryImpl();
  }

  public async execute(
    category: Category,
    triggerCallback: () => void,
    successCallback: () => void,
  ) {
    triggerCallback();
    try {
      await this.scoreBoardRepo.deleteScoreBoardEntry(category.getId());
      await this.pictureRepo.deleteAllInCategory(category.getId());
      await this.categoryRepo.deleteCategory(category.getName());
      await this.categoryRepo.download(category.getName());
    } catch (error) {
      throw new Error(`DownloadCategoryUseCase fail: ${error}`);
    } finally {
      successCallback();
    }
  }
}
