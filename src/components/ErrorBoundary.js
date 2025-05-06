import React, { Component } from "react";
import { View, Text } from "react-native";
import Error from "../../assets/icons/Error";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-elements";
import SkyStars from "../../assets/icons/SkyStars";
import { ThemeContext } from "../contexts/ThemeContext";
import { createStyles } from "../utils/styles";
import i18n from "../i18n/i18n"; 

class ErrorBoundary extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error capturado por ErrorBoundary:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false });
    if (this.props.navigation) {
      this.props.navigation.navigate("Home");
    }
  };

  render() {
    const { theme } = this.context;
    const styles = createStyles(theme);

    if (this.state.hasError) {
      return (
        <LinearGradient
          colors={[
            theme.homeBackground1,
            theme.homeBackground2,
            theme.homeBackground4,
            theme.homeBackground4,
            theme.homeBackground4,
            theme.homeBackground2,
            theme.homeBackground2,
            theme.errorBackground2,
            theme.errorBackground1,
          ]}
          style={styles.errorContainer}
        >
          <SkyStars style={styles.skyStars} />
          <Error style={styles.errorIcon} />
          <View style={styles.UpsContainer}>
            <Text style={styles.UpsText}>{i18n.t("error.Ups")}</Text>
            <Text style={styles.UpsText}>{i18n.t("error.Mal")}</Text>
            <Text style={styles.UpsTextInfo}>{i18n.t("error.Intentar")}</Text>

            <Button
              buttonStyle={styles.ErrorButton}
              titleStyle={styles.ErrorButtonTitle}
              title={i18n.t("error.Boton")}
              onPress={this.resetError}
            />
          </View>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
