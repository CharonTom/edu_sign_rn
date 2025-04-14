// app/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import { useRouter } from "expo-router";

export default function QrScreen() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Remplacez cette URL par celle de votre API accessible depuis votre mobile
    axios
      .get("http://127.0.0.1:8000/api/qr")
      .then((response) => {
        setToken(response.data.token);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Erreur", "Impossible de récupérer le QR Code");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre QR Code</Text>
      {token && <QRCode value={token} size={250} />}
      <Button title="Scanner un QR Code" onPress={() => router.push("/scan")} />
      <Text style={styles.tokenText}>Token: {token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 20, marginBottom: 20 },
  tokenText: { marginTop: 20, textAlign: "center" },
});
