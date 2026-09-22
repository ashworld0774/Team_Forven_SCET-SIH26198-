import React from 'react';
import { View, Text } from 'react-native';

// Pure React Native SVG-style icons using text/unicode
export const Icon = ({ name, size = 24, color = '#333' }) => {
  const icons = {
    home: '⌂',
    person: '👤',
    chat: '💬',
    info: 'ⓘ',
    language: '🌐',
    scanner: '⊞',
    logout: '⇥',
    bell: '🔔',
    menu: '≡',
    back: '←',
    heart: '♡',
    heartFilled: '♥',
    share: '↗',
    close: '✕',
    search: '⌕',
    edit: '✎',
    check: '✓',
    location: '◎',
    category: '▦',
    wireframe: '⊹',
    cube: '⬡',
    ar: 'AR',
    xray: '☢',
    mri: '⊛',
    ct: '⊕',
    send: '➤',
    star: '★',
    email: '✉',
    lock: '🔒',
    expand: '⤢',
  };
  return (
    <Text style={{ fontSize: size, color, lineHeight: size + 4 }}>
      {icons[name] || '•'}
    </Text>
  );
};