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
  AMBIENT: '/sounds/HouseontheHill_Everet_Almond.m4a',
  DICE_ROLL: '/sounds/dice_roll.mp3',
  PAPER_TEAR: '/sounds/paper_tear.mp3'
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
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [rollResult, setRollResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFateRevealed, setIsFateRevealed] = useState(false);
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
        ambientRef.current.play().catch(e => {
          console.log("Ambient play blocked:", e);
          // Fallback: try to play on next user interaction
          const handleFirstInteraction = () => {
            if (isMusicOn && ambientRef.current) {
              ambientRef.current.play().catch(() => {});
              window.removeEventListener('click', handleFirstInteraction);
              window.removeEventListener('keydown', handleFirstInteraction);
            }
          };
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('keydown', handleFirstInteraction);
        });
      } else {
        ambientRef.current.pause();
      }
    }
  }, [isMusicOn]);

  // Audio player utility
  const playSfx = useCallback((path, maxDuration = null) => {
    if (!path) return;
    const audio = new Audio(path);
    audio.volume = 0.3;
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
    setIsFateRevealed(false);
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
    {
      id: 'blue-ore',
      name: '💎 水庫礦區與「藍色礦石」的秘密',
      image: 'clue_ore.png',
      desc: '這是整個故事的核心物資。',
      details: [
        '官方掩蓋的礦藏：調查員在圖書館發現，盧卡斯的自來水公司在修築水庫時，於地基作業中發現了奇特的礦藏。',
        '「金礦」謠言：盧卡斯對外聲稱礦石是「貴金屬」，導致鎮上流傳水庫挖到金礦的謠言，這也是哈里斯三人組決定綁架簡小姐的直接動機。',
        '超自然能量：蒼浩在礦區目睹地洞中散發出的藍光，後來更在神祕木屋的棺材中發現相同的藍色螢光，顯示礦石與不死的超自然力量有關。'
      ]
    },
    {
      id: 'nightmare',
      name: '🎨 集體噩夢與藝術家的畫作',
      image: 'clue_nightmare.png',
      desc: '這是揭示邪神影響的精神線索。',
      details: [
        '預知性的噩夢：所有調查員與進入森林的平民（如獵人小孩）都會夢見湖泊、荒廢木屋、身穿軍服的腐爛人臉以及胸口被刺穿的劇痛。',
        '藝術家的證言：在第七章中，眾人發現了失蹤藝術家的營地，其畫作精確描繪了調查員們夢境中的恐怖景觀（如湖中升起的怪物），證實噩夢並非偶然，而是某種力量的感召。',
        '賽斯的日記：日記中記錄了藝術家團隊進入森林後，精神逐漸被噩夢侵蝕並走向崩潰的過程。'
      ]
    },
    {
      id: 'spikes',
      name: '📌 神祕的「尖刺」（Metal Spikes）',
      image: 'clue_spikes_new_v2.png',
      desc: '這是解開活屍化與控制機制的實體線索。',
      details: [
        '靈魂束縛的媒介：調查員在湖邊祭壇目睹被尖刺貫穿胸膛的活人。這些人即便受到致命傷也無法死去。',
        '死亡的解脫：線索指出，被尖刺穿透者會感受到靈魂被灼燒，唯有拔除尖刺，受害者才能真正死去。蒼浩的好友二虎也是因掙脫了這種尖刺而逃脫，但身體已發生異變。'
      ]
    },
    {
      id: 'secrets',
      name: '🕵️ 盧卡斯的個人秘密與身世真相',
      image: 'clue_lucas_tabloid.png',
      desc: '這是推動人性悲劇劇情的線索。',
      details: [
        '外遇雜誌與私生女：斯科特在圖書館發現盧卡斯數年前的外遇八卦。這項線索在結局與安妮的身世相呼應——安妮其實是盧卡斯的私生女，潛入盧卡斯家是為了替被拋棄的母親復仇。',
        '侵佔原住民土地的紀錄：斯科特持有的盧卡斯企業犯罪紀錄，揭示了盧卡斯如何非法奪取土地並殺害族人，這成為最後米勒勒索盧卡斯，以及斯科特決定起訴盧卡斯的重要證據。'
      ]
    },
    {
      id: 'history',
      name: '🗺️ 環境與歷史線索',
      images: ['clue_forest_lake.png', 'clue_cabin_coffin.png'],
      desc: '揭露森林深處被遺忘的歷史。',
      details: [
        '印地安人禁忌：當地原住民傳說指出，湖泊是邪教或惡魔的領地，連族人都不敢靠近。',
        '南北戰爭的逃兵：歷史紀錄顯示，曾有戰敗的南方軍團躲入這片森林，這解釋了為何調查員會遇到身穿該時期軍裝的「活屍士兵」。'
      ]
    }
  ];

  const suspects = [
    {
      id: 'harris',
      name: '哈里斯 (Harris)',
      role: '綁匪首領',
      image: 'suspect2.png',
      desc: '聽信水庫挖到黃金的謠言後策劃了綁架盧卡斯之女簡的行動，索要一萬美元贖金。在森林中精神逐漸崩潰，最終在昏睡中被活捉。',
      fate: { status: '被捕', color: '#ff9800' }
    },
    {
      id: 'kidnapper1',
      name: '克雷頓 (Clayton)',
      role: '綁匪成員',
      image: 'suspect1.png',
      desc: '留著鬍子的綁匪，自稱被哈里斯威脅才參與綁架。在森林中與調查員對峙時，被大B的步槍轟碎了腿部，隨後投降並供出簡的藏身處。他坦承森林中有讓人精神失常的怪異力量。',
      fate: { status: '重傷被捕', color: '#ff9800' }
    },
    {
      id: 'kidnapper2',
      name: '多布斯 (Dobbs)',
      role: '看守人',
      image: 'suspect3.png',
      desc: '沒膽的跟屁蟲，被指派在長生小木屋看守簡。當調查員抵達時，發現他已慘遭殺害——胸膛被尖刺貫穿，屍體被釘在一棵大樹上，散發著死亡的氣息。',
      fate: { status: '死亡', color: '#f44336' }
    },
    {
      id: 'kimbo',
      name: '劉金寶 (Liu Kimbo)',
      role: '異變的工員',
      image: 'kimbo.png',
      desc: '蒼浩與二虎的同鄉，原為水庫工員，後被邪神影響。眼神冷淡疏離，瘋狂崇拜「主」。常駕駛著載滿炸藥與藍色礦石的卡車。',
      fate: { status: '崩潰', color: '#9e9e9e', detail: '礦坑被炸毀後，與領班卡爾跪在廢墟前絕望痛哭，喃喃說著「我們失敗了，再也無法回到主的恩寵之中」。' }
    },
    {
      id: 'erhu',
      name: '二虎 (Erhu)',
      role: '異變的好友 (活屍)',
      image: 'erhu.png',
      desc: '蒼浩尋找已久的好友。三個月前為了尋找金寶進入森林卻失蹤。再次現身時已成了面色慘白的「活屍」，胸口巨大的傷口流出詭異藍光。雖然身體已死，但保有最後一絲保護蒼浩的友情。',
      fate: {
        status: '異變 (非人)',
        color: '#9e9e9e',
        detail: '在關鍵時刻救下蒼浩，對他說：「趕快離開，我已經回不去了。來世有機會再做兄弟吧。照顧好我的家人。」說完便消失在林中。'
      }
    }
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
      image: 'event_prologue_v8.png',
      summary: '富豪盧卡斯的女兒簡被哈里斯的三人組綁架。在贖金交易失敗後，綁匪帶著簡逃入森林。警長召集搜救隊，五位調查員在貝靈頓警察局集結。',
      detail: '6月13日，簡在為水庫工人送餐途中被劫。6月19日贖金交易當晚，哈里斯突然精神失常與警方交火後逃入森林。盧卡斯懸賞五千美元，並提供每人每日25美元補助。蒼浩、斯科特、米勒、大B、安妮五人組成搜救小隊，從森林西南方向東北方收網。'
    },
    {
      id: 'event-chapter1',
      chapter: '第一章',
      title: '買個槍也男上加男',
      date: '6月20日 下午',
      images: ['event_chapter1_v13.png', 'event_chapter1_v12.png', 'event_chapter1_v11.png'],
      summary: '斯科特調查森林歷史；大B與米勒籌措武裝；蒼浩與安妮在街上採購補給資料。',
      detail: '下午14時，搜救隊分頭行動。斯科特在圖書館發現了南北戰爭期間南軍利用森林躲藏的隱秘歷史。另一邊，大B靠著「富家子弟」的氣勢，在亞瑟槍店成功買到威力強大的散彈槍與步槍，米勒也在此時籌備了野外生存的望遠鏡和小刀。與此同時，蒼浩與安妮在貝靈頓鎮的街道上採購了大量野外生存所需的臘腸、醫藥箱與提燈，確保搜救行動的後勤保障。'
    },
    {
      id: 'event-chapter2',
      chapter: '第二章',
      title: '密林入口',
      date: '6月20日 中午',
      image: 'event_chapter2_v7.png',
      summary: '調查員抵達密林入口，斯科特發現血跡與腳印，提議搜救追蹤方向。',
      detail: '中午12時，搜救小隊抵達班寧頓森林西南入口。斯科特在路邊發現了連串的足跡與斑駁的血跡，經過冷靜觀察後，他精確地指出了綁匪逃竄的方向，並向眾人提議以此作為追蹤目標展開搜救。'
    },
    {
      id: 'event-chapter3',
      chapter: '第三章',
      title: '前進森林的一盤散沙',
      date: '6月20日 傍晚',
      image: 'event_chapter3_v2.png',
      summary: '隊伍抵達森林邊緣搜查，發現昨日槍戰痕跡並遭遇獵人父子。',
      detail: '衆人在警長的帶路下抵達森林邊緣（標記2號處），在此發現了大量的散彈槍彈殼與雜亂的足跡。斯科特準確判斷出綁匪是往東北方向逃竄。在深入過程中，隊伍遭遇了持槍戒備的獵人父子勞生與喬治。雙方一度劍拔弩張，但在斯科特亮出法官身份並成功說服後，獵人放下了武器，雙方交換了關於森林深處的不安情報。'
    },
    {
      id: 'event-chapter4',
      chapter: '第四章',
      title: '功夫高手的爬樹之旅',
      date: '6月20日 晚間',
      images: ['event_chapter4_v1.png', 'event_chapter4_v2.png'],
      summary: '獵人勞生轉交武器，喬治提到神祕噩夢，衆人得知更多森林怪談。',
      detail: '獵人勞生因信任法官斯科特，將傳家武器借給隊伍以營救富家千金。他提到森林深處有卡車發動聲。喬治則流露恐懼，稱自進入森林以來每晚都夢見被拖入湖底。斯科特證實了部落傳說中湖泊棲息著「邪神」的禁忌。蒼浩在嘗試攀爬高處偵查時不慎滑落受輕傷，所幸得到安妮的及時包紮。'
    },
    {
      id: 'event-chapter5',
      chapter: '第五章',
      title: '調查員內戰-有功夫無懦夫',
      date: '6月20日 深夜',
      image: 'event_chapter5_v1.png',
      summary: '營地爭吵引發內戰，蒼浩展示功夫壓制大B，隊伍在緊繃中紮營。',
      detail: '夜幕降臨，衆人在森林中紮營升起營火。由於大B的傲慢與種族偏見言論，引發蒼浩強烈不滿。雙方爆發衝突，蒼浩以驚人的功夫身手迅速壓制大B，令其啞口無言。儘管內部關係緊繃，衆人仍意識到森林潛在的威脅（包括喬治提到的精神感應異常），最終決定輪流守夜，在不安中迎接森林的第一個夜晚。'
    },
    {
      id: 'event2',
      chapter: '第六章',
      title: '集體噩夢',
      date: '6月20日深夜',
      image: 'event_chapter6_v1.png',
      summary: '調查員們在森林中紮營過夜，每個人都做了關於枯黃森林、詭異湖泊、金屬尖刺穿胸的恐怖噩夢。噩夢的共通元素暗示著某種超自然力量正在窺視他們。',
      detail: '米勒夢見被憤怒人群追趕，逃入森林後看見愛人站在湖畔被觸手拖入水中。大B夢見兒時劍術比賽的失敗，場景轉變為枯黃森林與湖中怪物。蒼浩聽到遠方的槍聲，最先察覺異常。每個人醒來後都感到「靈魂深處少了點什麼」——理智值下降。'
    },
    {
      id: 'event3',
      chapter: '第七章',
      title: '藝術家營地的預兆',
      date: '6月21日',
      image: 'event_chapter7_v2.png',
      summary: '發現失蹤藝術家的營地和屍體。更驚人的是，他們的畫作精確描繪了調查員們的噩夢場景。斯科特因看到湖中恐怖存在的畫作而短暫陷入瘋狂。',
      detail: '營地中散落的畫作包括：停在樹梢的貓頭鷹、枯萎樹林中的小路、月光閃耀的森林、荒廢小屋中的人影、以及湖畔恐怖存在升起的場景。這些畫與夢境的驚人吻合令所有人崩潰。蒼浩認出畫中場景就是自己的噩夢。斯科特直接瘋狂——尖叫後呆坐在地，暫時失去記憶。'
    },
    {
      id: 'event-chapter8',
      chapter: '第八章',
      title: '真相的殘酷暗示',
      date: '6月21日 凌晨',
      image: 'event_chapter8_v2.png',
      summary: '米勒與大B伏擊並捕獲了神經質的綁匪克雷頓。審問中，克雷頓描述了森林中「中彈卻不死」的非法存在，揭示了森林對人類心智的殘酷侵蝕。',
      detail: '克雷頓在審問中顯得極度恐懼，聲稱自己分不清現實與夢境。他曾明確射中森林中的黑影，但對方卻毫無反應地走開。他更暗示，其首領哈里斯發狂是因為看到警察變成了「奇怪的東西」。這讓團隊意識到，這座森林的力量正在扭曲人類的感官與認知，這不只是金錢糾紛，更涉及古老的威脅。'
    },
    {
      id: 'event4',
      chapter: '第九章',
      title: '礦區的祕密與舊友重逢',
      date: '6月21日',
      image: 'event_chapter9_v5.png',
      summary: '蒼浩在森林中截下一輛卡車，發現駕駛者竟是失蹤的舊友劉金寶。金寶已變得冷淡疏離，聲稱在為盧卡斯運送炸藥。蒼浩試圖強行帶走金寶，但失敗了。',
      detail: '金寶透露水庫附近正在進行祕密挖掘——工人們在礦區挖出會發出藍光的神祕礦物。蒼浩嘗試用武力制服金寶，但金寶反應迅速跳上卡車逃走。蒼浩後來潛入礦區，看到大量工人搬運炸藥進入一個散發藍光的洞穴。一切指向某種不可告人的祕密。'
    },
    {
      id: 'event-chapter10',
      chapter: '第十章',
      title: '來自深淵的監視：活屍士兵',
      date: '6月21日 深夜',
      image: 'event_chapter10_v2.png',
      summary: '在深夜守夜期間，米勒發現並射擊了一名潛伏在樹林中的黑影。令人驚悚的是，對方中彈後毫無反應，米勒隨後發現這竟然是一具穿著南北戰爭軍服、沒有呼吸的「活屍」。',
      detail: '米勒發現樹林角落有一道黑影閃過。當黑影試圖往深處逃竄時，米勒發現對方的動作顯得有些遲鈍。米勒開槍警告並精準射中對方的小腿，試圖使其停止行動。令人詭異的是，對方中彈後竟然連哼都不哼一聲就倒在地上，完全沒有痛覺反應。米勒上前將對方壓制在地，卻驚恐地發現這個人完全沒有呼吸跡象，連胸口都沒有起伏。當他把這道人影翻過來後，映入眼簾的是一幅極其駭人的景象：這具「人」全身上下穿著陳舊的南北戰爭時期軍裝，臉部早已腐爛不堪。'
    },
    {
      id: 'event-chapter11',
      chapter: '第十一章',
      title: '異變之兆：夜空中的神祕藍光',
      date: '6月21日 深夜',
      image: 'event_blue_light_v1.png',
      summary: '調查小組在不同位置同時目擊了天空閃過的強烈藍光，預示著超自然力量的覺醒。',
      detail: '在森林的不同角落，調查小組成員在準備守夜時，驚見夜空中劃過一陣強烈的藍光，猶如無聲的爆炸。大B、米勒與安妮在森林的一隅目睹了這不可思議的景象，光芒將樹梢映照得如同白晝。同時，獨自行動的斯科特與正在處理活屍士兵的蒼浩也感受到了這股不安的震動。空氣中瀰漫著一種難以言喻的量子波動感，彷彿森林深處有什麼古老的東西正在甦醒。'
    },
    {
      id: 'event-chapter12',
      chapter: '第十二章',
      title: '串在樹上的人棍：死亡氣息的小木屋',
      date: '6月22日',
      image: 'event_chapter11_v1.png',
      summary: '小組抵達綁匪藏身處「長生小木屋」，卻發現了極其恐怖的現場：綁匪多布斯竟被巨大監刺釘死在樹上。',
      detail: '斯科特、米勒、大B與安妮抵達了森林深處的長生小木屋。木屋外瀰漫著濃烈的腐敗臭味。他們驚恐地發現多布斯（Dobbs）被一根巨大的金屬監刺貫穿胸膛，釘在門外的一棵大樹上。木屋牆壁佈滿了由內向外射擊的彈孔，顯示屋內的人曾因極度恐懼而向看不見的威脅瘋狂開火。'
    },
    {
      id: 'event-chapter13',
      chapter: '第十三章',
      title: '監禁與失蹤的簡小姐',
      date: '6月22日',
      image: 'event_chapter13_v4.png',
      summary: '哈里斯投降後揭露簡小姐已神祕失蹤。斯科特急於搜救卻反被俘虜，但在礦區發現了被囚禁的眾人。',
      detail: '哈里斯（Harris）最終投降，他精神失常地聲稱昨晚小組被無數亡靈包圍。簡小姐在混亂中失蹤，安妮發現繩索是被自行鬆開的。心急如焚的斯科特獨自衝向礦區搜救小姐，卻被礦區勘探員包圍並俘虜。他在四號小木屋發現了被繩索綑綁、動彈不得的霍爾父子、簡小姐與斯科特自己。'
    },
    {
      id: 'event-chapter14',
      chapter: '第十四章',
      title: '夢中木屋與上古邪神的召喚',
      date: '6月22日',
      image: 'event_chapter13_v1.png',
      summary: '蒼浩與米勒找到了夢中的木屋，發現了石棺中甦醒的南北戰爭活屍，揭開了邪神格拉基的真相。',
      detail: '蒼浩與米勒發現了與蒼浩噩夢中完全一致的「夢中木屋」。木屋內停放著五口冒著藍光的石棺，棺材中裝有南北戰爭時期的軍牌與腐爛真菌。兩具身穿舊軍服的活屍士兵從棺中甦醒，米勒開槍將其擊殺。屋內的賽斯日記揭露，釋放藍色礦物是為了喚醒被囚禁的邪神「格拉基」。'
    },
    {
      id: 'event-chapter15',
      chapter: '第十五章',
      title: '虛偽的領班',
      date: '6月22日',
      image: 'event_chapter15_v1.png',
      summary: '大 B 與安妮潛入礦區，大 B 試圖以盧卡斯助手的身分混入辦公室，卻因無法解釋通訊細節而被領班卡爾識破並擒獲。',
      detail: '大 B 穿上偽裝衣物，在大門口遭遇領班卡爾 (Karl)。大 B 宣稱自己是盧卡斯派來支援工具與調查進度的，但卡爾對此深感懷疑，質問為何不用無線電聯繫。雖然大 B 試圖用話術搪塞，但卡爾最終決定直接動武，夥同金寶與另一名工人將大 B 壓制在地並綑綁。'
    },
    {
      id: 'event-chapter16',
      chapter: '第十六章',
      title: '監禁室的重逢',
      date: '6月22日',
      image: 'event_chapter16_v1.png',
      summary: '大 B 被投進監獄後，發現斯科特、簡小姐與霍爾父子皆被囚禁於此，眾人最終合力脫困。',
      detail: '大 B 被帶入四號木屋深處的小房間，見到了早已被俘的斯科特、簡小姐以及失蹤已久的霍爾 (Hall) 父子。簡小姐對調查員接連被捕感到不屑。隨後，眾人發現牆角有一個凸出的小木樁，斯科特利用其磨斷繩索，重獲自由後也幫助原本冷嘲熱諷的大 B 解開束縛。'
    },
    {
      id: 'event-chapter17',
      chapter: '第十七章',
      title: '安妮的孤注一擲',
      date: '6月22日',
      image: 'event_chapter17_v2.png',
      summary: '安妮被包圍後反鎖在工具室，利用炸藥推車製造大爆炸後成功逃離礦區。',
      detail: '安妮在逃亡中躲入五號工具室並將門反鎖。面對門外卡爾等人的破門威脅，安妮抓起炸藥與火柴威脅玉石俱焚。最終，安妮點燃了滿載炸藥的推車並衝出門外，巨大的爆炸將卡爾與金寶炸飛，安妮則趁著煙霧與混亂往湖泊方向的小路逃竄。'
    },
    {
      id: 'event-chapter18',
      chapter: '第十八章',
      title: '分頭突圍',
      date: '6月22日',
      images: ['event_chapter18_v1_new.png', 'event_chapter18_annie_escape.png'],
      summary: '礦區混亂之際，各路人馬分別逃脫，斯科特、簡小姐、大 B 以及獵人霍爾父子趁亂逃出，安妮則往湖泊方向逃跑。',
      detail: '藉由安妮製造的爆破，斯科特、簡小姐與大 B 及獵人霍爾父子趁亂從木屋後方的側邊小路逃出了礦區。安妮則獨自往湖泊方向逃跑，背後則有活屍和礦工們的追趕。'
    },
    {
      id: 'event-chapter19',
      chapter: '第十九章',
      title: '湖畔的意外重逢',
      date: '6月22日',
      image: 'event_chapter19_v3.png',
      summary: '安妮獨自往湖泊側邊的小路逃跑，並在礦區外圍遇見了剛從湖邊趕來的蒼浩與米勒。',
      detail: '眾人在礦區外圍和湖畔旁的小路中短暫重逢。安妮將礦區爆炸的情況告知兩人，面對背後源源不斷傳來的非人咆哮，這支殘破的小隊決定先離開這個是非之地。'
    },
    {
      id: 'event-chapter20',
      chapter: '第二十章',
      title: '反擊的狼煙',
      date: '6月22日',
      image: 'event_chapter19_v1.png',
      summary: '蒼浩、安妮、米勒回到湖邊木樁處，躲在對面森林中看到活屍追兵決定要在此伏擊。',
      detail: '蒼浩在叢林中看到兩個活屍追兵於是拿起中國配劍跳出來攻擊，而米勒則舉起步槍狙擊了另一隻活屍，而安妮繼續在叢林中躲著。'
    },
    {
      id: 'event-chapter21',
      chapter: '第二十一章',
      title: '絕死邊緣與二虎再臨',
      date: '6月22日',
      image: 'event_chapter21.png',
      summary: '就在蒼浩即將被處決之際，變異後的二虎射殺敵影救助，並在留下遺言後消失。',
      detail: '一名眼含深淵的活屍守衛步步逼近負傷的蒼浩。就在槍口抵住眉心的瞬間，一道淡藍色的火舌從密林深處噴湧而出，將守衛的頭部徹底粉碎。二虎緩步走出，胸口的貫穿傷散發著幽藍螢光。他拒絕了蒼浩的挽留，留下「照顧好我家，我已回不去了。來世有機會再做兄弟吧。」的決絕之言後，如同幻影般再次消失在永恆的迷霧中。'
    },
    {
      id: 'event-chapter22',
      chapter: '第二十二章',
      title: '斯科特的決斷',
      date: '6月22日',
      image: 'event_chapter22.png',
      summary: '斯科特與簡小姐還有大B決定回到礦區徹底摧毀地穴。',
      detail: '斯科特與簡小姐決定回到礦區徹底摧毀地穴，他們利用剩餘的炸藥將散發藍光的礦坑洞口炸毀，破壞邪神的降臨的計畫。大 B 則負責去一號木屋搜刮回眾人被收繳的武器裝備'
    },
    {
      id: 'event-chapter23',
      chapter: '第二十三章',
      title: '終焉封印與最終集結',
      date: '6月22日',
      image: 'event_chapter18_v1.png',
      summary: '調查小組利用炸藥徹底封印礦坑地洞，眾人在晨曦中的岔路口完成最後集結。',
      detail: '斯科特與大 B 將剩餘的炸藥推入佈滿藍光礦石的地洞。隨著一聲悶響，礦脈連同邪神的觸鬚被永久埋葬。次日凌晨，六位調查員在森林出口的岔路口重聚。疲倦與釋然交織在每個人臉上。而調查員們則帶著各自的秘密準備離開這片被詛咒的土地。'
    },
    {
      id: 'event-chapter24',
      chapter: '第二十四章',
      title: '劇變：希望的凋零 (The False Dawn)',
      date: '6月22日',
      image: 'event_chapter24.png',
      summary: '調查小組救出簡小姐（Jane）並撤離森林，原本充滿希望的歸途卻在簡飲下安妮（Annie）遞來的水後，演變成一場猝不及防的悲劇。',
      detail: '在完成礦區封印後，小組帶著簡小姐準備返回三金市。途中氣氛緩和，斯科特（Scott）將「盧卡斯犯罪紀錄」（關於非法強佔原住民土地的證據）交給簡，希望她能協助族人爭取正義。然而，當簡喝下女僕安妮提供的飲用水後，臉色迅速轉為不自然的潮紅，隨即心跳停止、呼吸消失，直接死在斯科特的懷中。眾人原本預期的曙光瞬間熄滅。'
    },
    {
      id: 'event-chapter25',
      chapter: '第二十五章',
      title: '揭密：蛇蠍的假面 (Unmasking the Betrayal)',
      date: '6月22日',
      image: 'event_chapter25.png',
      summary: '面對簡的離奇暴斃，賞金獵人米勒（Miller）察覺異樣並揭穿安妮的謊言，在安妮身上搜出致命毒藥。',
      detail: '面對安妮驚慌失措的辯解，經驗豐富的米勒利用他在社會摸爬滾打的直覺看穿了安妮在撒謊。儘管安妮極力否認並試圖博取同情，米勒仍冷酷地對她進行搜身，最終在她的女僕裝內搜出一只寫有「毒藥」的藥袋。證據確鑿之下，安妮停止了偽裝，整個人散發出與以往溫順形象完全相反的陰冷氣息。'
    },
    {
      id: 'event-chapter26',
      chapter: '第二十六章',
      title: '餘燼：血色復仇的終焉 (The Final Reckoning)',
      date: '6月23日',
      image: 'event_chapter26.png',
      summary: '安妮揭露其為盧卡斯私生女的復仇身世，盧卡斯在得知真相與愛女死訊後崩潰自殺，故事在無盡的遺憾中收場。',
      detail: '安妮被押回看守所後，要求與盧卡斯（Lucas）面談，並稱呼他為「爸爸」，揭露自己是多年前被他拋棄、目睹母親含恨而終的私生女，潛入府中多年只為親手奪走盧卡斯最珍視的事物。得知真相與女兒慘死的盧卡斯精神徹底崩潰，並於三天後在自責中舉槍自盡。'
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
          <h2 style={{ color: 'var(--gold-accent)', marginBottom: '15px' }}>調查小組 (Investigators)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {investigators.map(inv => (
              <div key={inv.id} className="character-card" onClick={() => { playSfx(inv.sound, 3000); clearCenter(); setActiveDossier(inv); }}>
                <img src={inv.image} alt={inv.name} className="dossier-image" />
                <div className="dossier-name">{inv.name}</div>
                {inv.fate && (
                  <div className="fate-tag" style={{ background: inv.fate.color }}>{inv.fate.status}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Main Focus */}
        <div className="panel center-panel" ref={centerPanelRef} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', paddingTop: '40px', overflowY: 'auto' }}>
          {activeDossier ? (
            <div className="dossier-detail" style={{ background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(1deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)' }}>
              <h1 style={{ fontFamily: 'Cinzel', borderBottom: '2px solid #222' }}>{activeDossier.name}</h1>
              <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#555' }}>{activeDossier.role}</p>

              {activeDossier.stats && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', background: 'rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontFamily: 'Cinzel', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--blood-ochre)' }}>能力屬性 (Ability Attributes)</h3>
                  {Object.entries(activeDossier.stats).map(([stat, val]) => (
                    <div key={stat} style={{ marginBottom: '8px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', alignItems: 'center' }}>
                        <span>{stat}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--blood-ochre)' }}>{val}</span>
                          <button
                            className="roll-btn"
                            onClick={() => handleRoll(stat, val)}
                            title={`進行 ${stat} 檢定`}
                          >
                            🎲
                          </button>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#ddd', borderRadius: '3px' }}>
                        <div style={{ width: `${val}%`, height: '100%', background: 'var(--blood-ochre)', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ marginTop: '20px', lineHeight: '1.6', fontSize: '0.95rem' }}>{activeDossier.desc}</p>

              {activeDossier.fate && (
                <div className="fate-reveal-container">
                  <div
                    className={`fate-cover ${isFateRevealed ? 'torn-off' : ''}`}
                    onClick={() => { if (!isFateRevealed) { playSfx(SFX.PAPER_TEAR); setIsFateRevealed(true); } }}
                  >
                    <span>點擊撕開命運真相</span>
                  </div>
                  <div className={`fate-detail-box ${isFateRevealed ? 'revealed' : 'hidden'}`}>
                    <h3 style={{ fontFamily: 'Cinzel', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <span className="fate-tag" style={{ background: activeDossier.fate.color, display: 'inline-block', marginRight: '8px' }}>{activeDossier.fate.status}</span>
                      最終命運
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#444' }}>{activeDossier.fate.detail}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setActiveDossier(null); setRollResult(null); }}
                style={{ marginTop: '30px', background: 'var(--blood-ochre)', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel' }}
              >
                關閉卷宗
              </button>
            </div>
          ) : activeSuspect ? (
            <div className="suspect-detail" style={{ background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(-2deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)', border: '2px solid var(--blood-ochre)' }}>
              <h1 style={{ fontFamily: 'Cinzel', borderBottom: '2px solid var(--blood-ochre)', color: 'var(--blood-ochre)' }}>{activeSuspect.name}</h1>
              <p style={{ marginTop: '15px', fontStyle: 'italic' }}>{activeSuspect.role}</p>
              {activeSuspect.fate && (
                <div className="fate-tag" style={{ background: activeSuspect.fate.color, display: 'inline-block', marginTop: '10px' }}>{activeSuspect.fate.status}</div>
              )}
              <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{activeSuspect.desc}</p>
              {activeSuspect.fate?.detail && (
                <div className="fate-reveal-container">
                  <div
                    className={`fate-cover ${isFateRevealed ? 'torn-off' : ''}`}
                    onClick={() => { if (!isFateRevealed) { playSfx(SFX.PAPER_TEAR); setIsFateRevealed(true); } }}
                  >
                    <span>點擊撕開命運真相</span>
                  </div>
                  <div className={`fate-detail-box ${isFateRevealed ? 'revealed' : 'hidden'}`}>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#444' }}>{activeSuspect.fate.detail}</p>
                  </div>
                </div>
              )}
              <img src={activeSuspect.image} alt={activeSuspect.name} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', marginTop: '15px', border: '4px solid #fff', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)' }} />
              <button
                onClick={() => { setActiveSuspect(null); setRollResult(null); }}
                style={{ marginTop: '30px', background: '#333', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel' }}
              >
                {npcs.some(n => n.id === activeSuspect.id) ? "隱藏關鍵人物" : "隱藏嫌疑人"}
              </button>
            </div>
          ) : activeClue ? (
            <div className="clue-detail" style={{ background: 'var(--parchment)', color: '#222', padding: '20px', maxWidth: '600px', transform: 'rotate(-1deg)', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'Cinzel', borderBottom: '1px solid #222', marginBottom: '15px' }}>{activeClue.name}</h1>
              {activeClue.images ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px', marginBottom: '15px' }}>
                  {activeClue.images.map((img, idx) => (
                    <img key={idx} src={img} alt={activeClue.name} style={{ width: '100%', height: '180px', objectFit: 'cover', border: '4px solid #fff', boxShadow: '3px 3px 10px rgba(0,0,0,0.3)' }} />
                  ))}
                </div>
              ) : (
                <img src={activeClue.image} alt={activeClue.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', border: '5px solid #fff', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)' }} />
              )}
              <p style={{ marginTop: '15px', lineHeight: '1.6', fontWeight: 'bold' }}>{activeClue.desc}</p>
              {activeClue.details && (
                <ul style={{ textAlign: 'left', marginTop: '15px', paddingLeft: '20px', listStyleType: 'square' }}>
                  {activeClue.details.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: '10px', fontSize: '0.95rem', lineHeight: '1.5' }}>{detail}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => { setActiveClue(null); setRollResult(null); }}
                style={{ marginTop: '20px', background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer' }}
              >
                收回線索
              </button>
            </div>
          ) : activeEvent ? (
            <div className="event-detail" style={{ background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '600px', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #222', paddingBottom: '10px' }}>
                <h1 style={{ fontFamily: 'Cinzel', fontSize: '1.3rem' }}>{activeEvent.title}</h1>
                <span style={{ fontFamily: 'Cinzel', fontSize: '0.8rem', color: 'var(--blood-ochre)' }}>{activeEvent.chapter}</span>
              </div>
              <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#888', fontSize: '0.85rem' }}>📅 {activeEvent.date}</p>
              {activeEvent.images ? (
                <div style={{ display: 'grid', gridTemplateColumns: activeEvent.images.length >= 3 ? 'repeat(3, 1fr)' : activeEvent.images.length > 1 ? '1fr 1fr' : '1fr', gap: '10px', marginTop: '15px' }}>
                  {activeEvent.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${activeEvent.title}-${idx}`} style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', border: '3px solid #fff', boxShadow: '3px 3px 10px rgba(0,0,0,0.3)' }} />
                  ))}
                </div>
              ) : activeEvent.image && (
                <img src={activeEvent.image} alt={activeEvent.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', marginTop: '15px', border: '5px solid #fff', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)' }} />
              )}
              <p style={{ marginTop: '15px', lineHeight: '1.8', fontSize: '0.95rem' }}>{activeEvent.detail}</p>
              <button
                onClick={() => { setActiveEvent(null); setRollResult(null); }}
                style={{ marginTop: '30px', background: 'var(--blood-ochre)', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel' }}
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
                  <img src="/forest_map.png" alt="Forest Map" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />

                  {/* Interactive Hotspots */}
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      className={`map-hotspot ${isEditMode ? 'edit-mode' : ''} ${draggedId === loc.id ? 'dragging' : ''}`}
                      style={{ top: loc.top, left: loc.left }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>📍 熱點座標更新 (更新後請複製)</h3>
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
                  <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>※ 拖曳地圖上的紅圈即可即時更新上方數值</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Tabbed Panel */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tab Bar */}
          <div className="tab-bar">
            <button className={`tab-btn ${rightTab === 'clues' ? 'active' : ''}`} onClick={() => setRightTab('clues')}>📜 線索</button>
            <button className={`tab-btn ${rightTab === 'suspects' ? 'active' : ''}`} onClick={() => setRightTab('suspects')}>🕵️ 人物</button>
            <button className={`tab-btn ${rightTab === 'chronicle' ? 'active' : ''}`} onClick={() => setRightTab('chronicle')}>📖 事件簿</button>
          </div>

          {/* Tab Content */}
          <div style={{ overflowY: 'auto', flex: 1, paddingTop: '15px' }}>
            {rightTab === 'clues' && (
              <div>
                <h2 style={{ color: 'var(--gold-accent)', marginBottom: '15px' }}>案件線索 (Clues)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {clues.map(clue => (
                    <div
                      key={clue.id}
                      className="list-item clue-item"
                      onClick={() => { playSfx(SFX.PARCHMENT); clearCenter(); setActiveClue(clue); }}
                    >
                      {clue.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightTab === 'suspects' && (
              <div>
                <h2 style={{ color: 'var(--blood-ochre)', marginBottom: '15px' }}>嫌疑人 (Suspects)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                  {suspects.map(suspect => (
                    <div
                      key={suspect.id}
                      className="list-item suspect-item"
                      onClick={() => { playSfx(suspect.sound || SFX.PARCHMENT, 3000); clearCenter(); setActiveSuspect(suspect); }}
                    >
                      <span>{suspect.name}</span>
                      {suspect.fate && (
                        <span className="fate-tag-small" style={{ background: suspect.fate.color }}>{suspect.fate.status}</span>
                      )}
                    </div>
                  ))}
                </div>

                <h2 style={{ color: '#7986cb', marginBottom: '15px' }}>關鍵人物 (Key NPCs)</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {npcs.map(npc => (
                    <div
                      key={npc.id}
                      className="list-item npc-item"
                      onClick={() => { playSfx(npc.sound || SFX.PARCHMENT, 3000); clearCenter(); setActiveSuspect(npc); }}
                    >
                      <span>{npc.name}</span>
                      {npc.fate && (
                        <span className="fate-tag-small" style={{ background: npc.fate.color }}>{npc.fate.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightTab === 'chronicle' && (
              <div>
                <h2 style={{ color: 'var(--gold-accent)', marginBottom: '15px' }}>事件簿 (Chronicle)</h2>
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
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>{rollResult.stat} 檢定</div>
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
          {!isRolling && <div style={{ marginTop: '15px', fontSize: '0.7rem', color: '#666' }}>點擊關閉</div>}
        </div>
      )}
    </div>
  );
}

export default App;
