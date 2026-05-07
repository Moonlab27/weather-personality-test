const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let state = "START";
let fadeAnim = 0;
let homeImgs = [], resultImgs = [], cloudImg;
let quizBgImg;
let mouseParticles = [];
let currentHomeIdx = 0, prevHomeIdx = 0, lastSwitchTime = 0;
const SWITCH_INTERVAL = 3000;
let resultParticles = [];

let currentQ = 0;
let answerHistory = [];
let winner = "";
let scores = { Light: 0, Fire: 0, Mist: 0, Cold: 0, Glow: 0, DarkFire: 0 };

let logicalWidth = window.innerWidth;
let logicalHeight = window.innerHeight;

const currentQuizSet = [
  { title: "当清晨的第一缕光穿过窗帘，你通常：", options: [ { text: "立刻起身，计划一整天的清单", tag: "Light" }, { text: "思考今天是否会有一场惊喜", tag: "Fire" }, { text: "在半梦半醒间感受光影的移动", tag: "Glow" }, { text: "拉紧被子，享受片刻的孤独", tag: "Cold" } ] },
  { title: "在陌生的城市迷路了，你的第一反应是：", options: [ { text: "打开地图，冷静寻找逻辑路径", tag: "Light" }, { text: "感到一丝莫名的兴奋与挑战欲", tag: "Fire" }, { text: "顺着直觉，寻找感觉舒适的方向", tag: "Glow" }, { text: "随遇而安，欣赏未预见的风景", tag: "Mist" } ] },
  { title: "你更喜欢哪种工作氛围？", options: [ { text: "井然有序，高效且充满阳光", tag: "Light" }, { text: "充满张力，像暴雨前的雷鸣", tag: "DarkFire" }, { text: "温馨治愈，像午后的夕阳", tag: "Glow" }, { text: "独立安静，甚至有一点清冷", tag: "Cold" } ] },
  { title: "看到窗外突然下起暴雨，你会：", options: [ { text: "检查屋顶是否有漏水的隐患", tag: "Light" }, { text: "想去雨中奔跑或大声唱歌", tag: "Fire" }, { text: "关好窗户，听雨声陷入沉思", tag: "Mist" }, { text: "觉得世界终于安静了", tag: "Cold" } ] },
  { title: "在朋友聚会中，你通常扮演：", options: [ { text: "保持礼貌边界，礼貌但疏离", tag: "Light" }, { text: "活跃气氛，像火种一样热烈", tag: "Fire" }, { text: "温柔倾听，像晚霞一样柔和", tag: "Glow" }, { text: "角落里的观察者，像雾气一样神秘", tag: "Mist" } ] },
  { title: "你如何处理积压已久的压力？", options: [ { text: "一点点拆解问题，逐一击破", tag: "Light" }, { text: "找个没人的地方彻底爆发", tag: "DarkFire" }, { text: "寻找朋友，在拥抱中消融", tag: "Glow" }, { text: "通过睡眠或静坐来自我净化", tag: "Cold" } ] },
  { title: "如果生命是一场气象，你希望它是：", options: [ { text: "永不熄灭的炽热烈日", tag: "Fire" }, { text: "变幻莫测的极地极光", tag: "DarkFire" }, { text: "看透一切的云淡风轻", tag: "Mist" }, { text: "绝对洁白的茫茫雪原", tag: "Cold" } ] },
  { title: "当你面对一个巨大的未知挑战时：", options: [ { text: "正面硬刚，享受这种被点燃感", tag: "Fire" }, { text: "在内心深处悄悄自我重构", tag: "DarkFire" }, { text: "保持沉默，等待最佳切入时机", tag: "Mist" }, { text: "先彻底切断与外界的干扰", tag: "Cold" } ] },
  { title: "你最喜欢的颜色偏向：", options: [ { text: "高饱和度的金红色系", tag: "Fire" }, { text: "深邃神秘的浓紫色系", tag: "DarkFire" }, { text: "低调内敛的烟灰色系", tag: "Mist" }, { text: "纯净透明的冰蓝色系", tag: "Cold" } ] },
  { title: "如果可以选择一种超能力，你会选：", options: [ { text: "瞬间冰冻，让时间停止", tag: "Light" }, { text: "操控闪电，破坏并重塑", tag: "DarkFire" }, { text: "治愈他人，抚平一切伤痛", tag: "Glow" }, { text: "隐身于雾，不被任何人察觉", tag: "Mist" } ] },
  { title: "面对别人的误解，你的态度是：", options: [ { text: "非常愤怒，甚至想与之争辩", tag: "Fire" }, { text: "剖析根源，进行精准的反击", tag: "DarkFire" }, { text: "无所谓，时间会像雾一样散去", tag: "Mist" }, { text: "感到深深的寒冷，默默撤退", tag: "Cold" } ] },
  { title: "休息日的下午，你最想在哪里度过？", options: [ { text: "在图书馆钻研感兴趣的课题", tag: "Light" }, { text: "在拳击馆大汗淋漓", tag: "Fire" }, { text: "在阳光房里昏昏欲睡", tag: "Glow" }, { text: "在咖啡馆看窗外的人来人往", tag: "Mist" } ] },
  { title: "你认为最极致的美是：", options: [ { text: "精密计算后的对称性", tag: "Light" }, { text: "废墟中开出的一朵花", tag: "DarkFire" }, { text: "落日消失在海平线的瞬间", tag: "Glow" }, { text: "万籁俱寂的雪原", tag: "Cold" } ] },
  { title: "如果为你的生命配一段背景音，你会选：", options: [ { text: "指针走动时极为精准的滴答声", tag: "Light" }, { text: "柴火燃烧时噼啪作响的跳跃声", tag: "Fire" }, { text: "远方潮汐永不停歇的起伏声", tag: "Mist" }, { text: "冰川裂开时清脆而孤独的响声", tag: "Cold" } ] },
  { title: "当世界陷入混乱，你希望自己是：", options: [ { text: "重新建立法典的学者", tag: "Light" }, { text: "破浪而行的船长", tag: "DarkFire" }, { text: "收容落魄者的灯塔", tag: "Glow" }, { text: "客观记录历史的史官", tag: "Mist" } ] },
  { title: "你如何看待失败？", options: [ { text: "那是必经的数据纠错过程", tag: "Light" }, { text: "那是下一次爆发的燃料", tag: "Fire" }, { text: "那是命运的一场大型恶作剧", tag: "DarkFire" }, { text: "那是暂时躲进冬眠的机会", tag: "Cold" } ] },
  { title: "你最向往的旅行地是：", options: [ { text: "火山喷发后的遗迹", tag: "DarkFire" }, { text: "充满烟火气的古老集市", tag: "Glow" }, { text: "迷雾笼罩的森林湖泊", tag: "Mist" }, { text: "宁静偏远的极北小镇", tag: "Cold" } ] },
  { title: "最后，用一个词形容你的灵魂：", options: [ { text: "透明且坚定", tag: "Light" }, { text: "热烈而无畏", tag: "Fire" }, { text: "深邃且复杂", tag: "DarkFire" }, { text: "温柔且强大", tag: "Glow" } ] }
];

