import { OMDB_API_KEY } from "@/config/system";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

type MovieDetails = {
  director: string;
  id: string;
  posterUri: string;
  rated: string;
  ratings: {
    source: string;
    value: string;
  }[];
  title: string;
  year: string;
};

export default function MovieDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<MovieDetails>({
    queryKey: ["movie-details", id],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(id)}`,
        );

        const json = await response.json();

        console.log(json);

        return {
          director: json.Director,
          id: json.imdbID,
          posterUri: json.Poster,
          rated: json.Rated,
          ratings: json.Ratings.map((rating: any) => ({
            source: rating.Source,
            value: rating.Value,
          })),
          title: json.Title,
          year: json.Year,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "" }} />
        <Text>Loading...</Text>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "Error" }} />
        <Text>Error: {error.message}</Text>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "Not found" }} />
        <View>Movie not found</View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: data.title }} />
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: data.posterUri,
            }}
            style={{
              height: 200,
              width: 120,
              borderRadius: 5,
              marginTop: 5,
            }}
          />
        </View>
        <Text>Year: {data.year}</Text>
        <Text>Director: {data.director}</Text>
        <Text>Rated: {data.rated}</Text>
        <View style={styles.ratingsBox}>
          <Text style={styles.ratingsBoxTitle}>Ratings:</Text>
          <View>
            {data.ratings.map((rating) => (
              <Text key={rating.source} style={styles.ratingItem}>
                - {rating.source}: {rating.value}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    gap: 8,
  },
  imageWrapper: {
    alignItems: "center",
  },
  ratingsBox: {
    borderRadius: 5,
    padding: 8,
    backgroundColor: "black",
  },
  ratingsBoxTitle: {
    color: "white",
  },
  ratingItem: {
    marginStart: 8,
    color: "white",
  },
});
