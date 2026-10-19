/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Zap,
  BookOpen,
  Clock,
  Shield,
  Briefcase,
  Flame,
  Sparkles,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  Menu,
  X,
  ChevronRight,
  Award,
  Gem,
  Activity,
  Heart
} from 'lucide-react';

/* =====================================================================
   DATA DEFINITIONS
   ===================================================================== */
interface CultivationStage {
  realm: string;
  layer: string;
  qiReq: number;
  rewardStones: number;
}

const CULTIVATION_STAGES: CultivationStage[] = [
  { realm: "Qi Condensation", layer: "Layer 1", qiReq: 100, rewardStones: 25 },
  { realm: "Qi Condensation", layer: "Layer 2", qiReq: 180, rewardStones: 30 },
  { realm: "Qi Condensation", layer: "Layer 3", qiReq: 280, rewardStones: 40 },
  { realm: "Qi Condensation", layer: "Layer 4", qiReq: 420, rewardStones: 50 },
  { realm: "Qi Condensation", layer: "Layer 5", qiReq: 600, rewardStones: 60 },
  { realm: "Qi Condensation", layer: "Layer 6", qiReq: 850, rewardStones: 75 },
  { realm: "Qi Condensation", layer: "Layer 7", qiReq: 1200, rewardStones: 90 },
  { realm: "Qi Condensation", layer: "Layer 8", qiReq: 1650, rewardStones: 120 },
  { realm: "Qi Condensation", layer: "Layer 9", qiReq: 2200, rewardStones: 160 },

  { realm: "Foundation Establishment", layer: "Early Stage", qiReq: 3200, rewardStones: 220 },
  { realm: "Foundation Establishment", layer: "Middle Stage", qiReq: 4800, rewardStones: 300 },
  { realm: "Foundation Establishment", layer: "Late Stage", qiReq: 7000, rewardStones: 400 },

  { realm: "Core Formation", layer: "Early Stage", qiReq: 10500, rewardStones: 600 },
  { realm: "Core Formation", layer: "Middle Stage", qiReq: 15500, rewardStones: 850 },
  { realm: "Core Formation", layer: "Late Stage", qiReq: 22500, rewardStones: 1200 },

  { realm: "Nascent Soul", layer: "Early Stage", qiReq: 33000, rewardStones: 1800 },
  { realm: "Nascent Soul", layer: "Middle Stage", qiReq: 48000, rewardStones: 2500 },
  { realm: "Nascent Soul", layer: "Late Stage", qiReq: 70000, rewardStones: 3500 },

  { realm: "Void Tribulation", layer: "Immortal Peak", qiReq: 120000, rewardStones: 10000 }
];

interface SpiritBeast {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'mystic' | 'legendary';
  icon: string;
  price: number;
  desc: string;
  bonusDesc: string;
  bonusQiMult: number;
}

const SPIRIT_BEASTS: SpiritBeast[] = [
  {
    id: "moonfox",
    name: "Moonfox",
    rarity: "rare",
    icon: "🦊",
    price: 0,
    desc: "A silver-furred fox blessed by moonlight. Sits beside you during meditation.",
    bonusDesc: "+15% Spiritual Qi gain",
    bonusQiMult: 0.15
  },
  {
    id: "azure_dragon",
    name: "Azure Dragon",
    rarity: "legendary",
    icon: "🐉",
    price: 800,
    desc: "A sovereign of tempests and thunder. Infuses your spiritual veins with draconic vigor.",
    bonusDesc: "+45% Spiritual Qi gain",
    bonusQiMult: 0.45
  },
  {
    id: "celestial_crane",
    name: "Celestial Crane",
    rarity: "mystic",
    icon: "🦩",
    price: 350,
    desc: "A graceful bird dwelling on immortal clouds. Enhances mental clarity and focus.",
    bonusDesc: "+25% Qi from Meditation",
    bonusQiMult: 0.25
  },
  {
    id: "shadow_wolf",
    name: "Shadow Wolf",
    rarity: "rare",
    icon: "🐺",
    price: 200,
    desc: "A silent stalker roaming the twilight forests. Enhances discovery of treasures.",
    bonusDesc: "+20% Spirit Stones from Quests",
    bonusQiMult: 0.10
  },
  {
    id: "star_turtle",
    name: "Star Turtle",
    rarity: "mystic",
    icon: "🐢",
    price: 450,
    desc: "An ancient being carrying constellations on its carapace. Gives boundless stability.",
    bonusDesc: "+30% Qi gain & Meditation safety",
    bonusQiMult: 0.30
  }
];

interface ArtifactItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'mystic' | 'legendary';
  icon: string;
  price: number;
  desc: string;
  bonusDesc: string;
  bonusFlatQi: number;
}

const ARTIFACTS: ArtifactItem[] = [
  {
    id: "manual_beginner",
    name: "Beginner Cultivation Manual",
    rarity: "common",
    icon: "📜",
    price: 0,
    desc: "Basic foundational techniques passed down across mortal villages.",
    bonusDesc: "+2 Qi per click",
    bonusFlatQi: 2
  },
  {
    id: "pendant_moonlit",
    name: "Moonlit Jade Pendant",
    rarity: "rare",
    icon: "📿",
    price: 150,
    desc: "A chilled piece of refined jade that purifies ambient energy.",
    bonusDesc: "+5 Qi per click",
    bonusFlatQi: 5
  },
  {
    id: "bracelet_gathering",
    name: "Spirit Gathering Bracelet",
    rarity: "mystic",
    icon: "💍",
    price: 400,
    desc: "Spun from heavenly silk and spirit gold, it continuously attracts wandering Qi.",
    bonusDesc: "+10 Qi per click",
    bonusFlatQi: 10
  },
  {
    id: "sword_celestial",
    name: "Celestial Sword",
    rarity: "mystic",
    icon: "🗡️",
    price: 750,
    desc: "Forged in heavenly meteoric flames. Slices through cultivation bottlenecks.",
    bonusDesc: "+20 Qi per click",
    bonusFlatQi: 20
  },
  {
    id: "seal_dragon",
    name: "Ancient Dragon Seal",
    rarity: "legendary",
    icon: "💠",
    price: 1500,
    desc: "The imperial sigil of an ancient immortal sect. Grants boundless authority.",
    bonusDesc: "+45 Qi per click",
    bonusFlatQi: 45
  }
];

interface AlchemyPill {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'mystic' | 'legendary';
  icon: string;
  costStones: number;
  desc: string;
  effectQi: number;
}

const ALCHEMY_PILLS: AlchemyPill[] = [
  {
    id: "pill_qi",
    name: "Qi Gathering Pill",
    rarity: "common",
    icon: "💊",
    costStones: 50,
    desc: "Instantly floods your core with 120 Spiritual Qi.",
    effectQi: 120
  },
  {
    id: "pill_spirit_recovery",
    name: "Spirit Recovery Pill",
    rarity: "rare",
    icon: "🧪",
    costStones: 120,
    desc: "Purifies your meridians and grants 320 Spiritual Qi.",
    effectQi: 320
  },
  {
    id: "pill_breakthrough",
    name: "Breakthrough Elixir",
    rarity: "legendary",
    icon: "⚗️",
    costStones: 300,
    desc: "A miraculous concoction granting 850 Spiritual Qi.",
    effectQi: 850
  }
];

interface QuestItem {
  id: string;
  title: string;
  desc: string;
  qi: number;
  stones: number;
}

