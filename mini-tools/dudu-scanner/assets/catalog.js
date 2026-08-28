(function (global) {
  var NS = (global.DuduScanner = global.DuduScanner || {});

  NS.TARGET_IDS = [
    "fry-sprite",
    "candy-critter",
    "boba-bubbles",
    "sleepy-bug",
    "rumble-monster",
    "rice-ball-sprite",
    "eye-guard",
    "motion-energy-ball",
    "toothbrush-knight",
    "breakfast-wake-up-bird",
  ];

  NS.TARGETS = {
    "fry-sprite": {
      name: "薯条精灵",
      revealLine: "蔬菜伙伴，快来集合！",
      description: "薯条精灵吃了好多薯条，正在肚肚里寻找蔬菜伙伴。",
      suggestion: "下一餐多吃几口蔬菜，让肚肚变得更有力量！",
      imageSrc: "./assets/images/fry-sprite.webp",
    },
    "candy-critter": {
      name: "糖果怪",
      revealLine: "甜甜能量有点多啦！",
      description: "糖果怪带来了好多甜甜能量，正在肚肚里转个不停。",
      suggestion: "现在去喝一杯白开水，接下来也要记得多喝水！",
      imageSrc: "./assets/images/candy-critter.webp",
    },
    "boba-bubbles": {
      name: "奶茶泡泡",
      revealLine: "奶茶泡泡已经装满啦！",
      description: "今天已经喝了不少奶茶，肚肚里的泡泡挤得满满的。",
      suggestion: "今天不能再喝奶茶啦，想喝东西就换成白开水吧",
      imageSrc: "./assets/images/boba-bubbles.webp",
    },
    "sleepy-bug": {
      name: "瞌睡虫",
      revealLine: "哈欠来了，该补足睡眠啦！",
      description: "昨晚睡得不够，瞌睡虫一整天都在肚肚里打哈欠。",
      suggestion: "今晚按时上床，睡前少看屏幕，好好睡一整晚！",
      imageSrc: "./assets/images/sleepy-bug.webp",
    },
    "rumble-monster": {
      name: "咕噜小怪兽",
      revealLine: "咕噜咕噜，肚肚在等正餐！",
      description: "错过了吃饭时间，咕噜小怪兽正敲鼓提醒你。",
      suggestion: "下一餐要按时吃正餐，不可以用零食替代哦",
      imageSrc: "./assets/images/rumble-monster.webp",
    },
    "rice-ball-sprite": {
      name: "饭团精灵",
      revealLine: "别着急，每一口都要慢慢嚼！",
      description: "吃得太快，饭团精灵还没准备好，下一口就来了。",
      suggestion: "吃饭记得细嚼慢咽哦",
      imageSrc: "./assets/images/rice-ball-sprite.webp",
    },
    "eye-guard": {
      name: "护眼小卫士",
      revealLine: "眼睛累啦，该休息一下！",
      description: "看了太久的屏幕，护眼小卫士举起盾牌，来帮眼睛挡住疲劳。",
      suggestion: "现在放下屏幕，看看远处，让眼睛休息一会儿！",
      imageSrc: "./assets/images/eye-guard.webp",
    },
    "motion-energy-ball": {
      name: "运动能量球",
      revealLine: "能量醒醒，身体动起来！",
      description: "坐得太久，运动能量球缩成了小小一团，正在等你把它唤醒。",
      suggestion: "现在站起来伸伸手、踢踢腿，再走动几分钟！",
      imageSrc: "./assets/images/motion-energy-ball.webp",
    },
    "toothbrush-knight": {
      name: "刷牙小骑士",
      revealLine: "牙齿城堡需要守护！",
      description: "刷牙小骑士发现牙齿角落里还藏着食物小怪兽，准备出发清理。",
      suggestion: "今晚睡觉前认真刷牙，牙齿里面、外面和后面都别漏掉！",
      imageSrc: "./assets/images/toothbrush-knight.webp",
    },
    "breakfast-wake-up-bird": {
      name: "早餐叫醒鸟",
      revealLine: "早餐时间到，快给身体加油！",
      description: "早上没有好好吃早餐，叫醒鸟正在肚肚里咕咕叫。",
      suggestion: "明天早上按时吃早餐，吃饱再精神满满地出发！",
      imageSrc: "./assets/images/breakfast-wake-up-bird.webp",
    },
  };

  NS.LOCK_CUE_PROFILES = {
    "fry-sprite": { frequencies: [392, 523.25, 783.99], oscillatorType: "square", durationSeconds: 0.62 },
    "candy-critter": { frequencies: [659.25, 783.99, 987.77], oscillatorType: "triangle", durationSeconds: 0.7 },
    "boba-bubbles": { frequencies: [329.63, 493.88, 659.25], oscillatorType: "sine", durationSeconds: 0.74 },
    "sleepy-bug": { frequencies: [220, 261.63, 329.63], oscillatorType: "sine", durationSeconds: 0.9 },
    "rumble-monster": { frequencies: [146.83, 196, 293.66], oscillatorType: "sawtooth", durationSeconds: 0.76 },
    "rice-ball-sprite": { frequencies: [440, 554.37, 659.25], oscillatorType: "triangle", durationSeconds: 0.68 },
    "eye-guard": { frequencies: [523.25, 659.25, 783.99], oscillatorType: "sine", durationSeconds: 0.72 },
    "motion-energy-ball": { frequencies: [440, 659.25, 880], oscillatorType: "square", durationSeconds: 0.64 },
    "toothbrush-knight": { frequencies: [392, 587.33, 783.99], oscillatorType: "triangle", durationSeconds: 0.74 },
    "breakfast-wake-up-bird": { frequencies: [493.88, 659.25, 987.77], oscillatorType: "sine", durationSeconds: 0.78 },
  };

  NS.getTarget = function (id) {
    return NS.TARGETS[id] || NS.TARGETS["fry-sprite"];
  };

  NS.pickMysteryTarget = function (excluded) {
    var list = NS.TARGET_IDS.filter(function (id) {
      return id !== excluded;
    });
    if (!list.length) {
      list = NS.TARGET_IDS.slice();
    }
    return list[Math.floor(Math.random() * list.length)];
  };

  NS.DISCOVERY_STORAGE_KEY = "dudu-scanner-discoveries-v1";
  NS.CUSTOM_LIBRARY_MAX = 6;
  NS.CUSTOM_ASSET_MAX_BYTES = 2 * 1024 * 1024;
})(window);
