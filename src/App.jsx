import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeDossier, setActiveDossier] = useState(null);
  const [activeClue, setActiveClue] = useState(null);
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [rightTab, setRightTab] = useState('clues');

  const clearCenter = () => {
    setActiveDossier(null);
    setActiveClue(null);
    setActiveSuspect(null);
    setActiveEvent(null);
  };

  const investigators = [
    { 
      id: 'canghao', 
      name: '蒼浩 (Cang Hao)', 
      role: '武術家 / 尋人者', 
      image: 'cang_hao_full.png',
      desc: '精通武術的華人，此行主要目的是尋找三個月前失蹤的好友二虎。',
      fate: { status: '生還', color: '#4caf50', detail: '回國後寫信隱瞞好友死訊，模仿二虎筆跡定期寫信給二虎的爸媽與劉奶奶，獨自背負痛苦。' },
      stats: { '敏捷 (DEX)': 70, '體質 (CON)': 50, '追蹤 (Track)': 70, '心理 (Psych)': 60, '理智 (SAN)': 40 }
    },
    { 
      id: 'scott', 
      name: '斯科特 (Scott)', 
      role: '原住民法官', 
      image: 'scott.png',
      desc: '利用法律權威取得資源，致力於維護森林的法治與秩序。',
      fate: { status: '生還', color: '#4caf50', detail: '果斷炸毀礦坑封印邪神。簡死後，致力於以法律手段起訴盧卡斯集團，為族人奪回被侵佔的土地。' },
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 53, '聆聽 (Listen)': 70, '追蹤 (Track)': 61, '教育 (EDU)': 80 }
    },
    { 
      id: 'miller', 
      name: '米勒 (Miller)', 
      role: '賞金獵人', 
      image: 'miller.png',
      desc: '經驗豐富的追蹤者，受雇前來調查連環失蹤案，對森林的危險有著直覺般的警覺。',
      fate: { status: '生還', color: '#4caf50', detail: '利用盧卡斯的犯罪紀錄成功勒索了一萬美元賞金，隨後瀟灑地離開了被寧頓小鎮。' },
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 65, '聆聽 (Listen)': 60, '力量 (STR)': 27, '心理 (Psych)': 30 }
    },
    { 
      id: 'bigb', 
      name: '大B (Big B)', 
      role: '富家子弟', 
      image: 'bigb.png',
      desc: '充滿好奇心的紈絝子弟，來到班寧頓森林是為了尋求某種超越金錢的刺激。與簡是青梅竹馬。',
      fate: { status: '生還', color: '#4caf50', detail: '與青梅竹馬簡死別後感到深深的懺悔與遺憾，決定回到父親身邊重新開始生活。' },
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 80, '外貌 (APP)': 35, '說服 (Persuade)': 70, '威嚇 (Intim)': 56 }
    },
    { 
      id: 'annie', 
      name: '安妮 (Annie)', 
      role: '女僕 / 復仇者', 
      image: 'annie.png',
      desc: '外表溫柔內心堅韌的女僕，實為盧卡斯當年拋棄的私生女。在紛亂的調查中，她隱藏著驚天的復仇計畫。',
      fate: { status: '入獄', color: '#f44336', detail: '在撤離途中於飲水下毒殺害簡，揭露自己為盧卡斯私生女的身世。被捕後預計服刑 10-15 年，盧卡斯在遺書中為她留下遺產與頂級律師團隊。' },
      stats: { '敏捷 (DEX)': 70, '幸運 (LUK)': 60, '聆聽 (Listen)': 60, '力量 (STR)': 50, '偵查 (Spot)': 45 }
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
    { id: 'lucas', name: '盧卡斯 (Lucas)', role: '富豪 / 水庫經營者', image: 'lucas.png', desc: '被寧頓小鎮的地方權貴，經營自來水公司與森林中的水庫。提供五千美元懸賞及每人每日25美元補助召集搜救隊。實則是壓迫原住民、侵佔土地的幕後黑手，也是安妮的親生父親。', fate: { status: '自殺', color: '#f44336', detail: '得知簡的死亡、安妮的真實身世、以及自己的種種罪行後，在悲痛與自責中舉槍自盡。死前留下遺書，請頂級律師團隊為安妮辯護，並留給她一筆遺產。' } }
  ];

  const storyEvents = [
    {
      id: 'event1',
      chapter: '序章',
      title: '搜救通報會',
      date: '6月20日',
      summary: '富豪盧卡斯的女兒簡被哈里斯的三人組綁架。在贖金交易失敗後，綁匪帶著簡逃入森林。警長召集搜救隊，五位調查員在被寧頓警察局集結。',
      detail: '6月13日，簡在為水庫工人送餐途中被劫。6月19日贖金交易當晚，哈里斯突然精神失常與警方交火後逃入森林。盧卡斯懸賞五千美元，並提供每人每日25美元補助。蒼浩、斯科特、米勒、大B、安妮五人組成搜救小隊，從森林西南方向東北方收網。'
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
      id: 'event4',
      chapter: '第九章',
      title: '礦區的祕密與舊友重逢',
      date: '6月21日',
      summary: '蒼浩在森林中截下一輛卡車，發現駕駛者竟是失蹤的舊友劉金寶。金寶已變得冷淡疏離，聲稱在為盧卡斯運送炸藥。蒼浩試圖強行帶走金寶，但失敗了。',
      detail: '金寶透露水庫附近正在進行祕密挖掘——工人們在礦區挖出會發出藍光的神祕礦物。蒼浩嘗試用武力制服金寶，但金寶反應迅速跳上卡車逃走。蒼浩後來潛入礦區，看到大量工人搬運炸藥進入一個散發藍光的洞穴。一切指向某種不可告人的祕密。'
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
      id: 'event6',
      chapter: '第十七至十八章',
      title: '最終決戰與驚天逆轉',
      date: '6月23日',
      summary: '斯科特決定引爆礦區炸藥封印邪神格拉基。簡被成功救出，但在撤離途中安妮揭露私生女身世，毒殺簡。盧卡斯三天後自殺。每個人都背負著各自的命運離開。',
      detail: '斯科特意識到礦區正試圖釋放舊日支配者格拉基，果斷點燃引線引爆炸藥。爆炸封住了洞穴——金寶與卡爾跪在廢墟前絕望痛哭。簡獲救後與斯科特重逢，大B也與青梅竹馬相見。然而安妮在飲水中下毒，簡在斯科特懷中失去心跳。真相是安妮是盧卡斯當年拋棄的私生女，母親被趕出豪門後死去，安妮一心復仇。盧卡斯得知一切後三天便舉槍自盡。'
    }
  ];

  return (
    <div className="mystery-board">
      {/* Sidebar: Investigators */}
      <div className="panel">
        <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>調查小組 (Investigators)</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
          {investigators.map(inv => (
            <div key={inv.id} className="character-card" onClick={() => {clearCenter(); setActiveDossier(inv);}}>
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
      <div className="panel" style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', paddingTop: '40px', overflowY: 'auto'}}>
        {activeDossier ? (
          <div className="dossier-detail" style={{background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(1deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)'}}>
            <h1 style={{fontFamily: 'Cinzel', borderBottom: '2px solid #222'}}>{activeDossier.name}</h1>
            <p style={{marginTop: '15px', fontStyle: 'italic', color: '#555'}}>{activeDossier.role}</p>
            
            {activeDossier.stats && (
              <div style={{marginTop: '20px', padding: '15px', border: '1px solid #ccc', background: 'rgba(0,0,0,0.05)'}}>
                <h3 style={{fontFamily: 'Cinzel', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--blood-ochre)'}}>能力屬性 (Ability Attributes)</h3>
                {Object.entries(activeDossier.stats).map(([stat, val]) => (
                  <div key={stat} style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px'}}>
                      <span>{stat}</span>
                      <span>{val}</span>
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
              onClick={() => setActiveDossier(null)}
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
              onClick={() => setActiveSuspect(null)}
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
              onClick={() => setActiveClue(null)}
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
              onClick={() => setActiveEvent(null)}
              style={{marginTop: '30px', background: 'var(--blood-ochre)', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'Cinzel'}}
            >
              關閉事件
            </button>
          </div>
        ) : (
          <div className="map-view">
            <h1 style={{color: 'var(--gold-accent)', fontFamily: 'Cinzel'}}>古茂密林地圖 (Forest Map)</h1>
            <div style={{marginTop: '20px', width: '800px', height: '500px', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold-accent)', overflow: 'hidden'}}>
              <img src="/forest_map.png" alt="Forest Map" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
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
                    onClick={() => {clearCenter(); setActiveClue(clue);}}
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
                    onClick={() => {clearCenter(); setActiveSuspect(suspect);}}
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
                    onClick={() => {clearCenter(); setActiveSuspect(npc);}}
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
                    onClick={() => {clearCenter(); setActiveEvent(event);}}
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
  );
}

export default App;