const colors = {
  Light: [20, 45, 80], Fire: [130, 70, 45], Mist: [60, 75, 90],
  Cold: [30, 80, 75], Glow: [160, 95, 100], DarkFire: [40, 50, 75],
  default: [30, 45, 80]
};

const homeFileList = ['w1.jpg', 'w2.jpg', 'w3.jpg', 'w4.jpg', 'w5.jpg', 'w6.jpg'];
const resultFileList = ['rain.jpg', 'snow.jpg', 'cloudy.jpg', 'sunset.jpg', 'sunrise.jpg', 'sea.jpg'];

let frameCount = 0;
let startTime;
let mouseX = 0, mouseY = 0;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function preload() {
  for (let f of homeFileList) {
    const img = await loadImage(f);
    if (img) {
      img.fileName = f;
      homeImgs.push(img);
    }
  }
  for (let f of resultFileList) {
    const img = await loadImage(f);
    if (img) {
      img.fileName = f;
      resultImgs.push(img);
    }
  }
  cloudImg = await loadImage('cloud.png');
  quizBgImg = await loadImage('quizbg.png');
  for (let i = 0; i < 80; i++) {
    resultParticles.push(new ResultParticle());
  }
}

function setup() {
  resize();
  startTime = Date.now();
  window.addEventListener('resize', resize);
  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('mousemove', handleMouseMove);
  requestAnimationFrame(draw);
}

