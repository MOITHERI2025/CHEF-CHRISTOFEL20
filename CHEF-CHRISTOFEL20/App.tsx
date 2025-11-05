import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

// 🌄 Online Image URLs
const images = {
  background:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Chef_hat_icon.svg/800px-Chef_hat_icon.svg.png",
};

const LoginScreen = ({ navigation, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "Christoffel" && password === "FineDining") {
      Alert.alert("Welcome", "Login successful!");
      onLogin();
      navigation.navigate("Menu");
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <ImageBackground source={{ uri: images.background }} style={styles.background}>
      <View style={styles.container}>
        <Image source={{ uri: images.logo }} style={styles.logo} />
        <Text style={styles.title}>Christoffel’s</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.goldButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>New user? Register here</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleRegister = () => {
    if (!user || !email || !pass) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert("Success", `Welcome ${user}!`);
    navigation.navigate("Login");
  };

  return (
    <ImageBackground source={{ uri: images.background }} style={styles.background}>
      <View style={styles.container}>
        <Image source={{ uri: images.logo }} style={styles.logo} />
        <Text style={styles.title}>Register</Text>
        <TextInput placeholder="Username" value={user} onChangeText={setUser} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput
          placeholder="Password"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.goldButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const MenuScreen = ({ navigation, route }) => {
  // ✅ Default Menu & Add new dishes from ManageMenu
  const defaultMenu = {
    starter: [
      { name: "Seared Scallops", price: 185 },
      { name: "Beef Carpaccio", price: 165 },
      { name: "Lobster Bisque", price: 175 },
    ],
    main: [
      { name: "Filet Mignon", price: 350 },
      { name: "Pan-Seared Duck", price: 325 },
      { name: "Grilled Sea Bass", price: 345 },
    ],
    dessert: [
      { name: "Dark Chocolate Fondant", price: 145 },
      { name: "Crème Brûlée", price: 135 },
      { name: "Tarte Tatin", price: 140 },
    ],
  };

  // ✅ If new item is passed from ManageMenu, add it
  const [menu, setMenu] = useState(defaultMenu);

  React.useEffect(() => {
    if (route.params?.newDish) {
      const { course, name, price } = route.params.newDish;
      setMenu((prev) => ({
        ...prev,
        [course]: [...prev[course], { name, price }],
      }));
    }
  }, [route.params]);

  const [selectedStarter, setSelectedStarter] = useState(null);
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedDessert, setSelectedDessert] = useState(null);

  const calculateTotal = () => {
    return (
      (selectedStarter?.price || 0) +
      (selectedMain?.price || 0) +
      (selectedDessert?.price || 0)
    );
  };

  return (
    <ImageBackground source={{ uri: images.background }} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Image source={{ uri: images.logo }} style={styles.logoSmall} />
          <Text style={styles.title}>Tonight’s Menu</Text>

          <View style={{ backgroundColor: "#ffffffcc", padding: 10, borderRadius: 8 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Your Selection:</Text>

            <Text>Starter: {selectedStarter ? selectedStarter.name : "None"}</Text>
            {selectedStarter && (
              <TouchableOpacity onPress={() => setSelectedStarter(null)}>
                <Text style={styles.removeMeal}>Remove Starter</Text>
              </TouchableOpacity>
            )}

            <Text>Main: {selectedMain ? selectedMain.name : "None"}</Text>
            {selectedMain && (
              <TouchableOpacity onPress={() => setSelectedMain(null)}>
                <Text style={styles.removeMeal}>Remove Main</Text>
              </TouchableOpacity>
            )}

            <Text>Dessert: {selectedDessert ? selectedDessert.name : "None"}</Text>
            {selectedDessert && (
              <TouchableOpacity onPress={() => setSelectedDessert(null)}>
                <Text style={styles.removeMeal}>Remove Dessert</Text>
              </TouchableOpacity>
            )}

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Total: R{calculateTotal()}
            </Text>
          </View>

          {/* Menu lists dynamically updated */}
          <Text style={styles.sectionTitle}>Starters</Text>
          {menu.starter.map((item, i) => (
            <TouchableOpacity key={i} style={styles.option} onPress={() => setSelectedStarter(item)}>
              <Text style={styles.dishText}>{item.name} – R{item.price}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Mains</Text>
          {menu.main.map((item, i) => (
            <TouchableOpacity key={i} style={styles.option} onPress={() => setSelectedMain(item)}>
              <Text style={styles.dishText}>{item.name} – R{item.price}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Desserts</Text>
          {menu.dessert.map((item, i) => (
            <TouchableOpacity key={i} style={styles.option} onPress={() => setSelectedDessert(item)}>
              <Text style={styles.dishText}>{item.name} – R{item.price}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("ManageMenu")}>
            <Text style={styles.buttonText}>Manage Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const ManageMenuScreen = ({ navigation }) => {
  const [dishName, setDishName] = useState("");
  const [price, setPrice] = useState("");
  const [course, setCourse] = useState("");

  const data = [
    { label: "Starter", value: "starter" },
    { label: "Main", value: "main" },
    { label: "Dessert", value: "dessert" },
  ];

  const addDish = () => {
    if (!dishName || !price || !course) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    navigation.navigate("Menu", {
      newDish: { name: dishName, price: parseInt(price), course },
    });

    setDishName("");
    setPrice("");
    setCourse("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ImageBackground source={{ uri: images.background }} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>Manage Menu</Text>

            <TextInput
              placeholder="Dish Name"
              value={dishName}
              onChangeText={setDishName}
              style={styles.input}
            />

            <TextInput
              placeholder="Price (R)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <Dropdown
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select course"
              value={course}
              onChange={(item) => setCourse(item.value)}
              style={styles.input}
            />

            <TouchableOpacity style={styles.goldButton} onPress={addDish}>
              <Text style={styles.buttonText}>Add to Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <>
            <Drawer.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={() => setLoggedIn(true)} />}
            </Drawer.Screen>
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Drawer.Screen name="Menu" component={MenuScreen} />
            <Drawer.Screen name="ManageMenu" component={ManageMenuScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, padding: 20 },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 20 },
  logoSmall: { width: 80, height: 80, alignSelf: "center", marginBottom: 10 },
  title: { fontSize: 28, color: "#fff", textAlign: "center", marginBottom: 10, fontWeight: "bold" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 8 },
  option: { backgroundColor: "#ffffffcc", padding: 10, borderRadius: 8, marginVertical: 5 },
  dishText: { fontWeight: "bold" },
  goldButton: { backgroundColor: "#C9A43C", padding: 15, borderRadius: 10, marginVertical: 10 },
  homeButton: { backgroundColor: "#6b4f1d", padding: 15, borderRadius: 10, marginVertical: 10 },
  buttonText: { color: "#fff", textAlign: "center" },
  removeMeal: { color: "red", fontSize: 13, textDecorationLine: "underline" },
});

export default App;
