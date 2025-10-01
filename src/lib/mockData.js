export const ROADMAP_DATA = {
  'trader-path': {
    id: 'trader-path',
    name: "The Trader's Path",
    description: "The mandatory starting point for all new traders. Master the core concepts before specializing.",
    type: 'fundamental',
    categories: [
      {
        name: 'Part 1: The Jungle',
        modules: [
          { id: 'm_markets', title: 'Financial Markets', description: 'Understand the arenas where trading happens.', xpRequired: 0, chapterCount: 4 },
          { id: 'm_language', title: "The Trader's Language", description: 'Learn to read charts and key terms.', xpRequired: 100, chapterCount: 3 },
          { id: 'm_tools', title: "The Trader's Tools", description: 'Discover platforms, brokers, and order types.', xpRequired: 200, chapterCount: 0 },
        ],
      },
      {
        name: 'Part 2: The Arsenal',
        modules: [
          { id: 'm_tech_101', title: 'Technical Analysis 101', description: 'Use data to predict future movements.', xpRequired: 300, chapterCount: 0 },
          { id: 'm_funda_101', title: 'Fundamental Analysis 101', description: 'Use news and economics to find opportunities.', xpRequired: 400, chapterCount: 0 },
          { id: 'm_risk', title: 'The Shield: Risk Management', description: 'The most crucial skill: protecting your capital.', xpRequired: 500, chapterCount: 0 },
        ],
      },
    ],
  },
  'day-trading-path': {
    id: 'day-trading-path',
    name: 'Career: Day Trader',
    description: 'Master the art of high-frequency trading within a single day.',
    type: 'specialization',
    modules: [
      { id: 'm_dt_open', title: 'Opening Range Strategies', description: 'Learn to trade the first minutes of the market open.', xpRequired: 0, chapterCount: 0 },
      { id: 'm_dt_scalp', title: 'The Art of Scalping', description: 'Master quick, small-profit trades.', xpRequired: 100, chapterCount: 0 },
      { id: 'm_dt_news', title: 'Trading the News', description: 'Capitalize on market volatility during economic events.', xpRequired: 200, chapterCount: 0 },
    ],
  },
  'swing-trading-path': {
    id: 'swing-trading-path',
    name: 'Career: Swing Trader',
    description: 'Learn to hold positions for several days to capture larger market moves.',
    type: 'specialization',
    modules: [
        { id: 'm_st_trends', title: 'Identifying Multi-Day Trends', description: 'Learn to spot and follow long-term trends.', xpRequired: 0, chapterCount: 0 },
        { id: 'm_st_ma', title: 'Moving Average Strategies', description: 'Use moving averages to make entry and exit decisions.', xpRequired: 100, chapterCount: 0 },
    ],
  },
};

export const CHAPTERS = {
  'm_markets': [
    { id: 'c1', moduleId: 'm_markets', title: 'What is a Market?', order: 1 },
    { id: 'c2', moduleId: 'm_markets', title: 'Types of Markets', order: 2 },
    { id: 'c3', moduleId: 'm_markets', title: 'Key Terminology', order: 3 },
    { id: 'cq1', moduleId: 'm_markets', title: 'Module 1 Quiz', order: 4, type: 'quiz' },
  ],
  'm_language': [
    { id: 'c4', moduleId: 'm_language', title: 'Understanding Candlesticks', order: 1 },
    { id: 'c5', moduleId: 'm_language', title: 'Basic Bullish Patterns', order: 2 },
    { id: 'c6', moduleId: 'm_language', title: 'Basic Bearish Patterns', order: 3 },
  ]
};

export const CHAPTER_CONTENT = {
  'c1': { type: 'text', content: 'A financial market is a broad term...' },
  'c2': { type: 'text', content: 'There are many types of financial markets...' },
  'c3': { type: 'text', content: 'Bulls are investors who believe...' },
  'c4': { type: 'text', content: 'A candlestick chart is a style of financial chart...' },
  'c5': { type: 'text', content: 'Bullish patterns, like the Hammer...' },
  'c6': { type: 'text', content: 'Bearish patterns, such as the Shooting Star...' },
  'cq1': { type: 'quiz', quizId: 'q1' },
};

export const QUIZZES = {
  'q1': {
    title: 'Module 1 Knowledge Check',
    questions: [
      { id: 'q1_1', text: 'Which term describes an investor who believes the market will go up?', options: ['Bear', 'Bull', 'Wolf', 'Whale'], correctAnswer: 'Bull' },
      { id: 'q1_2', text: 'What does "Forex" stand for?', options: ['Foreign Exchange', 'Forward Exchange', 'Four Exchanges', 'Foreign Export'], correctAnswer: 'Foreign Exchange' },
    ],
  },
};
