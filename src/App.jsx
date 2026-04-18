import { useState, useEffect, useRef, useMemo } from "react";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const Y = "#f5a623", G = "#00e5b4", R = "#ff3d6b", BG = "#070b12", CB = "#0c1320", BD = "#131e2e";

function TVTicker() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    const w = document.createElement("div");
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols:[
        {proName:"BIST:XU100",title:"BIST100"},{proName:"BIST:XU030",title:"BIST30"},
        {proName:"BIST:THYAO",title:"THYAO"},{proName:"BIST:GARAN",title:"GARAN"},
        {proName:"BIST:ASELS",title:"ASELS"},{proName:"BIST:AKBNK",title:"AKBNK"},
        {proName:"BIST:EREGL",title:"EREGL"},{proName:"BIST:TUPRS",title:"TUPRS"},
        {proName:"CURRENCY:USDTRY",title:"USD/TRY"},{proName:"COMEX:GC1!",title:"ALTIN"},
      ],
      showSymbolLogo:true,colorTheme:"dark",isTransparent:true,displayMode:"adaptive",locale:"tr"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, []);
  return <div ref={ref} style={{height:46,borderBottom:`1px solid ${BD}`}} />;
}

function TVChart({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.style.height = "400px";
    const w = document.createElement("div");
    w.style.height = "400px";
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      autosize:true,symbol:`BIST:${code}`,interval:"D",
      timezone:"Europe/Istanbul",theme:"dark",style:"1",locale:"tr",
      studies:["RSI@tv-basicstudies","MACD@tv-basicstudies","BB@tv-basicstudies"],
      width:"100%",height:"400"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, [code]);
  return <div ref={ref} style={{height:400,borderRadius:10,overflow:"hidden"}} />;
}

function TVScreener() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.style.height = "600px";
    const w = document.createElement("div");
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      width:"100%",height:600,defaultColumn:"overview",
      defaultScreen:"most_capitalized",market:"turkey",
      showToolbar:true,colorTheme:"dark",locale:"tr",isTransparent:true
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, []);
  return <div ref={ref} style={{height:600,borderRadius:10,overflow:"hidden"}} />;
}

function TVTech({ code }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const c = document.createElement("div");
    c.style.height = "200px";
    const w = document.createElement("div");
    c.appendChild(w);
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      interval:"1D",width:"100%",isTransparent:true,height:200,
      symbol:`BIST:${code}`,showIntervalTabs:true,locale:"tr",colorTheme:"dark"
    });
    c.appendChild(s);
    ref.current.appendChild(c);
  }, [code]);
  return <div ref={ref} style={{height:200,borderRadius:10,overflow:"hidden"}} />;
}

function Sig({ v }) {
  const m = {AL:[G,"rgba(0,229,180,.12)"],SAT:[R,"rgba(255,61,107,.12)"],BEKLE:[Y,"rgba(245,166,35,.12)"]};
  const [c,b] = m[v]||m.BEKLE;
  return <span style={{background:b,color:c,border:`1px solid ${c}40`,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:900}}>{v}</span>;
}

