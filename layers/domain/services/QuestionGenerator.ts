import Question from "@/layers/domain/entities/question";

export interface QuestionGenerator {
  generateRandomQuestion(
    categoryId: number,
    numberOfPossibleAnswers: number,
  ): Promise<Question>;
}
