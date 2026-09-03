import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@contexts/ThemeContext";
import HomeScreen from "@screens/HomeScreen";

function App(): React.JSX.Element {
  return (
    // Toàn bộ cây App phải nằm trong SafeAreaProvider — chỉ cần khai báo 1 lần duy nhất ở gốc
    <SafeAreaProvider>
      {/* ThemeProvider giữ nguyên từ Sprint 3 (Chương 3) */}
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
