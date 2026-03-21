import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

const SFX = {
  SWORD: '/sounds/sword_clash.mp3',
  GAVEL: '/sounds/gavel_hit.mp3',
  SHOTGUN: '/sounds/shotgun_cock.mp3',
  COIN: '/sounds/coin_clink.mp3',
  VIAL: '/sounds/annie_vial.mp3',
  PARCHMENT: '/sounds/parchment_rustle.mp3',
  SANITY: '/sounds/sanity_loss.mp3',
  HALLUCINATION: '/sounds/hallucination.mp3',
  AMBIENT: '/sounds/forest_ambient.mp3',
  DICE_ROLL: '/sounds/dice_roll.mp3'
};

const SKILL_NARRATIVES = {
  canghao: {
    '敏捷 (DEX)': {
      success: '你如鬼魅般閃過攻擊，迅速奪取敵方武器並反制。',
      failure: '你在攀爬枯樹時腳下一滑，從高處摔落，感到一陣劇烈疼痛。(-1 HP)'
    },
    '體質 (CON)': {
      success: '你不眠不休地追趕槍聲來源，依然保持清醒與體力。',
      failure: '長時間的森林追蹤耗盡了你的體能，你感到極度疲憊。(明日所有檢定增加懲罰骰)'
    },
    '追蹤 (Track)': {
      success: '你在泥土中發現了新鮮的彈殼與破碎的衣料，確定了綁匪的方向。',
      failure: '森林的迷霧干擾了你的判斷，你帶領小隊走進了一片死胡同，遭到同伴的質疑。'
    },
    '心理 (Psych)': {
      success: '你看出斯科特的手在微微顫抖，察覺到他內心深處的恐懼。',
      failure: '劉金寶冷淡的眼神讓你感到困惑，你無法判斷他是否在撒謊。'
    },
    '理智 (SAN)': {
      success: '你緊握雙拳，在恐怖的畫作面前強撐意志，守住了最後的理智。',
      failure: '藝術家營地的慘狀或二虎異變的模樣讓你心碎，恐慌奪走了你的冷靜。(SAN值損失)'
    }
  },
  scott: {
    '敏捷 (DEX)': {
      success: '你迅速在灌木叢中找到隱蔽點，避開了搜救隊的視線。',
      failure: '陷入瘋狂的蒼浩突然揮拳，你反應不及，被打得眼冒金星。(-3 HP)'
    },
    '幸運 (LUK)': {
      success: '你試著推門，發現長生木屋的後門並未上鎖。',
      failure: '你的腳步聲驚動了附近的獵人，整支小隊陷入了重重包圍。'
    },
    '聆聽 (Listen)': {
      success: '你聽到了遠處卡車引擎的轟鳴聲，確定了水庫工人的蹤跡。',
      failure: '森林的風聲蓋過了一切，你完全沒注意到安妮悄悄靠近的腳步聲。'
    },
    '追蹤 (Track)': {
      success: '你蹲下身辨識出血跡，斷定這絕非野獸所為。',
      failure: '由於光線灰暗加上疲勞，你無法在紛亂的足跡中指明方向。'
    },
    '說服 (Persuade)': {
      success: '你利用法官的威信與誠意，成功說服森林裡的獵人父子提供關鍵情報。',
      failure: '獵人父子對你的法律說詞感到反感，拒絕合作甚至威脅要將你們逐出森林。'
    }
  },
  miller: {
    '敏捷 (DEX)': {
      success: '你像影子一樣繞到綁匪克雷頓背後，冰冷的槍管抵住他的後腦。',
      failure: '一名南北戰爭活屍突然撲向你，將你壓死在腐爛的樹葉堆中。'
    },
    '射擊 (Shoot)': {
      success: '砰！你精準地擊碎了活屍的腦殼，救下了受困的夥伴。',
      failure: '你的子彈射向天空，或是被樹木遮擋，看著獵物從眼皮底下逃脫。'
    },
    '偵查 (Spot)': {
      success: '你敏銳地察覺到斜前方樹林中的黑影，及時發出警告。',
      failure: '你忽略了營地帳篷內的血跡，完全沒意識到這是一場死亡盛宴的開端。'
    },
    '心理 (Psych)': {
      success: '你看出對方的微表情在撒謊，這名綁匪顯然還有所隱瞞。',
      failure: '你被對方的慘狀所迷惑，沒能察覺到他袖口下藏著的尖刀。'
    },
    '意志 (POW)': {
      success: '你閉上眼睛，強行驅散了眼前的幻象，守住了自我的存在。',
      failure: '你產生了幻覺，竟將被害者看成了昔日死去的愛人，陷入短暫瘋狂。'
    }
  },
  bigb: {
    '敏捷 (DEX)': {
      success: '你迅速閃到大樹後方，躲過了卡爾射來的密集成群子彈。',
      failure: '你不小心踩到了乾枯的樹枝，發出的聲響引來了盧卡斯手下的注意。'
    },
    '幸運 (LUK)': {
      success: '你隨手拿起望遠鏡一瞄，正好看到了灌木叢中槍口的閃光。',
      failure: '你成了森林生物或敵人的首要目標，運氣似乎在此刻用盡了。'
    },
    '說服 (Persuade)': {
      success: '你撒了一個完美的謊言，讓商店主人相信你是某個貴族的有錢兒子，這才順利買到精良的獵槍。',
      failure: '你試圖冒充水庫工員被當場拆穿，差點被警衛送進牢房。'
    },
    '隱蔽 (Stealth)': {
      success: '你與米勒成功潛伏在路邊，等待卡車進入力場中心進行奇襲。',
      failure: '你試圖潛入礦區時被探照燈捕捉，引發了一場混亂的交火。'
    },
    '體質 (CON)': {
      success: '你忍受著傷痛，一步步帶領簡逃離那片充滿不詳的古老森林。',
      failure: '看到滿地的鮮血與尖刺，強烈的恐懼讓你雙腿發軟，當場癱倒在地。(-3 SAN)'
    }
  },
  annie: {
    '敏捷 (DEX)': {
      success: '你身輕如燕，在混亂的交火中穿梭，成功脫離包圍。',
      failure: '你的行動發出了太大的噪音，被迫在狹窄的山洞中迎接敵人的正面痛擊。'
    },
    '醫學 (Medicine)': {
      success: '你細心地包紮了同伴的傷口，讓他們原本暗淡的眼神重新燃起希望。',
      failure: '你的手在顫抖，藥劑的調配出現誤差，導致受傷者傷勢惡化。(-2 HP)'
    },
    '投擲 (Throw)': {
      success: '你精準地將炸藥包扔向卡車底盤，巨大的火球瞬間吞噬了敵影。',
      failure: '你的手在顫抖，炸藥包並未命中目標，反而暴露了你隱藏的位置。'
    },
    '偵查 (Spot)': {
      success: '你在樹縫間發現了被遺棄的手提包，裡面裝著簡的隨身物品。',
      failure: '你漏掉了草叢中關鍵的足跡，使得搜救隊在原地徘徊了數小時。'
    },
    '心理 (Psych)': {
      success: '你完美的偽裝讓所有人相信你只是個溫順的女僕，而非復仇女神。',
      failure: '你的秘密在與米勒對視時出現了破綻，他可能已經開始懷疑你的真身。'
    }
  }
};

