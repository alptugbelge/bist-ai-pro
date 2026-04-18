import { useState, useEffect, useRef, useMemo } from "react";

const Y = "#f5a623", G = "#00e5b4", R = "#ff3d6b", BG = "#070b12", CB = "#0c1320", BD = "#131e2e";

function TVTicker() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.className = "tradingview-widget-container";
    const w = document.createElement("div");
    w.className = "tradingview-widget-container__widget";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols: [
        {proName:"BIST:XU100",title:"BIST100"},{proName:"BIST:XU030",title:"BIST30"},
        {proName:"BIST:THYAO",title:"THYAO"},{proName:"BIST:GARAN",title:"GARAN"},
        {proName:"BIST:ASELS",title:"ASELS"},{proName:"BIST:AKBNK",title:"AKBNK"},
        {proName:"BIST:EREGL",title:"EREGL"},{proName:"BIST:TUPRS",title:"TUPRS"},
        {proName:"BIST:FROTO",title:"FROTO"},{proName:"BIST:BIMAS",title:"BIMAS"},
        {proName:"CURRENCY:USDTRY",title:"USD/TRY"},{proName:"COMEX:GC1!",title:"ALTIN"},
      ],
      showSymbolLogo: true, colorTheme: "dark", isTransparent: true,
      displayMode: "adaptive", locale: "tr"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, []);
  return <div ref={ref} style={{height:46,borderBottom:`1px solid ${BD}`}} />;
}

function TVMini({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.className = "tradingview-widget-container";
    c.style.height = "65px";
    const w = document.createElement("div");
    w.className = "tradingview-widget-container__widget";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol:`BIST:${code}`, width:"100%", height:65,
      locale:"tr", dateRange:"1D", colorTheme:"dark", isTransparent:true
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, [code]);
  return <div ref={ref} style={{height:65,overflow:"hidden",borderRadius:6}} />;
}

function TVChart({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.className = "tradingview-widget-container";
    c.style.height = "400px";
    const w = document.createElement("div");
    w.style.height = "400px";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      autosize:true, symbol:`BIST:${code}`, interval:"D",
      timezone:"Europe/Istanbul", theme:"dark", style:"1", locale:"tr",
      studies:["RSI@tv-basicstudies","MACD@tv-basicstudies","BB@tv-basicstudies"],
      width:"100%", height:"400"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, [code]);
  return <div ref={ref} style={{height:400,borderRadius:10,overflow:"hidden"}} />;
}

function TVTechAnalysis({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.className = "tradingview-widget-container";
    c.style.height = "200px";
    const w = document.createElement("div");
    w.className = "tradingview-widget-container__widget";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      interval:"1D", width:"100%", isTransparent:true, height:200,
      symbol:`BIST:${code}`, showIntervalTabs:true, locale:"tr", colorTheme:"dark"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, [code]);
  return <div ref={ref} style={{height:200,borderRadius:10,overflow:"hidden"}} />;
}

function TVScreener() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.className = "tradingview-widget-container";
    c.style.height = "600px";
    const w = document.createElement("div");
    w.className = "tradingview-widget-container__widget";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      width:"100%", height:600, defaultColumn:"overview",
      defaultScreen:"most_capitalized", market:"turkey",
      showToolbar:true, colorTheme:"dark", locale:"tr", isTransparent:true
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, []);
  return <div ref={ref} style={{height:600,borderRadius:10,overflow:"hidden"}} />;
}

function Sig({ v }) {
  const m = {AL:[G,"rgba(0,229,180,.12)"],SAT:[R,"rgba(255,61,107,.12)"],BEKLE:[Y,"rgba(245,166,35,.12)"]};
  const [c,b] = m[v]||m.BEKLE;
  return <span style={{background:b,color:c,border:`1px solid ${c}40`,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:900}}>{v}</span>;
}

