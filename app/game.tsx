import { useLocalSearchParams } from "expo-router";
import GameComponent from "@/layers/presentation/gameComponent";

type SeachParamGameType = {
  categoryId: string;
};

class GamePageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GamePageError";
  }
}

export default function GamePage() {
  const { categoryId } = useLocalSearchParams<SeachParamGameType>();

  if (categoryId === undefined) {
    throw new GamePageError("categoryId is undefined");
  }

  const categoryIdNumber = parseInt(categoryId);

  return <GameComponent categoryId={categoryIdNumber} />;
}