function App() {
  const [activeDossier, setActiveDossier] = useState(null);
  const [activeClue, setActiveClue] = useState(null);
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [rightTab, setRightTab] = useState('clues');
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const centerPanelRef = useRef(null);
  const mapContainerRef = useRef(null);
  const ambientRef = useRef(null);

  // Initialize and handle Ambient Music
  useEffect(() => {
    // Initial loading timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const audio = new Audio(SFX.AMBIENT);
    audio.loop = true;
    audio.volume = 0.3;
    ambientRef.current = audio;

    return () => {
      clearTimeout(timer);
      audio.pause();
      ambientRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (ambientRef.current) {
      if (isMusicOn) {
        ambientRef.current.play().catch(e => console.log("Ambient play blocked:", e));
      } else {
        ambientRef.current.pause();
      }
    }
  }, [isMusicOn]);

  // Audio player utility
  const playSfx = useCallback((path, maxDuration = null) => {
    if (!path) return;
    const audio = new Audio(path);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked by browser:", e));
    
    if (maxDuration) {
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, maxDuration);
    }
  }, []);

  const handleRoll = (statName, statValue) => {
    if (isRolling) return;
    setIsRolling(true);
    setRollResult(null);
    playSfx(SFX.DICE_ROLL);

    let count = 0;
    const interval = setInterval(() => {
      setRollResult({ val: Math.floor(Math.random() * 100) + 1, type: 'rolling', stat: statName, target: statValue });
      count++;
      if (count > 12) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 100) + 1;
        
        let successType = 'failure';
        if (finalVal === 1) successType = 'critical';
        else if (finalVal <= Math.floor(statValue / 5)) successType = 'extreme';
        else if (finalVal <= Math.floor(statValue / 2)) successType = 'hard';
        else if (finalVal <= statValue) successType = 'success';
        else if (finalVal >= 96) successType = 'fumble';
        
        // Find narrative
        let narrative = "";
        if (activeDossier && SKILL_NARRATIVES[activeDossier.id]) {
          const charNarratives = SKILL_NARRATIVES[activeDossier.id];
          if (charNarratives[statName]) {
            const isSuccess = ['critical', 'extreme', 'hard', 'success'].includes(successType);
            narrative = isSuccess ? charNarratives[statName].success : charNarratives[statName].failure;
          }
        }

        setRollResult({ val: finalVal, type: successType, stat: statName, target: statValue, narrative });
        setIsRolling(false);
      }
    }, 60);
  };

  // Auto-scroll to center panel on mobile when something is selected
  useEffect(() => {
    if (activeDossier || activeClue || activeSuspect || activeEvent) {
      if (window.innerWidth <= 1024) {
        centerPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeDossier, activeClue, activeSuspect, activeEvent]);

  const clearCenter = () => {
    setActiveDossier(null);
    setActiveClue(null);
    setActiveSuspect(null);
    setActiveEvent(null);
    setRollResult(null);
  };

  const investigators = [
    { 
      id: 'canghao', 
      name: '蒼浩 (Cang Hao)', 
      role: '武術家 / 尋人者', 
      image: 'cang_hao_sword.png',
      desc: '精通武術的華人，此行主要目的是尋找三個月前失蹤的好友二虎。',
      fate: { status: '生還', color: '#4caf50', detail: '回國後寫信隱瞞好友死訊，模仿二虎筆跡定期寫信給二虎的爸媽與劉奶奶，獨自背負痛苦。' },
      stats: { '敏捷 (DEX)': 70, '體質 (CON)': 50, '追蹤 (Track)': 70, '心理 (Psych)': 60, '理智 (SAN)': 40 },
      sound: SFX.SWORD
    },
    { 
      id: 'scott', 
      name: '斯科特 (Scott)', 
      role: '原住民法官', 
      image: 'scott.png',
      desc: '利用法律權威取得資源，致力於維護森林的法治與秩序。',
      fate: { status: '生還', color: '#4caf50', detail: '果斷炸毀礦坑封印邪神。簡死後，致力於以法律手段起訴盧卡斯集團，為族人奪回被侵佔的土地。' },
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 53, '聆聽 (Listen)': 70, '追蹤 (Track)': 61, '說服 (Persuade)': 65 },
      sound: SFX.GAVEL
    },
    { 
      id: 'miller', 
      name: '米勒 (Miller)', 
      role: '賞金獵人', 
      image: 'miller.png',
      desc: '經驗豐富的追蹤者，受雇前來調查連環失蹤案，對森林的危險有著直覺般的警覺。',
      fate: { status: '生還', color: '#4caf50', detail: '利用盧卡斯的犯罪紀錄成功勒索了一萬美元賞金，隨後瀟灑地離開了貝靈頓小鎮。' },
      stats: { '敏捷 (DEX)': 60, '射擊 (Shoot)': 75, '偵查 (Spot)': 60, '心理 (Psych)': 45, '意志 (POW)': 55 },
      sound: SFX.SHOTGUN
    },
    { 
      id: 'bigb', 
      name: '大B (Big B)', 
      role: '富家子弟', 
      image: 'bigb.png',
      desc: '充滿好奇心的紈絝子弟，來到班寧頓森林是為了尋求某種超越金錢的刺激。與簡是青梅竹馬。',
      fate: { status: '生還', color: '#4caf50', detail: '與青梅竹馬簡死別後感到深深的懺悔與遺憾，決定回到父親身邊重新開始生活。' },
      stats: { '說服 (Persuade)': 70, '隱蔽 (Stealth)': 60, '體質 (CON)': 65, '敏捷 (DEX)': 60, '幸運 (LUK)': 80 },
      sound: SFX.COIN
    },
    { 
      id: 'annie', 
      name: '安妮 (Annie)', 
      role: '女僕 / 復仇者', 
      image: 'annie.png',
      desc: '外表溫柔內心堅韌的女僕，實為盧卡斯當年拋棄的私生女。在紛亂的調查中，她隱藏著驚天的復仇計畫。',
      fate: { status: '入獄', color: '#f44336', detail: '在撤離途中於飲水下毒殺害簡，揭露自己為盧卡斯私生女的身世。被捕後預計服刑 10-15 年，盧卡斯在遺書中為她留下遺產與頂級律師團隊。' },
      stats: { '醫學 (Medicine)': 70, '投擲 (Throw)': 60, '心理 (Psych)': 65, '偵查 (Spot)': 55, '敏捷 (DEX)': 70 },
      sound: SFX.VIAL
    }
  ];

  const clues = [
    { id: 'photo', name: '📜 被剪下的警察局照片', image: 'clue_photo.png', desc: '一張合照，其中一個人的部分被刻意剪掉了，邊緣殘留著焦慮的撕痕。' },
    { id: 'ore', name: '💎 藍色礦石樣本 (Moonlight)', image: 'clue_ore.png', desc: '散發著微弱藍光與不詳共鳴的礦石，長時間直視會感到輕微眩暈。被稱為「月光石」，從水庫礦區深處挖出。' },
    { id: 'painting', name: '🎨 藝術家賽斯的畫作', image: 'clue_painting.png', desc: '扭曲的森林景象，彷彿樹木正在活過來。' },
    { id: 'nightmare', name: '🌙 噩夢畫冊', image: 'clue_nightmare.png', desc: '在失蹤藝術家營地發現的畫作合集。詭異的是，這些畫精確地描繪了每位調查員的噩夢場景——湖中升起的觸手、枯黃森林中的小屋、金屬尖刺穿胸的恐怖景象。斯科特看到後當場陷入短暫瘋狂。' },
    { id: 'ancientmap', name: '🗺️ 活屍木屋中的地圖', image: 'clue_ancient_map.png', desc: '從南北戰爭活屍的木屋牆壁上取下的手繪地圖。標示了湖泊、礦坑挖掘地、及一條通往深處的秘密路徑。正是這張地圖引導調查員們找到了邪教獻祭的現場。' }
  ];

  const suspects = [
    { id: 'harris', name: '哈里斯 (Harris)', role: '綁匪首領', image: 'suspect2.png', desc: '鎮上臭名昭彰的小混混頭目，自大且衝動。聽信水庫挖到黃金的謠言後策劃了綁架盧卡斯之女簡的行動，索要一萬美元贖金。在森林中精神逐漸崩潰，最終在昏睡中被活捉。', fate: { status: '被捕', color: '#ff9800' } },
    { id: 'kidnapper1', name: '克雷頓 (Clayton)', role: '綁匪成員', image: 'suspect1.png', desc: '留著鬍子的綁匪，自稱被哈里斯威脅才參與綁架。在森林中與調查員對峙時，被大B的步槍轟碎了腿部，隨後投降並供出簡的藏身處。他坦承森林中有讓人精神失常的怪異力量。', fate: { status: '重傷被捕', color: '#ff9800' } },
    { id: 'kidnapper2', name: '多布斯 (Dobbs)', role: '看守人', image: 'suspect3.png', desc: '沒膽的跟屁蟲，被指派在長生小木屋看守簡。當調查員抵達時，發現他已慘遭殺害——胸膛被監刺貫穿，屍體被釘在一棵大樹上，散發著死亡的氣息。', fate: { status: '死亡', color: '#f44336' } },
    { id: 'kimbo', name: '劉金寶 (Liu Kimbo)', role: '異變的工員', image: 'kimbo.png', desc: '蒼浩與二虎的同鄉，原為水庫工員，後被邪神影響。眼神冷淡疏離，瘋狂崇拜「主」。常駕駛著載滿炸藥與藍色礦石的卡車。', fate: { status: '崩潰', color: '#9e9e9e', detail: '礦坑被炸毀後，與領班卡爾跪在廢墟前絕望痛哭，喃喃說著「我們失敗了，再也無法回到主的恩寵之中」。' } },
    { id: 'erhu', name: '二虎 (Erhu)', role: '異變的好友 (活屍)', image: 'erhu.png', desc: '蒼浩尋找已久的好友。三個月前為了尋找金寶進入森林卻失蹤。再次現身時已成了面色慘白的「活屍」，胸口巨大的傷口流出詭異藍光。雖然身體已死，但保有最後一絲保護蒼浩的友情。', fate: { status: '異變 (非人)', color: '#9e9e9e', detail: '在關鍵時刻救下蒼浩，對他說：「趕快離開，我已經回不去了。來世有機會再做兄弟吧。照顧好我的家人，別讓他們知道我的事情。」說完便消失在林中。' } }
  ];

  const npcs = [
    { id: 'jane', name: '簡 (Jane)', role: '富豪之女 / 人質', image: 'jane.png', desc: '盧卡斯的女兒，約18-20歲。被哈里斯的三人組綁架，是整場搜救行動的核心。與大B是青梅竹馬。個性有些傲嬌冷淡，但對安妮展露了罕見的溫柔。', fate: { status: '死亡', color: '#f44336', detail: '雖從綁匪手中獲救，卻在撤離森林途中遭安妮在飲水中下毒。她在斯科特懷裡失去心跳，最終死在未婚夫的臂彎之中。' } },
    { id: 'lucas', name: '盧卡斯 (Lucas)', role: '富豪 / 水庫經營者', image: 'lucas.png', desc: '貝靈頓小鎮的地方權貴，經營自來水公司與森林中的水庫。提供五千美元懸賞及每人每日25美元補助召集搜救隊。實則是壓迫原住民、侵佔土地的幕後黑手，也是安妮的親生父親。', fate: { status: '自殺', color: '#f44336', detail: '得知簡的死亡、安妮的真實身世、以及自己的種種罪行後，在悲痛與自責中舉槍自盡。死前留下遺書，請頂級律師團隊為安妮辯護，並留給她一筆遺產。' } }
  ];

  const storyEvents = [
    {
      id: 'event1',
      chapter: '序章',
      title: '搜救通報會',
      date: '6月20日',
      summary: '富豪盧卡斯的女兒簡被哈里斯的三人組綁架。在贖金交易失敗後，綁匪帶著簡逃入森林。警長召集搜救隊，五位調查員在貝靈頓警察局集結。',
      detail: '6月13日，簡在為水庫工人送餐途中被劫。6月19日贖金交易當晚，哈里斯突然精神失常與警方交火後逃入森林。盧卡斯懸賞五千美元，並提供每人每日25美元補助。蒼浩、斯科特、米勒、大B、安妮五人組成搜救小隊，從森林西南方向東北方收網。'
    },
    {
      id: 'event-chapter1',
      chapter: '第一章',
      title: '密林入口',
      date: '6月20日中午',
      summary: '調查員抵達密林入口，發現了一頂破損的帽子與樹幹上詭異的小刀刻痕。',
      detail: '中午12時，搜救小隊抵達班寧頓森林西南入口。斯科特在路邊灌木叢發現了一頂屬於看守人多布斯的帽子，上面沾染了少量乾涸的血跡。樹幹上刻著一個倒置的十字與某些難以辨認的符號，蒼浩察覺到空氣中瀰漫著一股令人不安的腐朽味。'
    },
    {
      id: 'event-chapter2',
      chapter: '第二章',
      title: '買個槍也男上加男',
      date: '6月20日 下午',
      summary: '斯科特在圖書館調查森林歷史與盧卡斯的計畫；大B與米勒前往亞瑟槍店籌備武裝。',
      detail: '斯科特在圖書館發現1861-1865年南北戰爭期間，敗退的南軍曾利用森林地形躲藏並撤往加拿大的歷史。同時，盧卡斯董事長的伐木公司在東北角修建水庫地基時，發現了神祕礦藏並派遣地質學家小隊進入。另一邊，大B靠著「富家子弟」的氣勢，在亞瑟槍店成功買到威力強大的散彈槍與步槍，米勒也在此時籌備了野外生存必備的物資。'
    },
    {
      id: 'event-chapter3',
      chapter: '第三章',
      title: '前進森林的一盤散沙',
      date: '6月20日 傍晚',
      summary: '隊伍抵達森林邊緣搜查，發現昨日槍戰痕跡並遭遇獵人父子。',
      detail: '衆人在警長的帶路下抵達森林邊緣（標記2號處），在此發現了大量的散彈槍彈殼與雜亂的足跡。斯科特準確判斷出綁匪是往東北方向逃竄。在深入過程中，隊伍遭遇了持槍戒備的獵人父子勞生與喬治。雙方一度劍拔弩張，但在斯科特亮出法官身份並成功說服後，獵人放下了武器，雙方交換了關於森林深處的不安情報。'
    },
    {
      id: 'event-chapter4',
      chapter: '第四章',
      title: '功夫高手的爬樹之旅',
      date: '6月20日 晚間',
      summary: '獵人代勞生轉交武器，喬治提到神祕噩夢，衆人得知更多森林怪談。',
      detail: '獵人勞生因信任法官斯科特，將傳家武器借給隊伍以營救富家千金。他提到森林深處有卡車發動聲。喬治則流露恐懼，稱自進入森林以來每晚都夢見被拖入湖底。大B證實了部落傳說中湖泊棲息著「邪神」的禁忌。米勒在嘗試攀爬高處偵查時不慎滑落受輕傷，所幸得到安妮的及時包紮。'
    },
    {
      id: 'event-chapter5',
      chapter: '第五章',
      title: '調查員內戰-有功夫無懦夫',
      date: '6月20日 深夜',
      summary: '營地爭吵引發內戰，米勒展示功夫壓制大B，隊伍在緊繃中紮營。',
      detail: '夜幕降臨，衆人在森林中紮營升起營火。由於大B的傲慢與種族偏見言論，引發米勒強烈不滿。雙方爆發衝突，米勒以驚人的功夫身手迅速壓制大B，令其啞口無言。儘管內部關係緊繃，衆人仍意識到森林潛在的威脅（包括喬治提到的精神感應異常），最終決定輪流守夜，在不安中迎接森林的第一個夜晚。'
    },
    {
      id: 'event2',
      chapter: '第六章',
      title: '集體噩夢',
      date: '6月20日深夜',
      summary: '調查員們在森林中紮營過夜，每個人都做了關於枯黃森林、詭異湖泊、金屬尖刺穿胸的恐怖噩夢。噩夢的共通元素暗示著某種超自然力量正在窺視他們。',
      detail: '米勒夢見被憤怒人群追趕，逃入森林後看見愛人站在湖畔被觸手拖入水中。大B夢見兒時劍術比賽的失敗，場景轉變為枯黃森林與湖中怪物。蒼浩聽到遠方的槍聲，最先察覺異常。每個人醒來後都感到「靈魂深處少了點什麼」——理智值下降。'
    },
    {
      id: 'event3',
      chapter: '第七章',
      title: '藝術家營地的預兆',
      date: '6月21日',
      summary: '發現失蹤藝術家的營地和屍體。更驚人的是，他們的畫作精確描繪了調查員們的噩夢場景。斯科特因看到湖中恐怖存在的畫作而短暫陷入瘋狂。',
      detail: '營地中散落的畫作包括：停在樹梢的貓頭鷹、枯萎樹林中的小路、月光閃耀的森林、荒廢小屋中的人影、以及湖畔恐怖存在升起的場景。這些畫與夢境的驚人吻合令所有人崩潰。蒼浩認出畫中場景就是自己的噩夢。斯科特直接瘋狂——尖叫後呆坐在地，暫時失去記憶。'
    },
    {
      id: 'event-chapter8',
      chapter: '第八章',
      title: '警局的神祕照片',
      date: '6月21日 凌晨',
      summary: '在搜獲的證物中發現一張被刻意剪裁的照片，揭示了盧卡斯與當地警局之間不尋常的利益往來。',
      detail: '凌晨3時，斯科特在整理警局交火現場遺留的文書時，從哈里斯外套夾層發現了一張破損的照片。照片顯示盧卡斯曾將一箱沉重的物品交給警長，背景正是被封鎖的水庫區域。米勒指出，哈里斯之所以敢如此囂張，可能是因為掌握了足以威脅兩人的證據。這讓團隊意識到，敵人不只在森林裡，可能就在警察局內。'
    },
    {
      id: 'event4',
      chapter: '第九章',
      title: '礦區的祕密與舊友重逢',
      date: '6月21日',
      summary: '蒼浩在森林中截下一輛卡車，發現駕駛者竟是失蹤的舊友劉金寶。金寶已變得冷淡疏離，聲稱在為盧卡斯運送炸藥。蒼浩試圖強行帶走金寶，但失敗了。',
      detail: '金寶透露水庫附近正在進行祕密挖掘——工人們在礦區挖出會發出藍光的神祕礦物。蒼浩嘗試用武力制服金寶，但金寶反應迅速跳上卡車逃走。蒼浩後來潛入礦區，看到大量工人搬運炸藥進入一個散發藍光的洞穴。一切指向某種不可告人的祕密。'
    },
    {
      id: 'event-chapter10',
      chapter: '第十章',
      title: '月光石的顫動',
      date: '6月21日深夜',
      summary: '隨著接近水庫核心區，調查員身上的金屬物品開始發出不規律的顫動與低鳴，物理法則似乎正在失效。',
      detail: '接近深夜，小隊抵達水庫挖掘區邊緣。不僅米勒的手錶停止走動，大B攜帶的指南針也在瘋狂打轉。衆人感到一股莫名的重壓，空氣中開始出現微弱的幽藍色火花。安妮觀察到周圍的植物正以肉眼可見的速度枯萎並轉化為灰白色。這種被稱為「月光石」的礦石，顯示出其具有扭曲現實空間的超自然特質。'
    },
    {
      id: 'event5',
      chapter: '第十一至十四章',
      title: '活屍、獻祭與監禁',
      date: '6月22日',
      summary: '調查員在木屋中發現南北戰爭時代的「活屍」棺材，在湖畔目睹五人被監刺穿胸釘在木樁上的血腥獻祭場景。他們也被邪教信徒俘虜監禁。',
      detail: '木屋中的活屍身穿南北戰爭軍服，即使被打爛了頭卻似乎不會真正死去。湖畔的獻祭場景最為恐怖——六根柱子中五根釘滿活人，監刺從胸口貫穿，血液滿溢卻仍在掙扎尖叫。部分內臟從腹中滑出但他們竟然都還活著。調查員的理智備受打擊，蒼浩再次陷入瘋狂。'
    },
    {
      id: 'event-chapter15',
      chapter: '第十五至十六章',
      title: '絕地求生',
      date: '6月22日深夜',
      summary: '利用守衛換班的間隙，蒼浩帶領眾人從木屋地牢破門而出。',
      detail: '深夜，趁著邪教信徒進行儀式的混亂時刻，二虎故意留下了牢房鎖頭的破綻。蒼浩施展武技擊暈守衛，斯科特與米勒奪取武器掩護小隊撤離。在逃往礦區的路上，他們目睹了更多被「格拉基」力量轉化的可憐工員，小隊意識到必須在一切太遲前徹底摧毀這個地方。'
    },
    {
      id: 'event6',
      chapter: '第十七至十八章',
      title: '最終決戰與驚天逆轉',
      date: '6月23日',
      summary: '斯科特決定引爆礦區炸藥封印邪神格拉基。簡被成功救出，但在撤離途中安妮揭露私生女身世，毒殺簡。盧卡斯三天後自殺。每個人都背負著各自的命運離開。',
      detail: '斯科特意識到礦區正試圖釋放舊日支配者格拉基，果斷點燃引線引爆炸藥。爆炸封住了洞穴——金寶與卡爾跪在廢墟前絕望痛哭。簡獲救後與斯科特重逢，大B也與青梅竹馬相見。然而安妮在飲水中下毒，簡在斯科特懷中失去心跳。真相是安妮是盧卡斯當年拋棄的私生女，母親被趕出豪門後死去，安妮一心復仇。盧卡斯得知一切後三天便舉槍自盡。'
    }
  ];

  // Location hotspot data for the interactive map
  const initialLocations = [
    {
      id: 'police_station',
      name: '貝靈頓警察局',
      nameEn: 'Beilington Police Station',
      image: '/警察局內部.jpg',
      top: '88.4%', left: '27.2%',
      tooltipPos: 'top',
      linkType: 'event', linkId: 'event1',
      sound: null
    },
    {
      id: 'campsite',
      name: '調查員紮營地',
      nameEn: 'Investigator Campsite',
      image: '/紮營地.jpg',
      top: '40.1%', left: '34.4%',
      tooltipPos: 'top',
      linkType: 'event', linkId: 'event2',
      sound: null
    },
    {
      id: 'first_track',
      name: '第一個森林追蹤點',
      nameEn: 'First Forest Tracking Point',
      image: '/第一個森林追蹤點.jpg',
      top: '67.9%', left: '31.0%',
      tooltipPos: 'top',
      linkType: 'event', linkId: 'event3',
      sound: null
    },
    {
      id: 'paintings',
      name: '散落的畫 (藝術家營地)',
      nameEn: 'Scattered Paintings',
      image: '/散落的畫.jpg',
      top: '16.5%', left: '47.9%',
      tooltipPos: 'right',
      linkType: 'clue', linkId: 'painting',
      sound: SFX.PARCHMENT
    },
    {
      id: 'gunfight',
      name: '槍戰地點',
      nameEn: 'Gunfight Location',
      image: '/槍戰地點.jpg',
      top: '54.9%', left: '42.0%',
      tooltipPos: 'right',
      linkType: 'event', linkId: 'event4',
      sound: null
    },
    {
      id: 'lakeside',
      name: '湖邊獻祭場',
      nameEn: 'Lakeside Ritual Site',
      image: '/湖邊.jpg',
      top: '64.2%', left: '63.6%',
      tooltipPos: 'left',
      linkType: 'event', linkId: 'event5',
      sound: null
    },
    {
      id: 'crystal_cave',
      name: '藍色水晶洞窟 (礦區)',
      nameEn: 'Blue Crystal Cave',
      image: '/藍色水晶洞窟.jpg',
      top: '12%', left: '79%',
      tooltipPos: 'left',
      linkType: 'clue', linkId: 'ore',
      sound: SFX.HALLUCINATION
    }
  ];

  const [locations, setLocations] = useState(initialLocations);

  const handleHotspotClick = (loc) => {
    if (isEditMode) return;
    playSfx(loc.sound);
    clearCenter();
    if (loc.linkType === 'clue') {
      const target = clues.find(c => c.id === loc.linkId);
      if (target) setActiveClue(target);
    } else if (loc.linkType === 'event') {
      const target = storyEvents.find(e => e.id === loc.linkId);
      if (target) setActiveEvent(target);
    }
  };

  const handleMapMouseDown = (e, id) => {
    if (!isEditMode) return;
    setDraggedId(id);
    e.stopPropagation();
  };

  const handleMapMouseMove = (e) => {
    if (!isEditMode || !draggedId || !mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setLocations(prev => prev.map(loc => 
      loc.id === draggedId 
        ? { ...loc, top: `${Math.max(0, Math.min(100, y)).toFixed(1)}%`, left: `${Math.max(0, Math.min(100, x)).toFixed(1)}%` } 
        : loc
    ));
  };

  const handleMapMouseUp = () => {
    setDraggedId(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="splash-title">SHADOWS OF THE ANCIENT FOREST</h1>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
          <p className="loading-text">正在讀取調查資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="top-controls">
        <button 
          className="music-toggle-btn"
          onClick={() => setIsMusicOn(!isMusicOn)}
          title={isMusicOn ? "關閉環境音" : "開啟環境音"}
        >
          {isMusicOn ? "背景音效: ON 🔊" : "背景音效: OFF 🔇"}
        </button>
        <button 
          className="edit-toggle-btn"
          onClick={() => setIsEditMode(!isEditMode)}
          style={{ background: isEditMode ? 'var(--blood-ochre)' : 'rgba(0,0,0,0.7)' }}
        >
          {isEditMode ? "🛠️ 結束編輯" : "🛠️ 編輯熱點"}
        </button>
      </div>

      <div className="mystery-board">
        {/* Sidebar: Investigators */}
        <div className="panel">
          <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>調查小組 (Investigators)</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
            {investigators.map(inv => (
              <div key={inv.id} className="character-card" onClick={() => {playSfx(inv.sound, 3000); clearCenter(); setActiveDossier(inv);}}>
                <img src={inv.image} alt={inv.name} className="dossier-image" />
                <div className="dossier-name">{inv.name}</div>
                {inv.fate && (
                  <div className="fate-tag" style={{background: inv.fate.color}}>{inv.fate.status}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Main Focus */}
        <div className="panel center-panel" ref={centerPanelRef} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', paddingTop: '40px', overflowY: 'auto'}}>
          {activeDossier ? (
            <div className="dossier-detail" style={{background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(1deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)'}}>
              <h1 style={{fontFamily: 'Cinzel', borderBottom: '2px solid #222'}}>{activeDossier.name}</h1>
              <p style={{marginTop: '15px', fontStyle: 'italic', color: '#555'}}>{activeDossier.role}</p>
              
              {activeDossier.stats && (
                <div style={{marginTop: '20px', padding: '15px', border: '1px solid #ccc', background: 'rgba(0,0,0,0.05)'}}>
                  <h3 style={{fontFamily: 'Cinzel', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--blood-ochre)'}}>能力屬性 (Ability Attributes)</h3>
                  {Object.entries(activeDossier.stats).map(([stat, val]) => (
                    <div key={stat} style={{marginBottom: '8px', position: 'relative'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', alignItems: 'center'}}>
                        <span>{stat}</span>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <span style={{fontWeight: 'bold', color: 'var(--blood-ochre)'}}>{val}</span>
                          <button 
                            className="roll-btn" 
                            onClick={() => handleRoll(stat, val)}
                            title={`進行 ${stat} 檢定`}
                          >
                            🎲
                          </button>
                        </div>
                      </div>
                      <div style={{width: '100%', height: '6px', background: '#ddd', borderRadius: '3px'}}>
                        <div style={{width: `${val}%`, height: '100%', background: 'var(--blood-ochre)', borderRadius: '3px'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p style={{marginTop: '20px', lineHeight: '1.6', fontSize: '0.95rem'}}>{activeDossier.desc}</p>

              {activeDossier.fate && (
                <div className="fate-detail-box">
                  <h3 style={{fontFamily: 'Cinzel', fontSize: '0.9rem', marginBottom: '8px'}}>
                    <span className="fate-tag" style={{background: activeDossier.fate.color, display: 'inline-block', marginRight: '8px'}}>{activeDossier.fate.status}</span>
                    最終命運
                  </h3>
                  <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#444'}}>{activeDossier.fate.detail}</p>
                </div>
              )}

              <button 
                onClick={() => { setActiveDossier(null); setRollResult(null); }}
                style={{marginTop: '30px', background: 'var(--blood-ochre)', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel'}}
              >
                關閉卷宗
              </button>
            </div>
          ) : activeSuspect ? (
            <div className="suspect-detail" style={{background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(-2deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)', border: '2px solid var(--blood-ochre)'}}>
              <h1 style={{fontFamily: 'Cinzel', borderBottom: '2px solid var(--blood-ochre)', color: 'var(--blood-ochre)'}}>{activeSuspect.name}</h1>
              <p style={{marginTop: '15px', fontStyle: 'italic'}}>{activeSuspect.role}</p>
              {activeSuspect.fate && (
                <div className="fate-tag" style={{background: activeSuspect.fate.color, display: 'inline-block', marginTop: '10px'}}>{activeSuspect.fate.status}</div>
              )}
              <p style={{marginTop: '20px', lineHeight: '1.6'}}>{activeSuspect.desc}</p>
              {activeSuspect.fate?.detail && (
                <div className="fate-detail-box">
                  <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#444'}}>{activeSuspect.fate.detail}</p>
                </div>
              )}
              <img src={activeSuspect.image} alt={activeSuspect.name} style={{width: '100%', maxHeight: '500px', objectFit: 'contain', marginTop: '15px', border: '4px solid #fff', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'}} />
              <button 
                onClick={() => { setActiveSuspect(null); setRollResult(null); }}
                style={{marginTop: '30px', background: '#333', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel'}}
              >
                隱藏嫌疑人
              </button>
            </div>
          ) : activeClue ? (
            <div className="clue-detail" style={{background: 'var(--parchment)', color: '#222', padding: '20px', maxWidth: '600px', transform: 'rotate(-1deg)', textAlign: 'center'}}>
              <h1 style={{fontFamily: 'Cinzel', borderBottom: '1px solid #222', marginBottom: '15px'}}>{activeClue.name}</h1>
              <img src={activeClue.image} alt={activeClue.name} style={{width: '100%', maxHeight: '400px', objectFit: 'contain', border: '5px solid #fff', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'}} />
              <p style={{marginTop: '15px', lineHeight: '1.6'}}>{activeClue.desc}</p>
              <button 
                onClick={() => { setActiveClue(null); setRollResult(null); }}
                style={{marginTop: '20px', background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer'}}
              >
                收回線索
              </button>
            </div>
          ) : activeEvent ? (
            <div className="event-detail" style={{background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '600px', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px'}}>
                <h1 style={{fontFamily: 'Cinzel', fontSize: '1.3rem'}}>{activeEvent.title}</h1>
                <span style={{fontFamily: 'Cinzel', fontSize: '0.8rem', color: 'var(--blood-ochre)'}}>{activeEvent.chapter}</span>
              </div>
              <p style={{marginTop: '10px', fontStyle: 'italic', color: '#888', fontSize: '0.85rem'}}>📅 {activeEvent.date}</p>
              <p style={{marginTop: '15px', lineHeight: '1.8', fontSize: '0.95rem'}}>{activeEvent.detail}</p>
              <button 
                onClick={() => { setActiveEvent(null); setRollResult(null); }}
                style={{marginTop: '30px', background: 'var(--blood-ochre)', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel'}}
              >
                關閉事件
              </button>
            </div>
          ) : (
            <div className="map-view">
              <div className="map-container-wrapper">
                <div className="map-fog"></div>
                <div className="map-vignette"></div>
                <div 
                  ref={mapContainerRef}
                  onMouseMove={handleMapMouseMove}
                  onMouseUp={handleMapMouseUp}
                  onMouseLeave={handleMapMouseUp}
                  style={{
                    width: '100%', 
                    height: 'auto', 
                    aspectRatio: '16/10', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: isEditMode ? '2px solid red' : '2px solid var(--gold-accent)', 
                    position: 'relative',
                    cursor: isEditMode ? 'crosshair' : 'default',
                    overflow: 'visible'
                  }}
                >
                  <img src="/forest_map.png" alt="Forest Map" style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}} />
                  
                  {/* Interactive Hotspots */}
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      className={`map-hotspot ${isEditMode ? 'edit-mode' : ''} ${draggedId === loc.id ? 'dragging' : ''}`}
                      style={{top: loc.top, left: loc.left}}
                      onClick={() => handleHotspotClick(loc)}
                      onMouseDown={(e) => handleMapMouseDown(e, loc.id)}
                      onMouseEnter={() => !isEditMode && setHoveredHotspot(loc.id)}
                      onMouseLeave={() => !isEditMode && setHoveredHotspot(null)}
                    >
                      <div className="hotspot-pulse"></div>
                      <div className="hotspot-label">{loc.name}</div>
                      {!isEditMode && hoveredHotspot === loc.id && (
                        <div className={`hotspot-tooltip tooltip-${loc.tooltipPos}`}>
                          <img src={loc.image} alt={loc.name} className="tooltip-image" />
                          <div className="tooltip-info">
                            <div className="tooltip-name">{loc.name}</div>
                            <div className="tooltip-name-en">{loc.nameEn}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="map-interaction-prompt">
                點擊地圖上的閃爍熱點查看場景細節
              </div>

              {isEditMode && (
                <div className="edit-coordinates-panel">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <h3 style={{margin: 0, fontSize: '1rem'}}>📍 熱點座標更新 (更新後請複製)</h3>
                    <button 
                      onClick={() => {
                        const code = locations.map(loc => `  { id: '${loc.id}', top: '${loc.top}', left: '${loc.left}' },`).join('\n');
                        navigator.clipboard.writeText(code);
                        alert('座標已複製到剪貼簿！');
                      }}
                      className="copy-coords-btn"
                    >
                      📋 點我複製全部
                    </button>
                  </div>
                  <pre className="coords-code-block">
                    {locations.map(loc => `  { id: '${loc.id}', top: '${loc.top}', left: '${loc.left}' },`).join('\n')}
                  </pre>
                  <p style={{fontSize: '0.8rem', opacity: 0.7, marginTop: '5px'}}>※ 拖曳地圖上的紅圈即可即時更新上方數值</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Tabbed Panel */}
        <div className="panel" style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          {/* Tab Bar */}
          <div className="tab-bar">
            <button className={`tab-btn ${rightTab === 'clues' ? 'active' : ''}`} onClick={() => setRightTab('clues')}>📜 線索</button>
            <button className={`tab-btn ${rightTab === 'suspects' ? 'active' : ''}`} onClick={() => setRightTab('suspects')}>🕵️ 人物</button>
            <button className={`tab-btn ${rightTab === 'chronicle' ? 'active' : ''}`} onClick={() => setRightTab('chronicle')}>📖 事件簿</button>
          </div>

          {/* Tab Content */}
          <div style={{overflowY: 'auto', flex: 1, paddingTop: '15px'}}>
            {rightTab === 'clues' && (
              <div>
                <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>案件線索 (Clues)</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {clues.map(clue => (
                    <div 
                      key={clue.id} 
                      className="list-item clue-item"
                      onClick={() => {playSfx(SFX.PARCHMENT); clearCenter(); setActiveClue(clue);}}
                    >
                      {clue.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightTab === 'suspects' && (
              <div>
                <h2 style={{color: 'var(--blood-ochre)', marginBottom: '15px'}}>嫌疑人 (Suspects)</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px'}}>
                  {suspects.map(suspect => (
                    <div 
                      key={suspect.id}
                      className="list-item suspect-item"
                      onClick={() => {playSfx(suspect.sound || SFX.SANITY, 3000); clearCenter(); setActiveSuspect(suspect);}}
                    >
                      <span>{suspect.name}</span>
                      {suspect.fate && (
                        <span className="fate-tag-small" style={{background: suspect.fate.color}}>{suspect.fate.status}</span>
                      )}
                    </div>
                  ))}
                </div>

                <h2 style={{color: '#7986cb', marginBottom: '15px'}}>關鍵人物 (Key NPCs)</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {npcs.map(npc => (
                    <div 
                      key={npc.id}
                      className="list-item npc-item"
                      onClick={() => {playSfx(npc.sound || SFX.SANITY, 3000); clearCenter(); setActiveSuspect(npc);}}
                    >
                      <span>{npc.name}</span>
                      {npc.fate && (
                        <span className="fate-tag-small" style={{background: npc.fate.color}}>{npc.fate.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightTab === 'chronicle' && (
              <div>
                <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>事件簿 (Chronicle)</h2>
                <div className="timeline">
                  {storyEvents.map((event, idx) => (
                    <div 
                      key={event.id} 
                      className="timeline-event"
                      onClick={() => { clearCenter(); setActiveEvent(event); }}
                    >
                      <div className="timeline-marker">{idx + 1}</div>
                      <div className="timeline-content">
                        <div className="timeline-chapter">{event.chapter} · {event.date}</div>
                        <div className="timeline-title">{event.title}</div>
                        <div className="timeline-summary">{event.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dice Roll Overlay */}
      {rollResult && (
        <div className="dice-overlay" onClick={() => !isRolling && setRollResult(null)}>
          <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>{rollResult.stat} 檢定</div>
          <div className="roll-value">{rollResult.val}</div>
          <div className="roll-target">目標值: {rollResult.target}</div>
          <div className={`roll-type ${rollResult.type}`}>
            {rollResult.type === 'rolling' ? '擲骰中...' : 
             rollResult.type === 'critical' ? '極限大成功！' :
             rollResult.type === 'extreme' ? '極限成功' :
             rollResult.type === 'hard' ? '困難成功' :
             rollResult.type === 'success' ? '成功' :
             rollResult.type === 'fumble' ? '大失敗！' : '失敗'}
          </div>
          {rollResult.narrative && (
            <div className="roll-narrative">
              {rollResult.narrative}
            </div>
          )}
          {!isRolling && <div style={{marginTop: '15px', fontSize: '0.7rem', color: '#666'}}>點擊關閉</div>}
        </div>
      )}
    </div>
  );
}

export default App;
