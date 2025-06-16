import { useEffect, useState } from "react";
import Category from "../domain/entities/category";
import FetchCategoryInfoUseCase from "../application/usecases/fetchCategoryInfo";
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlatList, View, Text } from "@/components/Themed";
import { DownloadCategoryUseCase } from "../application/usecases/downloadcategoryusecase";
import { ExistsUseCase } from "../application/usecases/existsUseCase";
import { Link } from "expo-router";
import GetLocalCategoriesUseCase from "../application/usecases/getLocalCategoriesUseCase";
import NetInfo from "@react-native-community/netinfo";
import { CompareCategoryUseCase } from "../application/usecases/compareCategoryUseCase";
import GetSingleLocalCategoryUseCase from "../application/usecases/getSingleLocalCategoryUseCase";

const downloadUseCase = new DownloadCategoryUseCase();
const existsUseCase = new ExistsUseCase();
const fetchCategory = new FetchCategoryInfoUseCase();
const getAllLocalCategories = new GetLocalCategoriesUseCase();

export const CategoryDisplay = () => {
  const [userIsOnline, setUserIsOnline] = useState<boolean | null>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existenceMap, setExistenceMap] = useState<{
    [key: string]: boolean | null | "downloading" | "update_available";
  }>({});

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setUserIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let data: Category[];
        if (userIsOnline) {
          data = await fetchCategory.execute();
        } else {
          data = await getAllLocalCategories.execute();
        }
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
  }, [userIsOnline]);

  useEffect(() => {
    const compareCategories = new CompareCategoryUseCase();
    const getSingleCategory = new GetSingleLocalCategoryUseCase();

    const checkExistenceForCategories = async () => {
      const updatedExistenceMap = { ...existenceMap };
      for (const item of categories) {
        let existsResult: boolean | null | "downloading" | "update_available" =
          await existsUseCase.execute(item.getId());

        if (existsResult === true) {
          const localCategory: Category = await getSingleCategory.execute(
            item.getId(),
          );

          const compareResult = compareCategories.execute(item, localCategory);
          console.log("here " + compareResult);

          if (compareResult === false) {
            existsResult = "update_available";
          }
        }

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
    const itemExists: boolean | null | "downloading" | "update_available" =
      existenceMap[item.getId()];

    const handleDownload = () => {
      downloadUseCase.execute(
        item,
        () => {
          setExistenceMap((prevMap) => ({
            ...prevMap,
            [item.getId()]: "downloading",
          }));
        },
        () => {
          setExistenceMap((prevMap) => ({
            ...prevMap,
            [item.getId()]: true,
          }));
        },
      );
    };

    console.log("hi" + itemExists);

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
        {itemExists === null ? (
          <Text>Checking existence...</Text>
        ) : itemExists === true ? (
          <Link
            href={{ pathname: "/game", params: { categoryId: item.getId() } }}
            asChild
          >
            <TouchableOpacity style={styles.button}>
              <Text>Play</Text>
            </TouchableOpacity>
          </Link>
        ) : itemExists === false ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDownload()}
          >
            <Text>Download</Text>
          </TouchableOpacity>
        ) : itemExists === "downloading" ? (
          <ActivityIndicator />
        ) : (
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDownload()}
            >
              <Text>Download</Text>
            </TouchableOpacity>

            <Link
              href={{ pathname: "/game", params: { categoryId: item.getId() } }}
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text>Play</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.categoryItems}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItems: {
    padding: 10,
    width: "80%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#888888",
  },
});
