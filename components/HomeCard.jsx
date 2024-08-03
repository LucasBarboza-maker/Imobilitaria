import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const Card = ({ title, value, icon, imageSource, padding }) => {
  return (
    <View style={{...styles.cardContainer, padding:padding}}>
      <ImageBackground source={imageSource} style={styles.imageBackground} imageStyle={{ borderRadius: 10 }}>
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={styles.gradient}
        />
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            <Icon name={icon} size={24} color="#fff" style={styles.icon} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 175,
    height: 175,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  textContainer: {
    alignItems: 'flex-start',
    height:'100%',
    justifyContent:'flex-end'
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  icon: {
    position:'absolute',
    alignSelf: 'flex-end',
  },
});

export default Card;
