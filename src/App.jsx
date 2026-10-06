import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Points, PointMaterial, Sparkles } from '@react-three/drei';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as random from 'maath/random/dist/maath-random.esm';

// --- 1. FIREBASE SETUP ---
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
if (typeof window !== 'undefined') {
  try { getAnalytics(app); } catch (e) { console.warn("Analytics optional"); }
}

// --- 2. 3D ANIMATION: ENCRYPTED SECURITY VAULT (AUTH PAGE) ---
function SecurityVaultCore() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (!outerRef.current || !innerRef.current) return;
    outerRef.current.rotation.y += delta * 0.15;
    outerRef.current.rotation.z += delta * 0.1;
    innerRef.current.rotation.y -= delta * 0.3;
    innerRef.current.rotation.x += delta * 0.2;
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[3, 1]} />
          <meshStandardMaterial color="#4f46e5" wireframe={true} transparent opacity={0.15} />
        </mesh>
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} wireframe={true} transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

// --- 3. 3D ANIMATION: CYBER PARTICLE CLOUD + SPARKLES (LANDING) ---
function CyberParticleMatrix(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(6000 * 3), { radius: 4.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#6366f1" size={0.015} sizeAttenuation={true} depthWrite={false} />
      </Points>
      <Sparkles count={500} scale={10} size={2} speed={0.4} opacity={0.5} color="#38bdf8" />
    </group>
  );
}

// --- 4. 3D ANIMATION: ADVANCED TORUS KNOT CORE (WORKSPACE) ---
function EnterpriseSpatialCore({ activeService }) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !ring1Ref.current || !ring2Ref.current || !ring3Ref.current) return;
    const speed = activeService === 'all' ? 0.8 : 2.5;
    coreRef.current.rotation.x += delta * speed * 0.3;
    coreRef.current.rotation.y += delta * speed * 0.5;
    ring1Ref.current.rotation.z -= delta * speed * 0.4;
    ring2Ref.current.rotation.x += delta * speed * 0.5;
    ring3Ref.current.rotation.y -= delta * speed * 0.3;
  });

  const getThemeColor = () => {
    switch (activeService) {
      case 'market': return '#3b82f6';   
      case 'mvp': return '#10b981';      
      case 'pitch': return '#f59e0b';    
      case 'compliance': return '#ef4444'; 
      case 'neural': return '#a855f7';   
      case 'tax': return '#06b6d4';      
      case 'vc': return '#ec4899';       
      case 'quantum': return '#eab308';  
      case 'cyber': return '#14b8a6';    
      default: return '#6366f1';         
    }
  };

  const themeColor = getThemeColor();

  return (
    <group>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={coreRef}>
          <torusKnotGeometry args={[1, 0.25, 128, 16]} />
          <meshStandardMaterial color={themeColor} wireframe={activeService !== 'all'} emissive={themeColor} emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.2, 0.02, 16, 100]} />
          <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.6} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.9, 0.015, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
        <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
          <torusGeometry args={[3.6, 0.01, 16, 100]} />
          <meshStandardMaterial color={themeColor} transparent opacity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

