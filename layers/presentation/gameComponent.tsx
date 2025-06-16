import { Alert, Image, StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "@/components/Themed";
import PlayGameUseCase from "../application/usecases/playflaggameusecase";
import { useEffect, useState, useMemo } from "react";
import Picture from "../domain/entities/picture";
import { UpdateScoreUseCase } from "../application/usecases/updatescoreusecase";
import { GetScoreUseCase } from "../application/usecases/getscoreusecase";
import * as Haptics from "expo-haptics";

class GameComponentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameComponentError";
  }
}

const updateScore = new UpdateScoreUseCase();
const getScore = new GetScoreUseCase();

export default function GameComponent({ categoryId }: { categoryId: number }) {
  const [question, setQuestion] = useState<string>("");
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [score, setScore] = useState<number>(0);

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

  const handleAnswerSelection = async (index: number) => {
    const isCorrect = playGame.selectAnswer(index);
    if (isCorrect) {
      Alert.alert("Correct!", "You selected the correct answer.", [
        { text: "Next", onPress: loadNewQuestion },
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(score + 1);
    } else {
      const previousHighScore = await getScore.execute(categoryId);

      if (previousHighScore < score) {
        await updateScore.execute(score, categoryId);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setScore(0);
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <ScoreDisplay score={score} />
      <Text style={styles.title}>{question}</Text>
      <View
        style={{
          width: "80%",
          alignItems: "center",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "gray",
        }}
      >
        {pictures.map((picture, index) => (
          <View key={index} style={styles.cardContainer}>
            <TouchableOpacity
              onPress={() => {
                handleAnswerSelection(index);
              }}
              style={styles.overlay}
            >
              <Image
                source={{
                  uri: picture.getUrl(),
                }}
                style={{
                  padding: 5,
                  height: 120,
                  width: 180,
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  cardContainer: {
    width: 180,
    height: 120,
    padding: 5,
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  cards: {
    backgroundColor: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

const ScoreDisplay = ({ score }: { score: number }) => {
  return (
    <View>
      <Text>{score}</Text>
    </View>
  );
};