async function callAI(system, userMsg) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1500,system,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:userMsg}]
      })
    });
    const d = await r.json();
    const t = d.content?.find(b=>b.type==="text")?.text||"";
    const clean = t.replace(/```json|```/g,"").trim();
    const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
    if(s===-1) return null;
    return JSON.parse(clean.slice(s,e+1));
  } catch(err) { console.error(err); return null; }
}
const STOCKS = [
  {c:"THYAO",n:"Turk Hava Yollari",s:"Havacilik",i:"BIST30"},
  {c:"GARAN",n:"Garanti BBVA",s:"Bankacilik",i:"BIST30"},
  {c:"ASELS",n:"Aselsan",s:"Savunma",i:"BIST30"},
  {c:"AKBNK",n:"Akbank",s:"Bankacilik",i:"BIST30"},
  {c:"KCHOL",n:"Koc Holding",s:"Holding",i:"BIST30"},
  {c:"EREGL",n:"Eregli Demir",s:"Metal",i:"BIST30"},
  {c:"BIMAS",n:"BIM Magazalar",s:"Perakende",i:"BIST30"},
  {c:"TUPRS",n:"Tupras",s:"Enerji",i:"BIST30"},
  {c:"FROTO",n:"Ford Otosan",s:"Otomotiv",i:"BIST30"},
  {c:"TCELL",n:"Turkcell",s:"Telekom",i:"BIST30"},
  {c:"PGSUS",n:"Pegasus",s:"Havacilik",i:"BIST30"},
  {c:"YKBNK",n:"Yapi Kredi",s:"Bankacilik",i:"BIST30"},
  {c:"KOZAL",n:"Koza Altin",s:"Madencilik",i:"BIST30"},
  {c:"SASA",n:"Sasa Polyester",s:"Kimya",i:"BIST30"},
  {c:"OTKAR",n:"Otokar",s:"Savunma",i:"BIST30"},
  {c:"SAHOL",n:"Sabanci Holding",s:"Holding",i:"BIST30"},
  {c:"ISCTR",n:"Is Bankasi",s:"Bankacilik",i:"BIST30"},
  {c:"EKGYO",n:"Emlak Konut",s:"GYO",i:"BIST30"},
  {c:"TAVHL",n:"TAV Havalimanlari",s:"Havacilik",i:"BIST30"},
  {c:"PETKM",n:"Petkim",s:"Kimya",i:"BIST30"},
  {c:"VESTL",n:"Vestel",s:"Elektronik",i:"BIST100"},
  {c:"ARCLK",n:"Arcelik",s:"Elektronik",i:"BIST100"},
  {c:"MGROS",n:"Migros",s:"Perakende",i:"BIST100"},
  {c:"SOKM",n:"Sok Marketler",s:"Perakende",i:"BIST100"},
  {c:"HALKB",n:"Halk Bankasi",s:"Bankacilik",i:"BIST100"},
  {c:"VAKBN",n:"Vakifbank",s:"Bankacilik",i:"BIST100"},
  {c:"TTKOM",n:"Turk Telekom",s:"Telekom",i:"BIST100"},
  {c:"TKFEN",n:"Tekfen Holding",s:"Holding",i:"BIST100"},
  {c:"ULKER",n:"Ulker Biskuvi",s:"Gida",i:"BIST100"},
  {c:"CCOLA",n:"Coca-Cola Icecek",s:"Icecek",i:"BIST100"},
  {c:"LOGO",n:"Logo Yazilim",s:"Teknoloji",i:"BIST100"},
  {c:"MAVI",n:"Mavi Giyim",s:"Tekstil",i:"BIST100"},
  {c:"ODAS",n:"Odas Elektrik",s:"Enerji",i:"BIST100"},
  {c:"KATMR",n:"Katmerciler",s:"Savunma",i:"BIST100"},
  {c:"AEFES",n:"Anadolu Efes",s:"Icecek",i:"BIST100"},
  {c:"ALKIM",n:"Alkim Kimya",s:"Kimya",i:"BIST-TUM"},
  {c:"FONET",n:"Fonet Bilgi",s:"Teknoloji",i:"BIST-TUM"},
  {c:"ARTMS",n:"Artemas",s:"Teknoloji",i:"BIST-TUM"},
  {c:"LKMNH",n:"Lokman Hekim",s:"Saglik",i:"BIST-TUM"},
  {c:"MOGAN",n:"Mogan Teknoloji",s:"Teknoloji",i:"BIST-TUM"},
  {c:"AKSEN",n:"Aksa Enerji",s:"Enerji",i:"BIST-TUM"},
  {c:"DEVA",n:"Deva Holding",s:"Saglik",i:"BIST-TUM"},
  {c:"KCAER",n:"Kocaer Celik",s:"Metal",i:"BIST-TUM"},
  {c:"RYSAS",n:"Reysas Lojistik",s:"Lojistik",i:"BIST-TUM"},
  {c:"PENTA",n:"Penta Teknoloji",s:"Teknoloji",i:"BIST-TUM"},
  {c:"NETAS",n:"Netas",s:"Teknoloji",i:"BIST-TUM"},
  {c:"TRCAS",n:"Turcas Petrol",s:"Enerji",i:"BIST-TUM"},
  {c:"CLEBI",n:"Celebi Hava",s:"Havacilik",i:"BIST-TUM"},
  {c:"MERIT",n:"Merit Turizm",s:"Turizm",i:"BIST-TUM"},
  {c:"DESPC",n:"Despec",s:"Teknoloji",i:"BIST-TUM"},
];

