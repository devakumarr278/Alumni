import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Target,
  Zap,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Code,
  Database,
  Sparkles,
  Star,
} from "lucide-react";

/**
 * Dark Purple Futuristic DailyTasks Component
 * - Personalized tasks generation (simple example)
 * - Stores tasks daily in localStorage
 * - Tracks completed tasks (array of ids)
 * - Uses icon COMPONENT references (no JSX inside data)
 */

/* ---------- Helper: Personalized Task Generator ---------- */
const generatePersonalizedTasks = (user) => {
  // base pool
  const pool = [
    {
      title: "Practice JS Functions",
      description: "Do 5 exercises on functions & closures",
      xp: 50,
      estimatedTime: "30m",
      category: "Coding",
      icon: Code,
      iconColor: "text-violet-300",
      difficulty: "Beginner",
    },
    {
      title: "CSS Grid Mini Project",
      description: "Build a 3-column responsive grid",
      xp: 70,
      estimatedTime: "40m",
      category: "Frontend",
      icon: BookOpen,
      iconColor: "text-pink-300",
      difficulty: "Intermediate",
    },
    {
      title: "MongoDB Aggregation Drill",
      description: "Write 3 aggregation queries",
      xp: 100,
      estimatedTime: "50m",
      category: "Database",
      icon: Database,
      iconColor: "text-amber-300",
      difficulty: "Advanced",
    },
    {
      title: "DSA Quick Problem",
      description: "Solve a medium level array problem",
      xp: 60,
      estimatedTime: "25m",
      category: "Problem Solving",
      icon: Target,
      iconColor: "text-purple-200",
      difficulty: "Intermediate",
    },
    {
      title: "Read Tech Article",
      description: "Read & summarize 2 pages of an article",
      xp: 30,
      estimatedTime: "20m",
      category: "Learning",
      icon: BookOpen,
      iconColor: "text-green-200",
      difficulty: "Easy",
    },
  ];

  // personal tweaks: prefer tasks based on goal & level
  const selected = [];

  // If user wants fullstack, ensure mix of frontend+backend
  if (user.goal === "fullstack") {
    selected.push(pool[0], pool[1], pool[2]);
  } else if (user.goal === "frontend") {
    selected.push(pool[1], pool[0], pool[4]);
  } else if (user.goal === "backend") {
    selected.push(pool[2], pool[0], pool[4]);
  } else if (user.goal === "dsa") {
    selected.push(pool[3], pool[0], pool[4]);
  } else {
    // fallback: pick first 4
    selected.push(...pool.slice(0, 4));
  }

  // adjust xp for level (small boost)
  const leveled = selected.map((t, i) => ({
    ...t,
    id: `${Date.now()}-${i}-${t.title.replace(/\s+/g, "-").toLowerCase()}`,
    xp: Math.round(t.xp * (1 + (user.level - 1) * 0.05)), // +5% xp per level
  }));

  return leveled;
};

/* ---------- Theme constants ---------- */
const BG = "bg-[#0b0713]"; // deep dark
const CARD = "bg-gradient-to-tr from-[#0f0716]/60 to-[#1b0e2a]/60 border border-[#3a1e59]/40";

