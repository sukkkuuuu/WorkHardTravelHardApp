import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  // ActivityIndicator, // 로딩 로고 나오는 기능이었던 것 같다
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import AsyncStroage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@toDos";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  useEffect(() => {
    loadToDos();
  }, []);
  const deleteToDos = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      // destructive는 ios에서만 적용된다
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };
  const saveToDos = async (toSave) => {
    // setItem의 값은 key, value 형태여야 하는데 value는 string 형태여야해서 toSave가 newToDos를 받는건데 이 newToDos가 JSON 형태라 string 으로 바꿔줘야해서 stringfy를 사용한거임
    await AsyncStroage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStroage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
      // console.log(JSON.parse(s));
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeText = (payload) => {
    setText(payload);
  };
  // 키보드 입력 할 때 입력칸 문자들이 계속 바뀌는 것

  const addToDo = () => {
    if (text === "") {
      return;
    }
    // 예전 object에 새로운 object를 붙일 때 사용하는 것이 Object.assign()이다. 근데 이렇게 사용안하고 ES6 문법을 사용해서 만들 수 도 있음
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          returnKeyType="done"
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder={working ? "Add a to do" : "where do you want to go"}
        ></TextInput>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity
                onPress={() => {
                  deleteToDos(key);
                }}
              >
                <EvilIcons name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 18,
  },
  header: {
    marginTop: 90,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "200",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
});
