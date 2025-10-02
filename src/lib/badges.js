// This file contains the metadata for all available badges in the application.
// The key for each badge should correspond to the `badgeId` stored in Firestore.

export const BADGES = {
  'first_trade': {
    id: 'first_trade',
    name: 'First Trade',
    description: 'You executed your very first trade in the simulator.',
    icon: '/assets/badges/badge_first_trade.svg', // Example path
  },
  'module_basics': {
    id: 'module_basics',
    name: 'Trading Novice',
    description: 'You completed the "Basics of Trading" module.',
    icon: '/assets/badges/badge_basics.svg',
  },
  'profitable_trade': {
    id: 'profitable_trade',
    name: 'Profit Maker',
    description: 'You closed your first profitable trade.',
    icon: '/assets/badges/badge_profit.svg',
  },
  'level_5': {
    id: 'level_5',
    name: 'Level 5 Scholar',
    description: 'You reached Level 5 by earning XP.',
    icon: '/assets/badges/badge_level_5.svg',
  },
  'crypto_trade': {
    id: 'crypto_trade',
    name: 'Crypto Pioneer',
    description: 'You made your first trade on a cryptocurrency.',
    icon: '/assets/badges/badge_crypto.svg',
  },
  'forex_trade': {
    id: 'forex_trade',
    name: 'Forex Explorer',
    description: 'You made your first trade in the forex market.',
    icon: '/assets/badges/badge_forex.svg',
  }
};