const DEFAULT_DAILY_QUESTS: QuestItem[] = [
  { id: "q1", title: "Study for 25 Minutes", desc: "Dedicate continuous focus to your mortal craft or studies.", qi: 50, stones: 20 },
  { id: "q2", title: "Exercise for 10 Minutes", desc: "Temper your mortal physique with stretching or calisthenics.", qi: 40, stones: 15 },
  { id: "q3", title: "Drink Pure Spring Water", desc: "Cleanse your vessels with ample water today.", qi: 30, stones: 10 },
  { id: "q4", title: "Read an Enlightening Chapter", desc: "Read books or acquire new knowledge for 15 minutes.", qi: 45, stones: 20 },
  { id: "q5", title: "Complete Meditation Session", desc: "Conduct a peaceful meditation practice.", qi: 60, stones: 25 }
];

const ORACLE_MESSAGES = [
  { tag: "Calm", quote: "The deepest rivers flow with the least sound. Quiet your heart to hear the Dao.", tip: "Take slow, even breaths before beginning strenuous work." },
  { tag: "Growth", quote: "A seed buried in dark soil does not lament; it stretches patiently toward the light.", tip: "Consistency of 10 minutes every day triumphs over irregular bursts." },
  { tag: "Patience", quote: "Do not attempt to pluck immortal peaches before the spring blossoms have fallen.", tip: "When facing a hard bottleneck, review your foundational habits." },
  { tag: "Opportunity", quote: "When the heavenly winds stir, the crane does not resist; it opens its wings.", tip: "Today brings great auspicious aura for finishing delayed tasks." }
];

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent game state
  const [playerName, setPlayerName] = useState<string>("Lin Tian");
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [currentQi, setCurrentQi] = useState<number>(0);
  const [spiritStones, setSpiritStones] = useState<number>(50);
  const [streak, setStreak] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const [ownedBeasts, setOwnedBeasts] = useState<string[]>(["moonfox"]);
  const [equippedBeast, setEquippedBeast] = useState<string>("moonfox");

  const [ownedArtifacts, setOwnedArtifacts] = useState<string[]>(["manual_beginner"]);
  const [equippedArtifact, setEquippedArtifact] = useState<string>("manual_beginner");

  const [pillsInventory, setPillsInventory] = useState<Record<string, number>>({
    pill_qi: 0,
    pill_spirit_recovery: 0,
    pill_breakthrough: 0
  });

  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [customQuests, setCustomQuests] = useState<Array<{ id: string; title: string; qi: number; stones: number; completed: boolean }>>([]);
  const [newCustomTitle, setNewCustomTitle] = useState<string>("");
  const [newCustomReward, setNewCustomReward] = useState<string>("qi-40");

  const [lastOracleDate, setLastOracleDate] = useState<string>("");

  const [achievements, setAchievements] = useState<Record<string, boolean>>({
    first_cultivate: false,
    first_breakthrough: false,
    first_meditation: false,
    first_quest: false,
    first_beast: false,
    streak_7: false
  });

  // Breakthrough modal state
  const [breakthroughModalOpen, setBreakthroughModalOpen] = useState<boolean>(false);
  const [breakthroughRewardStones, setBreakthroughRewardStones] = useState<number>(50);

  // Meditation state
  const [meditationDuration, setMeditationDuration] = useState<number>(30);
  const [meditationTimeRemaining, setMeditationTimeRemaining] = useState<number>(30);
  const [meditationRunning, setMeditationRunning] = useState<boolean>(false);
  const [meditationStateLbl, setMeditationStateLbl] = useState<string>("Ready to begin");
  const medTimerRef = useRef<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("CELESTIAL_REALM_SAVE_V1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          if (parsed.playerName) setPlayerName(parsed.playerName);
          if (typeof parsed.stageIndex === 'number') setStageIndex(parsed.stageIndex);
          if (typeof parsed.currentQi === 'number') setCurrentQi(parsed.currentQi);
          if (typeof parsed.spiritStones === 'number') setSpiritStones(parsed.spiritStones);
          if (typeof parsed.streak === 'number') setStreak(parsed.streak);
          if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);
          if (Array.isArray(parsed.ownedBeasts)) setOwnedBeasts(parsed.ownedBeasts);
          if (parsed.equippedBeast) setEquippedBeast(parsed.equippedBeast);
          if (Array.isArray(parsed.ownedArtifacts)) setOwnedArtifacts(parsed.ownedArtifacts);
          if (parsed.equippedArtifact) setEquippedArtifact(parsed.equippedArtifact);
          if (parsed.pillsInventory) setPillsInventory(parsed.pillsInventory);
          if (parsed.completedQuests) setCompletedQuests(parsed.completedQuests);
          if (Array.isArray(parsed.customQuests)) setCustomQuests(parsed.customQuests);
          if (parsed.lastOracleDate) setLastOracleDate(parsed.lastOracleDate);
          if (parsed.achievements) setAchievements(parsed.achievements);
        }
      }
    } catch (e) {
      console.warn("Failed to load save", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const data = {
      playerName,
      stageIndex,
      currentQi,
      spiritStones,
      streak,
      soundEnabled,
      ownedBeasts,
      equippedBeast,
      ownedArtifacts,
      equippedArtifact,
      pillsInventory,
      completedQuests,
      customQuests,
      lastOracleDate,
      achievements,
      lastActiveDate: new Date().toDateString()
    };
    localStorage.setItem("CELESTIAL_REALM_SAVE_V1", JSON.stringify(data));
  }, [
    playerName, stageIndex, currentQi, spiritStones, streak, soundEnabled,
    ownedBeasts, equippedBeast, ownedArtifacts, equippedArtifact, pillsInventory,
    completedQuests, customQuests, lastOracleDate, achievements
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Audio Synth
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playSound = (type: 'tap' | 'breakthrough' | 'bell') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'breakthrough') {
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0.12, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 1.0);
        });
      } else if (type === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.6);
      }
    } catch {
      // Audio fallback
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    showToast(!soundEnabled ? "Audio synthesis activated" : "Sound muted");
    if (!soundEnabled) playSound('tap');
  };

  const currentStage = CULTIVATION_STAGES[stageIndex] || CULTIVATION_STAGES[CULTIVATION_STAGES.length - 1];

  const calculateGatherRate = () => {
    let base = 5;
    const art = ARTIFACTS.find(a => a.id === equippedArtifact);
    if (art && art.bonusFlatQi) base += art.bonusFlatQi;

    const beast = SPIRIT_BEASTS.find(b => b.id === equippedBeast);
    if (beast && beast.bonusQiMult) {
      base = Math.round(base * (1 + beast.bonusQiMult));
    }
    return base;
  };

  const checkAchievement = (key: string) => {
    if (!achievements[key]) {
      setAchievements(prev => ({ ...prev, [key]: true }));
      setSpiritStones(prev => prev + 50);
      showToast(`Milestone Unlocked! (+50 Spirit Stones)`);
    }
  };

  const gatherQi = () => {
    const gain = calculateGatherRate();
    setCurrentQi(prev => prev + gain);
    playSound('tap');
    checkAchievement('first_cultivate');
    showToast(`+${gain} Spiritual Qi absorbed`);
  };

  const isEligibleBreakthrough = currentQi >= currentStage.qiReq && stageIndex < CULTIVATION_STAGES.length - 1;

  const triggerBreakthrough = () => {
    if (currentQi < currentStage.qiReq) {
      showToast("Insufficient Qi to shatter this bottleneck!");
      return;
    }
    if (stageIndex >= CULTIVATION_STAGES.length - 1) {
      showToast("You have reached the pinnacle of Void Tribulation!");
      return;
    }

    const leftoverQi = currentQi - currentStage.qiReq;
    const nextStage = CULTIVATION_STAGES[stageIndex + 1];
    const reward = currentStage.rewardStones || 50;

    setCurrentQi(leftoverQi);
    setStageIndex(prev => prev + 1);
    setSpiritStones(prev => prev + reward);
    setBreakthroughRewardStones(reward);

    playSound('breakthrough');
    checkAchievement('first_breakthrough');
    setBreakthroughModalOpen(true);
  };

  // Quests
  const completeQuest = (id: string, qiReward: number, stonesReward: number, isCustom = false) => {
    if (completedQuests[id]) {
      showToast("You already claimed this daily reward today!");
      return;
    }
    setCompletedQuests(prev => ({ ...prev, [id]: true }));
    setCurrentQi(prev => prev + qiReward);
    setSpiritStones(prev => prev + stonesReward);

    if (isCustom) {
      setCustomQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
    }

    playSound('tap');
    checkAchievement('first_quest');
    showToast(`Quest completed! Awarded +${qiReward} Qi & +${stonesReward} Stones`);
  };

  const addCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newCustomTitle.trim();
    if (!title) {
      showToast("Please enter a valid habit title.");
      return;
    }
    let qi = 40;
    let stones = 15;
    if (newCustomReward === "qi-80") { qi = 80; stones = 30; }
    if (newCustomReward === "qi-120") { qi = 120; stones = 50; }

    const newQ = {
      id: "custom_" + Date.now(),
      title,
      qi,
      stones,
      completed: false
    };
    setCustomQuests(prev => [...prev, newQ]);
    setNewCustomTitle("");
    showToast("New custom habit registered.");
  };

  // Meditation
  const selectMeditationDuration = (sec: number) => {
    if (meditationRunning) {
      showToast("Please pause or complete current meditation first.");
      return;
    }
    setMeditationDuration(sec);
    setMeditationTimeRemaining(sec);
  };

  const startMeditation = () => {
    if (meditationRunning) return;
    setMeditationRunning(true);
    setMeditationStateLbl("Absorbing Celestial Dew...");
    playSound('bell');

    const endTime = Date.now() + meditationTimeRemaining * 1000;
    if (medTimerRef.current) clearInterval(medTimerRef.current);

    medTimerRef.current = window.setInterval(() => {
      const rem = Math.round((endTime - Date.now()) / 1000);
      if (rem <= 0) {
        finishMeditation();
      } else {
        setMeditationTimeRemaining(rem);
      }
    }, 500);
  };

  const pauseMeditation = () => {
    if (!meditationRunning) return;
    if (medTimerRef.current) clearInterval(medTimerRef.current);
    setMeditationRunning(false);
    setMeditationStateLbl("Paused");
  };

  const cancelMeditation = () => {
    if (medTimerRef.current) clearInterval(medTimerRef.current);
    setMeditationRunning(false);
    setMeditationTimeRemaining(meditationDuration);
    setMeditationStateLbl("Session Cancelled");
  };

  const finishMeditation = () => {
    if (medTimerRef.current) clearInterval(medTimerRef.current);
    setMeditationRunning(false);
    setMeditationTimeRemaining(meditationDuration);
    setMeditationStateLbl("Session Finished!");

    let qiReward = 40;
    let stonesReward = 10;
    if (meditationDuration === 300) { qiReward = 450; stonesReward = 80; }
    if (meditationDuration === 600) { qiReward = 1000; stonesReward = 200; }

    if (equippedBeast === "celestial_crane") {
      qiReward = Math.round(qiReward * 1.25);
    }

    setCurrentQi(prev => prev + qiReward);
    setSpiritStones(prev => prev + stonesReward);
    playSound('bell');
    checkAchievement('first_meditation');
    showToast(`Meditation complete! Gained +${qiReward} Qi and +${stonesReward} Stones.`);
  };

  // Beasts & Artifacts
  const buyOrEquipBeast = (beastId: string) => {
    const beast = SPIRIT_BEASTS.find(b => b.id === beastId);
    if (!beast) return;

    const isOwned = ownedBeasts.includes(beastId);
    if (isOwned) {
      if (equippedBeast === beastId) {
        showToast(`${beast.name} is already your active companion.`);
      } else {
        setEquippedBeast(beastId);
        playSound('tap');
        showToast(`${beast.name} summoned as active companion!`);
      }
    } else {
      if (spiritStones < beast.price) {
        showToast(`Not enough Spirit Stones! Required: ${beast.price}`);
        return;
      }
      setSpiritStones(prev => prev - beast.price);
      setOwnedBeasts(prev => [...prev, beastId]);
      setEquippedBeast(beastId);
      playSound('tap');
      checkAchievement('first_beast');
      showToast(`Tamed ${beast.name}!`);
    }
  };

  const buyOrEquipArtifact = (artId: string) => {
    const art = ARTIFACTS.find(a => a.id === artId);
    if (!art) return;

    const isOwned = ownedArtifacts.includes(artId);
    if (isOwned) {
      if (equippedArtifact === artId) {
        showToast(`${art.name} is already equipped.`);
      } else {
        setEquippedArtifact(artId);
        playSound('tap');
        showToast(`Equipped ${art.name}!`);
      }
    } else {
      if (spiritStones < art.price) {
        showToast(`Not enough Spirit Stones! Required: ${art.price}`);
        return;
      }
      setSpiritStones(prev => prev - art.price);
      setOwnedArtifacts(prev => [...prev, artId]);
      setEquippedArtifact(artId);
      playSound('tap');
      showToast(`Bound ${art.name} to your soul!`);
    }
  };

  const craftPill = (pillId: string) => {
    const recipe = ALCHEMY_PILLS.find(p => p.id === pillId);
    if (!recipe) return;
    if (spiritStones < recipe.costStones) {
      showToast(`Not enough Spirit Stones! Need: ${recipe.costStones}`);
      return;
    }
    setSpiritStones(prev => prev - recipe.costStones);
    setPillsInventory(prev => ({ ...prev, [pillId]: (prev[pillId] || 0) + 1 }));
    playSound('tap');
    showToast(`Refined 1x ${recipe.name}!`);
  };

  const consumePill = (pillId: string) => {
    const count = pillsInventory[pillId] || 0;
    if (count <= 0) {
      showToast("You do not possess this pill.");
      return;
    }
    const pill = ALCHEMY_PILLS.find(p => p.id === pillId);
    if (!pill) return;

    setPillsInventory(prev => ({ ...prev, [pillId]: prev[pillId] - 1 }));
    setCurrentQi(prev => prev + pill.effectQi);
    playSound('tap');
    showToast(`Swallowed ${pill.name}. +${pill.effectQi} Qi!`);
  };

  // Oracle
  const todayStr = new Date().toDateString();
  const oracleClaimed = lastOracleDate === todayStr;
  const oracleHash = new Date().getDate() % ORACLE_MESSAGES.length;
  const oracleFortune = ORACLE_MESSAGES[oracleHash];

  const claimOracleBlessing = () => {
    if (oracleClaimed) {
      showToast("Blessing already received today.");
      return;
    }
    setLastOracleDate(todayStr);
    setCurrentQi(prev => prev + 50);
    setSpiritStones(prev => prev + 20);
    playSound('bell');
    showToast("Celestial Blessing received! +50 Qi & +20 Stones.");
  };

  const exportSaveData = () => {
    const data = {
      playerName, stageIndex, currentQi, spiritStones, streak, soundEnabled,
      ownedBeasts, equippedBeast, ownedArtifacts, equippedArtifact, pillsInventory,
      completedQuests, customQuests, lastOracleDate, achievements
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celestial_realm_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Save file exported.");
  };

  const importSaveData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed && typeof parsed.stageIndex === 'number') {
          if (confirm("Import this save data? Current progress will be replaced.")) {
            if (parsed.playerName) setPlayerName(parsed.playerName);
            if (typeof parsed.stageIndex === 'number') setStageIndex(parsed.stageIndex);
            if (typeof parsed.currentQi === 'number') setCurrentQi(parsed.currentQi);
            if (typeof parsed.spiritStones === 'number') setSpiritStones(parsed.spiritStones);
            if (typeof parsed.streak === 'number') setStreak(parsed.streak);
            if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);
            if (Array.isArray(parsed.ownedBeasts)) setOwnedBeasts(parsed.ownedBeasts);
            if (parsed.equippedBeast) setEquippedBeast(parsed.equippedBeast);
            if (Array.isArray(parsed.ownedArtifacts)) setOwnedArtifacts(parsed.ownedArtifacts);
            if (parsed.equippedArtifact) setEquippedArtifact(parsed.equippedArtifact);
            if (parsed.pillsInventory) setPillsInventory(parsed.pillsInventory);
            if (parsed.completedQuests) setCompletedQuests(parsed.completedQuests);
            if (Array.isArray(parsed.customQuests)) setCustomQuests(parsed.customQuests);
            if (parsed.lastOracleDate) setLastOracleDate(parsed.lastOracleDate);
            if (parsed.achievements) setAchievements(parsed.achievements);
            showToast("Save restored successfully!");
          }
        } else {
          showToast("Invalid save file format.");
        }
      } catch {
        showToast("Failed to parse JSON save.");
      }
    };
    reader.readAsText(file);
  };

  const promptResetProgress = () => {
    if (confirm("Are you certain you wish to reincarnate? All progress will reset.")) {
      localStorage.removeItem("CELESTIAL_REALM_SAVE_V1");
      window.location.reload();
    }
  };

  const pct = Math.min(100, Math.round((currentQi / currentStage.qiReq) * 100));
  const activeBeast = SPIRIT_BEASTS.find(b => b.id === equippedBeast) || SPIRIT_BEASTS[0];

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-[1540px] mx-auto w-full text-slate-100 font-sans">
      {/* Background ambient stars */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1px_1px_at_25px_35px,#fff,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_150px_180px,#a78bfa,rgba(0,0,0,0)),radial-gradient(1px_1px_at_280px_70px,#38bdf8,rgba(0,0,0,0)),radial-gradient(2px_2px_at_450px_220px,#fff,rgba(0,0,0,0)),radial-gradient(1px_1px_at_600px_120px,#fbcfe8,rgba(0,0,0,0)),radial-gradient(1.5px_1.5px_at_750px_300px,#38bdf8,rgba(0,0,0,0)),radial-gradient(1px_1px_at_900px_90px,#fff,rgba(0,0,0,0))] bg-[length:550px_450px] opacity-70" />

      {/* TOP HEADER */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-[#0e0d29]/85 backdrop-blur-md border-b border-purple-500/25 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-[1.35rem] font-bold tracking-wide bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
            <span>✦</span> Celestial Realm
          </h1>
          <span className="hidden lg:inline-block text-[0.82rem] text-slate-400 border-l border-white/15 pl-3 ml-1.5">
            ✦ Your story. Your choices. Your realm. ✦
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-purple-400 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(168,85,247,0.4)] cursor-pointer"
            title="Cultivator Settings"
          >
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 0 1 5 5c0 2.22-1.44 4.1-3.45 4.75C17.26 12.8 20 15.6 20 19v1H4v-1c0-3.4 2.74-6.2 6.45-7.25A4.99 4.99 0 0 1 7 7a5 5 0 0 1 5-5z"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[0.88rem] font-semibold text-white flex items-center gap-1">{playerName}</span>
            <span className="text-[0.72rem] text-sky-400">{currentStage.realm} · {currentStage.layer}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-slate-200 cursor-pointer transition-all hover:bg-purple-500/25 hover:border-purple-300 ${soundEnabled ? 'bg-purple-500/40 border-purple-500 text-white' : ''}`}
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-slate-200 cursor-pointer transition-all hover:bg-purple-500/25 hover:border-purple-300"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* MAIN BODY GRID */}
      <div className="flex flex-1 p-4 gap-4.5 relative">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:flex flex-col w-[250px] gap-2 flex-shrink-0">
          {[
            { id: 'home', label: 'Home', icon: Compass },
            { id: 'cultivate', label: 'Cultivation', icon: Zap },
            { id: 'quests', label: 'Quests', icon: BookOpen },
            { id: 'meditation', label: 'Meditation', icon: Clock },
            { id: 'beasts', label: 'Spirit Beasts', icon: Shield },
            { id: 'inventory', label: 'Artifacts & Bag', icon: Briefcase },
            { id: 'alchemy', label: 'Alchemy', icon: Flame },
            { id: 'oracle', label: 'Oracle', icon: Sparkles },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-4.5 py-3 rounded-[14px] border text-[0.95rem] font-medium cursor-pointer transition-all text-left w-full ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-500/45 to-indigo-500/30 border-purple-400/50 text-white shadow-[0_4px_18px_rgba(139,92,246,0.25)]'
                    : 'bg-transparent border-transparent text-slate-300 hover:bg-purple-500/15 hover:text-white hover:border-purple-300/20'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* CENTER DYNAMIC VIEW AREA */}
        <section className="flex-1 flex flex-col gap-4.5 min-w-0">
          
          {/* HOME SCREEN */}
          {activeTab === 'home' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              {/* HERO BANNER */}
              <div className="relative h-[380px] rounded-[20px] overflow-hidden flex flex-col justify-end p-6 border border-purple-400/35 shadow-[0_12px_40px_rgba(15,12,45,0.7)]">
                <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_75%_25%,#fdf4ff_0%,#d8b4fe_15%,rgba(147,51,234,0.3)_45%,transparent_65%),linear-gradient(180deg,#180d38_0%,#2e1065_40%,#0f172a_100%)]" />
                <div className="absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_85%_65%,rgba(192,132,252,0.28)_0%,transparent_55%),radial-gradient(ellipse_at_20%_75%,rgba(56,189,248,0.2)_0%,transparent_60%)] pointer-events-none" />
                
                {/* SVG Floating Palaces & Misty Scene */}
                <svg className="absolute bottom-0 right-0 w-full h-full z-3 pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  <circle cx="620" cy="110" r="95" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                  <circle cx="620" cy="110" r="88" fill="rgba(245, 235, 255, 0.08)" />
                  <path d="M560,95 Q640,60 690,130 Q630,170 560,95 Z" fill="rgba(255, 255, 255, 0.06)" />
                  <g fill="#18123b" opacity="0.95">
                    <path d="M500,260 L540,190 L570,190 L585,160 L600,190 L630,190 L670,260 L620,330 L550,330 Z" />
                    <rect x="575" y="145" width="20" height="25" fill="#a855f7" opacity="0.7" rx="3" />
                    <polygon points="585,120 570,145 600,145" fill="#fbbf24" />
                    <path d="M575,270 L578,390 L585,390 L583,270 Z" fill="rgba(56, 189, 248, 0.6)" />
                    <path d="M625,275 L627,370 L632,370 L631,275 Z" fill="rgba(56, 189, 248, 0.45)" />
                    <path d="M120,400 L180,310 L290,300 L380,330 L390,400 Z" fill="#0c0a21" />
                    <ellipse cx="270" cy="290" rx="14" ry="10" fill="#a78bfa" />
                    <circle cx="270" cy="275" r="7" fill="#f8fafc" />
                    <ellipse cx="295" cy="294" rx="7" ry="5" fill="#38bdf8" opacity="0.85" />
                  </g>
                  <path d="M0,380 Q200,340 400,370 T800,360 L800,400 L0,400 Z" fill="rgba(76, 29, 149, 0.35)" />
                </svg>

                <div className="relative z-5 max-w-[520px] bg-[#0e0b26]/55 p-5.5 rounded-[14px] backdrop-blur-md border border-white/12">
                  <span className="text-[0.85rem] tracking-[2px] uppercase text-purple-200 flex items-center gap-1.5 mb-1.5">
                    ✦ Welcome to ✦
                  </span>
                  <h2 className="text-[2.2rem] font-extrabold leading-tight mb-2 bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(167,139,250,0.4)]">
                    Celestial Realm
                  </h2>
                  <p className="text-[0.88rem] text-slate-300 mb-4.5 leading-relaxed">
                    A world of magic, adventure, and endless possibilities. Ascend the nine heavens through discipline and cultivation.
                  </p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      onClick={gatherQi}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-white/30 text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(139,92,246,0.45)] hover:translate-y-[-2px] transition-all"
                    >
                      <Sparkles size={18} />
                      Gather Spiritual Qi
                    </button>
                    {isEligibleBreakthrough && (
                      <button
                        onClick={triggerBreakthrough}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-200/50 text-black font-bold px-6 py-3 rounded-full text-[0.95rem] inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse"
                      >
                        ✦ Breakthrough Available! ✦
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* QUICK TILES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { title: 'Cultivation', tab: 'cultivate', icon: Zap, color: 'text-purple-400' },
                  { title: 'Spirit Beasts', tab: 'beasts', icon: Shield, color: 'text-sky-400' },
                  { title: 'Meditation', tab: 'meditation', icon: Clock, color: 'text-amber-400' },
                  { title: 'Daily Quests', tab: 'quests', icon: BookOpen, color: 'text-pink-400' },
                ].map((tile, i) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => setActiveTab(tile.tab)}
                      className="bg-[#12112e]/70 backdrop-blur-md border border-purple-500/25 rounded-[14px] p-3.5 text-center cursor-pointer transition-all hover:-translate-y-1 hover:border-purple-300 hover:bg-[#1e1b4b]/80 flex flex-col items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                    >
                      <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-purple-500/25 to-sky-500/15 border border-purple-400/30 ${tile.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-[0.82rem] font-semibold text-slate-200">{tile.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* ACTIVE COMPANION SUMMARY */}
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-[0.95rem] font-bold flex items-center gap-2 text-white">
                    <Sparkles size={18} className="text-amber-400" />
                    Equipped Spirit Companion
                  </h3>
                  <button onClick={() => setActiveTab('beasts')} className="bg-white/8 border border-white/20 text-white px-4 py-2 rounded-full text-[0.85rem] cursor-pointer hover:bg-white/16 transition-all">
                    Manage Beasts
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[2.2rem] bg-white/6 w-[54px] h-[54px] rounded-[8px] flex items-center justify-center">
                    {activeBeast.icon}
                  </div>
                  <div>
                    <div className="text-[1rem] font-bold text-white flex items-center gap-2">
                      {activeBeast.name}
                      <span className={`text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                        activeBeast.rarity === 'legendary' ? 'bg-amber-500/25 text-amber-300' :
                        activeBeast.rarity === 'mystic' ? 'bg-purple-500/25 text-purple-300' :
                        activeBeast.rarity === 'rare' ? 'bg-sky-500/25 text-sky-300' : 'bg-slate-500/20 text-slate-300'
                      }`}>
                        {activeBeast.rarity}
                      </span>
                    </div>
                    <div className="text-[0.8rem] text-sky-400 mt-0.5 font-semibold">{activeBeast.bonusDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CULTIVATION SCREEN */}
          {activeTab === 'cultivate' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-3">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Zap className="text-purple-400" /> Cultivation Altar
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Absorb the world's spiritual energy into your dantian</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div
                    onClick={gatherQi}
                    className="w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.4)_0%,rgba(99,102,241,0.1)_70%,transparent_100%)] border-2 border-dashed border-purple-400/50 mb-5 flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform shadow-[0_0_35px_rgba(139,92,246,0.35)]"
                    title="Tap to channel Spiritual Qi"
                  >
                    <span className="text-[3.5rem] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">☯</span>
                  </div>

                  <h3 className="text-[1.25rem] font-bold text-white mb-1">{currentStage.realm} · {currentStage.layer}</h3>
                  <p className="text-[0.85rem] text-slate-400 max-w-[380px] mb-4">
                    Channel the celestial currents of heaven and earth to strengthen your foundation.
                  </p>

                  <div className="w-full max-w-[440px]">
                    <div className="flex justify-between text-[0.76rem] text-slate-400 mb-1">
                      <span>Spiritual Qi: {currentQi} / {currentStage.qiReq}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={gatherQi}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-white/30 text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(139,92,246,0.45)]"
                    >
                      <Sparkles size={18} /> Gather Qi (+{calculateGatherRate()})
                    </button>
                    {isEligibleBreakthrough && (
                      <button
                        onClick={triggerBreakthrough}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-200/50 text-black font-bold px-6 py-3 rounded-full text-[0.95rem] inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-pulse"
                      >
                        ✦ Attempt Breakthrough! ✦
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* REALM ORDER INFO */}
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <h4 className="text-[0.95rem] font-bold mb-3 text-purple-300">Cultivation Realms Order</h4>
                <div className="flex flex-col gap-2 text-[0.85rem] text-slate-300">
                  <div>1. <strong className="text-white">Qi Condensation</strong> — 9 Layers (Early steps into the dao)</div>
                  <div>2. <strong className="text-white">Foundation Establishment</strong> — 3 Stages (Solidifying the immortal bedrock)</div>
                  <div>3. <strong className="text-white">Core Formation</strong> — 3 Stages (Condensing the golden elixir)</div>
                  <div>4. <strong className="text-white">Nascent Soul</strong> — 3 Stages (Awakening the celestial spirit)</div>
                  <div>5. <strong className="text-white">Void Tribulation</strong> — 1 Stage (Transcending the mortal coil)</div>
                </div>
              </div>
            </div>
          )}

          {/* QUESTS SCREEN */}
          {activeTab === 'quests' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-3">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <BookOpen className="text-pink-400" /> Daily Cultivation Quests
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Form healthy discipline habits to earn Qi and Spirit Stones</span>
                  </div>
                  <span className="text-[0.8rem] text-sky-400">Resets at midnight</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-3">
                  {DEFAULT_DAILY_QUESTS.map(q => {
                    const isDone = !!completedQuests[q.id];
                    return (
                      <div key={q.id} className={`bg-white/3 border border-white/8 rounded-[14px] p-3.5 flex items-center justify-between gap-3 ${isDone ? 'opacity-65 bg-emerald-500/4 border-emerald-500/20' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.95rem] font-semibold text-white">{q.title}</span>
                          <span className="text-[0.78rem] text-slate-400">{q.desc}</span>
                          <span className="text-[0.75rem] text-amber-400 font-semibold inline-flex items-center gap-1.5">
                            ✨ +{q.qi} Qi &nbsp;·&nbsp; 💎 +{q.stones} Stones
                          </span>
                        </div>
                        <button
                          onClick={() => completeQuest(q.id, q.qi, q.stones, false)}
                          disabled={isDone}
                          className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold cursor-pointer ${
                            isDone ? 'bg-white/8 text-slate-400 border border-white/10' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30'
                          }`}
                        >
                          {isDone ? '✓ Claimed' : 'Complete'}
                        </button>
                      </div>
                    );
                  })}

                  {customQuests.map(cq => {
                    const isDone = !!completedQuests[cq.id];
                    return (
                      <div key={cq.id} className={`bg-white/3 border border-white/8 rounded-[14px] p-3.5 flex items-center justify-between gap-3 ${isDone ? 'opacity-65 bg-emerald-500/4 border-emerald-500/20' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.95rem] font-semibold text-white">{cq.title} (Personal Habit)</span>
                          <span className="text-[0.75rem] text-amber-400 font-semibold inline-flex items-center gap-1.5">
                            ✨ +{cq.qi} Qi &nbsp;·&nbsp; 💎 +{cq.stones} Stones
                          </span>
                        </div>
                        <button
                          onClick={() => completeQuest(cq.id, cq.qi, cq.stones, true)}
                          disabled={isDone}
                          className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold cursor-pointer ${
                            isDone ? 'bg-white/8 text-slate-400 border border-white/10' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30'
                          }`}
                        >
                          {isDone ? '✓ Claimed' : 'Complete'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Quest Form */}
                <form onSubmit={addCustomQuest} className="flex flex-col gap-2.5 p-3.5 bg-white/2 rounded-[14px] border border-dashed border-white/15 mt-4">
                  <h4 className="text-[0.9rem] font-bold text-white">+ Add Custom Daily Cultivation Habit</h4>
                  <input
                    type="text"
                    value={newCustomTitle}
                    onChange={e => setNewCustomTitle(e.target.value)}
                    placeholder="e.g. Read 15 pages of ancient text..."
                    maxLength={60}
                    className="bg-[#0a0a1e]/70 border border-white/15 rounded-[8px] text-white px-3.5 py-2.5 text-[0.88rem] outline-none focus:border-purple-500 w-full"
                  />
                  <div className="flex gap-3 items-center flex-wrap">
                    <label className="text-[0.8rem] text-slate-400">Reward:</label>
                    <select
                      value={newCustomReward}
                      onChange={e => setNewCustomReward(e.target.value)}
                      className="bg-[#0a0a1e]/70 border border-white/15 rounded-[8px] text-white px-3 py-2 text-[0.85rem] outline-none"
                    >
                      <option value="qi-40">+40 Qi & +15 Stones</option>
                      <option value="qi-80">+80 Qi & +30 Stones</option>
                      <option value="qi-120">+120 Qi & +50 Stones</option>
                    </select>
                    <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30 px-4.5 py-2 rounded-full text-[0.85rem] font-semibold cursor-pointer ml-auto">
                      Add Quest
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MEDITATION SCREEN */}
          {activeTab === 'meditation' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-3">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Clock className="text-amber-400" /> Celestial Meditation
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Still your mind to attract dense celestial Qi</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className={`w-[200px] h-[200px] rounded-full border-4 border-purple-500/25 border-t-sky-400 flex flex-col items-center justify-center mb-6 relative shadow-[0_0_35px_rgba(56,189,248,0.2)] ${meditationRunning ? 'animate-[spin_8s_linear_infinite] shadow-[0_0_50px_rgba(168,85,247,0.4)]' : ''}`}>
                    <div className="text-[2.2px] font-bold tracking-widest font-mono text-white">
                      {String(Math.floor(meditationTimeRemaining / 60)).padStart(2, '0')}:{String(meditationTimeRemaining % 60).padStart(2, '0')}
                    </div>
                    <span className="text-[0.75rem] text-slate-400 mt-1">{meditationStateLbl}</span>
                  </div>

                  <div className="flex gap-2.5 mb-5 flex-wrap justify-center">
                    {[
                      { sec: 30, label: '30s Quick' },
                      { sec: 300, label: '5 Minutes' },
                      { sec: 600, label: '10 Minutes' }
                    ].map(d => (
                      <button
                        key={d.sec}
                        onClick={() => selectMeditationDuration(d.sec)}
                        className={`bg-white/8 border border-white/20 text-white px-4 py-2 rounded-full text-[0.88rem] cursor-pointer hover:bg-white/16 ${meditationDuration === d.sec ? 'border-sky-400 bg-sky-500/20' : ''}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center items-center">
                    {!meditationRunning ? (
                      <button
                        onClick={startMeditation}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-white/30 text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold cursor-pointer shadow-[0_4px_18px_rgba(139,92,246,0.45)]"
                      >
                        Begin Meditation
                      </button>
                    ) : (
                      <button
                        onClick={pauseMeditation}
                        className="bg-white/8 border border-white/20 text-white px-5 py-2.5 rounded-full text-[0.88rem] cursor-pointer hover:bg-white/16"
                      >
                        Pause
                      </button>
                    )}
                    {meditationRunning && (
                      <button
                        onClick={cancelMeditation}
                        className="bg-white/8 border border-white/20 text-rose-300 px-5 py-2.5 rounded-full text-[0.88rem] cursor-pointer hover:bg-white/16"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <p className="text-[0.8rem] text-slate-500 mt-5 max-w-[360px]">
                    Safe background timer active. Rewards are granted automatically when the session is fully completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SPIRIT BEASTS SCREEN */}
          {activeTab === 'beasts' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Shield className="text-sky-400" /> Spirit Beasts Sanctuary
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Tame mythical companions to multiply your spiritual gain</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SPIRIT_BEASTS.map(b => {
                    const isOwned = ownedBeasts.includes(b.id);
                    const isEquipped = equippedBeast === b.id;
                    return (
                      <div key={b.id} className={`bg-white/3 border rounded-[14px] p-4 flex flex-col gap-2.5 transition-all ${isEquipped ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] bg-sky-500/5' : 'border-white/10 hover:border-purple-400/40'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[0.7rem] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold ${
                            b.rarity === 'legendary' ? 'bg-amber-500/25 text-amber-300' :
                            b.rarity === 'mystic' ? 'bg-purple-500/25 text-purple-300' :
                            b.rarity === 'rare' ? 'bg-sky-500/25 text-sky-300' : 'bg-slate-500/20 text-slate-300'
                          }`}>{b.rarity}</span>
                          {isEquipped && <span className="text-[0.75rem] text-sky-400 font-bold">ACTIVE</span>}
                        </div>
                        <div className="text-[2.2rem] my-1">{b.icon}</div>
                        <h4 className="text-[1.05rem] font-bold text-white">{b.name}</h4>
                        <p className="text-[0.8rem] text-slate-400 leading-snug flex-grow">{b.desc}</p>
                        <span className="text-[0.78rem] text-sky-400 bg-sky-500/10 px-2 py-1 rounded-[6px] font-semibold inline-block">{b.bonusDesc}</span>
                        <div className="mt-2">
                          {isEquipped ? (
                            <button disabled className="w-full bg-white/8 border border-white/20 text-slate-400 py-2 rounded-full text-[0.85rem]">Equipped</button>
                          ) : isOwned ? (
                            <button onClick={() => buyOrEquipBeast(b.id)} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30 py-2 rounded-full text-[0.85rem] font-semibold cursor-pointer">Equip Companion</button>
                          ) : (
                            <button onClick={() => buyOrEquipBeast(b.id)} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-full text-[0.85rem] font-bold cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]">Tame (💎 {b.price} Stones)</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ARTIFACTS & INVENTORY SCREEN */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Briefcase className="text-purple-300" /> Artifacts & Spatial Ring
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Equip sacred talismans and manage gathered treasures</span>
                  </div>
                </div>

                <h4 className="text-[0.95rem] font-bold text-white mb-3">Equipped Artifacts & Relics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                  {ARTIFACTS.map(a => {
                    const isOwned = ownedArtifacts.includes(a.id);
                    const isEquipped = equippedArtifact === a.id;
                    return (
                      <div key={a.id} className={`bg-white/3 border rounded-[14px] p-4 flex flex-col gap-2.5 transition-all ${isEquipped ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] bg-sky-500/5' : 'border-white/10 hover:border-purple-400/40'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[0.7rem] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold ${
                            a.rarity === 'legendary' ? 'bg-amber-500/25 text-amber-300' :
                            a.rarity === 'mystic' ? 'bg-purple-500/25 text-purple-300' :
                            a.rarity === 'rare' ? 'bg-sky-500/25 text-sky-300' : 'bg-slate-500/20 text-slate-300'
                          }`}>{a.rarity}</span>
                          {isEquipped && <span className="text-[0.75rem] text-sky-400 font-bold">EQUIPPED</span>}
                        </div>
                        <div className="text-[2.2rem] my-1">{a.icon}</div>
                        <h4 className="text-[1.05rem] font-bold text-white">{a.name}</h4>
                        <p className="text-[0.8rem] text-slate-400 leading-snug flex-grow">{a.desc}</p>
                        <span className="text-[0.78rem] text-sky-400 bg-sky-500/10 px-2 py-1 rounded-[6px] font-semibold inline-block">{a.bonusDesc}</span>
                        <div className="mt-2">
                          {isEquipped ? (
                            <button disabled className="w-full bg-white/8 border border-white/20 text-slate-400 py-2 rounded-full text-[0.85rem]">Bound</button>
                          ) : isOwned ? (
                            <button onClick={() => buyOrEquipArtifact(a.id)} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30 py-2 rounded-full text-[0.85rem] font-semibold cursor-pointer">Equip Relic</button>
                          ) : (
                            <button onClick={() => buyOrEquipArtifact(a.id)} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-full text-[0.85rem] font-bold cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]">Purchase (💎 {a.price})</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h4 className="text-[0.95rem] font-bold text-white mb-3">Pills & Consumables Storage</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {ALCHEMY_PILLS.map(p => {
                    const count = pillsInventory[p.id] || 0;
                    return (
                      <div key={p.id} className="bg-white/3 border border-white/10 rounded-[14px] p-4 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-slate-500/20 text-slate-300">Consumable</span>
                          <span className="text-[0.8rem] font-bold text-white">Qty: {count}</span>
                        </div>
                        <div className="text-[2.2rem] my-1">{p.icon}</div>
                        <h4 className="text-[1.05rem] font-bold text-white">{p.name}</h4>
                        <p className="text-[0.8rem] text-slate-400 leading-snug flex-grow">{p.desc}</p>
                        <button
                          onClick={() => consumePill(p.id)}
                          disabled={count <= 0}
                          className={`w-full py-2 rounded-full text-[0.85rem] font-semibold cursor-pointer ${
                            count > 0 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30' : 'bg-white/8 text-slate-500 border border-white/10'
                          }`}
                        >
                          {count > 0 ? 'Consume Pill' : 'Empty'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ALCHEMY SCREEN */}
          {activeTab === 'alchemy' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Flame className="text-amber-500" /> Heavenly Alchemy Cauldron
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Refine rare spirit stones into potent cultivation pills</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {ALCHEMY_PILLS.map(p => (
                    <div key={p.id} className="bg-white/3 border border-white/10 rounded-[14px] p-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                          p.rarity === 'legendary' ? 'bg-amber-500/25 text-amber-300' :
                          p.rarity === 'rare' ? 'bg-sky-500/25 text-sky-300' : 'bg-slate-500/20 text-slate-300'
                        }`}>{p.rarity}</span>
                        <span className="text-[0.75rem] font-bold text-amber-400">Cost: 💎 {p.costStones}</span>
                      </div>
                      <div className="text-[2.2rem] my-1">{p.icon}</div>
                      <h4 className="text-[1.05rem] font-bold text-white">{p.name}</h4>
                      <p className="text-[0.8rem] text-slate-400 leading-snug flex-grow">{p.desc}</p>
                      <button
                        onClick={() => craftPill(p.id)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2 rounded-full text-[0.85rem] font-bold cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] mt-2"
                      >
                        Refine Pill (💎 {p.costStones} Stones)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORACLE SCREEN */}
          {activeTab === 'oracle' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-purple-300" /> Celestial Oracle
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Seek daily guidance and fortunes from the stars</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center py-6 px-4">
                  <div className="text-[3rem] mb-3">🔮</div>
                  <span className="bg-purple-500/25 text-purple-200 px-3.5 py-1 rounded-full text-[0.75rem] font-bold uppercase tracking-wider mb-3">
                    Fortune of {oracleFortune.tag}
                  </span>
                  <blockquote className="text-[1.15rem] italic text-white max-w-[500px] mb-3 leading-relaxed">
                    "{oracleFortune.quote}"
                  </blockquote>
                  <p className="text-[0.85rem] text-slate-400 max-w-[440px] mb-6">
                    Cultivation Tip: {oracleFortune.tip}
                  </p>

                  <button
                    onClick={claimOracleBlessing}
                    disabled={oracleClaimed}
                    className={`px-6 py-3 rounded-full font-bold text-[0.95rem] cursor-pointer ${
                      oracleClaimed
                        ? 'bg-white/8 text-slate-400 opacity-50 border border-white/10'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                    }`}
                  >
                    {oracleClaimed ? "Blessing Received Today" : "Receive Daily Blessing (+50 Qi, +20 Stones)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS SCREEN */}
          {activeTab === 'achievements' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Trophy className="text-amber-400" /> Daoist Milestones
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Eternal records of your immortal cultivation journey</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { key: "first_cultivate", title: "First Spiritual Breath", desc: "Channel spiritual Qi for the first time into your vessels." },
                    { key: "first_breakthrough", title: "Mortal Transience Shattered", desc: "Successfully breakthrough a cultivation bottleneck." },
                    { key: "first_meditation", title: "Tranquil Soul", desc: "Complete a full celestial meditation session." },
                    { key: "first_quest", title: "Diligent Practitioner", desc: "Complete any daily cultivation habit." },
                    { key: "first_beast", title: "Beast Tamer", desc: "Form a pact with an immortal spirit beast." },
                    { key: "streak_7", title: "Seven Days of Immortality", desc: "Maintain your daily cultivation streak for 7 consecutive days." }
                  ].map(m => {
                    const isDone = !!achievements[m.key];
                    return (
                      <div key={m.key} className={`bg-white/3 border border-white/8 rounded-[14px] p-3.5 flex items-center justify-between gap-3 ${isDone ? 'opacity-90 bg-emerald-500/4 border-emerald-500/20' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.95rem] font-semibold text-white flex items-center gap-2">
                            <span>{isDone ? '🏆' : '🔒'}</span> {m.title}
                          </span>
                          <span className="text-[0.78rem] text-slate-400">{m.desc}</span>
                        </div>
                        <span className={`text-[0.8rem] font-bold ${isDone ? 'text-amber-400' : 'text-slate-500'}`}>
                          {isDone ? '✓ Attained' : 'Locked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS SCREEN */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-4.5 animate-fadeIn">
              <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-purple-500/25 pb-3 mb-4">
                  <div>
                    <h2 className="text-[1.4rem] font-bold text-white flex items-center gap-2">
                      <Settings className="text-purple-300" /> Cultivator Profile & Settings
                    </h2>
                    <span className="text-[0.8rem] text-slate-400">Manage preferences and local game data backup</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4.5">
                  <div>
                    <label className="text-[0.85rem] text-slate-300 block mb-2">Cultivator Dao Name</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        maxLength={24}
                        className="bg-[#0a0a1e]/70 border border-white/15 rounded-[8px] text-white px-3.5 py-2.5 text-[0.88rem] outline-none focus:border-purple-500 flex-1"
                      />
                      <button onClick={() => showToast("Daoist name updated.")} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-[0.88rem] font-semibold cursor-pointer border border-white/30">
                        Rename
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/8 pt-4">
                    <h4 className="text-[0.95rem] font-bold text-white mb-2">Audio Synthesis</h4>
                    <button onClick={toggleSound} className="bg-white/8 border border-white/20 text-white px-4.5 py-2 rounded-full text-[0.85rem] cursor-pointer hover:bg-white/16">
                      Sound FX: <strong className="ml-1.5 text-purple-300">{soundEnabled ? "Enabled" : "Disabled"}</strong>
                    </button>
                  </div>

                  <div className="border-t border-white/8 pt-4">
                    <h4 className="text-[0.95rem] font-bold text-white mb-1">Export & Import Progress</h4>
                    <p className="text-[0.8rem] text-slate-400 mb-3">
                      Your game is stored safely inside this browser's Local Storage. Export your save file as JSON to transfer it.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={exportSaveData} className="bg-white/8 border border-white/20 text-white px-4.5 py-2 rounded-full text-[0.85rem] cursor-pointer hover:bg-white/16">
                        Export Save (JSON)
                      </button>
                      <button onClick={() => document.getElementById('import-file-input')?.click()} className="bg-white/8 border border-white/20 text-white px-4.5 py-2 rounded-full text-[0.85rem] cursor-pointer hover:bg-white/16">
                        Import Save File
                      </button>
                      <input id="import-file-input" type="file" accept=".json" onChange={importSaveData} className="hidden" />
                    </div>
                  </div>

                  <div className="border-t border-white/8 pt-4">
                    <h4 className="text-[0.95rem] font-bold text-rose-400 mb-1">Danger Zone</h4>
                    <button onClick={promptResetProgress} className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4.5 py-2 rounded-full text-[0.85rem] cursor-pointer hover:bg-rose-500/20">
                      Reset Progress (Reincarnate)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* RIGHT STATS COLUMN */}
        <aside className="hidden lg:flex flex-col w-[320px] gap-4 flex-shrink-0">
          {/* Journey Spotlight */}
          <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[0.95rem] font-bold flex items-center gap-2 text-white">
                <Trophy size={18} className="text-amber-400" /> Your Journey
              </h3>
              <ChevronRight size={18} className="text-slate-500" />
            </div>

            <div className="flex gap-3 items-center mb-3.5">
              <div className="w-[44px] h-[44px] rounded-[8px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[1.4rem]">
                💎
              </div>
              <div>
                <div className="text-[0.88rem] font-bold text-white">The Beginning</div>
                <div className="text-[0.74rem] text-slate-400">Explore the floating islands and meet companions.</div>
              </div>
            </div>

            <button onClick={() => setActiveTab('quests')} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30 py-2 rounded-full text-[0.85rem] font-semibold cursor-pointer">
              View Quests
            </button>
          </div>

          {/* Your Stats */}
          <div className="bg-[#12112e]/75 backdrop-blur-md border border-purple-500/25 rounded-[20px] p-4.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[0.95rem] font-bold flex items-center gap-2 text-white">
                <Activity size={18} className="text-purple-300" /> Your Stats
              </h3>
              <ChevronRight size={18} className="text-slate-500" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3.5">
              <div className="bg-white/4 border border-white/8 rounded-[8px] p-2.5 text-center flex flex-col items-center gap-1">
                <span className="text-[1.1rem]">⚡</span>
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-wide">Level</span>
                <span className="text-[0.88rem] font-bold text-white">{stageIndex + 1}</span>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-[8px] p-2.5 text-center flex flex-col items-center gap-1">
                <span className="text-[1.1rem]">🔥</span>
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-wide">Streak</span>
                <span className="text-[0.88rem] font-bold text-white">{streak}d</span>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-[8px] p-2.5 text-center flex flex-col items-center gap-1">
                <span className="text-[1.1rem]">💎</span>
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-wide">Stones</span>
                <span className="text-[0.88rem] font-bold text-white">{spiritStones}</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-[0.76rem] text-slate-400 mb-1">
                <span>Qi Progress</span>
                <span>{currentQi} / {currentStage.qiReq} XP</span>
              </div>
              <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          {/* Featured Realm Card */}
          <div className="bg-gradient-to-b from-[#1e1b4b]/60 to-[#0f0e28]/85 border border-purple-500/25 rounded-[20px] p-4.5 flex flex-col gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[0.85rem] font-bold text-white flex items-center gap-1.5">
                👑 Featured Realm
              </h3>
              <ChevronRight size={16} className="text-slate-500" />
            </div>

            <div className="w-full h-[100px] rounded-[8px] bg-[radial-gradient(circle_at_50%_30%,#a855f7_0%,transparent_60%),linear-gradient(135deg,#1e1b4b,#312e81)] relative overflow-hidden flex items-center justify-center">
              <span className="text-[2rem]">🏰</span>
            </div>

            <div>
              <h4 className="text-[0.9rem] font-bold text-white">The Floating Isles</h4>
              <p className="text-[0.74rem] text-slate-400 leading-snug mt-1">
                Discover hidden ancient grottos, solve puzzles, and gather ancient celestial dew.
              </p>
            </div>

            <button onClick={gatherQi} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/30 py-2 rounded-full text-[0.82rem] font-semibold cursor-pointer">
              Explore & Gather
            </button>
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0e0d29]/95 backdrop-blur-md border-t border-purple-500/25 px-3 py-2 z-90 flex justify-around">
        {[
          { id: 'home', label: 'Home', icon: Compass },
          { id: 'cultivate', label: 'Cultivate', icon: Zap },
          { id: 'quests', label: 'Quests', icon: BookOpen },
          { id: 'meditation', label: 'Meditate', icon: Clock },
        ].map(b => {
          const Icon = b.icon;
          const isActive = activeTab === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveTab(b.id)}
              className={`flex flex-col items-center gap-1 bg-transparent border-none text-[0.7rem] font-medium cursor-pointer ${isActive ? 'text-purple-300' : 'text-slate-400'}`}
            >
              <Icon size={20} />
              <span>{b.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 bg-transparent border-none text-[0.7rem] font-medium text-slate-400 cursor-pointer"
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-95">
          <div onClick={() => setMobileDrawerOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 bg-[#110f2d] border-t border-purple-500 rounded-t-[20px] p-5 z-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[1.1rem] font-bold text-white">Heavenly Pavilions</h3>
              <button onClick={() => setMobileDrawerOpen(false)} className="bg-white/8 text-white px-2.5 py-1 rounded-[6px]">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { id: 'beasts', label: 'Spirit Beasts', icon: '🦊' },
                { id: 'inventory', label: 'Artifacts', icon: '🗡️' },
                { id: 'alchemy', label: 'Alchemy', icon: '⚗️' },
                { id: 'oracle', label: 'Oracle', icon: '🔮' },
                { id: 'achievements', label: 'Milestones', icon: '🏆' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileDrawerOpen(false); }}
                  className="bg-[#12112e]/70 border border-purple-500/25 rounded-[14px] p-3 text-center cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <span className="text-[1.5rem]">{item.icon}</span>
                  <span className="text-[0.8rem] font-semibold text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BREAKTHROUGH MODAL */}
      {breakthroughModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-100 flex items-center justify-center p-5">
          <div className="bg-gradient-to-b from-[#1e1b4b] to-[#0d0c26] border border-purple-300 rounded-[20px] max-w-[480px] w-full p-6 text-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
            <div className="text-[3.5rem] mb-3 animate-pulse">✨</div>
            <h3 className="text-[1.6rem] font-extrabold text-white mb-2 bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
              Breakthrough Achieved!
            </h3>
            <p className="text-[0.95rem] text-slate-300 mb-4">
              You shattered your mortal boundaries and advanced into {currentStage.realm} ({currentStage.layer})!
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-[8px] p-2.5 mb-5">
              <span className="text-amber-400 font-bold text-[0.9rem]">+{breakthroughRewardStones} Spirit Stones Awarded!</span>
            </div>
            <button
              onClick={() => setBreakthroughModalOpen(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 rounded-full cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            >
              Accept & Harmonize Qi
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div className="fixed bottom-[74px] left-1/2 -translate-x-1/2 z-120 flex flex-col items-center pointer-events-none w-[90%] max-w-[420px]">
          <div className="bg-[#12112e]/95 border border-purple-500 text-white px-4 py-2.5 rounded-full text-[0.85rem] font-medium text-center shadow-[0_4px_18px_rgba(0,0,0,0.6)] animate-bounce">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
