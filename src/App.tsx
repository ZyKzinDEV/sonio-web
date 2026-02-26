import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play, Headphones, Radio, Download, ChevronRight, Menu, X, Star, Zap, Shield, Smartphone, Globe, Moon, Sun, Loader2, WifiOff, LaptopMinimal, MonitorDown } from 'lucide-react';
import { baseEnglish, TranslationType } from './translations';
import { translateDictionary } from './services/translationService';

const LanguageContext = createContext<{
  lang: string;
  setLang: (lang: string) => void;
  detectedLang: string;
  t: TranslationType;
  isTranslating: boolean;
}>({
  lang: 'en',
  setLang: () => {},
  detectedLang: 'en',
  t: baseEnglish,
  isTranslating: false
});

const useLanguage = () => useContext(LanguageContext);

const ThemeContext = createContext<{
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {}
});

const useTheme = () => useContext(ThemeContext);

const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const download = async (platform: 'desktop' | 'android') => {
    setIsDownloading(platform);
    // Add a small delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
      // Create a dummy binary file to make the download feel real (e.g., 45MB for desktop, 25MB for android)
      const dummySize = platform === 'desktop' ? 1024 * 1024 * 45 : 1024 * 1024 * 25; 
      const dummyData = new Uint8Array(dummySize); 
      const blob = new Blob([dummyData], { type: 'application/octet-stream' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = platform === 'desktop' ? 'SonioSetup-v2.0.0.exe' : 'Sonio-v2.0.0.apk';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsDownloading(null);
    }
  };

  return { download, isDownloading };
};

const LogoIcon = ({ className = "", style }: { className?: string, style?: React.CSSProperties }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!imgError) {
    return <img src="/logo.png" alt="Sonio" className={className} style={style} onError={() => setImgError(true)} />;
  }
  
  return (
    <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <linearGradient id="sonio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#70D6FF" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <path d="M 95 55 C 95 30, 70 25, 55 25 C 30 25, 25 45, 25 60 C 25 85, 55 90, 70 90 C 95 90, 105 110, 105 125 C 105 150, 80 155, 60 155 C 35 155, 25 135, 25 120" stroke="url(#sonio-grad)" strokeWidth="24" strokeLinecap="round" />
      <path d="M 105 40 A 35 35 0 0 1 130 65" stroke="url(#sonio-grad)" strokeWidth="14" strokeLinecap="round" />
      <path d="M 125 20 A 60 60 0 0 1 155 50" stroke="url(#sonio-grad)" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
};

