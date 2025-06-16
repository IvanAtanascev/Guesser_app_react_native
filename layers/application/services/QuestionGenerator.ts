import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import PictureRepositoryImpl from "@/layers/data/repositories/picturerepository";
import Picture from "@/layers/domain/entities/picture";
import Question from "@/layers/domain/entities/question";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";
import PictureRepository from "@/layers/domain/repositories/picturerepository";
import { QuestionGenerator } from "@/layers/domain/services/QuestionGenerator";

class QuestionGeneratorClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionGeneratorError";
  }
}

export default class QuestionGeneratorImpl implements QuestionGenerator {
  private categoryRepo: CategoryRepository;
  private pictureRepo: PictureRepository;

  constructor() {
    this.categoryRepo = new CategoryRepositoryImpl();
    this.pictureRepo = new PictureRepositoryImpl();
  }

  private async isCategoryAvailable(categoryId: number): Promise<boolean> {
    const ids = await this.categoryRepo.getAllAvailableCategoryIds();
    return ids.includes(categoryId);
  }

  private async selectRandomIdFromCategory(
    categoryId: number,
  ): Promise<number> {
    const exists: boolean = await this.isCategoryAvailable(categoryId);
    if (!exists) {
      throw new QuestionGeneratorClassError(
        `Category with id ${categoryId} not found`,
      );
    }

    const categoryMemberIdList: number[] =
      await this.categoryRepo.getAllIdsInCategory(categoryId);
    if (categoryMemberIdList.length === 0) {
      throw new QuestionGeneratorClassError(
        `Category with id ${categoryId} is empty`,
      );
    }

    return categoryMemberIdList[
      Math.floor(Math.random() * categoryMemberIdList.length)
    ];
  }

  public async generateRandomQuestion(
    categoryId: number,
    numberOfPossibleAnswers: number,
  ): Promise<Question> {
    const generateRandomPictures = async () => {
      let pictures: Picture[] = [];
      let ids: number[] = [];

      for (let i: number = 0; i < numberOfPossibleAnswers; i++) {
        const pictureId: number =
          await this.selectRandomIdFromCategory(categoryId);

        if (!ids.includes(pictureId)) {
          pictures[i] = await this.pictureRepo.findById(pictureId);
          ids[i] = pictureId;
        } else {
          i--;
        }
      }

      return pictures;
    };

    const pictures: Picture[] = await generateRandomPictures();

    const correctPictureIndex: number = Math.floor(
      Math.random() * numberOfPossibleAnswers,
    );

    const question: Question = new Question(pictures, correctPictureIndex);

    return question;
  }
}
