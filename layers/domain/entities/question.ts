import Picture from "./picture";

class QuestionClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionClassError"
  }
}

export default class Question {
  private readonly pictures: Picture[] = [];
  private readonly correctPictureIndex: number;
  private readonly questionString: string;

  constructor(pictures: Picture[], correctPictureIndex: number) {
    if (pictures.length !== 4) {
      throw new QuestionClassError("doesn't have 4 pictures");
    }
    if (correctPictureIndex < 0 || correctPictureIndex > 3) {
      throw new QuestionClassError("correctPictureIndex out of range");
    }
    this.correctPictureIndex = correctPictureIndex;
    this.questionString = `Which picture shows the flag of ${pictures[correctPictureIndex].getName()}`;
  }

  public getPictures(): Picture[] {
    return this.pictures;
  }

  public getQuestionString(): string {
    return this.questionString;
  }

  public isCorrect(index: number): boolean {
    return index === this.correctPictureIndex;
  }

}
