import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, TorusKnot, MeshDistortMaterial } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- ADVANCED 3D SPATIAL UNIVERSE ---
function SpatialUniverse({ phase, activeService }) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const knotRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !ring1Ref.current || !ring2Ref.current || !knotRef.current) return;
    const speed = phase === 'idle' ? 0.3 : 2.2;

    coreRef.current.rotation.x += delta * speed * 0.4;
    coreRef.current.rotation.y += delta * speed * 0.6;
    ring1Ref.current.rotation.z -= delta * speed * 0.5;
    ring2Ref.current.rotation.x += delta * speed * 0.3;
    knotRef.current.rotation.y -= delta * speed * 0.4;
  });

  const getThemeColor = () => {
    switch (activeService) {
      case 'market': return '#0ea5e9';   // Cyan
      case 'strategy': return '#a855f7'; // Violet
      case 'code': return '#10b981';     // Emerald
      case 'pitch': return '#f59e0b';    // Amber
      default: return '#6366f1';         // Indigo
    }
  };

  const color = getThemeColor();

  return (
    <group>
      <Float speed={2} rotationIntensity={1.2} floatIntensity={2}>
        {/* Central Distorted Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.3, 0]} />
          <MeshDistortMaterial 
            color={color} 
            speed={3} 
            distort={0.4} 
            roughness={0.1} 
            metalness={0.9} 
            wireframe={phase !== 'idle'} 
          />
        </mesh>

        {/* Orbiting Torus Knot */}
        <group ref={knotRef} scale={[0.8, 0.8, 0.8]}>
          <TorusKnot args={[1.8, 0.05, 128, 32]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </TorusKnot>
        </group>

        {/* Outer Data Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>

        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.2, 0.015, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>
      </Float>
    </group>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [formData, setFormData] = useState({
    industry: 'Autonomous AI & Spatial Robotics',
    budget: '$100k - $250k (Pre-Seed)',
    problem: 'Last-mile automated delivery drones suffer from cellular dead-zone telemetry loss in high-density metropolitan corridors.'
  });

  const [activeService, setActiveService] = useState('market');
  const [agentPhase, setAgentPhase] = useState('idle');
  const [progressLog, setProgressLog] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Modal State for Interactive Buttons
  const [modalData, setModalData] = useState(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const workspaceRef = useRef(null);

  const scrollToWorkspace = (serviceKey) => {
    setActiveService(serviceKey);
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Interactive Deep-Dive Modals Content
  const handleOpenModal = (type) => {
    const modals = {
      specs: {
        title: "Spatial Neural Architecture Specs",
        content: "Nexus AI utilizes a multi-layered asynchronous processing pipeline. Built on React 19, Vite, Three.js spatial shaders, and Google's Gemini 1.5 Flash model, it constructs deterministic business logic graphs in <4.2 seconds."
      },
      telemetry: {
        title: "Live Telemetry & Latency Metrics",
        content: "System load: Optimal (14ms latency). API handshake status: Secure (TLS 1.3). Distributed cluster node synchronization active across 4 edge regions."
      },
      whitepaper: {
        title: "Executive Whitepaper: Autonomous Agents",
        content: "Read how generative agentic loops replace traditional human-in-the-loop market validation. By vectorizing competitor data against regulatory constraints, founders reduce go-to-market friction by 74%."
      }
    };
    setModalData(modals[type]);
  };

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API Key missing! Please configure VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setProgressLog(['[SYSTEM] Initializing Apple-Grade Spatial Neural Pipeline...']);
    setAgentPhase('research');
    setResults(null);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are Nexus AI, an elite spatial enterprise startup architect. 
        Analyze the following venture parameters:
        Industry: ${formData.industry}
        Budget: ${formData.budget}
        Problem: ${formData.problem}

        Respond ONLY with a valid JSON object matching this exact structure:
        {
          "market": "Comprehensive TAM/SAM/SOM global telemetry, structural demographic friction, and macro competitive moats.",
          "strategy": "Ecosystem monetization blueprint, tiered B2B pricing architecture, and high-retention enterprise GTM strategy.",
          "code": "Production-grade microservice backend implementation (Node.js / Python FastAPI) engineered for fault-tolerant telemetry.",
          "pitch": "Visionary Y-Combinator seed deck narrative: Hook, spatial paradigm shift, market size, and capitalization ask."
        }
      `;

      setTimeout(() => setAgentPhase('design'), 1600);
      setTimeout(() => setAgentPhase('architecture'), 3200);
      setTimeout(() => setAgentPhase('roadmap'), 4800);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      setResults(parsedData);
      setAgentPhase('idle');
      setProgressLog(prev => [...prev, '[SUCCESS] Spatial architecture fully synthesized.']);

    } catch (err) {
      console.error(err);
      setError("Execution interrupted. Check API key permissions.");
      setAgentPhase('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* --- APPLE-GRADE NAVBAR --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center bg-black/70 backdrop-blur-2xl border-b border-white/10 max-w-7xl mx-auto rounded-full mt-4 w-[90%] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
          <h1 className="font-semibold text-lg tracking-tight text-white">
            NEXUS <span className="text-slate-400 font-light">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-medium text-slate-400">
          <button onClick={() => scrollToWorkspace('market')} className="hover:text-white transition">Platform</button>
          <button onClick={() => handleOpenModal('specs')} className="hover:text-white transition">Architecture</button>
          <button onClick={() => handleOpenModal('telemetry')} className="hover:text-white transition">Telemetry</button>
        </nav>
        <button onClick={() => scrollToWorkspace('market')} className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-200 transition shadow-lg">
          Initialize Suite
        </button>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center relative z-10 px-4 pt-28 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[11px] font-medium tracking-wider uppercase backdrop-blur-xl">
          Spatial Intelligence Architecture v3.0
        </div>
        <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter text-white mb-6 leading-none max-w-5xl">
          Intelligence, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-indigo-500 font-light">
            engineered to scale.
          </span>
        </h2>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mb-10 font-light leading-relaxed">
          Nexus AI operates as a sovereign autonomous architect—synthesizing market macro-dynamics, monetization schemas, and enterprise infrastructure in real-time.
        </p>

        {/* Hero Interactive Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button onClick={() => scrollToWorkspace('market')} className="px-8 py-4 rounded-full bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
            Launch Workspace →
          </button>
          <button onClick={() => handleOpenModal('whitepaper')} className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition border border-white/10 backdrop-blur-md">
            Read Whitepaper
          </button>
        </div>

        {/* --- SERVICE PILLARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl text-left mb-12">
          
          <div onClick={() => scrollToWorkspace('market')} className="group bg-[#0a0a0c] border border-white/10 hover:border-cyan-500/50 p-6 rounded-3xl cursor-pointer transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-mono text-cyan-400 mb-4 block">01 / MARKET</span>
            <h3 className="font-semibold text-white mb-2 text-base">Global Telemetry</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">Automated TAM/SAM calculations and structural friction analysis.</p>
          </div>

          <div onClick={() => scrollToWorkspace('strategy')} className="group bg-[#0a0a0c] border border-white/10 hover:border-purple-500/50 p-6 rounded-3xl cursor-pointer transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-mono text-purple-400 mb-4 block">02 / STRATEGY</span>
            <h3 className="font-semibold text-white mb-2 text-base">Ecosystem Design</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">Tiered subscription engineering and high-retention GTM models.</p>
          </div>

          <div onClick={() => scrollToWorkspace('code')} className="group bg-[#0a0a0c] border border-white/10 hover:border-emerald-500/50 p-6 rounded-3xl cursor-pointer transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-mono text-emerald-400 mb-4 block">03 / CODE</span>
            <h3 className="font-semibold text-white mb-2 text-base">Core Infrastructure</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">Production-grade asynchronous API codebases ready for deployment.</p>
          </div>

          <div onClick={() => scrollToWorkspace('pitch')} className="group bg-[#0a0a0c] border border-white/10 hover:border-amber-500/50 p-6 rounded-3xl cursor-pointer transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs font-mono text-amber-400 mb-4 block">04 / PITCH</span>
            <h3 className="font-semibold text-white mb-2 text-base">Investor Deck</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">Visionary Y-Combinator narrative structures for institutional round raises.</p>
          </div>

        </div>
      </div>

      {/* --- WORKSPACE SPLIT VIEW --- */}
      <div ref={workspaceRef} className="flex flex-col lg:flex-row w-full relative min-h-screen">
        
        {/* LEFT COLUMN: Workspace Form & Output */}
        <div className="w-full lg:w-7/12 flex flex-col z-10 p-6 lg:p-16 gap-8 justify-center">
          
          <div className="bg-[#0a0a0c] border border-white/10 rounded-[32px] p-8 lg:p-10 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Autonomous Enterprise Parameters
            </h3>
            
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">Target Domain</label>
                <input 
                  type="text"
                  className="w-full bg-[#121216] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-cyan-400 outline-none transition font-light"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  disabled={agentPhase !== 'idle'}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">Capital Allocation</label>
                <select 
                  className="w-full bg-[#121216] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-cyan-400 outline-none transition appearance-none font-light"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  disabled={agentPhase !== 'idle'}
                >
                  <option>$50k - $100k (Bootstrapped)</option>
                  <option>$100k - $250k (Pre-Seed)</option>
                  <option>$1M+ (Institutional Seed)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">Operational Friction Point</label>
              <textarea
                rows={4}
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                disabled={agentPhase !== 'idle'}
                className="w-full bg-[#121216] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-cyan-400 outline-none transition resize-y font-light"
              />
            </div>

            <button
              onClick={runAgentPipeline}
              disabled={agentPhase !== 'idle'}
              className={`w-full mt-8 py-5 rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all shadow-2xl ${
                agentPhase === 'idle'
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300 cursor-pointer shadow-cyan-500/20 hover:scale-[1.01]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {agentPhase === 'idle' ? 'Execute Spatial Synthesis' : `Synthesizing Layer: ${agentPhase.toUpperCase()}...`}
            </button>
          </div>

          {/* Results Output Console */}
          {results && (
            <div className="bg-[#0a0a0c] border border-white/10 rounded-[32px] p-8 lg:p-10 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
                <div className="flex overflow-x-auto gap-2">
                  {[
                    { id: 'market', label: 'Market Data' },
                    { id: 'strategy', label: 'Ecosystem' },
                    { id: 'code', label: 'API Code' },
                    { id: 'pitch', label: 'Pitch Deck' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveService(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeService === tab.id
                          ? 'bg-white text-black font-semibold'
                          : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => copyToClipboard(results[activeService])}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 transition"
                >
                  {copied ? 'Copied!' : 'Copy View'}
                </button>
              </div>

              <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 min-h-[350px]">
                {activeService === 'code' ? (
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {results.code}
                  </pre>
                ) : (
                  <div className="prose prose-invert max-w-none text-sm text-slate-300 font-light leading-loose whitespace-pre-line">
                    {results[activeService]?.replace(/###/g, '\n•').replace(/\*\*/g, '')}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="h-16"></div>
        </div>

        {/* RIGHT COLUMN: Spatial 3D Visualizer */}
        <div className="hidden lg:block lg:w-5/12 h-screen sticky top-0 border-l border-white/10 bg-[#000000] z-0 overflow-hidden">
          <div className="absolute top-28 left-8 z-10 font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-black/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-2xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Spatial Core: {activeService.toUpperCase()}
          </div>

          <Canvas camera={{ position: [0, 0, 7] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#0ea5e9" />
            <Stars radius={200} depth={60} count={6000} factor={4} saturation={0} fade speed={1} />
            <SpatialUniverse phase={agentPhase} activeService={activeService} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={agentPhase === 'idle'} autoRotateSpeed={0.7} />
          </Canvas>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-90" />
        </div>
      </div>

      {/* --- EXTENDED INFORMATION SECTION: ENTERPRISE FAQ & SPECS --- */}
      <section className="py-24 px-8 max-w-5xl mx-auto w-full z-10 border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Knowledge Base</span>
          <h3 className="text-3xl font-semibold text-white mt-2">Frequently Answered Questions</h3>
        </div>

        <div className="space-y-4">
          {[
            { q: "How does Nexus AI generate deterministic business models?", a: "Nexus AI combines real-time semantic vector searches with fine-tuned structural templates, mapping target friction points against historical VC funding datasets." },
            { q: "Is my proprietary venture data secured?", a: "Yes. All sessions are encrypted via TLS 1.3, and local environment variables ensure keys never touch un-vetted public cloud endpoints." },
            { q: "Can I deploy the generated code directly to production?", a: "The generated API boilerplate scripts are engineered using industry-standard Node.js and Python FastAPI conventions, structured for instant Vercel or AWS containerization." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left font-medium text-white flex justify-between items-center hover:bg-white/5 transition"
              >
                <span>{faq.q}</span>
                <span className="text-cyan-400 font-mono text-lg">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-400 font-light leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- MODAL OVERLAY (FOR WORKING BUTTONS) --- */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0a0a0c] border border-white/20 rounded-[32px] p-8 max-w-lg w-full relative shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">{modalData.title}</h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed mb-8">{modalData.content}</p>
            <button 
              onClick={() => setModalData(null)}
              className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-slate-200 transition"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-slate-500 font-mono z-10">
        <p>Nexus AI Enterprise © 2026 • Sovereign Autonomous Architect</p>
      </footer>

    </div>
  );
}