const Logo = () => (
  <div className="flex items-center gap-2">
    <LogoIcon className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,198,255,0.5)]" />
    <span className="font-display font-bold text-2xl tracking-tight text-black dark:text-white">Sonio</span>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { lang, setLang, detectedLang, t, isTranslating } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { download, isDownloading } = useDownload();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = (newLang: string) => {
    setLang(newLang);
    setIsLangMenuOpen(false);
  };

  const getLangName = (code: string) => {
    try {
      const name = new Intl.DisplayNames([code], { type: 'language' }).of(code) || code;
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return code.toUpperCase();
    }
  };

  // Show English and the detected language. If English is detected, show all options as fallback.
  const options = detectedLang === 'en' ? ['en'] : ['en', detectedLang];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-sonio-bg/80 dark:bg-sonio-bg/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">{t.nav.features}</a>
          <a href="#support" className="text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">{t.nav.support}</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors uppercase"
            >
              {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {lang}
            </button>
            {isLangMenuOpen && options.length > 1 && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1">
                {options.map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => toggleLang(opt)} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 ${lang === opt ? 'text-sonio-blue dark:text-sonio-light' : 'text-black dark:text-white'}`}
                  >
                    {getLangName(opt)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* <button className="text-sm font-medium text-black dark:text-white hover:text-sonio-blue dark:hover:text-sonio-light transition-colors">{t.nav.login}</button> */}
          <button 
            onClick={() => download('desktop')}
            disabled={isDownloading !== null}
            className="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isDownloading === 'desktop' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.nav.download}
          </button>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 text-black/70 dark:text-white/70"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-sonio-bg border-b border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden"
        >
          {options.length > 1 && (
            <div className="flex gap-2 mb-2">
              {options.map((opt) => (
                <button 
                  key={opt}
                  onClick={() => toggleLang(opt)} 
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${lang === opt ? 'bg-sonio-blue text-white' : 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70'}`}
                >
                  {isTranslating && lang === opt && <Loader2 className="w-3 h-3 animate-spin" />}
                  {opt}
                </button>
              ))}
            </div>
          )}
          <a href="#features" className="text-lg font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">{t.nav.features}</a>
          <a href="#support" className="text-lg font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">{t.nav.support}</a>
          <hr className="border-black/10 dark:border-white/10 my-2" />
          <button 
            onClick={() => download('desktop')}
            disabled={isDownloading !== null}
            className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-full text-sm font-semibold w-full flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isDownloading === 'desktop' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.nav.download}
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const rotateX = useTransform(scrollY, [0, 1000], [15, 5]);
  const { t } = useLanguage();
  const { download, isDownloading } = useDownload();

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden perspective-1000">
      {/* Background Orbs */}
      <div className="glow-orb w-[600px] h-[600px] bg-sonio-blue/30 top-[-10%] left-[-10%]" />
      <div className="glow-orb w-[500px] h-[500px] bg-sonio-light/20 bottom-[-10%] right-[-10%]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-sonio-blue dark:bg-sonio-light animate-pulse" />
            <span className="text-xr font-medium text-black/80 dark:text-white/80 uppercase tracking-wider">{t.hero.badge}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6 text-black dark:text-white">
            {t.hero.title1}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonio-blue to-sonio-light">
              {t.hero.title2}
            </span>
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60 mb-8 max-w-lg leading-relaxed">
            {t.hero.desc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => download('desktop')}
              disabled={isDownloading !== null}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-sonio-blue to-sonio-light text-white px-8 py-4 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(0,198,255,0.4)] transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isDownloading === 'desktop' ? <Loader2 className="w-5 h-5 animate-spin" /> : <MonitorDown className="w-5 h-5" />}
              {t.hero.dlDesktop}
            </button>
            <button 
              onClick={() => download('android')}
              disabled={isDownloading !== null}
              className="flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-black dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-all backdrop-blur-sm border border-black/10 dark:border-white/5 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isDownloading === 'android' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
              {t.hero.dlAndroid}
            </button>
          </div>
          
          <div className="mt-10 flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://picsum.photos/seed/${i}/100/100`} alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-sonio-bg" referrerPolicy="no-referrer" />
              ))}
            </div>
            <p>{t.hero.users}</p>
          </div>
        </motion.div>

        <motion.div 
          className="relative h-[600px] hidden lg:flex items-center justify-center preserve-3d"
          style={{ y: y1, rotateX }}
        >
          {/* 3D Animated Logo */}
          <motion.div 
            className="relative w-[400px] h-[400px] flex items-center justify-center preserve-3d"
            animate={{ 
              y: [0, -30, 0],
              rotateY: [-20, 20, -20],
              rotateX: [10, -10, 10]
            }}
            transition={{ 
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Deep background glow */}
            <div 
              className="absolute inset-0 bg-sonio-blue/30 rounded-full blur-[100px] animate-pulse" 
              style={{ transform: 'translateZ(-50px)' }} 
            />
            
            {/* The Logo itself with 3D translation */}
            <LogoIcon 
              className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(0,198,255,0.6)] relative z-10" 
              style={{ transform: 'translateZ(50px)' }} 
            />
            
            {/* Floating particles/accents around the logo */}
            <motion.div 
              className="absolute w-8 h-8 rounded-full bg-sonio-light/50 blur-md"
              animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ top: '10%', right: '10%', transform: 'translateZ(80px)' }}
            />
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-sonio-blue/40 blur-lg"
              animate={{ y: [0, 40, 0], x: [0, -40, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ bottom: '10%', left: '10%', transform: 'translateZ(100px)' }}
            />
          </motion.div>

          {/* Floating Elements */}
          <motion.div 
            className="absolute top-20 -left-10 bg-white/80 dark:bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-4"
            style={{ y: y2 }}
          >
            <div className="w-12 h-12 rounded-full bg-sonio-blue/10 dark:bg-sonio-blue/20 flex items-center justify-center text-sonio-blue dark:text-sonio-light">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-black dark:text-white">{t.hero.lossless}</p>
              <p className="text-xs text-black/60 dark:text-white/60">{t.hero.losslessDesc}</p>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-40 -right-10 bg-white/80 dark:bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl flex items-center gap-4"
            style={{ y: y1 }}
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-black dark:text-white">{t.hero.radio}</p>
              <p className="text-xs text-black/60 dark:text-white/60">{t.hero.radioDesc}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-sonio-light" />,
      title: t.features.f1Title,
      description: t.features.f1Desc,
      className: "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-sonio-blue/10 to-transparent",
      image: "https://static.vecteezy.com/system/resources/previews/067/404/692/non_2x/3d-render-of-a-glossy-blue-lightning-bolt-symbol-fast-speed-energy-power-icon-free-png.png"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: t.features.f2Title,
      description: t.features.f2Desc,
      className: "md:col-span-1 lg:col-span-1",
      image: "https://img.pikbest.com/png-images/20240611/3d-star-icon-vector-illustration_10611212.png!sw800"
    },
    {
      icon: <WifiOff className="w-8 h-8 text-emerald-400" />,
      title: t.features.f3Title,
      description: t.features.f3Desc,
      className: "md:col-span-1 lg:col-span-1",
      image: "https://static.vecteezy.com/system/resources/previews/012/794/458/non_2x/3d-download-icon-rendered-object-illustration-png.png"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-400" />,
      title: t.features.f4Title,
      description: t.features.f4Desc,
      className: "md:col-span-2 lg:col-span-2 bg-gradient-to-tl from-purple-500/10 to-transparent",
      image: "https://static.vecteezy.com/system/resources/previews/029/726/216/non_2x/3d-purple-illustration-icon-of-using-smartphone-for-sign-up-or-login-to-profile-account-with-security-padlock-side-free-png.png"
    }
  ];

  return (
    <section id="features" className="py-32 relative bg-zinc-50 dark:bg-transparent transition-colors duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sonio-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8">
              <span className="text-sm font-bold text-black/80 dark:text-white/80 uppercase tracking-widest">Features</span>
            </div> */}
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-black dark:text-white tracking-tight">{t.features.title}</h2>
            <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
              {t.features.desc}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[minmax(300px,auto)]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all group shadow-xl shadow-black/5 dark:shadow-none flex flex-col justify-between ${feature.className}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                  {feature.icon}
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">{feature.title}</h3>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed text-lg max-w-md">{feature.description}</p>
                </div>
              </div>
              
              {/* Decorative image that peeks out on hover */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full overflow-hidden opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-all duration-700 group-hover:-translate-y-10 group-hover:-translate-x-10 blur-xl group-hover:blur-md">
                <img src={feature.image} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Showcase = () => {
  const { t } = useLanguage();
  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      <div className="glow-orb w-[800px] h-[800px] bg-sonio-blue/10 dark:bg-sonio-blue/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[3rem] p-8 md:p-16 overflow-hidden relative shadow-2xl shadow-black/5 dark:shadow-none"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-black dark:text-white tracking-tight">{t.showcase.title}</h2>
              <p className="text-lg text-black/60 dark:text-white/60 mb-10 leading-relaxed">
                {t.showcase.desc}
              </p>
              <ul className="space-y-6">
                {t.showcase.items.map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-sonio-blue/10 dark:bg-sonio-blue/20 flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-sonio-blue dark:bg-sonio-light" />
                    </div>
                    <span className="font-medium text-lg text-black dark:text-white">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <motion.div 
                className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src="https://picsum.photos/seed/appui/800/1000" alt="App Interface" className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <h4 className="text-3xl font-bold text-white mb-1">Midnight City</h4>
                      <p className="text-white/70 text-lg">M83</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                      <Play className="w-7 h-7 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Lyrics Widget */}
              <motion.div 
                className="absolute -left-6 md:-left-12 top-1/4 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl w-56 hidden sm:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-black/40 dark:text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Lyrics</p>
                <p className="text-black dark:text-white font-medium text-sm leading-relaxed">"Waiting in a car<br/>Waiting for a ride in the dark"</p>
              </motion.div>

              {/* Floating EQ Widget */}
              <motion.div 
                className="absolute -right-6 md:-right-12 bottom-1/3 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl flex gap-1.5 items-end h-20 hidden sm:flex"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                {[40, 70, 40, 90, 60].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="w-2 bg-sonio-blue dark:bg-sonio-light rounded-t-sm"
                    animate={{ height: [`${h}%`, `${Math.max(20, h - 30)}%`, `${h}%`] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { t } = useLanguage();
  const { download, isDownloading } = useDownload();
  return (
    <section className="py-32 relative bg-white dark:bg-transparent transition-colors duration-300 overflow-hidden">
      {/* Massive background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] select-none">
        <h2 className="text-[20vw] font-black tracking-tighter">SONIO</h2>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-br from-sonio-blue/10 via-transparent to-sonio-light/10 dark:from-sonio-dark dark:via-black dark:to-black border border-sonio-blue/20 dark:border-white/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-sonio-blue/5 dark:shadow-none"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-sonio-light/20 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sonio-blue/20 rounded-full blur-[100px] mix-blend-screen" />
          
          <div className="relative z-10">
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 text-black dark:text-white tracking-tight">{t.cta.title}</h2>
            <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.cta.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => download('desktop')}
                disabled={isDownloading !== null}
                className="flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isDownloading === 'desktop' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                {t.hero.dlDesktop}
              </button>
              <button 
                onClick={() => download('android')}
                disabled={isDownloading !== null}
                className="flex items-center justify-center gap-3 bg-white dark:bg-white/10 text-black dark:text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-zinc-50 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/10 shadow-sm disabled:opacity-70"
              >
                {isDownloading === 'android' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                {t.hero.dlAndroid}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-black pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-6 text-black/50 dark:text-white/50 max-w-xs">
              {t.footer.desc}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-black dark:text-white">{t.footer.company}</h4>
            <ul className="space-y-3 text-black/60 dark:text-white/60 text-sm">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.about}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.jobs}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.record}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-black dark:text-white">{t.footer.communities}</h4>
            <ul className="space-y-3 text-black/60 dark:text-white/60 text-sm">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.artists}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.devs}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.ads}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.investors}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-black dark:text-white">{t.footer.links}</h4>
            <ul className="space-y-3 text-black/60 dark:text-white/60 text-sm">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.support}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.webPlayer}</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.freeApp}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-black/10 dark:border-white/10 text-xs text-black/40 dark:text-white/40">
          <ul className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.legal}</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.privacyCenter}</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.privacyPolicy}</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.cookies}</a></li>
            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.aboutAds}</a></li>
          </ul>
          <p>&copy; 2026 Sonio AB</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState<string>('en');
  const [detectedLang, setDetectedLang] = useState<string>('en');
  const [t, setT] = useState<TranslationType>(baseEnglish);
  const [isTranslating, setIsTranslating] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const baseStr = JSON.stringify(baseEnglish);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    setDetectedLang(browserLang);
    
    if (browserLang !== 'en') {
      setLang(browserLang);
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('sonio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const loadTranslation = async () => {
      if (lang === 'en') {
        setT(baseEnglish);
        return;
      }

      const cached = localStorage.getItem(`sonio_dict_${lang}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Check if the cached translation matches the current base English text
          if (parsed._baseStr === baseStr && parsed.data) {
            setT(parsed.data);
            return;
          }
        } catch (e) {}
      }

      setIsTranslating(true);
      const translated = await translateDictionary(baseEnglish, lang);
      if (translated) {
        // Save both the translation and the base string it was generated from
        localStorage.setItem(`sonio_dict_${lang}`, JSON.stringify({
          _baseStr: baseStr,
          data: translated
        }));
        setT(translated);
      } else {
        setLang('en');
        setT(baseEnglish);
      }
      setIsTranslating(false);
    };

    loadTranslation();
  }, [lang, baseStr]);

  const handleSetLang = (newLang: string) => {
    setLang(newLang);
  };

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sonio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, setLang: handleSetLang, detectedLang, t, isTranslating }}>
        <div className="min-h-screen bg-white dark:bg-sonio-bg text-black dark:text-white font-sans selection:bg-sonio-blue/30 transition-colors duration-300">
          <Navbar />
          <Hero />
          <Features />
          <CTA />
          <Footer />
        </div>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
