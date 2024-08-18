import { useEffect, useState } from "react";
import Category from "../domain/entities/category";
import FetchCategoryInfoUseCase from "../application/usecases/fetchCategoryInfo";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { DownloadCategoryUseCase } from "../application/usecases/downloadcategoryusecase";
import { ExistsUseCase } from "../application/usecases/existsUseCase";
import { Link } from "expo-router";

const downloadUseCase = new DownloadCategoryUseCase();
const existsUseCase = new ExistsUseCase();

export const CategoryDisplay = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existenceMap, setExistenceMap] = useState<{
    [key: string]: boolean | null;
  }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchCategoryUseCase = new FetchCategoryInfoUseCase();
      try {
        const data = await fetchCategoryUseCase.execute();
        setCategories(data);

        const initialExistenceMap = data.reduce(
          (acc, item) => {
            acc[item.getId()] = null;
            return acc;
          },
          {} as { [key: string]: boolean | null },
        );

        setExistenceMap(initialExistenceMap);
      } catch (error) {
        setError(`Failed to fetch categories: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const checkExistenceForCategories = async () => {
      const updatedExistenceMap = { ...existenceMap };
      for (const item of categories) {
        const existsResult = await existsUseCase.execute(item.getId());
        updatedExistenceMap[item.getId()] = existsResult;
      }
      setExistenceMap(updatedExistenceMap);
    };

    if (categories.length > 0) {
      checkExistenceForCategories();
    }
  }, [categories]);

  if (loading) {
    return (
      <View>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Category }) => {
    const itemExists = existenceMap[item.getId()];

    const handleDownload = () => {
      downloadUseCase.execute(item.getName(), () => {
        setExistenceMap((prevMap) => ({
          ...prevMap,
          [item.getId()]: true,
        }));
      });
    };

    return (
      <View style={styles.categoryItems}>
        <Text style={styles.text}>{item.getName()}</Text>
        {itemExists === null ? (
          <Text>Checking existence...</Text>
        ) : itemExists ? (
          <Link
            href={{ pathname: "/game", params: { categoryId: item.getId() } }}
            asChild
          >
            <TouchableOpacity>
              <Text>Play</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <Button onPress={handleDownload} title="Download" />
        )}
      </View>
    );
  };

  return (
    <View>
      <Text>Categories</Text>
      <FlatList
        style={styles.container}
        data={categories}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  container: {
    marginTop: 10,
  },
  categoryItems: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
  },
});