export default function App() {
  const [tab, setTab] = useState("market");
  const [search, setSearch] = useState("");
  const [idxF, setIdxF] = useState("TUMU");
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [aLoad, setALoad] = useState(false);
  const [signals, setSignals] = useState({});
  const [scanResult, setScanResult] = useState(null);
  const [scanLoad, setScanLoad] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertForm, setAlertForm] = useState({code:"",price:"",dir:"ustune"});
  const [chat, setChat] = useState([]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [chat]);

  const filtered = useMemo(() =>
    STOCKS.filter(s => {
      const q = search.toLowerCase();
      const matchQ = s.c.toLowerCase().includes(q)||s.n.toLowerCase().includes(q);
      const matchI = idxF==="TUMU"||s.i===idxF;
      return matchQ&&matchI;
    })
  ,[search,idxF]);

  const analyze = async (stock) => {
    setSelected(stock); setTab("analysis"); setALoad(true);
    const r = await callAI(
      `Sen BIST'in en iyi yapay zeka borsa uzmanisisin. Turkce yanit ver. SADECE JSON:
{"signal":"AL|SAT|BEKLE","confidence":0-100,"summary":"3 cumle uzman yorum","chart_reading":"grafik RSI MACD Bollinger destek direnc","price_action":"fiyat hacim analizi","fundamental":"temel analiz buyume sektor","news_catalyst":"KAP ve haberler","prediction":"1 hafta 1 ay tahmin","risk":"DUSUK|ORTA|YUKSEK","target_1w":fiyat,"target_1m":fiyat,"stop_loss":fiyat,"reasons":["r1","r2","r3"],"chart_pattern":"formasyon","momentum":"GUCLU_YUKSELIS|YAVAS_YUKSELIS|YATAY|YAVAS_DUSUS|GUCLU_DUSUS","entry_strategy":"giris stratejisi"}`,
      `${stock.n} (${stock.c}) - ${stock.s} - ${stock.i}. Bugun BIST:${stock.c} icin kapsamli analiz yap.`
    );
    if(r){setAnalysis(a=>({...a,[stock.c]:r}));setSignals(s=>({...s,[stock.c]:r.signal}));}
    setALoad(false);
  };

  const analyzeCustom = () => {
    if(!customCode.trim()) return;
    const code = customCode.trim().toUpperCase();
    const stock = STOCKS.find(s=>s.c===code)||{c:code,n:code,s:"Bilinmiyor",i:"BIST-TUM"};
    analyze(stock); setCustomCode("");
  };

  const scan = async () => {
    setScanLoad(true); setScanResult(null); setTab("scan");
    const r = await callAI(
      `Sen BIST AI analist sistemisisin. SADECE JSON:
{"bist100":"endeks","direction":"YUKSELIS|DUSUS|YATAY","summary":"piyasa 3 cumle","top_opportunities":[{"code":"KOD","name":"isim","signal":"AL","confidence":80,"reason":"sebep","catalyst":"katalizor"}],"avoid_list":[{"code":"KOD","reason":"neden"}],"hidden_gems":[{"code":"KOD","name":"isim","reason":"potansiyel"}],"hot_sectors":[{"sector":"sektor","reason":"neden"}],"key_news":["haber1","haber2","haber3"],"risk_level":"DUSUK|ORTA|YUKSEK","weekly_outlook":"bu hafta beklenti"}`,
      `Bugun BIST piyasasini analiz et. Tum hisseler, KAP haberleri, makro faktorler dahil et.`
    );
    setScanResult(r); setScanLoad(false);
  };

  const sendChat = async () => {
    if(!chatMsg.trim()) return;
    const msg = chatMsg; setChatMsg(""); setChatLoad(true);
    setChat(c=>[...c,{r:"user",t:msg}]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          system:"Sen BIST'in en zeki borsa asistanisin. Turkce, net ve uzman yanit ver.",
          messages:[{role:"user",content:msg}]
        })
      });
      const d = await res.json();
      const answer = d.content?.find(b=>b.type==="text")?.text||"Yanit alinamadi.";
      setChat(c=>[...c,{r:"ai",t:answer}]);
    } catch { setChat(c=>[...c,{r:"ai",t:"Hata olustu."}]); }
    setChatLoad(false);
  };

  const an = selected?analysis[selected.c]:null;
  const tb = (t) => ({
    padding:"7px 12px",borderRadius:6,fontSize:10,fontWeight:700,
    border:tab===t?`1px solid ${Y}`:`1px solid ${BD}`,
    background:tab===t?`rgba(245,166,35,.1)`:"transparent",
    color:tab===t?Y:"#2e4257",cursor:"pointer",letterSpacing:1,
    textTransform:"uppercase",whiteSpace:"nowrap"
  });
  return (
    <div style={{minHeight:"100vh",background:BG,color:"#b8ccdc",fontFamily:"'Courier New',monospace",fontSize:12}}>
      <TVTicker />
      <div style={{borderBottom:`1px solid ${BD}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:"#000"}}>TL</div>
          <div>
            <div style={{color:Y,fontWeight:900,fontSize:14,letterSpacing:3}}>BIST AI PRO</div>
            <div style={{fontSize:8,color:"#1e3248"}}>GERCEK ZAMANLI - AI ANALIZ</div>
          </div>
        </div>
        <div style={{flex:1,overflowX:"auto",display:"flex",gap:5}}>
          {["market","screener","analysis","scan","alert","portfolio","chat"].map(t=>(
            <button key={t} style={tb(t)} onClick={()=>setTab(t)}>
              {t==="market"?"Piyasa":t==="screener"?"Tum BIST":t==="analysis"?"Analiz":t==="scan"?"AI Tara":t==="alert"?"Alarmlar":t==="portfolio"?`Portfoy${portfolio.length>0?` (${portfolio.length})`:""}`:t==="chat"?"AI Asistan":""}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"14px"}}>

        {tab==="market"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hisse kodu ara..."
                style={{flex:1,minWidth:140,background:CB,border:`1px solid ${BD}`,borderRadius:8,padding:"8px 12px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              <select value={idxF} onChange={e=>setIdxF(e.target.value)}
                style={{background:CB,border:`1px solid ${BD}`,borderRadius:8,padding:"8px 10px",color:"#b8ccdc",fontSize:11,cursor:"pointer"}}>
                <option value="TUMU">Tumu</option>
                <option value="BIST30">BIST30</option>
                <option value="BIST100">BIST100</option>
                <option value="BIST-TUM">Kucuk Hisseler</option>
              </select>
              <input value={customCode} onChange={e=>setCustomCode(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&analyzeCustom()}
                placeholder="Kod + Enter"
                style={{width:110,background:CB,border:`1px solid ${Y}40`,borderRadius:8,padding:"8px 12px",color:Y,fontSize:12,outline:"none"}}/>
              <button onClick={scan} style={{padding:"8px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>AI TARA</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
              {filtered.map(stock=>(
                <div key={stock.c} onClick={()=>analyze(stock)}
                  style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=Y}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BD}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div>
                      <div style={{color:Y,fontWeight:900,fontSize:14}}>{stock.c}</div>
                      <div style={{color:"#1e3248",fontSize:9}}>{stock.s}</div>
                    </div>
                    {signals[stock.c]&&<Sig v={signals[stock.c]}/>}
                  </div>
                  <div style={{fontSize:9,color:"#1e3248"}}>{stock.i}</div>
                  <div style={{fontSize:9,color:G,opacity:.5,marginTop:4}}>Tikla - AI Analiz</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="screener"&&(
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:10}}>TUM BIST - 600+ HİSSE CANLI</div>
            <TVScreener/>
          </div>
        )}

        {tab==="analysis"&&(
          <div>
            {!selected?(
              <div style={{textAlign:"center",padding:60,color:"#1e3248"}}>
                <div style={{fontSize:36,marginBottom:10}}>📊</div>
                <div style={{marginBottom:16,color:"#2e4257"}}>Hisse secin veya kod girin</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  <input value={customCode} onChange={e=>setCustomCode(e.target.value.toUpperCase())}
                    onKeyDown={e=>e.key==="Enter"&&analyzeCustom()}
                    placeholder="Hisse kodu (THYAO)"
                    style={{background:CB,border:`1px solid ${Y}40`,borderRadius:8,padding:"10px 14px",color:Y,fontSize:13,outline:"none",width:180}}/>
                  <button onClick={analyzeCustom} style={{padding:"10px 18px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>Analiz Et</button>
                </div>
              </div>
            ):(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{color:Y,fontSize:22,fontWeight:900}}>{selected.c}</div>
                    <div style={{color:"#2e4257",fontSize:11}}>{selected.n} - {selected.s}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{if(!portfolio.find(p=>p.c===selected.c))setPortfolio(p=>[...p,{...selected,date:new Date().toLocaleDateString("tr-TR"),signal:an?.signal}]);}}
                      style={{padding:"7px 14px",borderRadius:8,background:`linear-gradient(135deg,${G},#00a87d)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>+ Portfoy</button>
                    <button onClick={()=>{setAlertForm({code:selected.c,price:"",dir:"ustune"});setTab("alert");}}
                      style={{padding:"7px 14px",borderRadius:8,background:`rgba(245,166,35,.1)`,color:Y,fontWeight:700,fontSize:11,border:`1px solid ${Y}40`,cursor:"pointer"}}>Alarm</button>
                  </div>
                </div>
                <div style={{marginBottom:10}}><TVChart code={selected.c}/></div>
                <div style={{marginBottom:10}}><TVTech code={selected.c}/></div>
                {aLoad?(
                  <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:40,textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:10}}>🧠</div>
                    <div style={{color:Y,marginBottom:6}}>AI Analiz Ediyor...</div>
                    <div style={{color:"#1e3248",fontSize:10}}>Grafik - KAP - Haberler - Tahmin</div>
                  </div>
                ):an?(
                  <div style={{display:"grid",gap:10}}>
                    <div style={{background:an.signal==="AL"?"rgba(0,229,180,.04)":an.signal==="SAT"?"rgba(255,61,107,.04)":"rgba(245,166,35,.04)",border:`1px solid ${an.signal==="AL"?G:an.signal==="SAT"?R:Y}35`,borderRadius:12,padding:18}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:9,color:"#2e4257"}}>SINYAL</div>
                          <div style={{fontSize:40,fontWeight:900,color:an.signal==="AL"?G:an.signal==="SAT"?R:Y}}>{an.signal}</div>
                        </div>
                        {[["GUVEN",an.confidence+"%"],["1H HEDEF",(an.target_1w||"-")+"TL"],["1A HEDEF",(an.target_1m||"-")+"TL"],["STOP",(an.stop_loss||"-")+"TL"],["RISK",an.risk||"-"]].map(([l,v])=>(
                          <div key={l}>
                            <div style={{fontSize:9,color:"#2e4257"}}>{l}</div>
                            <div style={{fontSize:13,fontWeight:700,color:l==="RISK"?(v==="DUSUK"?G:v==="YUKSEK"?R:Y):l.includes("HEDEF")?G:l==="STOP"?R:"#b8ccdc"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{marginTop:12,color:"#7a94a8",lineHeight:1.7,fontSize:12}}>{an.summary}</p>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:8}}>
                      {[["Grafik",an.chart_reading,"#5e9eff"],["Fiyat",an.price_action,G],["Temel",an.fundamental,"#c084fc"],["Haberler",an.news_catalyst,Y],["Tahmin",an.prediction,"#34d399"],["Giris",an.entry_strategy,"#fb923c"]].map(([l,v,c])=>(
                        <div key={l} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                          <div style={{color:c,fontSize:10,fontWeight:700,marginBottom:6}}>{l}</div>
                          <p style={{color:"#5a7488",fontSize:11,lineHeight:1.6,margin:0}}>{v||"-"}</p>
                        </div>
                      ))}
                    </div>
                    {an.reasons&&(
                      <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                        <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:8}}>GEREKCELER</div>
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

        {tab==="scan"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <span style={{color:"#2e4257",fontSize:10,letterSpacing:2}}>AI PIYASA TARAMASI</span>
              <button onClick={scan} disabled={scanLoad} style={{padding:"7px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer",opacity:scanLoad?.5:1}}>
                {scanLoad?"Taraniyor...":"Yenile"}
              </button>
            </div>
            {scanLoad?(
              <div style={{textAlign:"center",padding:60}}>
                <div style={{fontSize:36,marginBottom:10}}>🔍</div>
                <div style={{color:Y}}>Tum BIST taraniyor...</div>
              </div>
            ):scanResult?(
              <div style={{display:"grid",gap:10}}>
                <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:8}}>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>BIST100</div><div style={{fontSize:18,fontWeight:700}}>{scanResult.bist100||"-"}</div></div>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>TREND</div><div style={{fontSize:14,fontWeight:700,color:scanResult.direction==="YUKSELIS"?G:scanResult.direction==="DUSUS"?R:Y}}>{scanResult.direction}</div></div>
                    <div><div style={{fontSize:9,color:"#2e4257"}}>RISK</div><div style={{fontSize:14,fontWeight:700,color:scanResult.risk_level==="DUSUK"?G:scanResult.risk_level==="YUKSEK"?R:Y}}>{scanResult.risk_level}</div></div>
                  </div>
                  <p style={{color:"#5a7488",fontSize:12,margin:0}}>{scanResult.summary}</p>
                  {scanResult.weekly_outlook&&<p style={{color:"#3a5468",fontSize:11,margin:"8px 0 0",fontStyle:"italic"}}>{scanResult.weekly_outlook}</p>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:"rgba(0,229,180,.03)",border:`1px solid rgba(0,229,180,.2)`,borderRadius:12,padding:14}}>
                    <div style={{color:G,fontSize:10,fontWeight:700,marginBottom:10}}>EN IYI FIRSATLAR</div>
                    {scanResult.top_opportunities?.map(item=>(
                      <div key={item.code} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid rgba(0,229,180,.1)`}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                          <span style={{color:Y,fontWeight:700}}>{item.code}</span>
                          <span style={{color:G,fontSize:10}}>%{item.confidence}</span>
                        </div>
                        <div style={{color:"#2a4055",fontSize:10,marginBottom:4}}>{item.reason}</div>
                        <button onClick={()=>analyze(STOCKS.find(x=>x.c===item.code)||{c:item.code,n:item.name||item.code,s:"-",i:"BIST-TUM"})}
                          style={{padding:"2px 8px",borderRadius:4,background:`rgba(0,229,180,.1)`,color:G,border:`1px solid rgba(0,229,180,.25)`,fontSize:9,cursor:"pointer"}}>Analiz</button>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"rgba(255,61,107,.03)",border:`1px solid rgba(255,61,107,.2)`,borderRadius:12,padding:14}}>
                    <div style={{color:R,fontSize:10,fontWeight:700,marginBottom:10}}>KACINILACAKLAR</div>
                    {scanResult.avoid_list?.map(item=>(
                      <div key={item.code} style={{marginBottom:8,paddingBottom:8,borderBottom:`1px solid rgba(255,61,107,.1)`}}>
                        <div style={{color:Y,fontWeight:700,marginBottom:2}}>{item.code}</div>
                        <div style={{color:"#3a5468",fontSize:10}}>{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {scanResult.hidden_gems?.length>0&&(
                  <div style={{background:"rgba(245,166,35,.03)",border:`1px solid rgba(245,166,35,.2)`,borderRadius:12,padding:14}}>
                    <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:10}}>GIZLI FIRSATLAR</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                      {scanResult.hidden_gems.map(item=>(
                        <div key={item.code} style={{background:"#09111c",borderRadius:8,padding:10}}>
                          <div style={{color:Y,fontWeight:700,marginBottom:2}}>{item.code}</div>
                          <div style={{color:"#2a4055",fontSize:10,marginBottom:5}}>{item.reason}</div>
                          <button onClick={()=>analyze({c:item.code,n:item.name||item.code,s:"-",i:"BIST-TUM"})}
                            style={{padding:"2px 8px",borderRadius:4,background:`rgba(245,166,35,.1)`,color:Y,border:`1px solid rgba(245,166,35,.25)`,fontSize:9,cursor:"pointer"}}>Analiz</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {scanResult.key_news&&(
                  <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12}}>
                    <div style={{color:Y,fontSize:10,fontWeight:700,marginBottom:8}}>BUGÜNÜN HABERLERI</div>
                    {scanResult.key_news.map((n,i)=>(
                      <div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${BD}`,color:"#5a7488",fontSize:11}}>- {n}</div>
                    ))}
                  </div>
                )}
              </div>
            ):(
              <div style={{textAlign:"center",padding:60,color:"#1e3248"}}>
                <div style={{fontSize:36,marginBottom:10}}>🤖</div>
                <button onClick={scan} style={{padding:"10px 20px",borderRadius:10,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,border:"none",cursor:"pointer"}}>Taramayi Baslat</button>
              </div>
            )}
          </div>
        )}

        {tab==="alert"&&(
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:12}}>FIYAT ALARMLARI</div>
            <div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:8,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div>
                <div style={{fontSize:9,color:"#2e4257",marginBottom:4}}>Hisse</div>
                <input value={alertForm.code} onChange={e=>setAlertForm(a=>({...a,code:e.target.value.toUpperCase()}))}
                  placeholder="THYAO" style={{width:90,background:"#09111c",border:`1px solid ${BD}`,borderRadius:6,padding:"7px 10px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              </div>
              <div>
                <div style={{fontSize:9,color:"#2e4257",marginBottom:4}}>Fiyat (TL)</div>
                <input type="number" value={alertForm.price} onChange={e=>setAlertForm(a=>({...a,price:e.target.value}))}
                  placeholder="300" style={{width:90,background:"#09111c",border:`1px solid ${BD}`,borderRadius:6,padding:"7px 10px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              </div>
              <div>
                <div style={{fontSize:9,color:"#2e4257",marginBottom:4}}>Yon</div>
                <select value={alertForm.dir} onChange={e=>setAlertForm(a=>({...a,dir:e.target.value}))}
                  style={{background:"#09111c",border:`1px solid ${BD}`,borderRadius:6,padding:"7px 10px",color:"#b8ccdc",fontSize:12,cursor:"pointer"}}>
                  <option value="ustune">Ustune</option>
                  <option value="altina">Altina</option>
                </select>
              </div>
              <button onClick={()=>{if(alertForm.code&&alertForm.price){setAlerts(a=>[...a,{...alertForm,id:Date.now()}]);setAlertForm({code:"",price:"",dir:"ustune"});}}}
                style={{padding:"8px 14px",borderRadius:8,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>+ Ekle</button>
            </div>
            {alerts.length===0?<div style={{textAlign:"center",padding:40,color:"#1e3248"}}>Henuz alarm yok.</div>:alerts.map(a=>(
              <div key={a.id} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:14,marginBottom:8,flexWrap:"wrap"}}>
                <div>
                  <div style={{color:Y,fontWeight:700}}>{a.code}</div>
                  <div style={{color:"#3a5468",fontSize:11}}>Fiyat {a.dir} cikinca: {a.price} TL</div>
                </div>
                <button onClick={()=>setAlerts(x=>x.filter(y=>y.id!==a.id))} style={{marginLeft:"auto",padding:"4px 10px",borderRadius:6,background:`rgba(255,61,107,.1)`,color:R,border:`1px solid rgba(255,61,107,.25)`,fontSize:10,cursor:"pointer"}}>Sil</button>
              </div>
            ))}
          </div>
        )}

        {tab==="portfolio"&&(
          <div>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:12}}>PORTFOYUM</div>
            {portfolio.length===0?<div style={{textAlign:"center",padding:60,color:"#1e3248"}}>Analiz sayfasindan hisse ekleyin.</div>:portfolio.map(stock=>(
              <div key={stock.c} style={{background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:14,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <div>
                    <div style={{color:Y,fontWeight:700,fontSize:15}}>{stock.c}</div>
                    <div style={{color:"#1e3248",fontSize:10}}>{stock.n} - {stock.date}</div>
                  </div>
                  {(signals[stock.c]||stock.signal)&&<Sig v={signals[stock.c]||stock.signal}/>}
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <button onClick={()=>analyze(stock)} style={{padding:"5px 10px",borderRadius:6,background:"rgba(94,158,255,.1)",color:"#5e9eff",border:"1px solid rgba(94,158,255,.2)",fontSize:10,cursor:"pointer"}}>Analiz</button>
                    <button onClick={()=>setPortfolio(p=>p.filter(x=>x.c!==stock.c))} style={{padding:"5px 10px",borderRadius:6,background:`rgba(255,61,107,.1)`,color:R,border:`1px solid rgba(255,61,107,.25)`,fontSize:10,cursor:"pointer"}}>Cikar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="chat"&&(
          <div style={{display:"flex",flexDirection:"column",height:"70vh"}}>
            <div style={{color:Y,fontSize:10,letterSpacing:2,marginBottom:10}}>AI BORSA ASISTANI</div>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}}>
              {chat.length===0&&(
                <div style={{textAlign:"center",padding:40,color:"#1e3248"}}>
                  {["THYAO bu hafta yukselir mi?","Hangi sektor guclu?","Kucuk hisselerde risk nasil yonetilir?"].map(q=>(
                    <button key={q} onClick={()=>setChatMsg(q)}
                      style={{display:"block",margin:"5px auto",padding:"7px 14px",borderRadius:8,background:`rgba(245,166,35,.07)`,color:Y,border:`1px solid rgba(245,166,35,.25)`,fontSize:11,cursor:"pointer"}}>
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
              {chatLoad&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:CB,border:`1px solid ${BD}`,borderRadius:12,padding:"10px 14px",color:Y,fontSize:11}}>Arastiriyor...</div></div>}
              <div ref={chatEnd}/>
            </div>
            <div style={{display:"flex",gap:8,paddingTop:8,borderTop:`1px solid ${BD}`}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}
                placeholder="BIST hakkinda soru sorun..."
                style={{flex:1,background:CB,border:`1px solid ${BD}`,borderRadius:10,padding:"10px 14px",color:"#b8ccdc",fontSize:12,outline:"none"}}/>
              <button onClick={sendChat} disabled={chatLoad}
                style={{padding:"10px 16px",borderRadius:10,background:`linear-gradient(135deg,${Y},#e06c00)`,color:"#000",fontWeight:700,fontSize:12,border:"none",cursor:"pointer",opacity:chatLoad?.6:1}}>
                Gonder
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",padding:12,color:"#0f1e2d",fontSize:9,borderTop:`1px solid ${BD}`,marginTop:16}}>
        BIST AI PRO - Yatirim tavsiyesi degildir.
      </div>
    </div>
  );
}

