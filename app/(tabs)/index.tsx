import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { Button, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { OMDB_API_KEY } from "@/config/system";

type SearchResultMovie = {
  title: string;
  year: string;
  posterUri: string;
};

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [searchQuery, setSearchQuery] = useState("");

  const { data, refetch } = useQuery<SearchResultMovie[]>({
    queryKey: ["movie-search-by-title", searchQuery],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchQuery)}`,
        );

        const json = await response.json();

        console.log(json);

        return json.Search.map((item: any) => ({
          title: item.Title,
          year: item.Year,
          posterUri: item.Poster,
        }));
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    enabled: false,
  });

  return (
    <View style={styles.pageWrapper}>
      <Text>What movie would you like to know about?</Text>
      <TextInput
        placeholder="Type here"
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={() => refetch()} />

      {data && (
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            paddingBottom: tabBarHeight,
          }}
        >
          {data.map((item) => (
            <View key={`${item.title}-${item.year}`} style={styles.movieCard}>
              <View style={styles.movieCardHeader}>
                <Text style={styles.movieCardHeaderTitle}>{item.title}</Text>
                <Text style={styles.movieCardHeaderYear}>{item.year}</Text>
              </View>
              <Image
                source={{
                  uri: item.posterUri,
                }}
                style={{
                  height: 200,
                  width: 120,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    height: "100%",
  },
  movieCard: {
    alignSelf: "flex-start",
    borderColor: "black",
    display: "flex",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  movieCardHeader: {
    display: "flex",
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  movieCardHeaderYear: {
    fontSize: 10,
  },
  movieCardHeaderTitle: {
    textDecorationLine: "underline",
  },
});
