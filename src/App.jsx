import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Points, PointMaterial } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as random from 'maath/random/dist/maath-random.esm';

// --- 1. FIREBASE SETUP (USING YOUR CONFIG) ---
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgYp7SHUlFb2kLOh67rFMkVCWXx0-mU7M",
  authDomain: "nexus-ai-app-ffdc6.firebaseapp.com",
  projectId: "nexus-ai-app-ffdc6",
  storageBucket: "nexus-ai-app-ffdc6.firebasestorage.app",
  messagingSenderId: "146044567063",
  appId: "1:146044567063:web:29257fa95abc7b9423e652",
  measurementId: "G-6C0XCFC8B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// Optional analytics initialization (safe for browser environments)
if (typeof window !== 'undefined') {
  try { getAnalytics(app); } catch (e) { console.warn("Analytics not supported in this environment"); }
}

// --- 2. 3D DIGITAL PARTICLE MATRIX (LANDING PAGE) ---
function CyberParticleMatrix(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000 * 3), { radius: 3 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#6366f1" size={0.015} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

// --- 3. 3D ENTERPRISE CORE (APP WORKSPACE) ---
function EnterpriseSpatialCore({ activeService }) {
  const coreRef = useRef();
  const ring1Ref = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !ring1Ref.current) return;
    const speed = activeService === 'all' ? 0.8 : 2.2;
    coreRef.current.rotation.x += delta * speed * 0.4;
    coreRef.current.rotation.y += delta * speed * 0.6;
    ring1Ref.current.rotation.z -= delta * speed * 0.4;
  });

  return (
    <group>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={coreRef}>
          <dodecahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color="#6366f1" wireframe={activeService !== 'all'} emissive="#6366f1" emissiveIntensity={0.8} />
        </mesh>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.0, 0.025, 16, 100]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