async function callAI(system, userMsg) {
  try {
    const body = {
      model:"claude-sonnet-4-20250514", max_tokens:1500, system,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      messages:[{role:"user",content:userMsg}]
    };
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
    });
    const d = await r.json();
    const t = d.content?.find(b=>b.type==="text")?.text||"";
    const clean = t.replace(/```json|```/g,"").trim();
    const s=clean.indexOf("{"), e=clean.lastIndexOf("}");
    if(s===-1) return null;
    return JSON.parse(clean.slice(s,e+1));
  } catch { return null; }
}

const POPULAR = [
  {c:"THYAO",n:"Türk Hava Yolları",s:"Havacılık",i:"BIST30"},
  {c:"GARAN",n:"Garanti BBVA",s:"Bankacılık",i:"BIST30"},
  {c:"ASELS",n:"Aselsan",s:"Savunma",i:"BIST30"},
  {c:"AKBNK",n:"Akbank",s:"Bankacılık",i:"BIST30"},
  {c:"KCHOL",n:"Koç Holding",s:"Holding",i:"BIST30"},
  {c:"EREGL",n:"Ereğli Demir",s:"Metal",i:"BIST30"},
  {c:"BIMAS",n:"BİM Mağazalar",s:"Perakende",i:"BIST30"},
  {c:"TUPRS",n:"Tüpraş",s:"Enerji",i:"BIST30"},
  {c:"FROTO",n:"Ford Otosan",s:"Otomotiv",i:"BIST30"},
  {c:"TCELL",n:"Turkcell",s:"Telekom",i:"BIST30"},
  {c:"PGSUS",n:"Pegasus",s:"Havacılık",i:"BIST30"},
  {c:"YKBNK",n:"Yapı Kredi",s:"Bankacılık",i:"BIST30"},
  {c:"KOZAL",n:"Koza Altın",s:"Madencilik",i:"BIST30"},
  {c:"SASA",n:"Sasa Polyester",s:"Kimya",i:"BIST30"},
  {c:"OTKAR",n:"Otokar",s:"Savunma",i:"BIST30"},
  {c:"LOGO",n:"Logo Yazılım",s:"Teknoloji",i:"BIST100"},
  {c:"MAVI",n:"Mavi Giyim",s:"Tekstil",i:"BIST100"},
  {c:"CCOLA",n:"Coca-Cola İçecek",s:"İçecek",i:"BIST100"},
  {c:"ODAS",n:"Odaş Elektrik",s:"Enerji",i:"BIST100"},
  {c:"KATMR",n:"Katmerciler",s:"Savunma",i:"BIST100"},
  {c:"ALKIM",n:"Alkim Kimya",s:"Kimya",i:"BIST-TÜM"},
  {c:"FONET",n:"Fonet Bilgi",s:"Teknoloji",i:"BIST-TÜM"},
  {c:"ARTMS",n:"Artemas",s:"Teknoloji",i:"BIST-TÜM"},
  {c:"LKMNH",n:"Lokman Hekim",s:"Sağlık",i:"BIST-TÜM"},
  {c:"MOGAN",n:"Mogan Teknoloji",s:"Teknoloji",i:"BIST-TÜM"},
];

