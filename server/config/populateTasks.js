const mongoose = require("mongoose");
const Task = require("../models/Task");
require("dotenv").config({ path: "../.env" });

const tasks = {
  routine: {
    morning: [
      "Wake up before 6:30 AM",
      "Drink 2 glasses of water immediately",
      "Write 3 things you are grateful for",
      "Meditate for 10 minutes",
      "Plan your day — top 3 priorities",
      "No phone for first 1 hour",
      "Eat a healthy breakfast mindfully",
      "Read for 20 minutes",
      "Light stretching or yoga for 10 min",
      "Affirmations — say 5 positive things aloud",
      "Journal your thoughts for 5 minutes",
      "Prepare your outfit and bag the night before",
      "Review your weekly goals",
      "Take a cold shower for energy",
    ],
    mindful: [
      "No social media before 10 AM",
      "Spend 10 minutes in silence",
      "Write how you feel today honestly",
      "Do a 5 minute breathing exercise",
      "Limit screen time to 2 hours today",
      "Go outside for 15 minutes without phone",
      "Write one thing you want to improve",
      "Cook or prepare your own meal",
      "Spend time with family without devices",
      "Sleep before 10:30 PM tonight",
    ],
    night: [
      "Write 3 wins from today",
      "Plan tomorrow's schedule before sleeping",
      "Read a book for 20 minutes",
      "No screen 30 minutes before bed",
      "Do a 5 minute body scan meditation",
      "Drink herbal tea or warm water",
      "Tidy your desk and bedroom",
      "Write one thing you are proud of today",
      "Reflect — what could you do better tomorrow?",
      "Sleep by 10:30 PM",
      "Dim lights 1 hour before sleep",
      "Review your goals for tomorrow",
      "Write a short journal entry",
      "Practice deep breathing for 5 minutes",
    ],
    digital_detox: [
      "No social media for the entire day",
      "Delete one app you waste time on",
      "No phone at the dining table",
      "Spend 1 hour doing an offline hobby",
      "Turn off all notifications for 4 hours",
      "Read a physical book instead of scrolling",
      "Complete phone-free morning until noon",
    ],
  },

  fitness: {
    core: [
      "30 second plank x 3 sets",
      "20 crunches x 3 sets",
      "15 leg raises x 3 sets",
      "Side plank 20 sec each side x 3",
      "20 bicycle crunches x 3 sets",
      "Flutter kicks for 30 seconds x 3",
      "10 V-ups x 3 sets",
      "Dead bug exercise 10 reps x 3",
      "Mountain climbers 20 reps x 3",
      "Reverse crunches 15 reps x 3",
      "Hollow body hold 20 seconds x 3",
      "Russian twists 20 reps x 3",
      "Toe touches 15 reps x 3",
      "Plank with shoulder taps 10 each side",
      "Full core circuit — all above x 1 set",
    ],
    stretch: [
      "Full body stretch — 15 minutes",
      "Hip flexor stretch — 30 sec each side",
      "Hamstring stretch — 30 sec each leg",
      "Shoulder and neck stretch — 5 min",
      "Seated forward fold — 1 minute",
      "Pigeon pose — 30 sec each side",
      "Cat-cow stretch — 10 reps",
      "Child pose — hold for 1 minute",
      "Chest opener stretch — 30 seconds",
      "Spinal twist — 30 sec each side",
      "Quad stretch standing — 30 sec each",
      "Ankle circles — 10 each direction",
      "Full yoga flow — 20 minutes",
      "Foam roll your legs — 10 minutes",
    ],
    walk: [
      "Walk for 20 minutes at a steady pace",
      "Walk 3000 steps today",
      "Walk after dinner for 15 minutes",
      "Walk to a nearby place instead of driving",
      "Walk 4000 steps and track it",
      "Brisk walk for 25 minutes",
      "Walk in a park or green area today",
      "5000 steps challenge today",
      "Walk with a friend or family member",
      "Morning walk before breakfast — 20 min",
      "Evening walk after work — 25 min",
      "Walk 6000 steps today",
      "Walk and listen to a podcast — 30 min",
      "Walk uphill or stairs for 15 minutes",
      "Walk 7000 steps — final push!",
      "Walk 30 minutes non-stop",
      "Walk in the evening and reflect on your day",
      "Walk 8000 steps today",
      "Walk to your goals — 30 min visualization walk",
      "Final day — walk 10000 steps celebration!",
      "Rest walk — light 15 min stroll",
    ],
    full_body_30: [
      "10 pushups + 10 squats + 10 lunges",
      "Walk or jog for 20 minutes",
      "15 sit-ups + 15 jumping jacks",
      "20 squats + 10 pushups",
      "Stretch full body — 15 minutes",
      "20 jumping jacks + 10 burpees",
      "Jog for 25 minutes",
      "15 pushups + 20 squats + 15 lunges",
      "Core workout — plank + crunches",
      "Rest day — light walk only",
      "Upper body — 3 sets pushups + dips",
      "Lower body — squats + lunges 3 sets",
      "Full body HIIT — 20 minutes",
      "Yoga or stretching — 20 minutes",
      "Jog 30 minutes non-stop",
      "20 pushups + 30 squats",
      "Core circuit — 3 exercises x 3 sets",
      "Walk 5000 steps + 15 pushups",
      "15 min HIIT + 10 min stretch",
      "Active rest — swim or cycle",
      "Full body workout — 45 minutes",
      "Jog 30 min + cool down stretch",
      "25 pushups + 25 squats + 25 lunges",
      "Yoga flow — 30 minutes",
      "HIIT cardio — 25 minutes",
      "Upper + lower body superset — 3 rounds",
      "Walk 7000 steps today",
      "Full body stretch + foam roll",
      "Jog 35 minutes — final push",
      "Final day — your best full body workout!",
    ],
  },

  career: {
    short_10: [
      "Update your LinkedIn headline and summary",
      "Solve 1 easy LeetCode problem",
      "Watch a 15 min tutorial on your skill",
      "Read 5 pages of a career book",
      "Write down your 3 career goals",
      "Research one company you want to work at",
      "Learn one new keyboard shortcut or tool tip",
      "Review your resume — improve one section",
      "Watch a TED Talk on productivity or success",
      "Reach out to one professional connection",
    ],
    medium_21: [
      "Solve 1 LeetCode problem — easy level",
      "Watch a 20 min tutorial on your main skill",
      "Practice coding for 30 minutes",
      "Read 5 pages of a professional book",
      "Improve your LinkedIn or portfolio",
      "Learn 1 new concept in your field",
      "Build a small practice project — day 1",
      "Build a small practice project — day 2",
      "Write about what you learned this week",
      "Review and update your career goals",
      "Watch a talk from an industry expert",
      "Refactor or improve old code",
      "Read a tech article or blog",
      "Explore an open source project",
      "Practice system design — draw a diagram",
      "Mock interview yourself — 15 minutes",
      "Update your portfolio with recent work",
      "Plan a mini project for next week",
      "Research salary trends in your field",
      "Take an online quiz in your skill area",
      "Reflect on your growth — write a summary",
    ],
    long_30: [
      "Set your 30 day career goal clearly",
      "Solve 1 LeetCode easy problem",
      "Watch tutorial on your weakest skill",
      "Practice coding — 45 minutes",
      "Read 10 pages of a tech book",
      "Work on a portfolio project — day 1",
      "Work on a portfolio project — day 2",
      "Work on a portfolio project — day 3",
      "Write a blog post or LinkedIn post",
      "Rest day — review what you learned",
      "Solve 1 LeetCode medium problem",
      "Watch a system design video",
      "Practice your elevator pitch — 2 minutes",
      "Research 3 companies hiring in your field",
      "Apply to 1 job or internship",
      "Work on portfolio project — day 4",
      "Work on portfolio project — day 5 (finish)",
      "Deploy your project online",
      "Share your project on LinkedIn",
      "Mock interview — behavioral questions",
      "Mock interview — technical questions",
      "Learn about DSA — arrays and strings",
      "Learn about DSA — linked lists",
      "Learn about DSA — trees basics",
      "Solve 2 DSA problems of your choice",
      "Revise all concepts learned this month",
      "Update your resume with new project",
      "Ask a senior dev or mentor for feedback",
      "Plan your next 30 day career goal",
      "Final day — celebrate your progress!",
    ],
  },

  study: {
    short_7: [
      "Read your book for 20 minutes at full speed",
      "Summarize what you read in 5 bullet points",
      "Re-read the summary — double the speed",
      "Practice skimming a full article in 3 minutes",
      "Read 2 articles and note main ideas only",
      "Speed read a chapter — time yourself",
      "Final test — read and summarize in 10 minutes",
    ],
    medium_14: [
      "Study for 45 minutes without distraction",
      "Revise yesterday's notes completely",
      "Solve 10 practice questions",
      "Make clean summary notes",
      "Study a difficult topic for 1 hour",
      "Revise key formulas or concepts",
      "Self-test your knowledge — no peeking",
      "Watch an educational video on weak topic",
      "Create a mind map for one chapter",
      "Read your textbook chapter carefully",
      "Solve past exam questions — 30 min",
      "Study using Pomodoro — 4 rounds",
      "Write key points from memory only",
      "Final revision — review all notes",
    ],
    medium_10: [
      "Write your growth goal for this challenge",
      "Read 10 pages of a self-improvement book",
      "Watch a motivational talk — take notes",
      "Journal — what limiting belief do you have?",
      "Replace one negative thought with positive",
      "Practice gratitude — write 5 things",
      "Do something uncomfortable on purpose",
      "Teach someone something you learned",
      "Reflect — how have you grown this week?",
      "Write a letter to your future self",
    ],
    long_21: [
      "Study for 45 minutes without distraction",
      "Revise yesterday's notes",
      "Solve 10 practice questions",
      "Make summary notes",
      "Study a difficult topic for 1 hour",
      "Revise key formulas or concepts",
      "Self-test your knowledge",
      "Watch an educational video",
      "Create a mind map for a topic",
      "Read your textbook chapter",
      "Solve past exam questions",
      "Study in Pomodoro technique — 4 rounds",
      "Discuss a topic with a classmate",
      "Write key points from memory",
      "Review all notes from this week",
      "Make flashcards for difficult terms",
      "Attempt a mock test",
      "Identify your weak areas",
      "Study your weakest topic deeply",
      "Revise everything — final review",
      "Celebrate — you completed the challenge!",
    ],
  },
};

