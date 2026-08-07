export const demoUsername = 'guest_explorer'

export const demoMyProfile = {
  username: demoUsername,
  email: 'demo@learnix.app',
  level: 4,
  xp: 620,
  total_xp: 3620,
  streak_days: 6,
  education_type: 'college',
  board: null,
  medium: null,
  class_name: null,
  stream: null,
  university: 'Demo University',
  branch: 'Computer Engineering',
  semester: 4,
  goal_mode: 'topper',
}

export const demoDashboard = {
  todays_mission: {
    topic_id: 9002,
    topic_name: 'CSS Flexbox & Grid',
    subject_name: 'Web Development Fundamentals',
    xp_reward: 120,
  },
  overall_progress: 42,
  daily_goal_minutes: 60,
  weekly_goal_minutes: 420,
  weekly_progress_minutes: 245,
  recently_completed: [
    { topic_id: 9001, topic_name: 'HTML Fundamentals', subject_name: 'Web Development Fundamentals', completed_on: '2026-08-05', xp: 100 },
    { topic_id: 9006, topic_name: 'Introduction to Python', subject_name: 'Python for Data Science', completed_on: '2026-08-04', xp: 90 },
  ],
  profile: {
    level: 4,
    xp: 620,
    xp_to_next_level: 380,
    streak_days: 6,
  },
}

export const demoSubjects = [
  {
    id: 9100,
    name: 'Web Development Fundamentals',
    icon: '',
    accent: 'emerald',
    difficulty: 'Medium',
    estimated_hours: 40,
    university: 'Demo University',
    branch: 'Computer Engineering',
    semester: 4,
    completion: 42,
    topics_completed: 3,
    topics_total: 7,
    xp_earned: 310,
    is_enrolled: true,
  },
  {
    id: 9200,
    name: 'Python for Data Science',
    icon: '',
    accent: 'blue',
    difficulty: 'Medium',
    estimated_hours: 35,
    university: 'Demo University',
    branch: 'Computer Engineering',
    semester: 4,
    completion: 25,
    topics_completed: 1,
    topics_total: 4,
    xp_earned: 90,
    is_enrolled: true,
  },
  {
    id: 9300,
    name: 'Financial Accounting Basics',
    icon: '',
    accent: 'gold',
    difficulty: 'Easy',
    estimated_hours: 20,
    university: null,
    branch: null,
    semester: null,
    completion: 0,
    topics_completed: 0,
    topics_total: 5,
    xp_earned: 0,
    is_enrolled: false,
  },
]

