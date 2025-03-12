import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface CircularProgressBarProps {
  percentage: number; // Value between 0 and 100
  points: number;     // Points to display inside the circle
  size: number;       // Percentage of the screen width to use as diameter (e.g., 50 for 50%)
  strokeWidth?: number; // Optional stroke width, default is 10
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  points,
  size,
  strokeWidth = 10,
}) => {
  // Calculate diameter based on screen width percentage
  const diameter = wp(`${size}%`);
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Define colors (adjust these as needed or integrate with your theme)
  const secondaryColor = '#4e2b00';   // Background ring color
  const primaryColor = '#ffc75f'; // Progress (shaded) ring color

  return (
    <View className="relative items-center justify-center">
      <Svg height={diameter} width={diameter}>
        {/* Background Circle */}
        <Circle
          stroke={primaryColor}
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          stroke={secondaryColor}
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          // Rotate so the progress starts at the top
          transform={`rotate(0 ${diameter / 2} ${diameter / 2})`}
        />
      </Svg>
      {/* Centered Points Text */}
      <View className="absolute">
        <View className="text-xl font-bold text-secondary flex-column justify-center items-center">
          <Text className='font-bold'>{points}</Text> 
          <Text>zivas</Text>
        </View>
      </View>
    </View>
  );
};

export default CircularProgressBar;