function resize() {
  const dpr = window.devicePixelRatio || 1;
  logicalWidth = window.innerWidth;
  logicalHeight = window.innerHeight;

  if (dpr > 1) {
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    ctx.scale(dpr, dpr);
  } else {
    canvas.width = logicalWidth;
    canvas.height = logicalHeight;
  }
}

function draw() {
  frameCount++;
  const currentTime = Date.now() - startTime;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  const lerpSpeed = (state === "QUIZ") ? 0.3 : 0.15;
  fadeAnim = lerp(fadeAnim, 255, lerpSpeed);

  if (state === "START") drawStartScreen(currentTime);
  else if (state === "QUIZ") drawQuizScreen();
  else if (state === "RESULT") drawResultScreen();

  for (let i = mouseParticles.length - 1; i >= 0; i--) {
    mouseParticles[i].update();
    mouseParticles[i].show();
    if (mouseParticles[i].alpha <= 0) mouseParticles.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function drawStartScreen(currentTime) {
  if (currentTime - lastSwitchTime > SWITCH_INTERVAL) {
    prevHomeIdx = currentHomeIdx;
    currentHomeIdx = (currentHomeIdx + 1) % homeImgs.length;
    lastSwitchTime = currentTime;
    fadeAnim = 0;
  }

  if (homeImgs[prevHomeIdx]) drawCoverImage(homeImgs[prevHomeIdx], 255);
  if (homeImgs[currentHomeIdx]) drawCoverImage(homeImgs[currentHomeIdx], fadeAnim);

  let deepMorandi;
  switch (currentHomeIdx) {
    case 0: deepMorandi = [75, 90, 80]; break;
    case 1: deepMorandi = [70, 85, 100]; break;
    case 2: deepMorandi = [90, 95, 105]; break;
    case 3: deepMorandi = [60, 60, 75]; break;
    case 4: deepMorandi = [110, 85, 90]; break;
    case 5: deepMorandi = [80, 85, 95]; break;
    default: deepMorandi = [80];
  }

  if (cloudImg) {
    ctx.save();
    const cw = map2(logicalWidth, 375, 1920, logicalWidth * 1.1, logicalWidth * 0.5);
    const ch = cw * (cloudImg.height / cloudImg.width);
    ctx.shadowColor = `rgba(${deepMorandi[0]}, ${deepMorandi[1]}, ${deepMorandi[2]}, 0.4)`;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 15;
    ctx.globalAlpha = 0.82;
    ctx.drawImage(cloudImg, logicalWidth / 2 - cw / 2, logicalHeight / 2 - ch * 0.4, cw, ch);
    ctx.restore();
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = map2(logicalWidth, 375, 1920, 30, 46) + 'px ZCOOL XiaoWei';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.23)';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  ctx.fillStyle = `rgb(${deepMorandi[0]}, ${deepMorandi[1]}, ${deepMorandi[2]})`;
  ctx.fillText("测测你的天气人格", logicalWidth / 2, logicalHeight / 2 + 5);

  ctx.font = '18px ZCOOL XiaoWei';
  ctx.strokeStyle = `rgb(${deepMorandi[0]}, ${deepMorandi[1]}, ${deepMorandi[2]})`;
  ctx.lineWidth = 0.5;
  ctx.strokeText("探索潜藏在你灵魂深处的气象", logicalWidth / 2, logicalHeight / 2 + 70);
  ctx.fillText("探索潜藏在你灵魂深处的气象", logicalWidth / 2, logicalHeight / 2 + 70);
  ctx.fillText("[ 点击屏幕开始 ]", logicalWidth / 2, logicalHeight / 2 + 95);
  ctx.restore();
}

function drawQuizScreen() {
  if (quizBgImg) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    drawCoverImage(quizBgImg, 255);
    ctx.restore();
  }

  const q = currentQuizSet[currentQ];
  if (!q) return;

  const barWidth = Math.min(logicalWidth * 0.6, 400);
  const barX = logicalWidth / 2;
  const barY = logicalHeight * 0.12;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.font = '14px ZCOOL XiaoWei';
  ctx.fillStyle = `rgba(255, 255, 255, ${fadeAnim * 0.8 / 255})`;
  ctx.fillText(String(currentQ + 1).padStart(2, '0') + ' / ' + String(currentQuizSet.length).padStart(2, '0'), barX, barY - 10);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  roundRect(barX - barWidth / 2, barY - 2, barWidth, 4, 10);
  ctx.restore();

  const progress = (currentQ + 1) / currentQuizSet.length;
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${fadeAnim / 255})`;
  roundRect(barX - barWidth / 2, barY - 2, barWidth * progress, 4, 10);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleSize = map2(logicalWidth, 375, 1920, 20, 28);
  ctx.font = titleSize + 'px ZCOOL XiaoWei';
  ctx.fillStyle = `rgba(255, 255, 255, ${fadeAnim / 255})`;
  drawWrappedText(q.title, logicalWidth / 2, logicalHeight * 0.22, Math.min(logicalWidth * 0.85, 650), titleSize * 1.3);

  const btnWidth = Math.min(logicalWidth * 0.85, 420);
  for (let i = 0; i < q.options.length; i++) {
    const x = logicalWidth / 2;
    const y = logicalHeight * 0.41 + i * 75;
    const isHover = mouseX > x - btnWidth / 2 && mouseX < x + btnWidth / 2 && mouseY > y - 35 && mouseY < y + 35;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${map2(fadeAnim, 0, 255, 0, 80) / 255})`;
    ctx.lineWidth = 1;
    ctx.fillStyle = isHover ? 'rgba(255, 255, 255, 0.24)' : `rgba(255, 255, 255, ${map2(fadeAnim, 0, 255, 0, 15) / 255})`;
    roundRect(x, y, btnWidth, 60, 5, true);
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px ZCOOL XiaoWei';
    ctx.fillStyle = `rgba(255, 255, 255, ${fadeAnim / 255})`;
    ctx.fillText(q.options[i].text, x, y);
    ctx.restore();
  }

  if (currentQ > 0) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px ZCOOL XiaoWei';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.47)';
    ctx.fillText('← 返回上一题', logicalWidth / 2, logicalHeight * 0.92);
    ctx.restore();
  }
  ctx.restore();
}

