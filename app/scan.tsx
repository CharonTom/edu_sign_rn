// app/scan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import { useRouter } from "expo-router";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Demande la permission d'utiliser la caméra
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Fonction appelée lors du scan du code-barres
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    // Envoie le token (données scannées) à ton API pour enregistrer la présence
    axios
      .post("http://127.0.0.1:8000/api/attendance", { token: data })
      .then((response) => {
        setMessage(response.data.success);
        Alert.alert("Succès", response.data.success);
      })
      .catch((error) => {
        let errorMsg = "Erreur lors de l'enregistrement";
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMsg = error.response.data.error;
        }
        setMessage(errorMsg);
        Alert.alert("Erreur", errorMsg);
      });
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.infoText}>
        Demande de permission pour la caméra...
      </Text>
    );
  }
  if (hasPermission === false) {
    return <Text style={styles.infoText}>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title="Recommencer le scan" onPress={() => setScanned(false)} />
      )}
      {message !== "" && <Text style={styles.messageText}>{message}</Text>}
      <Button title="Retour" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
  },
  messageText: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    margin: 10,
  },
});