export default function App() {
  const [tab, setTab] = useState("market");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [aLoad, setALoad] = useState(false);
  const [signals, setSignals] = useState({});
  const [scanResult, setScanResult] = useState(null);
  const [scanLoad, setScanLoad] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertForm, setAlertForm] = useState({code:"",price:"",dir:"üstüne"});
  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [chat]);

  const filtered = useMemo(() =>
    POPULAR.filter(s => s.c.toLowerCase().includes(search.toLowerCase()) || s.n.toLowerCase().includes(search.toLowerCase()))
  , [search]);

  const analyze = async (stock) => {
    setSelected(stock); setTab("analysis"); setALoad(true);
    const r = await callAI(
      `Sen BIST'in en iyi yapay zeka borsa uzmanısın. Grafik okuma, teknik ve temel analiz, KAP haberleri konusunda uzmansın. Türkçe yanıt ver. SADECE JSON:
{"signal":"AL|SAT|BEKLE","confidence":0-100,"summary":"3 cümle uzman yorum","chart_reading":"grafik analizi RSI MACD Bollinger destek direnç","price_action":"fiyat hacim analizi","fundamental":"temel analiz büyüme sektör","news_catalyst":"KAP ve haberler","prediction":"1 hafta ve 1 ay tahmin","risk":"DÜŞÜK|ORTA|YÜKSEK","target_1w":fiyat,"target_1m":fiyat,"stop_loss":fiyat,"reasons":["r1","r2","r3"],"chart_pattern":"formasyon","momentum":"GÜÇLÜ_YÜKSELİŞ|YAVAŞ_YÜKSELİŞ|YATAY|YAVAŞ_DÜŞÜŞ|GÜÇLÜ_DÜŞÜŞ","entry_strategy":"giriş stratejisi"}`,
      `${stock.n} (${stock.c}) - ${stock.s} sektörü - ${stock.i}. TradingView BIST:${stock.c}. Güncel teknik göstergeler ve KAP haberleri ile analiz et.`
    );
    if(r) { setAnalysis(a=>({...a,[stock.c]:r})); setSignals(s=>({...s,[stock.c]:r.signal})); }
    setALoad(false);
  };

  const analyzeCustom = () => {
    if(!customCode.trim()) return;
    const code = customCode.trim().toUpperCase();
    const stock = POPULAR.find(s=>s.c===code) || {c:code,n:code,s:"Bilinmiyor",i:"BIST-TÜM"};
    analyze(stock);
    setCustomCode("");
  };

  const scan = async () => {
    setScanLoad(true); setScanResult(null); setTab("scan");
    const r = await callAI(
      `Sen BIST AI analist sistemisisin. Web araması yap. SADECE JSON:
{"bist100":"endeks seviyesi","direction":"YÜKSELİŞ|DÜŞÜŞ|YATAY","summary":"piyasa 3 cümle","top_opportunities":[{"code":"KOD","name":"isim","signal":"AL","confidence":80,"reason":"sebep","catalyst":"katalizör"}],"avoid_list":[{"code":"KOD","reason":"neden"}],"hidden_gems":[{"code":"KOD","name":"isim","reason":"potansiyel"}],"hot_sectors":[{"sector":"sektör","reason":"neden"}],"key_news":["haber1","haber2","haber3"],"risk_level":"DÜŞÜK|ORTA|YÜKSEK","weekly_outlook":"bu hafta beklenti"}`,
      `Bugün BIST piyasasını analiz et. Tüm hisseler, KAP haberleri, makro faktörler. Özellikle BIST dışı küçük yüksek potansiyelli hisseleri de dahil et.`
    );
    setScanResult(r); setScanLoad(false);
  };

  const sendChat = async () => {
    if(!chatMsg.trim()) return;
    const msg = chatMsg; setChatMsg(""); setChatLoad(true);
    setChat(c=>[...c,{r:"user",t:msg}]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          system:"Sen BIST'in en zeki borsa asistanısın. Türkçe, net ve uzman yanıt ver.",
          messages:[{role:"user",content:msg}]
        })
      });
      const d = await res.json();
      const answer = d.content?.find(b=>b.type==="text")?.text||"Yanıt alınamadı.";
      setChat(c=>[...c,{r:"ai",t:answer}]);
    } catch { setChat(c=>[...c,{r:"ai",t:"Hata oluştu."}]); }
    setChatLoad(false);
  };

  const an = selected ? analysis[selected.c] : null;
  const tb = (t) => ({
    padding:"7px 12px", borderRadius:6, fontSize:10, fontWeight:700,
    border:tab===t?`1px solid ${Y}`:`1px solid ${BD}`,
    background:tab===t?`rgba(245,166,35,.1)`:"transparent",
    color:tab===t?Y:"#2e4257", cursor:"pointer", letterSpacing:1, textTransform:"uppercase", whiteSpace:"nowrap"
  });

  return (
    <div style={{minHeight:"100vh",background:BG,color:"#b8ccdc",fontFamily:"'JetBrains Mono','Courier New',monospace",fontSize:12}}>
      <TVTicker />
      <div style={{borderBottom:`1px solid ${BD}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16}}>₺</div>
          <div>
            <div style={{color:Y,fontWeight:900,fontSize:14,letterSpacing:3}}>BIST·AI PRO</div>
            <div style={{fontSize:8,color:"#1e3248",letterSpacing:2}}>GERÇEK ZAMANLI • TÜM HİSSELER • AI ANALİZ</div>
          </div>
        </div>
        <div style={{flex:1,overflowX:"auto",display:"flex",gap:5}}>
          {["market","screener","analysis","scan","alert","portfolio","chat"].map(t=>(
            <button key={t} style={tb(t)} onClick={()=>setTab(t)}>
              {t==="market"?"Popüler":t==="screener"?"Tüm BIST":t==="analysis"?"Analiz":t==="scan"?"AI Tara":t==="alert"?"Alarmlar":t==="portfolio"?`Portföy${portfolio.length>0?` (${portfolio.length})`:""}`:t==="chat"?"AI Asistan":""}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"14px"}}>

        {tab==="market" && (
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Hisse kodu ara..."
                style={{flex:1,minWidth:150,background:CB,border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              <input value={customCode} onChange={e=>setCustomCode(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&analyzeCustom()}
                placeholder="Kod gir (ACSEL...) + Enter"
                style={{width:180,background:CB,border:`1px solid ${Y}30`,borderRadius:8,padding:"8px 12px",color:Y,fontSize:12,outline:"none"}}/>
              <button onClick={scan} style={{padding:"8px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>🤖 AI TARA</button>
            </div>
            <div style={{marginBottom:10,padding:"8px 12px",background:`rgba(0,229,180,.04)`,border:`1px solid ${G}15`,borderRadius:8,fontSize:10,color:"#2e4257"}}>
              💡 <span style={{color:G}}>Tüm BIST hisseleri</span> için → "Tüm BIST" sekmesine tıkla. Herhangi bir hisse kodu girmek için → sarı kutuya yaz + Enter
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
              {filtered.map(stock=>(
                <div key={stock.c} onClick={()=>analyze(stock)}
                  style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:10,cursor:"pointer",transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=Y}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BD}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div>
                      <div style={{color:Y,fontWeight:900,fontSize:13}}>{stock.c}</div>
                      <div style={{color:"#1e3248",fontSize:9}}>{stock.s}</div>
                    </div>
                    {signals[stock.c]&&<Sig v={signals[stock.c]}/>}
                  </div>
                  <TVMini code={stock.c}/>
                  <div style={{fontSize:9,color:G,opacity:.4,marginTop:2}}>● Anlık • Tıkla → AI Analiz</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="screener" && (
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:10}}>TÜM BIST HİSSELERİ — CANLI SCREENER</div>
            <div style={{marginBottom:10,padding:"8px 12px",background:`rgba(245,166,35,.04)`,border:`1px solid ${Y}15`,borderRadius:8,fontSize:10,color:"#2e4257"}}>
              💡 Herhangi bir hisseye tıklayın → AI Analizi başlar. Yeni IPO'lar otomatik buraya eklenir.
            </div>
            <TVScreener/>
          </div>
        )}

        {tab==="analysis" && (
          <div>
            {!selected ? (
              <div style={{textAlign:"center",padding:60,color:"#1e3248"}}>
                <div style={{fontSize:36,marginBottom:10}}>📊</div>
                <div>Piyasa veya Tüm BIST sekmesinden hisse seçin</div>
                <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"center"}}>
                  <input value={customCode} onChange={e=>setCustomCode(e.target.value.toUpperCase())}
                    onKeyDown={e=>e.key==="Enter"&&analyzeCustom()}
                    placeholder="Hisse kodu gir (örn: THYAO)"
                    style={{background:CB,border:`1px solid ${Y}40`,borderRadius:8,padding:"10px 14px",color:Y,fontSize:13,outline:"none",width:200}}/>
                  <button onClick={analyzeCustom} style={{padding:"10px 18px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>Analiz Et</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{color:Y,fontSize:22,fontWeight:900}}>{selected.c}</div>
                    <div style={{color:"#2e4257",fontSize:11}}>{selected.n} — {selected.s}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{if(!portfolio.find(p=>p.c===selected.c))setPortfolio(p=>[...p,{...selected,date:new Date().toLocaleDateString("tr-TR"),signal:an?.signal}]);}}
                      style={{padding:"7px 14px",borderRadius:8,background:`linear-gradient(135deg,${G},#00a87d)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>+ Portföy</button>
                    <button onClick={()=>{setAlertForm({code:selected.c,price:"",dir:"üstüne"});setTab("alert");}}
                      style={{padding:"7px 14px",borderRadius:8,background:`rgba(245,166,35,.1)`,color:Y,fontWeight:700,fontSize:11,border:`1px solid ${Y}40`,cursor:"pointer"}}>🔔 Alarm</button>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{color:G,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:6}}>📈 CANLI GRAFİK (RSI • MACD • BOLLINGER)</div>
                  <TVChart code={selected.c}/>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{color:"#5e9eff",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:6}}>🎯 TEKNİK ANALİZ ÖZETİ</div>
                  <TVTechAnalysis code={selected.c}/>
                </div>
                {aLoad ? (
                  <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:40,textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:10}}>🧠</div>
                    <div style={{color:Y,marginBottom:6}}>AI Analiz Ediyor...</div>
                    <div style={{color:"#1e3248",fontSize:10}}>Grafik • KAP • Haberler • Tahmin</div>
                  </div>
                ) : an ? (
                  <div style={{display:"grid",gap:10}}>
                    <div style={{background:an.signal==="AL"?"rgba(0,229,180,.04)":an.signal==="SAT"?"rgba(255,61,107,.04)":"rgba(245,166,35,.04)",border:`1px solid ${an.signal==="AL"?G:an.signal==="SAT"?R:Y}35`,borderRadius:12,padding:18}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:9,color:"#2e4257"}}>SİNYAL</div>
                          <div style={{fontSize:40,fontWeight:900,color:an.signal==="AL"?G:an.signal==="SAT"?R:Y}}>{an.signal}</div>
                        </div>
                        {[["GÜVEN",an.confidence+"%"],["FORMASYON",an.chart_pattern||"—"],["1H HEDEF",an.target_1w+"₺"],["1A HEDEF",an.target_1m+"₺"],["STOP",an.stop_loss+"₺"],["RİSK",an.risk]].map(([l,v])=>(
                          <div key={l}>
                            <div style={{fontSize:9,color:"#2e4257"}}>{l}</div>
                            <div style={{fontSize:14,fontWeight:700,color:l==="RİSK"?(v==="DÜŞÜK"?G:v==="YÜKSEK"?R:Y):l.includes("HEDEF")?G:l==="STOP"?R:"#b8ccdc"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{marginTop:12,color:"#7a94a8",lineHeight:1.7,fontSize:12}}>{an.summary}</p>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:8}}>
                      {[["📈 GRAFİK",an.chart_reading,"#5e9eff"],["💹 FİYAT",an.price_action,G],["🏢 TEMEL",an.fundamental,"#c084fc"],["📰 HABERLER",an.news_catalyst,Y],["🎯 TAHMİN",an.prediction,"#34d399"],["🚀 GİRİŞ",an.entry_strategy,"#fb923c"]].map(([l,v,c])=>(
                        <div key={l} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                          <div style={{color:c,fontSize:10,fontWeight:700,marginBottom:6}}>{l}</div>
                          <p style={{color:"#5a7488",fontSize:11,lineHeight:1.6,margin:0}}>{v||"—"}</p>
                        </div>
                      ))}
                    </div>
                    {an.reasons&&(
                      <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                        <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:8}}>✅ GEREKÇELER</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:6}}>
                          {an.reasons.map((r,i)=>(
                            <div key={i} style={{background:"#09111c",borderRadius:8,padding:"8px 10px",color:"#5a7488",fontSize:11}}>
                              <span style={{color:Y,marginRight:5}}>{i+1}.</span>{r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ):null}
              </div>
            )}
          </div>
        )}

        {tab==="scan" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <span style={{color:"#2e4257",fontSize:10,letterSpacing:2}}>AI PIYASA TARAMASI</span>
              <button onClick={scan} disabled={scanLoad} style={{padding:"7px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:scanLoad?"not-allowed":"pointer",opacity:scanLoad?.5:1}}>
                {scanLoad?"⏳ Taranıyor...":"🔄 Yenile"}
              </button>
            </div>
            {scanLoad?(
              <div style={{textAlign:"center",padding:60}}>
                <div style={{fontSize:36,marginBottom:10}}>🔍</div>
                <div style={{color:Y}}>Tüm BIST taranıyor...</div>
              </div>
            ):scanResult?(
              <div style={{display:"grid",gap:10}}>
                <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:8}}>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>BIST100</div><div style={{fontSize:18,fontWeight:700}}>{scanResult.bist100||"—"}</div></div>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>TREND</div><div style={{fontSize:14,fontWeight:700,color:scanResult.direction==="YÜKSELİŞ"?G:scanResult.direction==="DÜŞÜŞ"?R:Y}}>{scanResult.direction}</div></div>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>RİSK</div><div style={{fontSize:14,fontWeight:700,color:scanResult.risk_level==="DÜŞÜK"?G:scanResult.risk_level==="YÜKSEK"?R:Y}}>{scanResult.risk_level}</div></div>
                  </div>
                  <p style={{color:"#5a7488",fontSize:12,margin:0,lineHeight:1.6}}>{scanResult.summary}</p>
                  {scanResult.weekly_outlook&&<p style={{color:"#3a5468",fontSize:11,margin:"8px 0 0",fontStyle:"italic"}}>📅 {scanResult.weekly_outlook}</p>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:"rgba(0,229,180,.03)",border:`1px solid ${G}20`,borderRadius:12,padding:14}}>
                    <div style={{color:G,fontSize:10,fontWeight:700,marginBottom:10}}>🚀 EN İYİ FIRSATLAR</div>
                    {scanResult.top_opportunities?.map(item=>(
                      <div key={item.code} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${G}10`}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                          <span style={{color:Y,fontWeight:700}}>{item.code}</span>
                          <span style={{color:G,fontSize:10}}>%{item.confidence}</span>
                        </div>
                        <div style={{color:"#2a4055",fontSize:10,marginBottom:3}}>{item.reason}</div>
                        {item.catalyst&&<div style={{color:G,fontSize:9,opacity:.7}}>🎯 {item.catalyst}</div>}
                        <button onClick={()=>{const s=POPULAR.find(x=>x.c===item.code)||{c:item.code,n:item.name||item.code,s:"—",i:"BIST-TÜM"};analyze(s);}}
                          style={{marginTop:5,padding:"2px 8px",borderRadius:4,background:`rgba(0,229,180,.1)`,color:G,border:`1px solid ${G}25`,fontSize:9,cursor:"pointer"}}>
                          Analiz →
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"rgba(255,61,107,.03)",border:`1px solid ${R}20`,borderRadius:12,padding:14}}>
                    <div style={{color:R,fontSize:10,fontWeight:700,marginBottom:10}}>⚠️ KAÇINILACAKLAR</div>
                    {scanResult.avoid_list?.map(item=>(
                      <div key={item.code} style={{marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${R}10`}}>
                        <div style={{color:Y,fontWeight:700,marginBottom:2}}>{item.code}</div>
                        <div style={{color:"#3a5468",fontSize:10}}>{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {scanResult.hidden_gems?.length>0&&(
                  <div style={{background:"rgba(245,166,35,.03)",border:`1px solid ${Y}20`,borderRadius:12,padding:14}}>
                    <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:10}}>💎 GİZLİ FIRSATLAR</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
                      {scanResult.hidden_gems.map(item=>(
                        <div key={item.code} style={{background:"#09111c",borderRadius:8,padding:10}}>
                          <div style={{color:Y,fontWeight:700,marginBottom:2}}>{item.code}</div>
                          <div style={{color:"#2a4055",fontSize:10,marginBottom:5}}>{item.reason}</div>
                          <button onClick={()=>analyze({c:item.code,n:item.name||item.code,s:"—",i:"BIST-TÜM"})}
                            style={{padding:"2px 8px",borderRadius:4,background:`rgba(245,166,35,.1)`,color:Y,border:`1px solid ${Y}25`,fontSize:9,cursor:"pointer"}}>Analiz Et</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {scanResult.key_news&&(
                  <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                    <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:8}}>📰 BUGÜNÜN HABERLERİ</div>
                    {scanResult.key_news.map((n,i)=>(
                      <div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${BD}`,color:"#5a7488",fontSize:11}}>• {n}</div>
                    ))}
                  </div>
                )}
              </div>
            ):(
              <div style={{textAlign:"center",padding:60,color:"#1e3248"}}>
                <div style={{fontSize:36,marginBottom:10}}>🤖</div>
                <button onClick={scan} style={{padding:"10px 20px",borderRadius:10,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>Taramayı Başlat</button>
              </div>
            )}
          </div>
        )}

        {tab==="alert" && (
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:12}}>FİYAT ALARMLARI</div>
            <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
              {[["Hisse","code","THYAO","text",100],["Fiyat (₺)","price","300","number",90]].map(([l,k,ph,t,w])=>(
                <div key={k}>
                  <div style={{fontSize:9,color:"#2e4257",marginBottom:4}}>{l}</div>
                  <input type={t} value={alertForm[k]} onChange={e=>setAlertForm(a=>({...a,[k]:k==="code"?e.target.value.toUpperCase():e.target.value}))}
                    placeholder={ph} style={{width:w,background:"#09111c",border:`1px solid ${BD}`,borderRadius:6,padding:"7px 10px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:9,color:"#2e4257",marginBottom:4}}>Yön</div>
                <select value={alertForm.dir} onChange={e=>setAlertForm(a=>({...a,dir:e.target.value}))}
                  style={{background:"#09111c",border:`1px solid ${BD}`,borderRadius:6,padding:"7px 10px",color:"#b8ccdc",fontSize:12,cursor:"pointer"}}>
                  <option>üstüne</option><option>altına</option>
                </select>
              </div>
              <button onClick={()=>{if(alertForm.code&&alertForm.price)setAlerts(a=>[...a,{...alertForm,id:Date.now()}]);setAlertForm({code:"",price:"",dir:"üstüne"});}}
                style={{padding:"8px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>+ Ekle</button>
            </div>
            {alerts.map(a=>(
              <div key={a.id} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:14,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontSize:16}}>⏳</span>
                <div>
                  <div style={{color:Y,fontWeight:700}}>{a.code}</div>
                  <div style={{color:"#3a5468",fontSize:11}}>Fiyat {a.dir} çıkınca: <span style={{color:"#b8ccdc",fontWeight:700}}>{a.price}₺</span></div>
                </div>
                <button onClick={()=>setAlerts(x=>x.filter(y=>y.id!==a.id))} style={{marginLeft:"auto",padding:"4px 10px",borderRadius:6,background:`rgba(255,61,107,.1)`,color:R,border:`1px solid ${R}25`,fontSize:10,cursor:"pointer"}}>Sil</button>
              </div>
            ))}
            {alerts.length===0&&<div style={{textAlign:"center",padding:40,color:"#1e3248"}}><div style={{fontSize:28,marginBottom:8}}>🔔</div>Henüz alarm yok.</div>}
          </div>
        )}

        {tab==="portfolio" && (
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:12}}>PORTFÖYÜM</div>
            {portfolio.length===0?(
              <div style={{textAlign:"center",padding:60,color:"#1e3248"}}><div style={{fontSize:28,marginBottom:8}}>💼</div>Analiz sayfasından hisse ekleyin.</div>
            ):portfolio.map(stock=>(
              <div key={stock.c} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:14,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:8}}>
                  <div>
                    <div style={{color:Y,fontWeight:700,fontSize:15}}>{stock.c}</div>
                    <div style={{color:"#1e3248",fontSize:10}}>{stock.n} • {stock.date}</div>
                  </div>
                  {(signals[stock.c]||stock.signal)&&<Sig v={signals[stock.c]||stock.signal}/>}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <button onClick={()=>analyze(stock)} style={{padding:"5px 10px",borderRadius:6,background:"rgba(94,158,255,.1)",color:"#5e9eff",border:"1px solid rgba(94,158,255,.2)",fontSize:10,cursor:"pointer"}}>Analiz</button>
                    <button onClick={()=>setPortfolio(p=>p.filter(x=>x.c!==stock.c))} style={{padding:"5px 10px",borderRadius:6,background:`rgba(255,61,107,.1)`,color:R,border:`1px solid ${R}25`,fontSize:10,cursor:"pointer"}}>Çıkar</button>
                  </div>
                </div>
                <TVMini code={stock.c}/>
              </div>
            ))}
          </div>
        )}

        {tab==="chat" && (
          <div style={{display:"flex",flexDirection:"column",height:"70vh"}}>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:10}}>🤖 AI BORSA ASISTANI</div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}}>
              {chat.length===0&&(
                <div style={{textAlign:"center",padding:40,color:"#1e3248"}}>
                  <div style={{fontSize:32,marginBottom:10}}>💬</div>
                  {["THYAO bu hafta yükselir mi?","Hangi sektör güçlü görünüyor?","Küçük hisselerde nasıl risk yönetilir?"].map(q=>(
                    <button key={q} onClick={()=>setChatMsg(q)}
                      style={{display:"block",margin:"5px auto",padding:"7px 14px",borderRadius:8,background:`rgba(245,166,35,.07)`,color:Y,border:`1px solid ${Y}25`,fontSize:11,cursor:"pointer"}}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {chat.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"82%",padding:"10px 14px",borderRadius:12,fontSize:12,lineHeight:1.6,
                    background:m.r==="user"?`rgba(245,166,35,.08)`:CB,
                    border:`1px solid ${m.r==="user"?Y+"25":BD}`,
                    color:m.r==="user"?Y:"#7a94a8",whiteSpace:"pre-wrap"}}>
                    {m.t}
                  </div>
                </div>
              ))}
              {chatLoad&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:"10px 14px",color:Y,fontSize:11}}>Araştırıyor...</div></div>}
              <div ref={chatEnd}/>
            </div>
            <div style={{display:"flex",gap:8,paddingTop:8,borderTop:`1px solid ${BD}`}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}
                placeholder="BIST hakkında her şeyi sorabilirsiniz..."
                style={{flex:1,background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:"10px 14px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              <button onClick={sendChat} disabled={chatLoad}
                style={{padding:"10px 16px",borderRadius:10,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:12,border:"none",cursor:chatLoad?"not-allowed":"pointer",opacity:chatLoad?.6:1}}>
                Gönder
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",padding:12,color:"#0f1e2d",fontSize:9,borderTop:`1px solid ${BD}`,marginTop:16}}>
        ⚠️ BIST·AI PRO — Yatırım tavsiyesi değildir. Tüm kararlar yatırımcıya aittir.
      </div>
    </div>
  );
}
