export const learnerTypes = [
  { id: 'school', label: 'School Student', icon: 'GraduationCap', desc: 'Grades 6 through 12, board exams and beyond.' },
  { id: 'college', label: 'College Student', icon: 'Landmark', desc: 'Engineering, science, or any semester-based degree.' },
  { id: 'placement', label: 'Placement Prep', icon: 'Briefcase', desc: 'DSA, CS fundamentals, and interview readiness.' },
  { id: 'competitive', label: 'Competitive Exam', icon: 'Target', desc: 'JEE, NEET, GATE, UPSC and similar tracks.' },
  { id: 'skill', label: 'Skill Learning', icon: 'Sparkles', desc: 'Pick up a new skill at your own pace, no syllabus required.' },
]

export const boards = ['CBSE', 'ICSE', 'GSEB', 'State Board']
export const mediums = ['English', 'Gujarati', 'Hindi']
export const classes = ['6', '7', '8', '9', '10', '11', '12']
export const streams = [
  { id: 'science', label: 'Science', icon: 'FlaskConical' },
  { id: 'commerce', label: 'Commerce', icon: 'LineChart' },
  { id: 'arts', label: 'Arts', icon: 'Palette' },
]

export const universities = ['GTU', 'Mumbai University', 'SPPU', 'Anna University', 'VTU']
export const branches = ['Computer Engineering', 'Information Technology', 'CS (AI & ML)', 'Mechanical', 'Civil', 'Electrical']
export const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']

export const goalModes = [
  {
    id: 'pass',
    label: 'Pass Mode',
    emoji: '🟢',
    accent: 'emerald',
    tagline: 'I just want to pass.',
    resources: ['Simple notes', 'Easy videos', 'Important questions'],
  },
  {
    id: 'average',
    label: 'Average Mode',
    emoji: '🔵',
    accent: 'blue',
    tagline: 'I want around 60–75%.',
    resources: ['Good tutorials', 'Practice questions', 'Standard notes', 'Assignments'],
  },
  {
    id: 'topper',
    label: 'Topper Mode',
    emoji: '🟣',
    accent: 'purple',
    tagline: 'I want 85%+.',
    resources: ['Best YouTube playlists', 'Advanced notes', 'Interview questions', 'PYQs', 'Extra practice', 'Hidden concepts'],
  },
]
