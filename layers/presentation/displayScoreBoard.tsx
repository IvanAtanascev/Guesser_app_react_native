import { useEffect, useState } from "react";
import Category from "../domain/entities/category";
import { GetScoreUseCase } from "../application/usecases/getscoreusecase";
import GetLocalCategoriesUseCase from "../application/usecases/getLocalCategoriesUseCase";
import { View, Text, FlatList } from "@/components/Themed";
import { useIsFocused } from "@react-navigation/native";

const getAllLocalCategories = new GetLocalCategoriesUseCase();
const getScore = new GetScoreUseCase();

export default function DisplayScoreBoard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [scoreMap, setScoreMap] = useState<{
    [key: string]: number;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isFocused = useIsFocused();

  const initializeScores = async () => {
    try {
      const localCategoryResults: Category[] = await getAllLocalCategories.execute();
      setCategories(localCategoryResults);

      const initialScoreMap = localCategoryResults.reduce(
        (acc, item) => {
          acc[item.getId()] = 0;
          return acc;
        },
        {} as { [key: string]: number },
      );

      setScoreMap(initialScoreMap);

      const updatedScoreMap = { ...initialScoreMap };

      for (const category of localCategoryResults) {
        const score = await getScore.execute(category.getId());
        updatedScoreMap[category.getId()] = score;
      }

      setScoreMap(updatedScoreMap);
    } catch (error) {
      setError(`Failed to fetch categories: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      initializeScores();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Category }) => {
    const score: number = scoreMap[item.getId()];

    return (
      <View
        style={{
          alignItems: "center",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{item.getName()}</Text>
        <Text>{score}</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        padding: 10,
        width: "80%",
        height: "100%",
      }}
    >
      <FlatList
        data={categories}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