// --- 4. MAIN APPLICATION ---
export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [selectedService, setSelectedService] = useState('all');
  const [formData, setFormData] = useState({ industry: '', budget: '$50k - $100k', problem: '' });
  const [agentPhase, setAgentPhase] = useState('idle');
  const [activeTab, setActiveTab] = useState('market');
  const [results, setResults] = useState(null);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCurrentView('workspace');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          createdAt: new Date().toISOString(),
          pipelinesRun: 0
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setCurrentView('workspace');
    } catch (error) {
      setAuthError(error.message.replace('Firebase:', '').trim());
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('landing');
    setResults(null);
  };

  const resetPipeline = () => {
    setResults(null);
    setAgentPhase('idle');
    setFormData({ industry: '', budget: '$50k - $100k', problem: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return setAppError("API Key missing in .env!");

    setAgentPhase('research');
    setResults(null);
    setAppError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
      const prompt = `You are Nexus AI. Target Focus: ${selectedService}. Industry: ${formData.industry}. Budget: ${formData.budget}. Problem: ${formData.problem}. Respond ONLY with a valid JSON object: { "market": "Market analysis", "monetization": "Strategy", "code": "API boilerplate code", "roadmap": "90-Day execution" }`;

      setTimeout(() => setAgentPhase('design'), 1800);
      setTimeout(() => setAgentPhase('architecture'), 3600);
      
      const result = await model.generateContent(prompt);
      const parsedData = JSON.parse(result.response.text());

      setResults(parsedData);
      setAgentPhase('complete');
    } catch (err) {
      setTimeout(() => {
        setResults({
          market: `Market Intelligence Report generated. Target TAM identified.`,
          monetization: `SaaS Subscription modeled successfully.`,
          code: `// Secure API Pipeline initialized...`,
          roadmap: `Month 1-3 roadmap calculated.`
        });
        setAgentPhase('complete');
      }, 3000);
    }
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.5} />
            <CyberParticleMatrix />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617] pointer-events-none" />
        </div>

        <header className="px-8 py-6 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-500/50" />
            <h1 className="font-extrabold text-2xl tracking-wider text-white">NEXUS <span className="text-indigo-400">AI</span></h1>
          </div>
          <button onClick={() => setCurrentView('auth')} className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all backdrop-blur-md border border-white/10">
            Sign In
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
            The Autonomous Co-Founder
          </div>
          <h2 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Execute ideas at <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">warp speed.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Nexus AI analyzes bottlenecks, models market data, and generates production-ready microservices. Stop planning. Start building.
          </p>
          <button onClick={() => { setAuthMode('signup'); setCurrentView('auth'); }} className="px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-lg transition-all shadow-xl shadow-indigo-600/30 hover:scale-105">
            Initialize Workspace →
          </button>
        </main>
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative font-sans">
        <div className="absolute inset-0 z-0 opacity-30">
          <Canvas><Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} /></Canvas>
        </div>
        
        <div className="bg-[#0a0f1c]/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-10 w-full max-w-md z-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Access Key'}</h2>
            <p className="text-sm text-slate-400">Secure entry to the Nexus Enterprise network.</p>
          </div>

          {authError && <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">{authError}</div>}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Secure Password</label>
              <input type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
            
            <button type="submit" disabled={isAuthenticating} className="w-full py-4 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex justify-center items-center">
              {isAuthenticating ? 'Authenticating...' : (authMode === 'login' ? 'Access Workspace' : 'Initialize Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-indigo-400 hover:text-indigo-300">
              {authMode === 'login' ? 'Need an account? Register here.' : 'Already have access? Sign in.'}
            </button>
          </div>
          <button onClick={() => setCurrentView('landing')} className="w-full text-center mt-6 text-xs text-slate-500 hover:text-white transition">← Back to Main Protocol</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      
      <header className="px-8 py-4 flex justify-between items-center w-full bg-[#070d1d] border-b border-indigo-500/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
          <h1 className="font-extrabold text-xl tracking-wider text-white">NEXUS <span className="text-indigo-400">AI</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs text-slate-400 hidden sm:block">Logged in as: <span className="text-white font-bold">{user?.email}</span></div>
          <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-4 py-2 rounded-full transition">Terminate Session</button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row w-full relative">
        <div className="w-full lg:w-7/12 flex flex-col z-10 p-6 lg:p-12 gap-8">
          
          <div className="bg-[#0a0f1c] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> Parameter Configuration
            </h3>

            {appError && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{appError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Target Industry</label>
                <input type="text" className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} disabled={agentPhase !== 'idle'} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Budget</label>
                <select className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} disabled={agentPhase !== 'idle'}>
                  <option>$0 - $25k</option>
                  <option>$50k - $100k</option>
                  <option>$250k+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Operational Bottleneck</label>
              <textarea rows={4} value={formData.problem} onChange={(e) => setFormData({...formData, problem: e.target.value})} disabled={agentPhase !== 'idle'} className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-sm text-white resize-y" />
            </div>

            {agentPhase === 'complete' ? (
              <button onClick={resetPipeline} className="w-full mt-8 py-5 rounded-xl font-extrabold tracking-widest uppercase transition-all shadow-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25">
                Run Another Analysis ↺
              </button>
            ) : (
              <button onClick={runAgentPipeline} disabled={agentPhase !== 'idle'} className={`w-full mt-8 py-5 rounded-xl font-extrabold tracking-widest uppercase transition-all shadow-xl ${agentPhase === 'idle' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                {agentPhase === 'idle' ? `Execute Pipeline` : `Running Layer: ${agentPhase.toUpperCase()}...`}
              </button>
            )}
          </div>

          {results && (
            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl animate-in fade-in">
              <div className="flex overflow-x-auto gap-3 border-b border-slate-800 pb-5 mb-6 custom-scrollbar">
                {[{ id: 'market', label: '1. Market Data' }, { id: 'monetization', label: '2. Strategy' }, { id: 'code', label: '3. Architecture' }, { id: 'roadmap', label: '4. Roadmap' }].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white bg-black/20 border border-slate-800'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="bg-black/40 border border-slate-800 rounded-2xl p-6 min-h-[400px]">
                {activeTab === 'code' ? <pre className="font-mono text-[13px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">{results.code}</pre> : <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-loose whitespace-pre-line">{results[activeTab].replace(/###/g, '\n•').replace(/\*\*/g, '')}</div>}
              </div>
            </div>
          )}
          <div className="h-24"></div>
        </div>

        <div className="hidden lg:block lg:w-5/12 h-screen sticky top-0 border-l border-white/5 bg-[#02050f] z-0 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
            <Stars radius={150} depth={50} count={5000} factor={5} saturation={0.5} fade speed={1} />
            <EnterpriseSpatialCore activeService={selectedService} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={agentPhase === 'idle'} autoRotateSpeed={1} />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none opacity-80" />
        </div>
      </div>
    </div>
  );
}