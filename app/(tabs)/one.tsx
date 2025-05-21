import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function TabOneScreen() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("@username");
        if (!storedUsername) {
          throw new Error("Usuário não encontrado no AsyncStorage");
        }

        setUsername(storedUsername);

        const response = await fetch(
          `https://api.github.com/users/${storedUsername}/repos`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao buscar repositórios");
        }

        setRepos(data);
      } catch (error: any) {
        console.error("Erro:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repositórios de {username}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={repos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.repoItem}>
              <Text style={styles.repoName}>{item.name}</Text>
              <Text style={styles.repoDesc}>
                {item.description || "Sem descrição"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
  repoItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  repoDesc: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