// Challenge ko sahi task list se map karo
const getTaskList = (challengeId, challengeType, duration) => {
  const map = {
    // Old challenges
    "69b4e778c17232ba0df4e316": tasks.fitness.full_body_30,
    "69b4e778c17232ba0df4e317": tasks.career.medium_21,
    "69b4e778c17232ba0df4e318": tasks.routine.morning,
    "69b4e778c17232ba0df4e319": tasks.study.medium_14,
    "69b4e778c17232ba0df4e31a": tasks.study.long_21,
    "69b4e778c17232ba0df4e31b": tasks.fitness.walk,

    // New 15 challenges
    "65f1a2b3c4d5e6f7a8b9c001": tasks.routine.morning,
    "65f1a2b3c4d5e6f7a8b9c002": tasks.fitness.full_body_30,
    "65f1a2b3c4d5e6f7a8b9c003": tasks.career.medium_21,
    "65f1a2b3c4d5e6f7a8b9c004": tasks.study.medium_14,
    "65f1a2b3c4d5e6f7a8b9c005": tasks.routine.mindful,
    "65f1a2b3c4d5e6f7a8b9c006": tasks.fitness.core,
    "65f1a2b3c4d5e6f7a8b9c007": tasks.career.long_30,
    "65f1a2b3c4d5e6f7a8b9c008": tasks.study.long_21,
    "65f1a2b3c4d5e6f7a8b9c009": tasks.routine.digital_detox,
    "65f1a2b3c4d5e6f7a8b9c010": tasks.fitness.stretch,
    "65f1a2b3c4d5e6f7a8b9c011": tasks.study.medium_10,
    "65f1a2b3c4d5e6f7a8b9c012": tasks.career.short_10,
    "65f1a2b3c4d5e6f7a8b9c013": tasks.routine.night,
    "65f1a2b3c4d5e6f7a8b9c014": tasks.study.short_7,
    "65f1a2b3c4d5e6f7a8b9c015": tasks.fitness.walk,
  };

  return map[challengeId] || [];
};