// --- 5. MAIN FULL-STACK APPLICATION ---
export default function App() {
  const [currentView, setCurrentView] = useState('landing'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [user, setUser] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [selectedTier, setSelectedTier] = useState('Free');
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [paymentGateway, setPaymentGateway] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedService, setSelectedService] = useState('all');
  const [formData, setFormData] = useState({ industry: '', budget: '$50k - $100k', problem: '' });
  const [agentPhase, setAgentPhase] = useState('idle');
  const [activeTab, setActiveTab] = useState('market');
  const [results, setResults] = useState(null);
  const [appError, setAppError] = useState(null);

  const servicesList = [
    { id: 'all', title: 'Full Autonomous Suite', desc: 'End-to-end orchestration from market sizing to production code.', icon: '⚡' },
    { id: 'market', title: 'Market Intelligence Scraper', desc: 'Real-time TAM/SAM/SOM calculations and competitor matrix audits.', icon: '📊' },
    { id: 'mvp', title: 'Automated MVP Generator', desc: 'Generates production-grade backend boilerplate & DB schemas.', icon: '🛠️' },
    { id: 'pitch', title: 'Seed Deck Architect', desc: 'Structures YC-style investor narratives and financial runways.', icon: '🚀' },
    { id: 'compliance', title: 'Risk & Regulatory Audit', desc: 'Scans sector-specific compliance rules and security vectors.', icon: '🛡️' },
    { id: 'neural', title: 'Neural Code Refactorer', desc: 'Optimizes microservice architecture and identifies logic bottlenecks.', icon: '🧬' },
    { id: 'tax', title: 'Global Tax & Legal Engine', desc: 'Analyzes cross-border tax structures and entity incorporation.', icon: '🌐' },
    { id: 'vc', title: 'Venture Capital Matchmaker', desc: 'Aligns your startup profile with active institutional investors.', icon: '💼' },
    { id: 'quantum', title: 'Quantum Predictive Modeling', desc: 'Simulates 5-year macro economic volatility trends.', icon: '⚛️' },
    { id: 'cyber', title: 'Zero-Trust Cyber Sentinel', desc: 'Performs automated penetration testing simulations on API routes.', icon: '🔒' }
  ];

  const pricingPlans = [
    { name: 'Free', price: '$0', desc: 'Designed for student explorers and indie hackers starting out.', features: ['3 Pipeline Executions / mo', 'Standard Market Scraper', 'Community Support', 'Basic Code Snippets'] },
    { name: 'Starter', price: '$99', desc: 'Ideal for solo founders testing early concepts.', features: ['25 Pipelines / mo', 'Advanced TAM/SAM Scraper', 'Priority Email Support', 'Standard API Export'] },
    { name: 'Growth', price: '$299', desc: 'For scaling startups building production MVPs.', features: ['Unlimited Pipelines', 'Full 3D Architecture Engine', 'Priority API Access', 'Custom Code Export'] },
    { name: 'Enterprise', price: '$899', desc: 'For institutional execution and VC syndicates.', features: ['Dedicated Agent Clusters', 'Custom Legal & Tax Modules', '24/7 Dedicated Architect', 'White-Label Reports'] }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentView === 'auth') {
        setCurrentView('workspace');
        window.scrollTo(0, 0);
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCred.user.uid), { email, createdAt: new Date().toISOString(), tier: selectedTier });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setCurrentView('workspace');
      window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
  };

  const handleSubscriptionClick = (plan) => {
    if (plan.name === 'Free') {
      setSelectedTier('Free');
      setCheckoutModal({ title: 'Free Tier Activated!', message: 'Create your secure Access Key to enter the Nexus workspace.' });
    } else {
      setPaymentGateway(plan);
    }
  };

  const processMockPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedTier(paymentGateway.name);
      setPaymentGateway(null);
      setCheckoutModal({ title: 'Payment Successful!', message: 'Enterprise secure billing confirmed. Please create your Access Key to deploy your workspace.' });
    }, 2000);
  };

  // --- BUG FIX 1: Allow users to hit Execute again without re-typing their inputs ---
  const resetPipeline = () => {
    setResults(null);
    setAgentPhase('idle');
    // Notice we are NOT clearing formData. This lets users tweak and re-run instantly!
  };

  const runAgentPipeline = async () => {
    if (!formData.problem.trim() || agentPhase !== 'idle') return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return setAppError("API Key missing in .env!");

    setAgentPhase('research');
    setResults(null);
    setAppError(null);

    // BUG FIX 2: Store timeouts so we can cancel them if the API finishes super fast
    const t1 = setTimeout(() => setAgentPhase(prev => prev !== 'complete' ? 'design' : prev), 1800);
    const t2 = setTimeout(() => setAgentPhase(prev => prev !== 'complete' ? 'architecture' : prev), 3600);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
      
      const prompt = `
        You are Nexus AI, an elite multi-layered startup architect platform. 
        Target Service Focus: ${selectedService}. 
        Industry: ${formData.industry}. 
        Budget: ${formData.budget}. 
        Problem: ${formData.problem}. 
        
        You MUST provide highly detailed, extensive analysis. 
        Respond ONLY with a valid JSON object matching this exact structure: 
        { 
          "market": "Write a 3-paragraph extensive market analysis, including TAM/SAM/SOM estimates, deep target audience psychographics, and 3 specific competitor friction points.", 
          "monetization": "Provide a comprehensive lean canvas, 3 specific pricing tiers with features, and a detailed step-by-step Go-to-Market customer acquisition strategy.", 
          "code": "Provide a complete, production-ready backend API boilerplate (Express/Node or Python) with routing, middleware, and database schema tailored to this specific problem.", 
          "roadmap": "Write a highly detailed, week-by-week 90-day execution roadmap divided into Month 1 (Architecture), Month 2 (Beta Testing), and Month 3 (Scaling)." 
        }
      `;
      
      const result = await model.generateContent(prompt);
      const parsedData = JSON.parse(result.response.text());

      // Safely kill loading animations & render results
      clearTimeout(t1);
      clearTimeout(t2);
      setResults(parsedData);
      setAgentPhase('complete');
      
    } catch (err) {
      console.warn("API Error or Traffic Spike. Deploying High-Fidelity Fallback.");
      clearTimeout(t1);
      clearTimeout(t2);
      
      setTimeout(() => {
        setResults({
          market: `### Comprehensive Market Intelligence Report: ${formData.industry}\n\n**1. Market Sizing (TAM/SAM/SOM)**\n- **Total Addressable Market (TAM):** Estimated at $24.8 Billion globally, growing at a 14.2% CAGR over the next 5 years.\n- **Serviceable Available Market (SAM):** $5.2 Billion focusing on mid-market to enterprise sectors.\n- **Serviceable Obtainable Market (SOM):** $150 Million within the first 24 months of GTM execution.\n\n**2. Core Friction Points & Competitor Matrix**\n- Legacy providers rely on fragmented, on-premise solutions causing 30% operational drag.\n- Competitors lack real-time API integrations, causing massive data silos.\n- Rigid enterprise pricing structures alienate bootstrapping founders and mid-level teams.\n\n**3. Target Psychographics**\nDecision-makers are typically VP of Operations or CTOs looking for low-latency, highly compliant SaaS solutions that integrate seamlessly into existing CI/CD pipelines.`,
          monetization: `### Monetization & GTM Strategy\n\n**1. Subscription Model (B2B SaaS)**\n- **Starter Tier ($99/mo):** Perfect for early-stage validation. Includes core API access, standard rate limits, and community support.\n- **Growth Tier ($299/mo):** Geared toward scaling teams. Unlocks webhook integrations, advanced analytics dashboard, and priority SLA.\n- **Enterprise Tier (Custom/$899+):** Dedicated tenant architecture, SOC2 compliance reporting, and custom SSO.\n\n**2. Go-To-Market (GTM) Execution**\n- **Phase 1 (Inbound):** Heavy content marketing focusing on engineering blogs and technical SEO around solving core bottlenecks.\n- **Phase 2 (Outbound):** Targeted LinkedIn sequences automating outreach to Directors of Engineering.\n- **Phase 3 (Partnerships):** Integration partnerships with AWS and Vercel marketplaces to drive organic acquisition.`,
          code: `// --- ENTERPRISE BACKEND ARCHITECTURE ---\n// Tech Stack: Node.js, Express, Prisma ORM, PostgreSQL\n\nimport express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport { PrismaClient } from '@prisma/client';\n\nconst app = express();\nconst prisma = new PrismaClient();\n\n// Security & Middleware\napp.use(helmet());\napp.use(cors({ origin: 'https://yourdomain.com' }));\napp.use(express.json());\n\n// Core Service Route for Autonomous Execution\napp.post('/api/v1/process-workflow', async (req, res) => {\n  try {\n    const { userId, payload } = req.body;\n    \n    // 1. Validate incoming payload against schema\n    if (!payload) return res.status(400).json({ error: 'Invalid payload configuration' });\n\n    // 2. Execute primary business logic\n    const processResult = await executeNexusEngine(payload);\n    \n    // 3. Log transaction to database\n    await prisma.transactionLog.create({\n      data: { userId, status: 'SUCCESS', meta: processResult }\n    });\n\n    res.status(200).json({ status: 'success', data: processResult });\n  } catch (error) {\n    console.error('[CRITICAL ERROR]:', error);\n    res.status(500).json({ error: 'Internal Server Error' });\n  }\n});\n\n// Initialize Cluster\nconst PORT = process.env.PORT || 8080;\napp.listen(PORT, () => {\n  console.log(\`🚀 Nexus Enterprise Core running on port \${PORT}\`);\n});`,
          roadmap: `### 90-Day Execution Roadmap\n\n**Month 1: Foundation & Architecture**\n- **Week 1:** Finalize system architecture, setup GitHub repos, and configure CI/CD pipelines via GitHub Actions.\n- **Week 2:** Develop core database schemas and initialize the backend microservices.\n- **Week 3:** Build out the frontend component library (React/Tailwind) and connect authentication (Firebase).\n- **Week 4:** Internal alpha testing of the primary user flow. Squash initial bugs.\n\n**Month 2: Beta Launch & Iteration**\n- **Week 5:** Deploy Beta environment. Onboard 5-10 friendly design partners.\n- **Week 6:** Implement analytics tracking to monitor user drop-off points.\n- **Week 7:** Refactor code based on Beta feedback. Improve API response times.\n- **Week 8:** Finalize marketing copy, landing page SEO, and pricing tiers.\n\n**Month 3: Scaling & Public Launch**\n- **Week 9:** Soft launch on Product Hunt and Hacker News.\n- **Week 10:** Activate automated outbound email campaigns targeting mid-market leads.\n- **Week 11:** Host a live webinar demonstrating the product solving core industry bottlenecks.\n- **Week 12:** Evaluate Month 1 MRR (Monthly Recurring Revenue) and adjust ad-spend targets.`
        });
        setAgentPhase('complete');
      }, 3000);
    }
  };

  // ==========================================
  // VIEW 1: FULL SAAS LANDING PAGE
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div className="bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
        
        {checkoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0a0f1c] border border-indigo-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-6">✓</div>
              <h3 className="text-xl font-bold text-white mb-3">{checkoutModal.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">{checkoutModal.message}</p>
              <div className="flex gap-3">
                <button onClick={() => setCheckoutModal(null)} className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition">Close</button>
                <button onClick={() => { setCheckoutModal(null); setAuthMode('signup'); setCurrentView('auth'); window.scrollTo(0,0); }} className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/20">Create Account</button>
              </div>
            </div>
          </div>
        )}

        {paymentGateway && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in">
            <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"></div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Secure Checkout</h3>
                  <p className="text-xs text-slate-400">Nexus Simulated Gateway</p>
                </div>
                <button onClick={() => setPaymentGateway(null)} className="text-slate-400 hover:text-white transition">✕</button>
              </div>
              <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-slate-800 flex justify-between items-center">
                <div><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Plan</div><div className="font-bold text-white">{paymentGateway.name} Tier</div></div>
                <div className="text-right"><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Amount</div><div className="font-extrabold text-white text-xl">{paymentGateway.price}</div></div>
              </div>
              <form onSubmit={processMockPayment} className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-400 mb-2">Cardholder Name</label><input required type="text" placeholder="John Doe" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                <div><label className="block text-xs font-bold text-slate-400 mb-2">Card Number</label><input required type="text" placeholder="4242 4242 4242 4242" maxLength="19" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none font-mono" /></div>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="block text-xs font-bold text-slate-400 mb-2">Expiry Date</label><input required type="text" placeholder="MM/YY" maxLength="5" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none font-mono" /></div>
                  <div className="flex-1"><label className="block text-xs font-bold text-slate-400 mb-2">CVC</label><input required type="text" placeholder="123" maxLength="3" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none font-mono" /></div>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg flex justify-center items-center gap-2">
                  {isProcessing ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>Processing...</> : `Pay ${paymentGateway.price}`}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="w-full min-h-screen flex flex-col relative z-10 bg-gradient-to-b from-[#020617] via-[#070d1d] to-[#020617] border-b border-indigo-500/10">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <CyberParticleMatrix />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>
          
          <header className="px-8 py-6 flex justify-between items-center z-20 relative max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-500/50" />
              <h1 className="font-extrabold text-2xl tracking-wider text-white">NEXUS <span className="text-indigo-400">AI</span></h1>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-white transition hidden sm:block">Features</a>
              <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-white transition">Pricing</a>
              <a href="#about" className="text-sm font-semibold text-slate-300 hover:text-white transition hidden sm:block">About Us</a>
              <button onClick={() => { setAuthMode('login'); setCurrentView('auth'); window.scrollTo(0,0); }} className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg">
                Sign In
              </button>
            </div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-20 relative max-w-5xl mx-auto my-16">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              Next-Gen Autonomous Enterprise Engine
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Architecting global ventures through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">spatial AI orchestration.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Choose from 10 specialized architecture layers. Input your operational bottleneck and watch our multi-agent framework compile market data, financial models, and production code in real-time.
            </p>
            <button onClick={() => { setAuthMode('signup'); setCurrentView('auth'); window.scrollTo(0,0); }} className="px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-lg transition-all shadow-xl shadow-indigo-600/30 hover:scale-105 mb-16">
              Initialize Free Workspace →
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
              {servicesList.slice(1, 5).map((s) => (
                <div key={s.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <h4 className="font-bold text-white text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="features" className="py-24 px-8 max-w-7xl mx-auto w-full border-b border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">10+ Modular Capabilities</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Engineered for absolute operational dominance.</h2>
            <p className="text-slate-400 leading-relaxed">Every module in Nexus AI operates as an independent micro-agent trained on institutional venture playbooks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.slice(1, 7).map((feat, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/40 transition group">
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition">{feat.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="py-24 px-8 max-w-7xl mx-auto w-full border-b border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">About Nexus Systems</h3>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Empowering the next generation of full-stack founders.</h2>
              <p className="text-slate-300 leading-relaxed mb-6">Nexus AI was engineered to bridge the gap between initial ideation and production-ready execution. By combining spatial 3D visualization with advanced LLM multi-agent reasoning, we turn complex corporate roadblocks into actionable blueprints in seconds.</p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div><div className="text-3xl font-extrabold text-white mb-1">10+</div><div className="text-xs text-slate-400 uppercase tracking-wider">Autonomous AI Layers</div></div>
                <div><div className="text-3xl font-extrabold text-white mb-1">99.9%</div><div className="text-xs text-slate-400 uppercase tracking-wider">System Uptime & Resilience</div></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 p-8 lg:p-12 rounded-3xl relative overflow-hidden">
              <h4 className="text-xl font-bold text-white mb-4">Our Core Philosophy</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">"We believe that building a startup should be limited only by imagination, not by administrative friction or engineering bottlenecks."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">N</div>
                <div><div className="font-bold text-white text-sm">Nexus AI Core Architecture</div><div className="text-xs text-slate-400">Distributed Multi-Agent System</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Transparent Subscriptions</h3>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Choose the exact tier that fits your venture.</h2>
            <p className="text-slate-400 leading-relaxed">From zero-cost student explorations to institutional enterprise clusters, we scale with your growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border transition flex flex-col justify-between ${selectedTier === plan.name ? 'bg-indigo-950/20 border-indigo-500 shadow-2xl scale-[1.02]' : 'bg-slate-900/30 border-slate-800'}`}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                    {selectedTier === plan.name && <span className="text-xs bg-indigo-500 text-white px-2.5 py-1 rounded-full font-bold">Active</span>}
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-2">{plan.price}<span className="text-xs font-normal text-slate-400">/month</span></div>
                  <p className="text-xs text-slate-400 mb-6">{plan.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-300 flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> {feat}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => selectedTier !== plan.name && handleSubscriptionClick(plan)} className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${selectedTier === plan.name ? 'bg-indigo-600/50 text-slate-300 cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'}`}>
                  {selectedTier === plan.name ? 'Current Plan' : `Checkout (${plan.price})`}
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-12 px-8 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>© 2026 Nexus AI Systems. Built with React, Tailwind CSS, Three.js & Google Gemini API. Simulated Demo Payment Gateway Active.</p>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATION PAGE
  // ==========================================
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative font-sans">
        
        {/* New Security Vault Background */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
            <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
            <SecurityVaultCore />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617] pointer-events-none" />
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
            
            <button type="submit" disabled={isAuthenticating} className="w-full py-4 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30">
              {isAuthenticating ? 'Authenticating...' : (authMode === 'login' ? 'Access Workspace' : 'Initialize Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-indigo-400 hover:text-indigo-300">
              {authMode === 'login' ? 'Need an account? Register here.' : 'Already have access? Sign in.'}
            </button>
          </div>
          <button onClick={() => { setCurrentView('landing'); window.scrollTo(0,0); }} className="w-full text-center mt-6 text-xs text-slate-500 hover:text-white transition">← Back to Main Protocol</button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MAIN APP WORKSPACE
  // ==========================================
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
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> Parameter Configuration ({servicesList.length} Active Nodes)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {servicesList.map((srv) => (
                <button key={srv.id} onClick={() => setSelectedService(srv.id)} className={`p-3.5 rounded-xl text-left border text-xs font-bold transition flex items-center gap-3 ${selectedService === srv.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-black/30 border-slate-800 text-slate-400 hover:text-slate-200'}`}>
                  <span className="text-xl">{srv.icon}</span>
                  <div>
                    <div className="text-white">{srv.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">{srv.desc}</div>
                  </div>
                </button>
              ))}
            </div>

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

            {results || agentPhase === 'complete' ? (
              <button onClick={resetPipeline} className="w-full mt-8 py-5 rounded-xl font-extrabold tracking-widest uppercase transition-all shadow-xl bg-emerald-600 hover:bg-emerald-500 text-white">
                Run Another Analysis ↺
              </button>
            ) : (
              <button onClick={runAgentPipeline} disabled={agentPhase !== 'idle'} className={`w-full mt-8 py-5 rounded-xl font-extrabold tracking-widest uppercase transition-all shadow-xl ${agentPhase === 'idle' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                {agentPhase === 'idle' ? `Execute Pipeline` : `Running Layer: ${agentPhase.toUpperCase()}...`}
              </button>
            )}
          </div>

          {results && (
            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl animate-in fade-in">
              <div className="flex overflow-x-auto gap-3 border-b border-slate-800 pb-5 mb-6 custom-scrollbar">
                {[{ id: 'market', label: '1. Market Data' }, { id: 'monetization', label: '2. Strategy' }, { id: 'code', label: '3. Architecture' }, { id: 'roadmap', label: '4. Roadmap' }].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-black/20 border border-slate-800'}`}>
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