function drawResultScreen() {
  const resultMap = { Light: 'sunrise.jpg', Fire: 'rain.jpg', Mist: 'cloudy.jpg', Cold: 'snow.jpg', Glow: 'sunset.jpg', DarkFire: 'sea.jpg' };
  const bgImg = resultImgs.find(img => img && img.fileName === resultMap[winner]);
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    drawCoverImage(bgImg, 255);
    ctx.restore();
  }

  for (const p of resultParticles) {
    p.update(winner);
    p.show(winner);
  }

  const boxW = Math.min(logicalWidth * 0.96, 540);
  const boxH = Math.min(logicalHeight * 0.88, 800);
  const boxX = logicalWidth / 2;
  const boxY = logicalHeight * 0.5;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 0;
  roundRect(boxX, boxY, boxW, boxH, 20, true, true);
  ctx.restore();

  const c = colors[winner] || colors.default;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '24px ZCOOL XiaoWei';
  ctx.fillStyle = `rgba(85, 95, 110, ${fadeAnim * 0.8 / 255})`;
  ctx.fillText('你的天气人格是', boxX, boxY - boxH * 0.42);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.39)';
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 6;
  ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  ctx.font = Math.min(logicalWidth * 0.15, 68) + 'px ZCOOL XiaoWei';
  ctx.fillText(getWeatherName(winner), boxX, boxY - boxH * 0.29);

  ctx.font = '16px ZCOOL XiaoWei';
  ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${fadeAnim / 255})`;
  ctx.fillText(getWeatherSummary(winner), boxX, boxY - boxH * 0.16);

  drawTraitAnalysis(boxY - boxH * 0.04);

  ctx.font = '16px ZCOOL XiaoWei';
  ctx.fillStyle = `rgba(100, 110, 125, ${fadeAnim / 255})`;
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 0;
  ctx.fillText('— 点击屏幕任意处重新测试 —', boxX, boxY + boxH * 0.44);
  ctx.restore();
}

function drawTraitAnalysis(yAnchor) {
  const traits = [
    { name: '理性·微光', key: 'Light' }, { name: '热烈·骤雨', key: 'Fire' },
    { name: '冷静·阴天', key: 'Mist' }, { name: '纯粹·初雪', key: 'Cold' },
    { name: '温柔·晚霞', key: 'Glow' }, { name: '深沉·雷暴', key: 'DarkFire' }
  ];
  const barMaxW = Math.min(logicalWidth * 0.7, 450);
  const startX = logicalWidth / 2 - barMaxW / 2;

  for (let i = 0; i < traits.length; i++) {
    const t = traits[i];
    const score = scores[t.key];
    const y = yAnchor + i * 38;
    const targetW = map2(score, 0, 8, 5, barMaxW - 100);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '13px ZCOOL XiaoWei';
    ctx.fillStyle = `rgba(85, 95, 110, ${fadeAnim / 255})`;
    ctx.fillText(t.name, startX, y);

    ctx.fillStyle = 'rgba(180, 185, 195, 0.31)';
    roundRect(startX + 90, y - 4, barMaxW - 90, 8, 4, false, true);

    const tc = colors[t.key];
    ctx.fillStyle = `rgba(${tc[0]}, ${tc[1]}, ${tc[2]}, ${fadeAnim / 255})`;
    roundRect(startX + 90, y - 4, targetW, 8, 4, false, true);
    ctx.restore();
  }
}

function drawCoverImage(img, alpha) {
  if (!img) return;
  const r = img.width / img.height;
  const cr = logicalWidth / logicalHeight;
  let dw, dh;
  if (cr > r) { dw = logicalWidth; dh = logicalWidth / r; }
  else { dw = logicalHeight * r; dh = logicalHeight; }
  ctx.save();
  ctx.globalAlpha = alpha / 255;
  ctx.drawImage(img, logicalWidth / 2 - dw / 2, logicalHeight / 2 - dh / 2, dw, dh);
  ctx.restore();
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  let currentLine = '';
  let textY = y;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      ctx.fillText(currentLine, x, textY);
      currentLine = char;
      textY += lineHeight;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, x, textY);
}

function roundRect(x, y, w, h, r, center, noStroke) {
  ctx.beginPath();
  if (center) {
    x -= w / 2;
    y -= h / 2;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  if (!noStroke && ctx.lineWidth > 0) ctx.stroke();
}

function map2(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  handleInteraction();
}

function handleTouch(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX - rect.left;
    mouseY = e.touches[0].clientY - rect.top;
  }
  handleInteraction();
}

function handleInteraction() {
  if (state === 'START') {
    changeState('QUIZ');
  } else if (state === 'QUIZ') {
    const btnWidth = Math.min(logicalWidth * 0.85, 420);
    const q = currentQuizSet[currentQ];
    
    for (let i = 0; i < q.options.length; i++) {
      const y = logicalHeight * 0.41 + i * 75;
      if (mouseY > y - 35 && mouseY < y + 35 && mouseX > logicalWidth / 2 - btnWidth / 2 && mouseX < logicalWidth / 2 + btnWidth / 2) {
        handleSelect(q.options[i].tag);
        return;
      }
    }
    
    if (currentQ > 0 && mouseY > logicalHeight * 0.88) goBack();
  } else if (state === 'RESULT') {
    resetQuiz();
    changeState('START');
  }
}

function handleMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  for (let i = 0; i < 2; i++) {
    mouseParticles.push(new MouseTrail(mouseX, mouseY));
  }
}

function handleSelect(tag) {
  scores[tag]++;
  answerHistory.push(tag);
  currentQ++;
  if (currentQ >= currentQuizSet.length) {
    calculateResult();
    changeState('RESULT');
  } else {
    fadeAnim = 0;
  }
}

function goBack() {
  if (currentQ > 0) {
    currentQ--;
    const lastTag = answerHistory.pop();
    scores[lastTag]--;
    fadeAnim = 0;
  }
}

function calculateResult() {
  winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  if (winner === 'Fire' && scores.Mist + scores.DarkFire > 4) winner = 'DarkFire';
}

function resetQuiz() {
  currentQ = 0;
  answerHistory = [];
  for (const key in scores) scores[key] = 0;
}

function changeState(s) {
  state = s;
  fadeAnim = 0;
}

function getWeatherSummary(tag) {
  const s = {
    Light: '唤醒世界的初光 / 秩序与逻辑的建立者',
    Fire: '生命力的热烈庆典 / 坦荡且不伪装的行动派',
    Mist: '冷静的幕后观察者 / 擅长看清潮汐的去向',
    Cold: '守住孤独与洁白的初雪 / 纯粹且不随波逐流',
    Glow: '定格美好的治愈者 / 用温柔缝补破碎的情绪',
    DarkFire: '深渊中积蓄的能量 / 不破不立的重塑者'
  };
  return s[tag] || '';
}

function getWeatherName(tag) {
  const n = { Light: '微光清晨', Fire: '骤雨午后', Mist: '阴天海边', Cold: '极地初雪', Glow: '晚霞余晖', DarkFire: '雷暴深海' };
  return n[tag] || '未知气象';
}

class ResultParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * logicalWidth;
    this.y = Math.random() * logicalHeight;
    this.vx = Math.random() - 0.5;
    this.vy = Math.random() * 2 + 1;
    this.size = Math.random() * 3 + 2;
    this.alpha = Math.random() * 100 + 100;
  }

  update(type) {
    if (type === 'Fire' || type === 'DarkFire') {
      this.vy = Math.random() * 4 + 8;
      this.vx = -1.5;
    } else if (type === 'Cold') {
      this.vy = Math.random() + 1;
      this.vx = Math.sin(frameCount * 0.02 + this.x) * 0.5;
    } else {
      this.vy = -Math.random() * 0.5 - 0.3;
      this.vx = Math.random() - 0.5;
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > logicalHeight) this.y = -10;
    if (this.y < -10) this.y = logicalHeight;
    if (this.x > logicalWidth) this.x = 0;
    if (this.x < 0) this.x = logicalWidth;
  }

  show(type) {
    ctx.save();
    const softAlpha = map2(this.alpha, 100, 200, 80, 180);
    if (type === 'Glow' || type === 'Light') {
      ctx.fillStyle = `rgba(255, 250, 220, ${softAlpha / 255})`;
      ctx.strokeStyle = `rgba(255, 250, 220, ${softAlpha / 255})`;
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${softAlpha / 255})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${softAlpha / 255})`;
    }

    if (type === 'Fire' || type === 'DarkFire') {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx, this.y + this.vy * 1.8);
      ctx.stroke();
    } else {
      ctx.shadowColor = `rgba(255, 255, 255, ${softAlpha * 0.5 / 255})`;
      ctx.shadowBlur = 5;
      const dotSize = (type === 'Cold') ? this.size : this.size * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class MouseTrail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.vx = Math.random() - 0.5;
    this.vy = Math.random() - 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 7;
  }

  show() {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha / 255})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.onload = () => {
  preload().then(() => setup());
};
