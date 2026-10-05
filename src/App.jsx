import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- ADVANCED 3D MULTI-LAYERED NEURAL ENGINE ---
function MultiLayeredCore({ phase, activeService }) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const particleFieldRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !ring1Ref.current || !ring2Ref.current || !particleFieldRef.current) return;
    const speed = phase === 'idle' ? 0.3 : 2.5;

    coreRef.current.rotation.x += delta * speed * 0.4;
    coreRef.current.rotation.y += delta * speed * 0.7;

    ring1Ref.current.rotation.z -= delta * speed * 0.5;
    ring2Ref.current.rotation.x += delta * speed * 0.3;
    
    particleFieldRef.current.rotation.y -= delta * 0.15;
  });

  const getThemeColor = () => {
    switch (activeService) {
      case 'market': return '#3b82f6';   // Blue
      case 'strategy': return '#8b5cf6'; // Violet
      case 'code': return '#10b981';     // Emerald
      case 'pitch': return '#f59e0b';    // Amber
      default: return '#6366f1';         // Indigo
    }
  };

  const color = getThemeColor();

  return (
    <group>
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
        {/* Layer 1: Central AI Processing Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color={color} 
            wireframe={phase !== 'idle'} 
            emissive={color} 
            emissiveIntensity={0.8} 
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Layer 2: Inner Data Ring */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.4, 0.03, 16, 100]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>

        {/* Layer 3: Outer Orbital Field */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[3.3, 0.02, 16, 100]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>
      </Float>

      {/* Floating Ambient Data Particles */}
      <group ref={particleFieldRef}>
        {Array.from({ length: 25 }).map((_, i) => (
          <mesh key={i} position={[
            (Math.sin(i) * 4),
            (Math.cos(i * 2) * 4),
            ((i % 5) - 2.5) * 1.5
          ]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? color : '#38bdf8'} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [formData, setFormData] = useState({
    industry: 'Fintech & Automated Payments',
    budget: '$50k - $100k',
    problem: 'Cross-border B2B transactions suffer from a 3-day settlement lag and high foreign exchange tracking overhead.'
  });

  const [activeService, setActiveService] = useState('market');
  const [agentPhase, setAgentPhase] = useState('idle');
  const [progressLog, setProgressLog] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const workspaceRef = useRef(null);
  const pricingRef = useRef(null);
  const architectureRef = useRef(null);

  const scrollToSection = (elementRef, serviceKey = null) => {
    if (serviceKey) setActiveService(serviceKey);
    elementRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API Key missing! Please configure VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    setProgressLog(['[SYSTEM] Initializing Nexus AI Live Gemini Engine...']);
    setAgentPhase('research');
    setResults(null);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-pro for stable API routing
      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are Nexus AI, an elite enterprise autonomous startup architect. 
        Analyze the following venture parameters:
        Industry: ${formData.industry}
        Budget: ${formData.budget}
        Problem: ${formData.problem}

        Respond ONLY with a valid JSON object matching this exact structure:
        {
          "market": "Comprehensive TAM/SAM/SOM breakdown, demographic pain points, and competitor saturation index.",
          "strategy": "Lean business canvas, multi-tiered B2B pricing model, and customer acquisition CAC/LTV projections.",
          "code": "Production-grade backend architecture script (Node.js/Express or Python FastAPI) addressing the core technical bottleneck.",
          "pitch": "Y-Combinator style investor pitch structure including hook, solution, traction metrics, and seed funding ask."
        }
      `;

      setTimeout(() => setAgentPhase('design'), 1800);
      setTimeout(() => setAgentPhase('architecture'), 3600);
      setTimeout(() => setAgentPhase('roadmap'), 5400);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      setResults(parsedData);
      setAgentPhase('idle');
      setProgressLog(prev => [...prev, '[SUCCESS] Live AI generation complete. Payload secured.']);

    } catch (err) {
      console.error(err);
      setError("Pipeline execution failed. Check console or verify API key permissions.");
      setAgentPhase('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- FLOATING NAVBAR --- */}
      <header className="px-8 py-5 flex justify-between items-center w-full max-w-7xl mx-auto fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-500/50" />
          <h1 className="font-extrabold text-xl tracking-wider text-white">
            NEXUS <span className="text-indigo-400">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollToSection(workspaceRef, 'market')} className="hover:text-white transition">Platform</button>
          <button onClick={() => scrollToSection(architectureRef)} className="hover:text-white transition">Architecture</button>
          <button onClick={() => scrollToSection(pricingRef)} className="hover:text-white transition">Pricing</button>
        </nav>
        <button 
          onClick={() => scrollToSection(workspaceRef, 'market')} 
          className="px-5 py-2 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          Initialize AI
        </button>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="w-full min-h-screen flex flex-col relative z-10 bg-gradient-to-b from-[#020617] via-[#070e27] to-[#020617] pt-24">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 max-w-5xl mx-auto my-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
            Enterprise Autonomous Agentic Platform v2.4
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Architecting enterprises <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              through multi-layered intelligence.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Harness live autonomous LLM orchestration to generate validated market models, monetization playbooks, and production-ready code in real-time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left mb-8">
            <div onClick={() => scrollToSection(workspaceRef, 'market')} className="group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-md shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 font-bold mb-4">01</div>
              <h3 className="font-bold text-white mb-2 text-base">Market Data</h3>
              <p className="text-xs text-slate-400">TAM/SAM/SOM calculations and competitor matrices.</p>
            </div>
            <div onClick={() => scrollToSection(workspaceRef, 'strategy')} className="group bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-md shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold mb-4">02</div>
              <h3 className="font-bold text-white mb-2 text-base">Business Model</h3>
              <p className="text-xs text-slate-400">Lean canvas and tiered subscription structures.</p>
            </div>
            <div onClick={() => scrollToSection(workspaceRef, 'code')} className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-md shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold mb-4">03</div>
              <h3 className="font-bold text-white mb-2 text-base">Architecture</h3>
              <p className="text-xs text-slate-400">Production-ready backend scripts for deployment.</p>
            </div>
            <div onClick={() => scrollToSection(workspaceRef, 'pitch')} className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-md shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 font-bold mb-4">04</div>
              <h3 className="font-bold text-white mb-2 text-base">Investor Pitch</h3>
              <p className="text-xs text-slate-400">Y-Combinator seed deck frameworks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- APP WORKSPACE SPLIT VIEW --- */}
      <div ref={workspaceRef} className="flex flex-col lg:flex-row w-full relative border-t border-white/5">
        <div className="w-full lg:w-7/12 flex flex-col z-10 p-6 lg:p-12 gap-8">
          <div className="bg-[#0a0f1c] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              Live Gemini Agent Configuration
            </h3>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Target Industry</label>
                <input 
                  type="text"
                  className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  disabled={agentPhase !== 'idle'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Capital Allocation</label>
                <select 
                  className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition appearance-none"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  disabled={agentPhase !== 'idle'}
                >
                  <option>$10k - $50k (Bootstrapped)</option>
                  <option>$50k - $100k</option>
                  <option>$250k+ (Seed Stage)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Core Operational Friction</label>
              <textarea
                rows={4}
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                disabled={agentPhase !== 'idle'}
                className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition resize-y"
              />
            </div>

            <button
              onClick={runAgentPipeline}
              disabled={agentPhase !== 'idle'}
              className={`w-full mt-8 py-5 rounded-xl font-extrabold tracking-widest uppercase transition-all shadow-xl ${
                agentPhase === 'idle'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-600/30 hover:scale-[1.01] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {agentPhase === 'idle' ? 'Execute Live AI Generation' : `Processing Layer: ${agentPhase.toUpperCase()}...`}
            </button>
          </div>

          {results && (
            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-700">
              <div className="flex overflow-x-auto gap-3 border-b border-slate-800 pb-5 mb-6 custom-scrollbar">
                {[
                  { id: 'market', label: '1. Market Data' },
                  { id: 'strategy', label: '2. Strategy' },
                  { id: 'code', label: '3. Architecture' },
                  { id: 'pitch', label: '4. Pitch Deck' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveService(tab.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeService === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white bg-black/20 border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-black/40 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
                {activeService === 'code' ? (
                  <pre className="font-mono text-[13px] text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {results.code}
                  </pre>
                ) : (
                  <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-loose whitespace-pre-line">
                    {results[activeService]?.replace(/###/g, '\n•').replace(/\*\*/g, '')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:w-5/12 h-screen sticky top-0 border-l border-white/5 bg-[#02050f] z-0 overflow-hidden">
          <div className="absolute top-20 left-6 z-10 font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Layer Visualizer: {activeService.toUpperCase()}
          </div>

          <Canvas camera={{ position: [0, 0, 7.5] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
            <Stars radius={150} depth={50} count={4000} factor={4} saturation={0.5} fade speed={1} />
            <MultiLayeredCore phase={agentPhase} activeService={activeService} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={agentPhase === 'idle'} autoRotateSpeed={0.7} />
          </Canvas>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none opacity-80" />
        </div>
      </div>

      {/* --- ARCHITECTURE & PRICING SECTIONS --- */}
      <div ref={architectureRef} className="w-full py-24 px-6 lg:px-16 bg-[#040817] border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-3">Technical Specification</h2>
          <p className="text-slate-400 text-sm">Decoupled full-stack architecture combining high-performance React spatial rendering with live Gemini intelligence.</p>
        </div>
      </div>

      <div ref={pricingRef} className="w-full py-24 px-6 lg:px-16 bg-[#020617] border-t border-white/5 relative z-10 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">Commercial Access Plans</h2>
        <p className="text-slate-400 text-sm mb-8">Deploy at scale with transparent developer and enterprise tiers.</p>
      </div>

    </div>
  );
}