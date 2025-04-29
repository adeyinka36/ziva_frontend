declare module 'react-native-confetti' {
  import { Component } from 'react';
  
  interface ConfettiProps {
    duration?: number;
  }

  export default class Confetti extends Component<ConfettiProps> {
    start(): void;
    stop(): void;
  }
} 