const allChallenges = [
  // ── Old 6 ──────────────────────────────────
  { _id: "69b4e778c17232ba0df4e316", title: "Fitness Starter", challengeType: "fitness", duration: 30 },
  { _id: "69b4e778c17232ba0df4e317", title: "Career Focus", challengeType: "career", duration: 15 },
  { _id: "69b4e778c17232ba0df4e318", title: "Morning Routine", challengeType: "routine", duration: 7 },
  { _id: "69b4e778c17232ba0df4e319", title: "Mindset Mastery", challengeType: "study", duration: 14 },
  { _id: "69b4e778c17232ba0df4e31a", title: "Daily Study Boost", challengeType: "study", duration: 21 },
  { _id: "69b4e778c17232ba0df4e31b", title: "Full Body Fitness", challengeType: "fitness", duration: 7 },

  // ── New 15 ─────────────────────────────────
  { _id: "65f1a2b3c4d5e6f7a8b9c001", title: "Morning Routine Reset", challengeType: "routine", duration: 7 },
  { _id: "65f1a2b3c4d5e6f7a8b9c002", title: "30 Day Fitness Grind", challengeType: "fitness", duration: 30 },
  { _id: "65f1a2b3c4d5e6f7a8b9c003", title: "Career Accelerator", challengeType: "career", duration: 21 },
  { _id: "65f1a2b3c4d5e6f7a8b9c004", title: "Deep Study Mode", challengeType: "study", duration: 14 },
  { _id: "65f1a2b3c4d5e6f7a8b9c005", title: "Mindful Living", challengeType: "routine", duration: 10 },
  { _id: "65f1a2b3c4d5e6f7a8b9c006", title: "Core Strength Builder", challengeType: "fitness", duration: 15 },
  { _id: "65f1a2b3c4d5e6f7a8b9c007", title: "Code Every Day", challengeType: "career", duration: 30 },
  { _id: "65f1a2b3c4d5e6f7a8b9c008", title: "Exam Warrior", challengeType: "study", duration: 21 },
  { _id: "65f1a2b3c4d5e6f7a8b9c009", title: "Digital Detox", challengeType: "routine", duration: 7 },
  { _id: "65f1a2b3c4d5e6f7a8b9c010", title: "Flexibility & Stretch", challengeType: "fitness", duration: 14 },
  { _id: "65f1a2b3c4d5e6f7a8b9c011", title: "Growth Mindset Journey", challengeType: "study", duration: 10 },
  { _id: "65f1a2b3c4d5e6f7a8b9c012", title: "LinkedIn Power Up", challengeType: "career", duration: 10 },
  { _id: "65f1a2b3c4d5e6f7a8b9c013", title: "Night Routine Mastery", challengeType: "routine", duration: 14 },
  { _id: "65f1a2b3c4d5e6f7a8b9c014", title: "Speed Reading Challenge", challengeType: "study", duration: 7 },
  { _id: "65f1a2b3c4d5e6f7a8b9c015", title: "Walk & Talk Wellness", challengeType: "fitness", duration: 21 },
];

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    await Task.deleteMany({});
    console.log("🗑️ Old tasks cleared");

    for (const ch of allChallenges) {
      const taskList = getTaskList(ch._id, ch.challengeType, ch.duration);

      if (taskList.length === 0) {
        console.log(`⚠️  No task list found for: ${ch.title}`);
        continue;
      }

      console.log(`\n📌 Seeding: ${ch.title} (${ch.duration} days)`);

      for (let day = 1; day <= ch.duration; day++) {
        const taskText = taskList[(day - 1) % taskList.length];
        await Task.create({
          challengeId: new mongoose.Types.ObjectId(ch._id),
          challengeType: ch.challengeType,
          day,
          taskText,
        });
        console.log(`   Day ${day}: ${taskText}`);
      }
    }

    console.log("\n🎉 All tasks seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seedTasks();