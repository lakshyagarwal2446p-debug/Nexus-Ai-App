import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Instance, Instances } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- 3D THEMATIC SCENE: "The Neural Business Graph" ---
function DataNodes({ phase }) {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = phase === 'idle' ? 0.2 : 1.5;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.z += delta * (speed * 0.5);
  });

  const getColor = () => {
    switch (phase) {
      case 'research': return '#3b82f6';
      case 'design': return '#8b5cf6';
      case 'architecture': return '#10b981';
      case 'roadmap': return '#f59e0b';
      default: return '#4f46e5';
    }
  };

  // Generate orbital positions for data nodes
  const nodes = Array.from({ length: 12 }).map((_, i) => ({
    position: [
      Math.sin((i / 12) * Math.PI * 2) * 2.5,
      Math.cos((i / 12) * Math.PI * 2) * 2.5,
      (Math.random() - 0.5) * 2
    ],
    scale: Math.random() * 0.3 + 0.1
  }));

  return (
    <group ref={groupRef}>
      {/* Central AI Processor */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={getColor()} wireframe={phase !== 'idle'} emissive={getColor()} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Orbiting Data Blocks (Representing logic/code assembling) */}
      <Instances limit={12}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent metalness={0.8} />
        {nodes.map((node, i) => (
          <Instance key={i} position={node.position} scale={node.scale} />
        ))}
      </Instances>
    </group>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [formData, setFormData] = useState({
    industry: 'Logistics & Supply Chain',
    budget: '$10k - $50k',
    problem: 'Mid-sized freight brokerages waste 40+ hours a week manually entering PDF invoice data.'
  });

  const [agentPhase, setAgentPhase] = useState('idle');
  const [progressLog, setProgressLog] = useState([]);
  const [activeTab, setActiveTab] = useState('market');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const workspaceRef = useRef(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API Key missing! Please add VITE_GEMINI_API_KEY to your .env file.");
      return;
    }

    setProgressLog(['[SYSTEM] Initializing Live Nexus AI Commercial Engine...']);
    setAgentPhase('research');
    setResults(null);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-1.5-flash for fast, structured generation
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are Nexus AI, an elite autonomous startup architect. 
        Analyze the following venture parameters:
        Industry: ${formData.industry}
        Budget: ${formData.budget}
        Problem: ${formData.problem}

        You MUST respond ONLY with a valid JSON object matching this exact structure (use markdown inside the strings):
        {
          "market": "Detailed TAM/SAM/SOM market analysis and competitor breakdown.",
          "monetization": "Lean canvas, pricing tiers, and Go-to-Market acquisition strategy.",
          "code": "Write a professional, production-ready backend API boilerplate (Node.js/Python) that solves the core technical problem.",
          "roadmap": "A detailed 90-day execution roadmap divided into Month 1, Month 2, and Month 3."
        }
      `;

      // Simulating phase transitions for UI UX while API calls in background
      setTimeout(() => setAgentPhase('design'), 2000);
      setTimeout(() => setAgentPhase('architecture'), 4000);
      setTimeout(() => setAgentPhase('roadmap'), 6000);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      setResults(parsedData);
      setAgentPhase('idle');
      setProgressLog(prev => [...prev, '[SUCCESS] Live AI generation complete. Payload secured.']);
      
      // Auto-scroll slightly down to results
      setTimeout(() => window.scrollBy({ top: 500, behavior: 'smooth' }), 300);

    } catch (err) {
      console.error(err);
      setError("AI Generation failed. Check terminal/console for details or ensure valid JSON was returned.");
      setAgentPhase('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- PROFESSIONAL LANDING PAGE (HERO) --- */}
      <div className="w-full min-h-[90vh] flex flex-col relative z-10 bg-gradient-to-b from-[#020617] to-[#0a0f1c] border-b border-indigo-500/10">
        <header className="px-8 py-6 flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="font-extrabold text-2xl tracking-wider text-white">
              NEXUS <span className="text-indigo-400">AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition">Product</a>
            <a href="#" className="hover:text-white transition">Solutions</a>
            <a href="#" className="hover:text-white transition">Enterprise</a>
          </nav>
          <button onClick={scrollToWorkspace} className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-indigo-50 transition shadow-lg shadow-white/10">
            Launch Platform
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
            The World's First Autonomous Co-Founder
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-4xl tracking-tight">
            Deploy ideas into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              revenue-generating code.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Nexus AI analyzes market gaps, designs pricing architectures, and generates production-ready software infrastructure in seconds. Stop brainstorming. Start deploying.
          </p>
          <button 
            onClick={scrollToWorkspace}
            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-indigo-600/20"
          >
            Access the AI Workspace ↓
          </button>
        </div>

        {/* Ambient background glow for hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* --- APP WORKSPACE SPLIT VIEW --- */}
      <div ref={workspaceRef} className="flex flex-col lg:flex-row w-full relative">
        
        {/* LEFT COLUMN: Scrollable Dashboard */}
        <div className="w-full lg:w-7/12 flex flex-col z-10 p-6 lg:p-12 gap-8">
          
          <div className="bg-[#0a0f1c] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Configure Autonomous Agent
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
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Allocated Budget</label>
                <select 
                  className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition appearance-none"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  disabled={agentPhase !== 'idle'}
                >
                  <option>$0 - $5k (Sweat Equity)</option>
                  <option>$10k - $50k</option>
                  <option>$100k+ (Pre-Seed)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Core Market Bottleneck</label>
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
                  ? 'bg-white text-black hover:bg-indigo-50 shadow-white/10 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {agentPhase === 'idle' ? 'Execute Live Generation' : `Processing: ${agentPhase}...`}
            </button>
          </div>

          {/* Results Render */}
          {results && (
            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex overflow-x-auto gap-3 border-b border-slate-800 pb-5 mb-6 custom-scrollbar">
                {[
                  { id: 'market', label: '1. Market Data' },
                  { id: 'monetization', label: '2. Strategy' },
                  { id: 'code', label: '3. Architecture' },
                  { id: 'roadmap', label: '4. GTM Roadmap' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-400 hover:text-white bg-black/20 hover:bg-black/50 border border-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-black/40 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
                {activeTab === 'code' ? (
                  <pre className="font-mono text-[13px] text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {results.code}
                  </pre>
                ) : (
                  <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-loose whitespace-pre-line">
                    {results[activeTab].replace(/###/g, '\n•').replace(/\*\*/g, '')}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="h-24"></div>
        </div>

        {/* RIGHT COLUMN: Sticky Interactive 3D Visualizer */}
        <div className="hidden lg:block lg:w-5/12 h-screen sticky top-0 border-l border-white/5 bg-[#02050f] z-0 overflow-hidden">
          
          <div className="absolute top-6 left-6 z-10 font-mono text-[10px] text-slate-500 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            Live AI Data Nodes
          </div>

          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
            <Stars radius={150} depth={50} count={5000} factor={5} saturation={0.5} fade speed={1} />
            <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
              <DataNodes phase={agentPhase} />
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={agentPhase === 'idle'} autoRotateSpeed={0.8} />
          </Canvas>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none opacity-80" />
        </div>
      </div>
    </div>
  );
}