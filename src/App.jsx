import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeDossier, setActiveDossier] = useState(null);
  const [activeClue, setActiveClue] = useState(null);
  const [activeSuspect, setActiveSuspect] = useState(null);

  const investigators = [
    { 
      id: 'canghao', 
      name: '蒼浩 (Cang Hao)', 
      role: '武術家 / 尋人者', 
      image: 'cang_hao_full.png',
      desc: '精通武術的華人，此行主要目的是尋找三個月前失蹤的好友二虎。',
      stats: { '敏捷 (DEX)': 70, '體質 (CON)': 50, '追蹤 (Track)': 70, '心理 (Psych)': 60, '理智 (SAN)': 40 }
    },
    { 
      id: 'scott', 
      name: '斯科特 (Scott)', 
      role: '原住民法官', 
      image: 'scott.png',
      desc: '利用法律權威取得資源，致力於維護森林的法治與秩序。',
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 53, '聆聽 (Listen)': 70, '追蹤 (Track)': 61, '教育 (EDU)': 80 }
    },
    { 
      id: 'miller', 
      name: '米勒 (Miller)', 
      role: '賞金獵人', 
      image: 'miller.png',
      desc: '經驗豐富的追蹤者，受雇前來調查連環失蹤案，對森林的危險有著直覺般的警覺。',
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 65, '聆聽 (Listen)': 60, '力量 (STR)': 27, '心理 (Psych)': 30 }
    },
    { 
      id: 'bigb', 
      name: '大B (Big B)', 
      role: '富家子弟', 
      image: 'bigb.png',
      desc: '充滿好奇心的紈絝子弟，來到班寧頓森林是為了尋求某種超越金錢的刺激。',
      stats: { '敏捷 (DEX)': 60, '幸運 (LUK)': 80, '外貌 (APP)': 35, '說服 (Persuade)': 70, '威嚇 (Intim)': 56 }
    },
    { 
      id: 'annie', 
      name: '安妮 (Annie)', 
      role: '女僕', 
      image: 'annie.png',
      desc: '雖然外表溫柔，但內心堅韌的女僕。在紛亂的調查中，她是少數能保持冷靜的人。',
      stats: { '敏捷 (DEX)': 70, '幸運 (LUK)': 60, '聆聽 (Listen)': 60, '力量 (STR)': 50, '偵查 (Spot)': 45 }
    }
  ];

  const clues = [
    { id: 'photo', name: '📜 被剪下的警察局照片', image: 'clue_photo.png', desc: '一張合照，其中一個人的部分被刻意剪掉了，邊緣殘留著焦慮的撕痕。' },
    { id: 'ore', name: '💎 藍色礦石樣本 (Moonlight)', image: 'clue_ore.png', desc: '散發著微弱藍光與不詳共鳴的礦石，長時間直視會感到輕微眩暈。' },
    { id: 'painting', name: '🎨 藝術家賽斯的畫作', image: 'clue_painting.png', desc: '扭曲的森林景象，彷彿樹木正在活過來。' }
  ];

  const suspects = [
    { id: 'kidnapper1', name: '克雷頓 (Clayton)', role: '綁匪首領', image: 'suspect1.png', desc: '眼神兇狠的頭目，臉上有一道明顯的疤痕。似乎是這場綁架案的主謀。' },
    { id: 'kidnapper2', name: '多布斯 (Dobbs)', role: '打手', image: 'suspect2.png', desc: '身材魁梧，沉默寡言。總是守在人質身邊，極具威脅性。' },
    { id: 'kidnapper3', name: '馬丁 (Martin)', role: '司機/眼線', image: 'suspect3.png', desc: '神情焦慮，一直在森林邊緣徘徊。看起來隨時可能崩潰逃走。' },
    { id: 'kimbo', name: '劉金寶 (Liu Kimbo)', role: '異變的工員', image: 'kimbo.png', desc: '蒼浩與二虎的同鄉，原為水庫工員，後被邪神影響。眼神冷淡疏離，瘋狂崇拜「主」。常駕駛著載滿炸藥與藍色礦石的卡車。' },
    { id: 'erhu', name: '二虎 (Erhu)', role: '異變的好友 (活屍)', image: 'erhu.png', desc: '蒼浩尋找已久的好友。三個月前為了尋找金寶進入森林卻失蹤。再次現身時已成了面色慘白的「活屍」，胸口巨大的傷口流出詭異藍光。雖然身體已死，但似乎還保有最後一絲保護蒼浩的友情。' }
  ];

  return (
    <div className="mystery-board">
      {/* Sidebar: Investigators */}
      <div className="panel">
        <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>調查小組 (Investigators)</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
          {investigators.map(inv => (
            <div key={inv.id} className="character-card" onClick={() => {setActiveDossier(inv); setActiveClue(null); setActiveSuspect(null);}}>
              <img src={inv.image} alt={inv.name} className="dossier-image" />
              <div className="dossier-name">{inv.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Map/Main Focus */}
      <div className="panel" style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', paddingTop: '40px'}}>
        {activeDossier ? (
          <div className="dossier-detail" style={{background: 'var(--parchment)', color: '#222', padding: '30px', maxWidth: '500px', transform: 'rotate(1deg)', boxShadow: '10px 10px 30px rgba(0,0,0,0.5)'}}>
            <h1 style={{fontFamily: 'Cinzel', borderBottom: '2px solid #222'}}>{activeDossier.name}</h1>
            <p style={{marginTop: '15px', fontStyle: 'italic', color: '#555'}}>{activeDossier.role}</p>
            
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

            <p style={{marginTop: '20px', lineHeight: '1.6', fontSize: '0.95rem'}}>{activeDossier.desc}</p>
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
            <p style={{marginTop: '20px', lineHeight: '1.6'}}>{activeSuspect.desc}</p>
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
        ) : (
          <div className="map-view">
            <h1 style={{color: 'var(--gold-accent)', fontFamily: 'Cinzel'}}>古茂密林地圖 (Forest Map)</h1>
            <div style={{marginTop: '20px', width: '800px', height: '500px', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--gold-accent)', overflow: 'hidden'}}>
              <img src="/forest_map.png" alt="Forest Map" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        )}
      </div>

      {/* Right: Chronicle/Inventory */}
      <div className="panel">
        <h2 style={{color: 'var(--gold-accent)', marginBottom: '15px'}}>案件線索 (Clues)</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px'}}>
          {clues.map(clue => (
            <div 
              key={clue.id} 
              onClick={() => {setActiveClue(clue); setActiveDossier(null); setActiveSuspect(null);}}
              style={{
                background: 'rgba(255,255,255,0.05)', 
                padding: '10px', 
                borderLeft: '3px solid var(--gold-accent)', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              {clue.name}
            </div>
          ))}
        </div>

        <h2 style={{color: 'var(--blood-ochre)', marginBottom: '15px'}}>幕後嫌疑人 (Suspects)</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          {suspects.map(suspect => (
            <div 
              key={suspect.id} 
              onClick={() => {setActiveSuspect(suspect); setActiveDossier(null); setActiveClue(null);}}
              style={{
                background: 'rgba(255,0,0,0.05)', 
                padding: '10px', 
                borderLeft: '3px solid var(--blood-ochre)', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,0,0,0.05)'}
            >
              {suspect.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
