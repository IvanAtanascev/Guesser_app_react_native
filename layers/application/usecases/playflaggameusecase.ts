import Question from "@/layers/domain/entities/question";
import Picture from "@/layers/domain/entities/picture";
import { QuestionGenerator } from "@/layers/domain/services/QuestionGenerator";

export default class PlayGameUseCase {
  private questionGenerator: QuestionGenerator;
  private currentQuestion: Question;
  private categoryId: number;
  private numberOfPossibleAnswers: number;

  constructor(
    questionGenerator: QuestionGenerator,
    initialQuestion: Question,
    categoryId: number,
    numberOfPossibleAnswers: number,
  ) {
    this.questionGenerator = questionGenerator;
    this.currentQuestion = initialQuestion;
    this.categoryId = categoryId;
    this.numberOfPossibleAnswers = numberOfPossibleAnswers;
  }

  public selectAnswer(index: number): boolean {
    return this.currentQuestion.isCorrect(index);
  }

  public async generateNewQuestion(): Promise<void> {
    this.currentQuestion = await this.questionGenerator.generateRandomQuestion(
      this.categoryId,
      this.numberOfPossibleAnswers,
    );
  }

  public getCurrentQuestionString(): string {
    return this.currentQuestion.getQuestionString();
  }

  public getPictures(): Picture[] {
    return this.currentQuestion.getPictures();
  }
}
