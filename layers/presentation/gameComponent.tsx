import { Alert, View, Text, TouchableOpacity, Image } from "react-native";
import PlayGameUseCase from "../application/usecases/playflaggameusecase";
import { useEffect, useState, useMemo } from "react";
import Picture from "../domain/entities/picture";
import { SvgUri } from "react-native-svg";

class GameComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameComponentError";
  }
}

export default function GameComponent({ categoryId }: { categoryId: number }) {
  const [question, setQuestion] = useState<string>("");
  const [pictures, setPictures] = useState<Picture[]>([]);

  const playGame = useMemo(
    () => new PlayGameUseCase(categoryId, 4),
    [categoryId],
  );

  const loadNewQuestion = async () => {
    try {
      await playGame.generateNewQuestion();
    } catch (error) {
      throw new GameComponentError(`Couldn't generate a question: ${error}`);
    }
    setQuestion(playGame.getCurrentQuestionString());
    setPictures(playGame.getPictures());
  };

  const handleAnswerSelection = (index: number) => {
    const isCorrect = playGame.selectAnswer(index);
    if (isCorrect) {
      Alert.alert("Correct!", "You selected the correct answer.", [
        { text: "Next", onPress: loadNewQuestion },
      ]);
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  return (
    <View>
      <Text>{question}</Text>
      <View>
        {pictures.map((picture, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelection(index)}
          >
            <SvgUri uri={picture.getUrl()} width="100" height="100" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
