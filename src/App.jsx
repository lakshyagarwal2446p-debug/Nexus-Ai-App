import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- APPLE/META SPATIAL 3D CORE ---
function SpatialNeuralCore({ phase, activeService }) {
  const coreRef = useRef();
  const ringRef = useRef();
  const dataNodeRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !ringRef.current || !dataNodeRef.current) return;
    const speed = phase === 'idle' ? 0.4 : 2.8;

    coreRef.current.rotation.x += delta * speed * 0.3;
    coreRef.current.rotation.y += delta * speed * 0.6;

    ringRef.current.rotation.z -= delta * speed * 0.4;
    dataNodeRef.current.rotation.y += delta * speed * 0.8;
  });

  const getThemeConfig = () => {
    switch (activeService) {
      case 'market': return { color: '#0ea5e9', emissive: '#0284c7' }; // Apple Cyan/Blue
      case 'strategy': return { color: '#a855f7', emissive: '#9333ea' }; // VisionOS Violet
      case 'code': return { color: '#10b981', emissive: '#059669' }; // Emerald Code
      case 'pitch': return { color: '#f59e0b', emissive: '#d97706' }; // Gold Investor
      default: return { color: '#6366f1', emissive: '#4f46e5' };
    }
  };

  const theme = getThemeConfig();

  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {/* Core Geometry */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color={theme.color} 
            wireframe={phase !== 'idle'} 
            emissive={theme.emissive} 
            emissiveIntensity={0.7} 
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Inner Data Shell */}
        <mesh ref={dataNodeRef} scale={[1.8, 1.8, 1.8]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.15} />
        </mesh>

        {/* Outer Orbital Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.6, 0.02, 16, 100]} />
          <meshStandardMaterial color={theme.color} emissive={theme.emissive} emissiveIntensity={1} />
        </mesh>
      </Float>
    </group>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [formData, setFormData] = useState({
    industry: 'Autonomous Robotics & AI Infrastructure',
    budget: '$100k - $250k (Pre-Seed)',
    problem: 'Autonomous last-mile delivery drones experience cellular dead-zone telemetry failures in dense metropolitan canyons.'
  });

  const [activeService, setActiveService] = useState('market'); // market | strategy | code | pitch
  const [agentPhase, setAgentPhase] = useState('idle');
  const [progressLog, setProgressLog] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API Key missing! Please configure VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setProgressLog(['[SYSTEM] Initializing Apple-Grade Neural Pipeline...']);
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
        You are Nexus AI, an elite spatial enterprise startup architect inspired by Apple and Meta design standards. 
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
    <div className="min-h-screen bg-[#000000] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- APPLE-GRADE TRANSLUCENT NAVBAR --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center bg-black/60 backdrop-blur-2xl border-b border-white/10 max-w-7xl mx-auto rounded-full mt-4 w-[90%]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
          <h1 className="font-semibold text-lg tracking-tight text-white">
            NEXUS <span className="text-slate-400 font-light">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-medium text-slate-400">
          <button onClick={() => scrollToWorkspace('market')} className="hover:text-white transition">Platform</button>
          <button onClick={() => scrollToWorkspace('strategy')} className="hover:text-white transition">Ecosystem</button>
          <button onClick={() => scrollToWorkspace('code')} className="hover:text-white transition">Developer API</button>
        </nav>
        <button onClick={() => scrollToWorkspace('market')} className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-200 transition shadow-lg">
          Initialize Suite
        </button>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="w-full min-h-screen flex flex-col justify-center items-center relative z-10 px-4 pt-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[11px] font-medium tracking-wider uppercase backdrop-blur-xl">
          Spatial Intelligence Architecture
        </div>
        <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter text-white mb-6 leading-none max-w-5xl">
          Intelligence, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-indigo-500 font-light">
            engineered to scale.
          </span>
        </h2>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mb-12 font-light leading-relaxed">
          Nexus AI operates as a sovereign autonomous architect—synthesizing market macro-dynamics, monetization schemas, and enterprise infrastructure in real-time.
        </p>

        {/* --- META / APPLE SERVICE PILLARS --- */}
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
        
        {/* LEFT COLUMN: Apple Minimalist Form */}
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
                  ? 'bg-white text-black hover:bg-slate-200 cursor-pointer shadow-white/10 hover:scale-[1.01]'
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

        {/* RIGHT COLUMN: Sticky Spatial 3D Visualizer */}
        <div className="hidden lg:block lg:w-5/12 h-screen sticky top-0 border-l border-white/10 bg-[#000000] z-0 overflow-hidden">
          <div className="absolute top-28 left-8 z-10 font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-black/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-2xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Spatial Core: {activeService.toUpperCase()}
          </div>

          <Canvas camera={{ position: [0, 0, 7] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#0ea5e9" />
            <Stars radius={200} depth={60} count={5000} factor={4} saturation={0} fade speed={1} />
            <SpatialNeuralCore phase={agentPhase} activeService={activeService} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={agentPhase === 'idle'} autoRotateSpeed={0.6} />
          </Canvas>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-90" />
        </div>
      </div>
    </div>
  );
}