export const demoTopicsBySubject = {
  9100: [
    { id: 9001, subject: 9100, name: 'HTML Fundamentals', description: 'Structure web pages using semantic HTML5 elements, forms, and accessibility basics.', prerequisites: [], estimated_hours: 5, difficulty: 'Easy', xp: 100, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'completed', completion: 100 },
    { id: 9002, subject: 9100, name: 'CSS Flexbox & Grid', description: 'Build responsive layouts using modern CSS layout systems.', prerequisites: [9001], estimated_hours: 6, difficulty: 'Medium', xp: 120, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'current', completion: 45 },
    { id: 9003, subject: 9100, name: 'JavaScript Basics', description: 'Variables, functions, control flow, and DOM manipulation.', prerequisites: [9001], estimated_hours: 8, difficulty: 'Medium', xp: 150, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'completed', completion: 100 },
    { id: 9004, subject: 9100, name: 'Responsive Design', description: 'Media queries, mobile-first design, and cross-device layouts.', prerequisites: [9002], estimated_hours: 5, difficulty: 'Medium', xp: 110, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9005, subject: 9100, name: 'Fetch API & AJAX', description: 'Make asynchronous requests and work with JSON data.', prerequisites: [9003], estimated_hours: 6, difficulty: 'Hard', xp: 160, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9007, subject: 9100, name: 'React Fundamentals', description: 'Components, props, state, and hooks.', prerequisites: [9004, 9005], estimated_hours: 8, difficulty: 'Hard', xp: 180, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9008, subject: 9100, name: 'Full-Stack Capstone Project', description: 'Combine everything into a deployed full-stack application.', prerequisites: [9007], estimated_hours: 12, difficulty: 'Hard', xp: 300, icon: '', is_boss: true, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
  ],
  9200: [
    { id: 9006, subject: 9200, name: 'Introduction to Python', description: 'Syntax, variables, data types, and basic control flow.', prerequisites: [], estimated_hours: 5, difficulty: 'Easy', xp: 90, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'completed', completion: 100 },
    { id: 9009, subject: 9200, name: 'NumPy Arrays', description: 'Vectorized numerical computing with NumPy.', prerequisites: [9006], estimated_hours: 6, difficulty: 'Medium', xp: 120, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'unlocked', completion: 0 },
    { id: 9010, subject: 9200, name: 'Pandas DataFrames', description: 'Load, clean, and analyze tabular data.', prerequisites: [9009], estimated_hours: 8, difficulty: 'Medium', xp: 140, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9011, subject: 9200, name: 'Data Visualization', description: 'Charting with Matplotlib and Seaborn.', prerequisites: [9010], estimated_hours: 6, difficulty: 'Medium', xp: 130, icon: '', is_boss: true, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
  ],
  9300: [
    { id: 9012, subject: 9300, name: 'The Accounting Equation', description: 'Assets, liabilities, and equity fundamentals.', prerequisites: [], estimated_hours: 3, difficulty: 'Easy', xp: 70, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9013, subject: 9300, name: 'Journal Entries', description: 'Recording financial transactions using debits and credits.', prerequisites: [9012], estimated_hours: 4, difficulty: 'Easy', xp: 80, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9014, subject: 9300, name: 'The Balance Sheet', description: 'Structuring and interpreting a company balance sheet.', prerequisites: [9013], estimated_hours: 4, difficulty: 'Medium', xp: 90, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9015, subject: 9300, name: 'Income Statements', description: 'Revenue, expenses, and net income reporting.', prerequisites: [9013], estimated_hours: 4, difficulty: 'Medium', xp: 90, icon: '', is_boss: false, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
    { id: 9016, subject: 9300, name: 'Financial Ratio Analysis', description: 'Liquidity, profitability, and solvency ratios.', prerequisites: [9014, 9015], estimated_hours: 5, difficulty: 'Hard', xp: 120, icon: '', is_boss: true, position_x: 0, position_y: 0, status: 'locked', completion: 0 },
  ],
}

export const demoResources = [
  { id: 9501, topic: 9001, title: 'HTML5 Crash Course For Beginners', type: 'youtube', platform: 'YouTube', creator: 'Traversy Media', url: 'https://www.youtube.com/results?search_query=html5+crash+course', duration: '', views: '', rating: '0.0', difficulty: 'Easy', thumbnail_color: 'emerald', is_bookmarked: true },
  { id: 9502, topic: 9002, title: 'CSS Flexbox in 15 Minutes', type: 'youtube', platform: 'YouTube', creator: 'Web Dev Simplified', url: 'https://www.youtube.com/results?search_query=css+flexbox', duration: '', views: '', rating: '0.0', difficulty: 'Medium', thumbnail_color: 'blue', is_bookmarked: false },
  { id: 9503, topic: 9003, title: 'JavaScript DOM Manipulation Full Course', type: 'youtube', platform: 'YouTube', creator: 'freeCodeCamp', url: 'https://www.youtube.com/results?search_query=javascript+dom+manipulation', duration: '', views: '', rating: '0.0', difficulty: 'Medium', thumbnail_color: 'gold', is_bookmarked: true },
  { id: 9504, topic: 9006, title: 'Python Tutorial for Beginners', type: 'youtube', platform: 'YouTube', creator: 'Programming with Mosh', url: 'https://www.youtube.com/results?search_query=python+tutorial+for+beginners', duration: '', views: '', rating: '0.0', difficulty: 'Easy', thumbnail_color: 'purple', is_bookmarked: false },
]

export const demoBookmarks = [
  { id: 8801, resource: 9501, resource_detail: demoResources[0], created_at: '2026-08-01T10:00:00Z' },
  { id: 8802, resource: 9503, resource_detail: demoResources[2], created_at: '2026-08-02T14:30:00Z' },
]

export const demoAchievements = [
  { id: 7701, name: 'First Topic', description: 'Complete your very first topic.', icon: '', tier: 'bronze', xp_reward: 50, unlocked: true, progress_pct: 100, unlocked_date: '2026-08-01' },
  { id: 7702, name: '5 Topics Completed', description: 'Complete 5 topics total.', icon: '', tier: 'silver', xp_reward: 100, unlocked: false, progress_pct: 60, unlocked_date: null },
  { id: 7703, name: 'Subject Complete', description: 'Finish every topic in a subject.', icon: '', tier: 'gold', xp_reward: 300, unlocked: false, progress_pct: 43, unlocked_date: null },
  { id: 7704, name: 'Quiz Ace', description: 'Score 100% on a practice quiz.', icon: '', tier: 'silver', xp_reward: 150, unlocked: true, progress_pct: 100, unlocked_date: '2026-08-03' },
  { id: 7705, name: 'Quiz Master', description: 'Complete 5 quiz attempts.', icon: '', tier: 'gold', xp_reward: 250, unlocked: false, progress_pct: 40, unlocked_date: null },
  { id: 7706, name: 'Level 5', description: 'Reach profile level 5.', icon: '', tier: 'gold', xp_reward: 200, unlocked: false, progress_pct: 80, unlocked_date: null },
  { id: 7707, name: 'Syllabus Creator', description: 'Generate your first AI syllabus tree.', icon: '', tier: 'platinum', xp_reward: 400, unlocked: true, progress_pct: 100, unlocked_date: '2026-07-28' },
]

export const demoLeaderboard = [
  { username: 'code_ninja_23', level: 9, total_xp: 8420, rank: 1 },
  { username: 'priya_learns', level: 8, total_xp: 7650, rank: 2 },
  { username: 'devMax', level: 7, total_xp: 6100, rank: 3 },
  { username: demoUsername, level: 4, total_xp: 3620, rank: 4 },
  { username: 'sara_codes', level: 4, total_xp: 3200, rank: 5 },
  { username: 'ananya_dev', level: 3, total_xp: 2150, rank: 6 },
]

export const demoAnalytics = {
  weeklyStudyTime: [
    { day: 'Fri', hours: 1.2 }, { day: 'Sat', hours: 2.0 }, { day: 'Sun', hours: 0.5 },
    { day: 'Mon', hours: 1.5 }, { day: 'Tue', hours: 0.8 }, { day: 'Wed', hours: 1.0 }, { day: 'Thu', hours: 1.1 },
  ],
  completionRate: 34,
  xpTimeline: [
    { date: 'Jun 08', xp: 200 }, { date: 'Jun 15', xp: 550 }, { date: 'Jun 22', xp: 900 },
    { date: 'Jun 29', xp: 1400 }, { date: 'Jul 06', xp: 1900 }, { date: 'Jul 13', xp: 2400 },
    { date: 'Jul 20', xp: 2900 }, { date: 'Jul 27', xp: 3200 }, { date: 'Aug 03', xp: 3620 },
  ],
  completionRadar: [
    { subject: 'Web Dev Fund', value: 42 }, { subject: 'Python for DS', value: 25 }, { subject: 'Financial Acc', value: 0 },
  ],
  subjectComparison: [
    { subject: 'Web Dev Fund', hours: 12.5 }, { subject: 'Python for DS', hours: 5.0 }, { subject: 'Financial Acc', hours: 0 },
  ],
  dailyActivityHeatmap: Array.from({ length: 70 }, (_, i) => (i > 55 ? [0, 1, 2, 3, 1, 2, 0][i % 7] : 0)),
  quizHistory: [
    { topic_name: 'HTML Fundamentals', score: 5, total: 5, percentage: 100, taken_at: 'Aug 03' },
    { topic_name: 'JavaScript Basics', score: 4, total: 5, percentage: 80, taken_at: 'Aug 04' },
    { topic_name: 'Introduction to Python', score: 3, total: 5, percentage: 60, taken_at: 'Aug 05' },
  ],
  avgQuizScore: 80,
}

export const demoTutorial = {
  concept: 'CSS Flexbox is a one-dimensional layout model that lets you distribute space and align items within a container, even when their size is unknown or dynamic. It solves layout problems (vertical centering, equal-width columns, responsive ordering) that used to require hacky float or positioning tricks.',
  key_points: [
    { title: 'The Flex Container', explanation: 'Any element becomes a flex container by setting display: flex, turning its direct children into flex items.', is_code: true, code: '.container {\n  display: flex;\n}', details: ['display: string, set to "flex" or "inline-flex" to activate flex layout'] },
    { title: 'Main Axis Direction', explanation: 'flex-direction controls whether items lay out in a row or column.', is_code: true, code: '.container {\n  flex-direction: row; /* or column */\n}', details: ['flex-direction: string, default "row" — row | row-reverse | column | column-reverse'] },
    { title: 'Justify Content', explanation: 'justify-content aligns items along the main axis.', is_code: true, code: '.container {\n  justify-content: space-between;\n}', details: ['justify-content: string — flex-start | center | space-between | space-around | space-evenly'] },
    { title: 'Align Items', explanation: 'align-items aligns items along the cross axis (perpendicular to the main axis).', is_code: true, code: '.container {\n  align-items: center;\n}', details: ['align-items: string — stretch (default) | flex-start | center | flex-end | baseline'] },
    { title: 'Flex Grow and Shrink', explanation: 'Individual items can grow or shrink to fill available space using the flex shorthand.', is_code: true, code: '.item {\n  flex: 1;\n}', details: ['flex-grow: number, default 0', 'flex-shrink: number, default 1', 'flex-basis: length, default auto'] },
    { title: 'When to Use Grid Instead', explanation: 'CSS Grid is better suited for two-dimensional layouts (rows AND columns together), while Flexbox excels at one-dimensional layouts.', is_code: false, code: 'Use Flexbox for navigation bars, button groups, and centering content. Use Grid for full page layouts, image galleries, and dashboards with rows and columns.', details: [] },
  ],
  examples: [
    { title: 'Example 1: Centering Content', description: 'Perfectly center a single child both horizontally and vertically.', is_code: true, code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 300px;\n}', output: 'The child element appears exactly centered within the 300px container.' },
    { title: 'Example 2: Equal-Width Columns', description: 'Create three columns that automatically share the available width equally.', is_code: true, code: '.row { display: flex; }\n.col { flex: 1; }', output: 'Three .col elements each take up exactly one third of the row width.' },
    { title: 'Example 3: Responsive Navbar', description: 'A navbar with a logo on the left and links pushed to the right.', is_code: true, code: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}', output: 'The logo stays left-aligned while nav links are pushed to the far right edge.' },
  ],
}

export const demoQuizQuestions = [
  {
    question: 'Which CSS property is used to change the direction of flex items (row vs column)?',
    options: ['justify-content', 'flex-direction', 'align-items', 'flex-wrap'],
    correct_index: 1,
    solution_steps: ['Identify which flex property controls the main axis orientation.', 'Recall that flex-direction specifically sets row or column layout.'],
    worked_solution: ['flex-direction: row (default) lays items left to right.', 'flex-direction: column lays items top to bottom.'],
    why_correct: 'flex-direction is the only listed property that controls the axis orientation of the flex container.',
    topic_name: '',
  },
  {
    question: 'What does justify-content: space-between do?',
    options: ['Centers all items with no gaps', 'Distributes items with equal space between them, none at the edges', 'Stretches items to fill the container', 'Reverses the item order'],
    correct_index: 1,
    solution_steps: ['Recall the different justify-content values.', 'Distinguish space-between from space-around and center.'],
    worked_solution: ['space-between places the first item at the start and the last at the end.', 'Remaining space is split evenly between the items in the middle.'],
    why_correct: 'space-between specifically avoids adding space at the outer edges, unlike space-around.',
    topic_name: '',
  },
  {
    question: 'Which property would you use to make a flex item grow to fill remaining space?',
    options: ['flex-shrink', 'flex-basis', 'flex-grow', 'align-self'],
    correct_index: 2,
    solution_steps: ['Identify which flex sub-property controls growth behavior.'],
    worked_solution: ['flex-grow: 1 tells the browser this item should expand to consume leftover space.', 'flex-grow: 0 (default) means the item will not grow beyond its base size.'],
    why_correct: 'flex-grow is specifically the property that controls how much an item expands relative to its siblings.',
    topic_name: '',
  },
]

export const demoCodePracticeQuestions = [
  {
    problem_statement: 'Write CSS for a container with three child divs so they are evenly spaced across the full width with equal gaps between them, but no gap at the very edges.',
    is_code: true,
    starter_code: '.container {\n  display: flex;\n  /* your code here */\n}',
    solution_code: '.container {\n  display: flex;\n  justify-content: space-between;\n}',
    solution_explanation: 'display: flex activates flex layout on the container. justify-content: space-between distributes the three children so the first touches the left edge, the last touches the right edge, and the remaining space is split evenly between them.',
  },
  {
    problem_statement: 'Create a flex container that centers a single child both horizontally and vertically within a 400px tall box.',
    is_code: true,
    starter_code: '',
    solution_code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 400px;\n}',
    solution_explanation: 'justify-content: center handles horizontal centering along the main axis, while align-items: center handles vertical centering along the cross axis — together they center the child in both directions.',
  },
]

export const demoChatHistory = [
  { id: 1, role: 'user', content: 'Whats the difference between justify-content and align-items?', created_at: '2026-08-05T10:00:00Z' },
  { id: 2, role: 'assistant', content: "Great question! Think of it this way:\n\n- **justify-content** controls alignment along the **main axis** (horizontal, by default)\n- **align-items** controls alignment along the **cross axis** (vertical, by default)\n\nIf you switch `flex-direction` to `column`, these swap — justify-content becomes vertical and align-items becomes horizontal.\n\nWant a quick visual example?", created_at: '2026-08-05T10:00:05Z' },
]