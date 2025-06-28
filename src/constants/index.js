export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'Contact',
    href: '#contact',
  },
];

export const clientReviews = [
  {
    id: 1,
    name: 'Emily Johnson',
    position: 'Marketing Director at GreenLeaf',
    img: 'assets/review1.png',
    review:
      'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
  },
  {
    id: 2,
    name: 'Mark Rogers',
    position: 'Founder of TechGear Shop',
    img: 'assets/review2.png',
    review:
      'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
  },
  {
    id: 3,
    name: 'John Dohsas',
    position: 'Project Manager at UrbanTech ',
    img: 'assets/review3.png',
    review:
      'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
  },
  {
    id: 4,
    name: 'Ether Smith',
    position: 'CEO of BrightStar Enterprises',
    img: 'assets/review4.png',
    review:
      'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
  },
];

export const myProjects = [
    {
    title: 'Scheduler',
    desc: 'A task prioritization app that intelligently categorizes and schedules tasks with real-time updates.',
    subdesc: 'Created with Python, Flask, HTML, and JavaScript. Features include dynamic UI updates and cloud deployment on Zeet and GCP.',
    href: 'https://scheduler-0r4v-main-qnxr6lu2aq-wm.a.run.app/',
    texture: '/textures/project/schedular.mp4',
    logo: 'assets/Schedular Logo.png',
    logoStyle: {
      backgroundColor: '#0000',
      border: '0.2px solid rgba(208, 213, 221, 1)',
      boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      { id: 1, name: 'Flask', path: 'assets/Flask.png' },
      { id: 2, name: 'JavaScript', path: '/assets/Java logo.png' },
      { id: 3, name: 'Zeet', path: '/assets/Google-Cloud-Symbol.png' },
      { id:4, name:'Python', path: '/assets/Python.png' },
    ],
  },
  {
    title: 'Habit Builder',
    desc: 'A secure habit tracking web app with user authentication and personalized tracking features.',
    subdesc: 'Built using Django, SQL, and JavaScript. Includes habit tracking, sub-task management, and custom reminders with a dynamic HTML/CSS interface.',
    href: 'https://github.com/MalharUofA/HabitBuilder',
    texture: '/textures/project/Habit builder.mp4',
    logo: 'assets/Habit builder logo.png ',
    logoStyle: {
      backgroundColor: '#60f5a1',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      { id: 1, name: 'Django', path: 'assets/djangoproject.svg' },
      { id: 2, name: 'SQL', path: 'assets/SQL.png' },
      { id: 3, name: 'JavaScript', path: 'assets/Js.jpg' },
      { id:4, name:'Python', path: '/assets/Python.png' },
    ],
  },
  {
    title: 'MovieVerse',
    desc: 'A movie discovery app that allows users to explore movies, view ratings, and build a favorites list.',
    subdesc: 'Developed with React.js, JavaScript, and TMDb API. Features include API integration, component reuse, and animated rating display.',
    href: 'https://github.com/MalharUofA/MovieVerse',
    texture: '/textures/project/movieverse.mp4',
    logo: 'assets/Movieverse logo.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      { id: 1, name: 'React.js', path: '/assets/react.svg' },
      { id: 2, name: 'JavaScript', path: 'assets/Js.jpg' },
    ],
  },

  {
    title: 'Aethon Events',
    desc: 'An event management Android app with role-based access, QR-based check-ins, and live notifications.',
    subdesc: 'Built using Java, Android Studio, Firebase, and Google Maps API. Integrated FCM for real-time updates and geolocation features.',
    href: 'https://github.com/CMPUT301F24helios/Aethon-Events',
    texture: '/textures/project/aethon.mp4',
    logo: 'assets/aethon logo.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      { id: 1, name: 'Java', path: '/assets/Java logo.png' },
      { id: 2, name: 'Firebase', path: '/assets/firebase logo.png' },
      { id: 3, name: 'Android Studio', path: '/assets/android studio.png' },
    ],
  },
  {
    title: 'Last Ferry to Crocuta',
    desc: 'A Unity-based card-battle game with four game modes, enemy AI scaling, and 10-level progression.',
    subdesc: 'Built using C# and Unity as a capstone project, focused on gameplay logic, difficulty scaling, and level persistence.',
    href: 'https://team-playing-mantis.itch.io/last-ferry-to-crocuta',
    texture: '/textures/project/last ferry to crocuta.mp4',
    logo: 'assets/Last Ferry to Crocuta.png',
    logoStyle: {
      backgroundColor: '#1B1B1B',
      border: '0.2px solid #2E2E2E',
      boxShadow: '0px 0px 60px 0px #AAAAAA4D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      { id: 1, name: 'C#', path: 'assets/csharp.png' },
      { id: 2, name: 'Unity', path: 'assets/Unity.png' },
    ],
  },
];



export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -6.5, 0] : isTablet ? [5, -5, 0] : [16, -5.7, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [15, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-15, 19, 0] : isTablet ? [-12, 10, 0] : [-32, 13, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-23, -10, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'University of Alberta',
    pos: 'Research Assistant – Cyber-Physical Systems',
    duration: 'Jan 2024 – Aug 2025',
    title: [
      'Worked under Professor Biao on cyberattack-resilient control systems.',
      'Developed a full-stack Python-based detection system using CNNs and statistical models.',
      'Achieved 99.56% accuracy in detecting four stealthy cyberattacks.',
      'Converted sensor time series into images using Gramian Angular Fields.',
      'Created real-time dashboards for monitoring with Plotly Dash.',
      'Tested and deployed on Linux-based systems.',
    ],
    icon: 'assets/ualberta.jpg',
  },
];
