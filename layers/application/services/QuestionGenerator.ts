import Picture from "@/layers/domain/entities/picture";
import Question from "@/layers/domain/entities/question";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";
import PictureRepository from "@/layers/domain/repositories/picturerepository";
import { QuestionGenerator } from "@/layers/domain/services/QuestionGenerator";

class QuestionGeneratorClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}

export default class QuestionGeneratorImpl implements QuestionGenerator {
  private categoryRepo: CategoryRepository;
  private pictureRepo: PictureRepository;

  constructor(
    categoryRepo: CategoryRepository,
    pictureRepo: PictureRepository,
  ) {
    this.categoryRepo = categoryRepo;
    this.pictureRepo = pictureRepo;
  }

  async isCategoryAvailable(categoryId: number): Promise<boolean> {
    const ids = await this.categoryRepo.getAllAvailableCategoryIds();
    return ids.includes(categoryId);
  }

  async selectRandomIdFromCategory(categoryId: number): Promise<number> {
    const exists: boolean = await this.isCategoryAvailable(categoryId);
    if (!exists) {
      throw new QuestionGeneratorClassError(
        `Category with id ${categoryId} not found`,
      );
    }

    const categoryMemberIdList =
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
      for (let i: number = 0; i < numberOfPossibleAnswers; i++) {
        const pictureId = await this.selectRandomIdFromCategory(categoryId);
        pictures[i] = await this.pictureRepo.findById(pictureId);
      }

      return pictures;
    };

    const pictures = await generateRandomPictures();

    const correctPictureIndex: number = Math.floor(
      Math.random() * numberOfPossibleAnswers,
    );

    const question: Question = new Question(pictures, correctPictureIndex);

    return question;
  }
}