/* ---------- Component ---------- */
const DailyTasks = () => {
  // example local user (replace with real user from your app)
  const [user] = useState({
    name: "Abi",
    level: 6,
    goal: "fullstack", // fullstack | frontend | backend | dsa
    streak: 7,
  });

  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]); // array of task ids
  const [todayStr, setTodayStr] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    setTodayStr(today);

    const savedDate = localStorage.getItem("dt_tasks_date");
    const savedTasks = localStorage.getItem("dt_tasks_data");
    const savedCompleted = localStorage.getItem("dt_tasks_completed");

    if (savedDate === today && savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
        const compArr = savedCompleted ? JSON.parse(savedCompleted) : [];
        setCompleted(Array.isArray(compArr) ? compArr : []);
        return;
      } catch (err) {
        // fallback to regenerate below
      }
    }

    // generate new tasks for the day
    const generated = generatePersonalizedTasks(user);
    localStorage.setItem("dt_tasks_date", today);
    localStorage.setItem("dt_tasks_data", JSON.stringify(generated));
    localStorage.setItem("dt_tasks_completed", JSON.stringify([]));
    setTasks(generated);
    setCompleted([]);
  }, [user]);

  const toggle = (taskId) => {
    let updated;
    if (completed.includes(taskId)) updated = completed.filter((id) => id !== taskId);
    else updated = [...completed, taskId];

    setCompleted(updated);
    localStorage.setItem("dt_tasks_completed", JSON.stringify(updated));
  };

  const totalXP = tasks.filter((t) => completed.includes(t.id)).reduce((s, t) => s + t.xp, 0);
  const completedCount = completed.length;
  const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  // simple badges (example)
  const badges = [
    { id: "badge-1", name: "Rising Coder", reqXP: 100, icon: Star },
    { id: "badge-2", name: "Consistency", reqXP: 200, icon: Sparkles },
  ];
  const unlocked = badges.filter((b) => totalXP >= b.reqXP);

  return (
    <div className={`${BG} min-h-screen text-white p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-[#120419] flex items-center justify-center">
                  <Target size={28} className="text-[#e9d5ff]" />
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-[#ff77cc]/20 flex items-center justify-center border border-[#7c3aed]/30">
                <Sparkles size={14} className="text-[#ffb3ff]" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Hey {user.name} — daily mission</h1>
              <p className="text-sm text-[#c7b3ff] mt-1">Personalized tasks · {todayStr}</p>

              <div className="flex gap-3 mt-3 items-center">
                <div className="px-3 py-2 rounded-lg backdrop-blur-sm bg-[#1b1026]/50 border border-[#3b1e5d] flex flex-col">
                  <span className="text-xs text-[#dcd2ff]">Level</span>
                  <span className="font-bold text-xl text-[#f3e8ff]">{user.level}</span>
                </div>

                <div className="px-3 py-2 rounded-lg backdrop-blur-sm bg-[#1b1026]/50 border border-[#3b1e5d] flex flex-col">
                  <span className="text-xs text-[#dcd2ff]">Streak</span>
                  <span className="font-bold text-xl text-[#ffd6f8]">{user.streak} days</span>
                </div>

                <div className="px-3 py-2 rounded-lg backdrop-blur-sm bg-gradient-to-r from-[#6d28d9]/30 to-[#9333ea]/20 border border-[#4b1b66] flex items-center gap-2">
                  <Award className="text-[#ffd6f8]" />
                  <div>
                    <span className="text-xs text-[#e9d5ff]">Today's XP</span>
                    <div className="font-semibold text-lg">{totalXP}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress capsule */}
          <div className="flex items-center gap-4">
            <div className="w-64">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-[#d9ccff] font-semibold">Progress</span>
                <span className="text-sm font-bold text-[#fff]">{percent}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#2a143a]/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="h-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-[#12111a]/50 border border-[#3b1e5d]">
              <Sparkles className="text-[#ffd6f8]" />
              <span className="text-xs text-[#e8dfff]">Badges</span>
              <span className="font-semibold text-sm">{unlocked.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Layout: left tasks, right weekly & badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tasks (2/3 width on large) */}
          <div className="lg:col-span-2 space-y-4">
            {tasks.map((task, idx) => {
              const Icon = task.icon;
              const done = completed.includes(task.id);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`p-5 rounded-2xl ${CARD} hover:scale-[1.01] transform transition-all duration-200`}
                >
                  <div className="flex gap-4 items-start">
                    <div
                      onClick={() => toggle(task.id)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                        done ? "bg-gradient-to-tr from-[#ffb3ff] to-[#ff77cc] text-[#3a0730]" : "bg-[#0e0812] border border-[#2a143a]"
                      }`}
                    >
                      {done ? <CheckCircle size={22} className="text-[#3a0730]" /> : <Icon className={`${task.iconColor} opacity-95`} size={20} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-bold text-lg ${done ? "text-[#f7e7ff] line-through" : "text-[#f3e8ff]"}`}>{task.title}</h3>
                          <p className="text-sm text-[#cfc0ff] mt-1">{task.description}</p>
                          <div className="flex gap-2 mt-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-[#241033]/50 border border-[#3b1e5d] text-[#e7dfff] flex items-center gap-1">
                              <Clock size={12} /> {task.estimatedTime}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-[#ffe6ff]/10 to-[#ffd6f8]/10 border border-[#4b1b66] text-[#ffd6f8] flex items-center gap-1">
                              <Award size={12} /> +{task.xp} XP
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-[#1b0e2a]/40 border border-[#3b1e5d] text-[#d9ccff]">{task.category}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${task.difficulty === "Advanced" ? "bg-[#2b0517] text-[#ffb3c9]" : task.difficulty === "Intermediate" ? "bg-[#241033] text-[#f3e8ff]" : "bg-[#121016] text-[#cde6b2]"}`}>{task.difficulty}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          {!done ? (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggle(task.id)}
                              className="px-3 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-sm font-semibold shadow-sm"
                            >
                              Mark Done
                            </motion.button>
                          ) : (
                            <div className="text-sm text-[#ffd6f8] font-semibold">Completed</div>
                          )}
                        </div>
                      </div>

                      {done && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-[#ffd6f8] flex items-center gap-2">
                          <Sparkles size={14} />
                          +{task.xp} XP earned — great work!
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Weekly challenges + badges */}
          <div className="space-y-4">
            <motion.div className={`${CARD} p-5 rounded-2xl`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-[#f3e8ff] flex items-center gap-2">
                  <TrendingUp /> Weekly Challenges
                </h3>
                <span className="text-xs text-[#cfc0ff]">3/3</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#0f0714]/40 border border-[#32183a] flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold text-[#f3e8ff]">Project Sprint</div>
                    <div className="text-xs text-[#d9ccff]">Build a fullstack mini-app</div>
                  </div>
                  <div className="text-sm text-[#ffd6f8] font-bold">300 XP</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0714]/40 border border-[#32183a] flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold text-[#f3e8ff]">DSA Push</div>
                    <div className="text-xs text-[#d9ccff]">Solve 10 problems</div>
                  </div>
                  <div className="text-sm text-[#ffd6f8] font-bold">250 XP</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f0714]/40 border border-[#32183a] flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold text-[#f3e8ff]">Learning Sprint</div>
                    <div className="text-xs text-[#d9ccff]">Finish 3 tutorials</div>
                  </div>
                  <div className="text-sm text-[#ffd6f8] font-bold">200 XP</div>
                </div>
              </div>
            </motion.div>

            <motion.div className={`${CARD} p-5 rounded-2xl`} initial={{ opacity: 0.05 }} animate={{ opacity: 1 }}>
              <h3 className="font-bold text-lg text-[#f3e8ff] mb-3">Badges</h3>
              <div className="flex flex-col gap-3">
                {badges.map((b) => {
                  const Icon = b.icon;
                  const isUnlocked = unlocked.some((u) => u.id === b.id);
                  return (
                    <div key={b.id} className="flex items-center gap-3 justify-between bg-[#0f0714]/40 p-3 rounded-lg border border-[#2a143a]">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUnlocked ? "bg-gradient-to-tr from-[#ffd6f8] to-[#ffb3ff] text-[#3a0730]" : "bg-[#120419]"}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#f3e8ff]">{b.name}</div>
                          <div className="text-xs text-[#cfc0ff]">Requires {b.reqXP} XP</div>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${isUnlocked ? "text-[#ff77cc]" : "text-[#8a6aa3]"}`}>{isUnlocked ? "Unlocked" : "Locked"}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div className={`${CARD} p-5 rounded-2xl text-center`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Zap className="mx-auto mb-2" />
              <div className="font-semibold text-[#f3e8ff]">Motivation</div>
              <div className="text-sm text-[#d9ccff] mt-2">Consistency beats intensity. Do a little every day.</div>
              <div className="mt-4">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] font-semibold">Claim Daily Reward</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
