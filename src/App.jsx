import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Copy, FileWarning, ShieldCheck, Scale, Camera, PieChart,
  ArrowRight, Download, Lightbulb, Search, Wrench, CheckCircle, Presentation,
  User, Users, Star, Target, PenTool, Hammer, TrendingUp, X, Image as ImageIcon, Loader,
  MapPin, Layers, CheckSquare, Zap, AlertCircle, Link, PlayCircle, BarChart
} from 'lucide-react';

// --- Firebase Initialization ---
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnSj05sE_daFrXocr_eusc2kdn2BcQwWI",
  authDomain: "scaffolded-logbook-research.firebaseapp.com",
  databaseURL: "https://scaffolded-logbook-research-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scaffolded-logbook-research",
  storageBucket: "scaffolded-logbook-research.firebasestorage.app",
  messagingSenderId: "151775571910",
  appId: "1:151775571910:web:91e3561f7d2e62ff7e4cc7",
  measurementId: "G-TLJ192MRLC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = 'scaffolded-logbook-research';

// ----- UI Sub-Components -----

const SectionHeading = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center mb-16"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
  </motion.div>
);

const TimelineItem = ({ week, title, role, desc, icon: Icon, isLast }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex relative group cursor-default"
  >
    {!isLast && (
      <div className="absolute top-10 left-[1.1rem] md:left-[2.1rem] w-1 h-full bg-blue-100 -z-10 group-hover:bg-amber-300 transition-colors duration-500"></div>
    )}
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-md z-10 group-hover:bg-amber-500 transition-colors duration-300"
    >
      <Icon size={24} className="hidden md:block" />
      <span className="md:hidden font-bold">{week}</span>
    </motion.div>
    <div className="ml-6 md:ml-8 pb-12 pt-1 md:pt-3 flex-1">
      <div className="flex items-baseline gap-3 mb-1">
        <h4 className="text-lg md:text-xl font-bold text-blue-900 group-hover:text-amber-600 transition-colors duration-300">Week {week}: {role}</h4>
      </div>
      <h5 className="text-md font-medium text-blue-600 mb-2">{title}</h5>
      <motion.p
        whileHover={{ scale: 1.02 }}
        className="text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-50 group-hover:shadow-md transition-all duration-300"
      >
        {desc}
      </motion.p>
    </div>
  </motion.div>
);

const SmartCarousel = ({ basePath, setLightboxImage, className = "w-full h-full object-cover absolute top-0 left-0", containerClassName = "relative w-full h-full bg-slate-100 cursor-pointer overflow-hidden group" }) => {
  const [validImages, setValidImages] = useState([`${basePath}.jpg`, `${basePath}1.jpg`, `${basePath}2.jpg`, `${basePath}3.jpg`]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [validImages.length]);

  const handleError = (imgSrc) => {
    setValidImages(prev => {
      const filtered = prev.filter(src => src !== imgSrc);
      if (currentIndex >= filtered.length) {
        setCurrentIndex(0);
      }
      return filtered;
    });
  };

  if (validImages.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-100 ${containerClassName}`}>
        <Camera size={24} className="mb-2 opacity-50" />
        Missing images
      </div>
    );
  }

  return (
    <div
      className={containerClassName}
      onClick={() => setLightboxImage(validImages[currentIndex])}
    >
      {validImages.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`Carousel ${idx}`}
          className={`${className} transition-all duration-700 ease-in-out group-hover:scale-105 ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          onError={() => handleError(src)}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="bg-black/50 p-3 rounded-full drop-shadow-lg backdrop-blur-sm">
          <Search size={24} className="text-white" />
        </div>
      </div>
      {validImages.length > 1 && (
        <div className="absolute bottom-2 w-full flex justify-center gap-1.5 z-20">
          {validImages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// FIX #2: Moved ProjectDetailModal OUTSIDE the parent component.
// Defining it inside caused React to unmount/remount the modal DOM on every
// parent state change (e.g., teamcard hover), resetting scroll position and
// triggering flicker. Passing selectedTeam & onClose as props is the correct pattern.
const ProjectDetailModal = ({ selectedTeam, evaluations = [], onClose }) => {
  const [activeTab, setActiveTab] = useState('w1');
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!selectedTeam) return null;

  const teamName = selectedTeam.teamName || 'ไม่ระบุชื่อทีม';
  const d = selectedTeam.data || {};
  const w1 = d.w1 || {};
  const w2 = d.w2 || {};
  const w3 = d.w3 || {};
  const w4 = d.w4 || {};
  const w5 = d.w5 || {};
  const ref = d.reflection || {};
  const members = selectedTeam.members || [];

  const teamEvals = evaluations.filter(ev =>
    members.some(m => m.uid === ev.uid || m.studentId === ev.studentId || m.fullName === ev.displayName)
  );

  const tabs = [
    { id: 'w1', label: 'W1: นักล่าปัญหา', icon: Target },
    { id: 'w2', label: 'W2: นักออกแบบ', icon: PenTool },
    { id: 'w3', label: 'W3: นักสร้าง', icon: Hammer },
    { id: 'w4', label: 'W4: นักทดสอบ', icon: Search },
    { id: 'w5', label: 'W5: นำเสนอ', icon: Lightbulb },
    { id: 'ref', label: 'Reflection', icon: Star },
  ];

  const ImageLightbox = () => {
    if (!lightboxImage) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
        <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition"><X size={32} /></button>
        <img src={lightboxImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in duration-200" alt="Fullscreen Evidence" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <ImageLightbox />
      <div className="bg-slate-50 w-[96vw] max-w-7xl h-[96vh] sm:h-[90vh] lg:aspect-video rounded-2xl shadow-2xl overflow-hidden flex flex-col relative" style={{ animation: 'modalPop 0.2s ease-out both' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 shrink-0 flex justify-between items-start text-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500 text-amber-950 text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">Live Showcase</span>
              <span className="text-blue-200 text-sm font-medium">ทีม: {teamName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">{w5.projectName || w1.projectName || 'โครงงานไร้ชื่อ'}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map((m, i) => (
                <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><User size={12} /> {m.fullName}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-white border-b border-slate-200 shrink-0 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors border-b-4 ${activeTab === tab.id
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">

          {/* TAB 1: W1 */}
          {activeTab === 'w1' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-blue-900 mb-4 border-b pb-2 flex items-center gap-2"><Target size={20} /> ภาพรวมปัญหา</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Project Name</span>
                      <p className="text-base font-medium text-slate-800">{w1.projectName || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">ผู้ที่ได้รับผลกระทบ (Affected People)</span>
                      <p className="text-sm bg-blue-50 text-blue-800 p-2 rounded">{w1.affectedPeople || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</p>
                    </div>
                  </div>
                </div>
                {w1.problemImage && (
                  <div className="md:w-1/3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative group cursor-pointer" onClick={() => setLightboxImage(w1.problemImage)}>
                    <img src={w1.problemImage} alt="Problem" className="w-full h-40 object-cover rounded-xl group-hover:opacity-80 transition" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={32} className="text-white drop-shadow-lg" /></div>
                    <span className="text-xs text-slate-500 mt-2 font-medium">ภาพประกอบปัญหา (Click to Expand)</span>
                  </div>
                )}
              </div>

              {/* 5W1H Grid */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-indigo-900 mb-4 border-b pb-2 flex items-center gap-2"><MapPin size={20} /> วิเคราะห์ 5W1H</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { l: 'Who', v: w1.who }, { l: 'What', v: w1.what }, { l: 'Where', v: w1.where },
                    { l: 'When', v: w1.when }, { l: 'Why', v: w1.why5w1h || w1.why }, { l: 'How', v: w1.how }
                  ].map((it, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-black text-indigo-400 mb-1 block">{it.l}</span>
                      <p className="text-sm text-slate-700">{it.v || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Whys & Root Cause */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-purple-900 mb-4 border-b pb-2 flex items-center gap-2"><Layers size={20} /> เจาะลึก 5 Whys หาต้นตอ</h3>
                <div className="space-y-3 mb-6 pl-4 border-l-2 border-purple-200">
                  {[w1.why1, w1.why2, w1.why3, w1.why4, w1.why5].map((why, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-white"></div>
                      <span className="text-xs font-bold text-purple-500">Why {i + 1}: </span>
                      <span className="text-sm text-slate-700">{why || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-red-50 text-red-900 to-orange-50 p-4 rounded-xl border border-red-200 shadow-inner">
                  <span className="text-xs font-black text-red-500 uppercase block mb-1">Root Cause (สาเหตุที่แท้จริง)</span>
                  <p className="font-bold text-lg">{w1.rootCause || <span className="text-red-300 italic">ไม่มีข้อมูล</span>}</p>
                </div>
              </div>

              {/* Peer Ratings (W1) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-pink-900 mb-4 border-b pb-2 flex items-center gap-2"><Users size={20} /> Peer Ratings (ประเมินไอเดียจากทีมอื่น)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.isArray(w1.peerRatings) && w1.peerRatings.length > 0 ? (
                    w1.peerRatings.map((pr, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-blue-900">
                          <User size={16} /> <span className="text-sm">{pr.evaluatorName || 'ผู้ประเมินไม่ระบุชื่อ'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1">ความชัดเจน: <Star size={12} className="text-amber-400" fill="currentColor" />{pr.clarityScore || '-'}</span>
                          <span className="flex items-center gap-1">ความสมเหตุสมผล: <Star size={12} className="text-amber-400" fill="currentColor" />{pr.logicScore || '-'}</span>
                          <span className="flex items-center gap-1">การนำเสนอ: <Star size={12} className="text-amber-400" fill="currentColor" />{pr.presentationScore || '-'}</span>
                        </div>
                        <div className="text-sm text-slate-600 bg-white p-2 border border-slate-100 rounded italic mt-2">
                          "{pr.feedback || 'ไม่มีข้อเสนอแนะเพิ่มเติม'}"
                        </div>
                      </div>
                    ))
                  ) : <p className="text-sm text-slate-400 italic">ยังไม่มีการประเมินจากเพื่อนร่วมชั้น</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: W2 */}
          {activeTab === 'w2' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-teal-900 flex items-center gap-2 mb-1"><CheckSquare size={20} /> วิธีแก้ปัญหาที่เลือก (Chosen Solution)</h3>
                  <p className="text-xl font-bold text-teal-700">{w2.solutions?.solutionA?.name || w2.solutionName || <span className="text-slate-400 italic font-normal">ไม่มีข้อมูล</span>}</p>
                </div>
                {w2.track && (
                  <span className="px-4 py-2 bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200">
                    Track: {w2.track === 'invention' ? 'สิ่งประดิษฐ์ (Invention)' : w2.track === 'application' ? 'แอปพลิเคชัน (Application)' : w2.track}
                  </span>
                )}
              </div>

              {/* Reality Check */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-emerald-900 mb-4 border-b pb-2 flex items-center gap-2"><CheckCircle size={20} /> Reality Check (การตรวจสอบความเป็นไปได้)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { l: 'ทักษะที่มี / ความรู้ที่ต้องหาเพิ่ม (Skill Gap)', v: w2.realityCheck?.skillGap, c: 'emerald' },
                    { l: 'การจัดการเวลา (Time Management)', v: w2.realityCheck?.timeManagement, c: 'emerald' },
                    { l: 'การประเมินความเสี่ยง (Risk Assessment)', v: w2.realityCheck?.riskAssessment, c: 'emerald' },
                    { l: 'คุณค่าของผลงาน (Value Proposition)', v: w2.realityCheck?.valueProposition, c: 'emerald' }
                  ].map((it, i) => (
                    <div key={i} className={`bg-${it.c}-50 p-4 rounded-xl border border-${it.c}-100`}>
                      <span className={`text-xs font-bold text-${it.c}-700 block mb-2`}>{it.l}</span>
                      <p className="text-sm text-slate-700">{it.v || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images & BOM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><ImageIcon size={20} /> ภาพร่าง (Wireframes / UserFlow)</h3>
                  <div className="flex flex-col gap-6">
                    {(w2.userFlowImage || w2.blueprintImage) && (
                      <div>
                        <span className="text-xs font-bold text-slate-500 mb-2 block">User Flow & Blueprint:</span>
                        <div className="relative group cursor-pointer" onClick={() => setLightboxImage(w2.userFlowImage || w2.blueprintImage)}>
                          <img src={w2.userFlowImage || w2.blueprintImage} alt="UserFlow" className="w-full h-48 object-contain bg-slate-50 rounded-xl border group-hover:opacity-80 transition" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={32} className="text-white drop-shadow-lg" /></div>
                        </div>
                      </div>
                    )}

                    {w2.wireframes && (
                      <div className="mt-2 pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-500 mb-3 block">Wireframes (หน้าจอฉบับร่าง):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['home', 'action', 'result'].map(k => w2.wireframes[k] ? (
                            <div key={k} className="flex flex-col gap-1">
                              <div className="relative group cursor-pointer" onClick={() => setLightboxImage(w2.wireframes[k])}>
                                <img src={w2.wireframes[k]} alt={`Wireframe ${k}`} className="w-full h-24 object-cover bg-slate-50 rounded border group-hover:opacity-80 transition" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={16} className="text-white shadow-sm" /></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase text-center">{k}</span>
                              {w2.wireframeNotes && w2.wireframeNotes[k] && (
                                <div className="text-[10px] text-slate-600 text-left w-full leading-tight bg-slate-50 p-2 rounded border border-slate-100/50">
                                  {typeof w2.wireframeNotes[k] === 'object' && w2.wireframeNotes[k] !== null ? (
                                    <div className="space-y-1">
                                      {w2.wireframeNotes[k].action && <p><span className="font-bold text-slate-700">Action:</span> {w2.wireframeNotes[k].action}</p>}
                                      {w2.wireframeNotes[k].reaction && <p><span className="font-bold text-slate-700">Reaction:</span> {w2.wireframeNotes[k].reaction}</p>}
                                      {w2.wireframeNotes[k].description && <p>{w2.wireframeNotes[k].description}</p>}
                                      {!w2.wireframeNotes[k].action && !w2.wireframeNotes[k].reaction && !w2.wireframeNotes[k].description && <p className="text-center italic text-slate-400">"{JSON.stringify(w2.wireframeNotes[k])}"</p>}
                                    </div>
                                  ) : (
                                    <p className="text-center">"{w2.wireframeNotes[k]}"</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null)}
                        </div>
                      </div>
                    )}

                    {!w2.userFlowImage && !w2.blueprintImage && !w2.wireframes && (
                      <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลการออกแบบ</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-amber-900 mb-4 border-b pb-2 flex items-center gap-2"><Layers size={20} /> รายการวัสดุอุปกรณ์ (BOM)</h3>
                  {Array.isArray(w2.bom) && w2.bom.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr><th className="p-2">รายการ</th><th className="p-2">จำนวน</th><th className="p-2 text-right">ราคา</th></tr>
                        </thead>
                        <tbody>
                          {w2.bom.map((item, i) => (
                            <tr key={i} className="border-b border-slate-100">
                              <td className="p-2">{typeof item === 'object' ? item.item || item.name || '-' : item}</td>
                              <td className="p-2">{typeof item === 'object' ? item.quantity || 1 : '-'}</td>
                              <td className="p-2 text-right">{typeof item === 'object' ? item.price || 0 : 0} ฿</td>
                            </tr>
                          ))}
                          <tr className="bg-amber-50 font-bold text-amber-900 border-t-2 border-amber-200">
                            <td className="p-2" colSpan="2">รวมทั้งหมด</td>
                            <td className="p-2 text-right">{w2.bom.reduce((sum, item) => sum + (typeof item === 'object' ? Number(item.price) || 0 : 0), 0)} ฿</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลรายการวัสดุ (BOM)</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: W3 */}
          {activeTab === 'w3' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-blue-900 mb-4 border-b pb-2 flex items-center gap-2"><Target size={20} /> เป้าหมายการทำงาน (Daily Goal)</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded-lg">{w3.dailyGoal || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}</p>
                    <div>
                      <span className="text-xs font-bold text-slate-500 mb-1 block">ผลสำเร็จตามเป้าหมาย (Goal Achievement)</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${w3.goalAchievement === 'full' ? 'bg-green-100 text-green-700' : w3.goalAchievement === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {w3.goalAchievement === 'full' ? 'สำเร็จครบถ้วน' : w3.goalAchievement === 'partial' ? 'สำเร็จบางส่วน' : w3.goalAchievement || 'ไม่ระบุ'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-indigo-900 mb-4 border-b pb-2 flex items-center gap-2"><Zap size={20} /> ความคืบหน้า (Progress)</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-4xl font-black text-indigo-600">{w3.progressPercentage || 0}%</div>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${w3.progressPercentage || 0}%` }}></div>
                    </div>
                  </div>
                  {(w3.softwareTools || w3.repoLink) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <p className="text-xs text-slate-500"><span className="font-bold">เครื่องมือ:</span> {w3.softwareTools || '-'}</p>
                      {w3.repoLink && <p className="text-xs text-slate-500"><span className="font-bold">Repo Link:</span> <a href={w3.repoLink} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{w3.repoLink}</a></p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-red-50 p-5 rounded-2xl shadow-sm border border-red-100">
                <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center gap-2"><AlertCircle size={20} /> ปัญหาที่พบระหว่างการสร้าง</h3>
                <div className="text-sm text-red-800 bg-white p-4 rounded-xl border border-red-50">
                  {Array.isArray(w3.problems)
                    ? <ul className="pl-4 list-disc space-y-2">{w3.problems.map((p, i) => (
                      <li key={i}>{typeof p === 'object' && p !== null ? (p.problem || p.description || p.text || p.title || JSON.stringify(p)) : p}</li>
                    ))}</ul>
                    : <p className="whitespace-pre-line">{typeof w3.problems === 'object' && w3.problems !== null ? JSON.stringify(w3.problems) : w3.problems || <span className="text-red-300 italic font-normal">ไม่มีบันทึกปัญหา</span>}</p>}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><ImageIcon size={20} /> แกลเลอรี่ผลงาน (Galleries)</h3>

                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-bold text-slate-700 mb-3 block">ภาพเบื้องหลังการทำงาน (Working Process)</span>
                    {Array.isArray(w3.workImages) && w3.workImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {w3.workImages.map((img, i) => (
                          <div key={i} className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200" onClick={() => setLightboxImage(img?.url || img)}>
                            <img src={img?.url || img} alt={`work-${i}`} className="w-full h-32 object-cover group-hover:scale-105 transition duration-300" onError={e => e.target.style.display = 'none'} />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center"><Search size={24} className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" /></div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-sm text-slate-400 italic">ไม่มีรูปภาพบรรยากาศการทำงาน</p>}
                  </div>

                  {Array.isArray(w3.appScreenshots) && w3.appScreenshots.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-700 mb-3 block">ภาพหน้าจอซอฟต์แวร์ (UI Screenshots)</span>
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {w3.appScreenshots.map((img, i) => (
                          <div key={i} className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-200 shadow-sm" onClick={() => setLightboxImage(img?.url || img)}>
                            <img src={img?.url || img} alt={`ui-${i}`} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300 object-top" onError={e => e.target.style.display = 'none'} />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center"><Search size={24} className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {w3.cleanupImage && (
                    <div className="pt-6 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-700 mb-2 block">ภาพเก็บกวาดสถานที่ (Clean-up)</span>
                      <div className="relative group cursor-pointer inline-block rounded-xl overflow-hidden border border-slate-200" onClick={() => setLightboxImage(w3.cleanupImage)}>
                        <img src={w3.cleanupImage} alt="Cleanup" className="w-48 h-32 object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center"><Search size={24} className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" /></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: W4 */}
          {activeTab === 'w4' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-teal-900 mb-4 border-b pb-2 flex items-center gap-2"><Search size={20} /> สถานการณ์และวิธีการทดสอบ</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Test Scenario</span>
                      <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded mt-1">{w4.testScenario || <span className="text-slate-400 italic font-normal">ไม่มีข้อมูล</span>}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Test Procedure</span>
                      <p className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded mt-1">{w4.testProcedure || <span className="text-slate-400 italic font-normal">ไม่มีข้อมูล</span>}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                  <span className="text-sm font-bold text-slate-500 mb-2">ผลการทดสอบ (Test Result)</span>
                  <div className={`px-8 py-4 rounded-2xl text-2xl font-black uppercase tracking-wider ${w4.testResult === 'pass' ? 'bg-green-100 text-green-600' : w4.testResult === 'fail' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    {w4.testResult || 'ไม่มีข้อมูล'}
                  </div>
                  {w4.operationSummary && (
                    <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 w-full text-left">{w4.operationSummary}</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-purple-900 mb-4 border-b pb-2 flex items-center gap-2"><AlertCircle size={20} /> Deep Analysis วิเคราะห์ข้อบกพร่อง</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <span className="text-xs font-bold text-red-700 block mb-1">Bug / Defects ที่พบ</span>
                    <p className="text-sm text-red-900">{w4.defects || <span className="text-red-300 italic">ไม่มีข้อมูล</span>}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <span className="text-xs font-bold text-orange-700 block mb-1">สาเหตุ (Root Cause)</span>
                    <p className="text-sm text-orange-900">{w4.rootCause || <span className="text-orange-300 italic">ไม่มีข้อมูล</span>}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <span className="text-xs font-bold text-teal-700 block mb-1">แผนการปรับปรุง (Redesign Plan)</span>
                    <p className="text-sm text-teal-900">{w4.redesignPlan || <span className="text-teal-300 italic">ไม่มีข้อมูล</span>}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><ImageIcon size={20} /> รูปภาพการทดสอบและการปรับปรุง</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {w4.testEvidenceImage && (
                    <div>
                      <span className="text-xs font-bold text-slate-500 mb-1 block">หลักฐานการทดสอบ (Evidence):</span>
                      <div className="relative group cursor-pointer" onClick={() => setLightboxImage(w4.testEvidenceImage)}>
                        <img src={w4.testEvidenceImage} className="w-full h-40 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition" alt="Test Evidence" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={32} className="text-white drop-shadow-lg" /></div>
                      </div>
                    </div>
                  )}
                  {w4.beforeImage && (
                    <div>
                      <span className="text-xs font-bold text-slate-500 mb-1 block">ก่อนปรับปรุง (Before):</span>
                      <div className="relative group cursor-pointer" onClick={() => setLightboxImage(w4.beforeImage)}>
                        <img src={w4.beforeImage} className="w-full h-40 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition" alt="Before" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={32} className="text-white drop-shadow-lg" /></div>
                      </div>
                    </div>
                  )}
                  {w4.afterImage && (
                    <div>
                      <span className="text-xs font-bold text-slate-500 mb-1 block">หลังปรับปรุง (After):</span>
                      <div className="relative group cursor-pointer" onClick={() => setLightboxImage(w4.afterImage)}>
                        <img src={w4.afterImage} className="w-full h-40 object-cover rounded-xl border border-slate-200 group-hover:opacity-80 transition" alt="After" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none"><Search size={32} className="text-white drop-shadow-lg" /></div>
                      </div>
                    </div>
                  )}
                  {!w4.testEvidenceImage && !w4.beforeImage && !w4.afterImage && (
                    <p className="text-sm text-slate-400 italic">ไม่มีรูปภาพประกอบ</p>
                  )}
                </div>
              </div>

              {/* Observation Log (W4) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-emerald-900 mb-4 border-b pb-2 flex items-center gap-2"><Search size={20} /> บันทึกการสังเกตการณ์ (Observation Log)</h3>
                <div className="space-y-4">
                  {Array.isArray(w4.observations) && w4.observations.length > 0 ? (
                    w4.observations.map((obs, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold shrink-0">{i + 1}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">{typeof obs === 'object' ? (obs.teamObserved || obs.title || `สังเกตการณ์ทีมที่ ${i + 1}`) : `ข้อสังเกตที่ ${i + 1}`}</p>
                          <p className="text-sm text-slate-600 bg-white p-3 rounded border border-slate-100 italic">"{typeof obs === 'object' ? (obs.detail || obs.notes || obs.text || JSON.stringify(obs)) : obs}"</p>
                        </div>
                      </div>
                    ))
                  ) : <p className="text-sm text-slate-400 italic">ไม่มีบันทึกการสังเกตการณ์ทีมอื่น</p>}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: W5 */}
          {activeTab === 'w5' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 bg-slate-800 flex items-center justify-center">
                  {(w5.pitchThumbnail || w5.finalProductImage) ? (
                    <img src={w5.pitchThumbnail || w5.finalProductImage} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : <ImageIcon size={48} className="text-slate-500" />}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="bg-white/20 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Final Product</span>
                  <h3 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{w5.projectName || w1.projectName || 'ไร้ชื่อโครงงาน'}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                    {w5.pitchUrl && <a href={w5.pitchUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl transition"><Presentation size={18} /> ดู Pitch Deck</a>}
                    {w5.finalProductUrl && <a href={w5.finalProductUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-900 font-bold rounded-xl transition"><Link size={18} /> ดูผลงานจริง</a>}
                    {w5.videoUrl && <a href={w5.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition"><PlayCircle size={18} /> ดูวิดีโอ</a>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase">ทุนที่ระดมได้ (Raised Capital)</p>
                    <p className="text-4xl font-black text-amber-500 mt-1">{(w5.raised_capital || 0).toLocaleString()} Coins</p>
                  </div>
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex justify-center items-center text-amber-500"><Activity size={32} /></div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase">จำนวนนักลงทุน (Investors)</p>
                    <p className="text-4xl font-black text-blue-500 mt-1">{(w5.investors || []).length} คน</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex justify-center items-center text-blue-500"><Users size={32} /></div>
                </div>
              </div>

              {/* Investor Details (W5) */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-blue-900 mb-4 border-b pb-2 flex items-center gap-2"><Users size={20} /> รายชื่อนักลงทุนและข้อเสนอแนะ (Investors)</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.isArray(w5.investors) && w5.investors.length > 0 ? (
                    w5.investors.map((inv, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-bl-xl text-xs flex items-center gap-1">
                          <Activity size={12} /> +{inv.amount || 0} Coins
                        </div>
                        <p className="font-bold text-slate-800 mb-2">{inv.name || 'นักลงทุนไม่ระบุชื่อ'}</p>

                        {inv.ratings && (
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 mb-3">
                            <span className="bg-white px-2 py-1 rounded border border-slate-100 flex items-center gap-1">ความคิดสร้างสรรค์: <Star size={10} className="text-amber-400" fill="currentColor" />{inv.ratings.creativity || '-'}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-100 flex items-center gap-1">ความเป็นไปได้: <Star size={10} className="text-amber-400" fill="currentColor" />{inv.ratings.feasibility || '-'}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-100 flex items-center gap-1">การนำเสนอ: <Star size={10} className="text-amber-400" fill="currentColor" />{inv.ratings.pitching || '-'}</span>
                          </div>
                        )}
                        <p className="text-sm text-slate-600 bg-white p-2 rounded border border-slate-100 italic">"{inv.feedback || 'ไม่มีข้อเสนอแนะ'}"</p>
                      </div>
                    ))
                  ) : <p className="text-sm text-slate-400 italic">ยังไม่มีข้อมูลนักลงทุน</p>}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><ImageIcon size={20} /> ภาพถ่ายผลงานจริง</h3>
                {w5.finalProductImage ? (
                  <img src={w5.finalProductImage} alt="Final Product" className="w-full max-h-96 object-contain bg-slate-50 rounded-xl border border-slate-100" />
                ) : <p className="text-sm text-slate-400 italic">ไม่มีข้อมูลรูปภาพ</p>}
              </div>
            </div>
          )}

          {/* TAB 6: Reflection & System Evaluation */}
          {activeTab === 'ref' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-pink-600 mb-2">ความพึงพอใจในผลงานตนเอง</span>
                  <div className="flex text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill={s <= (ref.selfSatisfaction || 0) ? 'currentColor' : 'transparent'} className={s <= (ref.selfSatisfaction || 0) ? 'text-amber-400' : 'text-slate-300'} />)}
                  </div>
                  <span className="text-2xl font-black text-pink-900">{ref.selfSatisfaction || 0} / 5</span>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-blue-600 mb-2">การทำงานเป็นทีม (Teamwork)</span>
                  <div className="flex text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill={s <= (ref.teamwork || 0) ? 'currentColor' : 'transparent'} className={s <= (ref.teamwork || 0) ? 'text-amber-400' : 'text-slate-300'} />)}
                  </div>
                  <span className="text-2xl font-black text-blue-900">{ref.teamwork || 0} / 5</span>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold text-emerald-600 mb-2">ความมั่นใจต่อผลงาน (Confidence)</span>
                  <div className="flex text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} fill={s <= (ref.confidenceLevel || 0) ? 'currentColor' : 'transparent'} className={s <= (ref.confidenceLevel || 0) ? 'text-amber-400' : 'text-slate-300'} />)}
                  </div>
                  <span className="text-2xl font-black text-emerald-900">{ref.confidenceLevel || 0} / 5</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-purple-900 mb-4 border-b pb-2 flex items-center gap-2"><Lightbulb size={20} /> สิ่งที่ได้เรียนรู้ (Lesson Learned)</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                  "{ref.lessonLearned || <span className="text-slate-400 font-normal">ไม่มีข้อมูลบันทึกสะท้อนคิด</span>}"
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-emerald-900 mb-4 border-b pb-2 flex items-center gap-2"><TrendingUp size={20} /> สิ่งที่อยากปรับปรุงในอนาคต (Future Improvement)</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {ref.futureImprovement || <span className="text-slate-400 italic">ไม่มีข้อมูลบันทึกกรอบการพัฒนา</span>}
                </p>
              </div>

              {/* System Evaluations Analytics */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg mt-8">
                <h3 className="font-bold text-lg text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2"><BarChart size={20} className="text-amber-400" /> ความเห็นต่อระบบอัจฉริยะแบบฝังตัว (System Evaluation)</h3>
                {teamEvals.length > 0 ? (
                  <div className="space-y-4">
                    {teamEvals.map((ev, i) => (
                      <div key={i} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-bold text-blue-300 flex items-center gap-1"><User size={14} /> {ev.displayName || ev.studentId || 'ผู้ใช้ไม่ระบุชื่อ'}</span>
                          <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700 rounded-full flex items-center gap-1 w-fit"><Star size={12} className="text-amber-400" fill="currentColor" /> ความพึงพอใจโดยรวม: {ev.overallSystemSatisfaction || '-'}/5</span>
                        </div>
                        {ev.openEndedFeedback && (
                          <div className="text-sm text-slate-300 border-l-2 border-slate-600 pl-3 py-1">"{ev.openEndedFeedback}"</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 border border-dashed border-slate-600 rounded-xl">
                    <p className="text-sm">สมาชิกในทีมนี้ยังไม่ได้ตอบแบบฟอร์มประเมินระบบ</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ----- Main Landing Page -----

export default function ShowcaseLanding() {
  const [allTeams, setAllTeams] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // State สำหรับ Section วิเคราะห์รายกลุ่ม
  const [activeRoom, setActiveRoom] = useState('3/9');
  const [expandedTeam, setExpandedTeam] = useState(null);

  // ข้อมูลคะแนนจริง (ฝังในระบบ)
  const teamScores = {
    '3/9': [
      { name: 'SHANNY', w1: 7, w2: 10, w3: 10, w4: 10, w5: 10, total: 47 },
      { name: 'Ameba', w1: 10, w2: 10, w3: 10, w4: 10, w5: 5, total: 45 },
      { name: 'Pheem the Builder', w1: 10, w2: 10, w3: 10, w4: 10, w5: 5, total: 45 },
      { name: 'ManuLnwza67', w1: 7, w2: 10, w3: 10, w4: 10, w5: 6, total: 43 },
      { name: 'Zony', w1: 7, w2: 9, w3: 10, w4: 10, w5: 5, total: 41 },
      { name: 'Teamบริษัทไม่จำกัดฯ', w1: 7, w2: 10, w3: 9, w4: 10, w5: 4, total: 40 },
      { name: 'Teamนี้ไม่มีคราไชยู', w1: 7, w2: 10, w3: 9, w4: 8, w5: 4, total: 38 },
      { name: 'DC Operation', w1: 7, w2: 7, w3: 10, w4: 7, w5: 6, total: 37 }
    ],
    '3/10': [
      { name: 'Zootopia', w1: 5, w2: 10, w3: 10, w4: 10, w5: 5, total: 40 },
      { name: 'ABC', w1: 7, w2: 9, w3: 10, w4: 10, w5: 3, total: 39 },
      { name: 'Team สิงโตใจงาม🦁', w1: 7, w2: 9, w3: 9, w4: 10, w5: 4, total: 39 },
      { name: 'team rorofago', w1: 6, w2: 7, w3: 10, w4: 6, w5: 5.2, total: 34.2 },
      { name: 'teamวิศวะตาเข', w1: 7, w2: 10, w3: 7, w4: 6, w5: 4, total: 34 },
      { name: 'ค่าBMI', w1: 7, w2: 6, w3: 9, w4: 9, w5: 3, total: 34 },
      { name: 'Team รา', w1: 6, w2: 9, w3: 8, w4: 8, w5: 2.75, total: 33.75 }
    ]
  };
  const [activeFrameworkCard, setActiveFrameworkCard] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const teamsRef = collection(db, 'artifacts', appId, 'public', 'data', 'teams');
    const unsubTeams = onSnapshot(teamsRef, (snap) => {
      const teamsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const activeTeams = teamsData.filter(
        team => team.progress?.w1 === 'submitted' || team.progress?.w1 === 'approved'
      );
      activeTeams.sort(
        (a, b) => (b.data?.w5?.raised_capital || 0) - (a.data?.w5?.raised_capital || 0)
      );
      setAllTeams(activeTeams);
      setIsFetching(false);
    });

    const evalRef = collection(db, 'system_evaluations');
    const unsubEval = onSnapshot(evalRef, (snap) => {
      setEvaluations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubTeams();
      unsubEval();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-blue-200 scroll-smooth">

      {/* Keyframe for modal pop animation (replaces non-standard tailwindcss-animate classes) */}
      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-[210]"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              src={lightboxImage}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl relative z-[205] cursor-default"
              alt="Enlarged view"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Navigation — z-40 keeps it below the modal (z-[100]) */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-bold text-sm text-blue-900 tracking-tight">
            <span className="text-blue-600">EDP</span> Smart Logbook Research
          </div>
          <div className="hidden md:flex space-x-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <a href="#painpoint" className="hover:text-blue-600 transition-colors">สภาพปัญหา</a>
            <a href="#framework" className="hover:text-blue-600 transition-colors">กรอบแนวคิด</a>
            <a href="#innovation" className="hover:text-blue-600 transition-colors">นวัตกรรม</a>
            <a href="#journey" className="hover:text-blue-600 transition-colors">การดำเนินการ</a>
            <a href="#showcase" className="hover:text-blue-600 transition-colors font-bold text-blue-700">ผลงานนักเรียน</a>
          </div>
        </div>
      </nav>

      {/* 2. Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-24 md:py-32">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400 blur-[100px]"
          />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block py-1.5 px-4 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-semibold tracking-widest mb-8"
          >
            รายงานวิจัยปฏิบัติการในชั้นเรียน โรงเรียนหอวัง
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-relaxed max-w-5xl mx-auto text-center mb-8 break-keep"
          >
            การพัฒนาทักษะกระบวนการออกแบบเชิงวิศวกรรม <br className="hidden lg:block" />
            ของนักเรียนชั้นมัธยมศึกษาปีที่ 3 โรงเรียนหอวัง <br className="hidden lg:block" />
            โดยใช้การจัดการเรียนรู้แบบสืบเสาะหาความรู้ (5E Models) <br className="hidden lg:block" />
            ร่วมกับระบบบันทึกนำทาง (Scaffolded Logbook)
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto my-6 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-12"
          >
            <p className="text-white text-lg md:text-xl font-medium mb-2 opacity-90">
              <span className="font-semibold">ผู้วิจัย:</span> นายบุญวิชญ์ ปวโรภาส
            </p>
            <p className="text-blue-200 text-sm md:text-base opacity-80">
              รายวิชาคอมพิวเตอร์เพื่อการออกแบบ 3 &nbsp;|&nbsp; โรงเรียนหอวัง
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto"
          >
            <a
              href="https://scaffolded-logbook-research.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:bg-amber-50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base w-full sm:w-auto"
            >
              ทดลองใช้ระบบ EDP Smart Logbook <ArrowRight size={20} />
            </a>
            <a
              href="#showcase"
              className="px-8 py-4 bg-blue-800/40 text-white font-semibold rounded-full border border-blue-400/30 hover:bg-blue-800/70 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base w-full sm:w-auto backdrop-blur-sm"
            >
              ชมผลงานนักเรียน (Student Portfolio)
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce"
        >
          <span className="text-xs text-blue-300 uppercase tracking-widest mb-2 font-semibold">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-blue-300/50 flex justify-center p-1">
            <div className="w-1 h-2 bg-blue-300 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 3. Background & Problem Statement */}
      <section id="painpoint" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="บริบทและสภาพปัญหาการจัดการเรียนรู้"
            subtitle="ความเป็นมาของการวิจัยและสภาพปัญหาที่นำไปสู่การพัฒนานวัตกรรม"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Text */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                  บริบทการจัดการเรียนรู้
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  ในรายวิชาคอมพิวเตอร์เพื่อการออกแบบ 3 มุ่งเน้นให้นักเรียนสร้างสรรค์นวัตกรรมผ่านกระบวนการออกแบบเชิงวิศวกรรม (Engineering Design Process: EDP) ตามแนวทางของสถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี (สสวท.) เพื่อพัฒนาทักษะการคิดเชิงวิศวกรรมอย่างเป็นขั้นตอน
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
                  สภาพปัญหา (กิจกรรมสะพานต้านแรงโน้มถ่วง)
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-4">
                  จากการจัดการเรียนรู้ด้วยรูปแบบเดิมที่ใช้ <strong>"เอกสารใบงาน (Paper-based)"</strong> พบปัญหาสำคัญคือ นักเรียนเกิด <strong>"ภาระทางปัญญา (Cognitive Overload)"</strong> ส่งผลให้เกิดพฤติกรรมการทำงานแบบข้ามขั้นตอน (Trial and Error โดยปราศจากการวางแผน) การคัดลอกผลงาน และการบันทึกข้อมูลย้อนหลัง (Retroactive Logging) ซึ่งทำให้ไม่เกิดการพัฒนาทักษะกระบวนการคิดอย่างแท้จริง
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Activity, label: "การทำงานข้ามขั้นตอน (Trial & Error without Planning)", color: "border-red-300 bg-red-50 text-red-800" },
                    { icon: Copy, label: "การคัดลอกผลงาน (Plagiarism)", color: "border-orange-300 bg-orange-50 text-orange-800" },
                    { icon: FileWarning, label: "การบันทึกข้อมูลย้อนหลัง (Retroactive Logging)", color: "border-purple-300 bg-purple-50 text-purple-800" },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium ${p.color}`}>
                      <p.icon size={16} className="flex-shrink-0" />
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: Actual Image */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl shadow-xl overflow-hidden border-4 border-white">
                <SmartCarousel basePath="/problems/problem-activity" setLightboxImage={setLightboxImage} containerClassName="relative w-full aspect-video sm:aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden group" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl shadow-md overflow-hidden border-4 border-white">
                  <SmartCarousel basePath="/problems/problem-copying" setLightboxImage={setLightboxImage} containerClassName="relative w-full aspect-video sm:aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden group" />
                </div>
                <div className="rounded-2xl shadow-md overflow-hidden border-4 border-white">
                  <SmartCarousel basePath="/problems/problem-paper" setLightboxImage={setLightboxImage} containerClassName="relative w-full aspect-video sm:aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden group" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1. Research Questions & Hypotheses */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <SectionHeading
            title="คำถามและสมมติฐานการวิจัย"
            subtitle=""
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: คำถามวิจัย */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2 border-b border-blue-100 pb-3">
                <Search className="text-blue-500" size={24} /> คำถามวิจัย
              </h3>
              <ul className="space-y-4 text-slate-700 leading-relaxed text-sm flex-1">
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2"></div>
                  <p>1) การจัดการเรียนรู้วิชาคอมพิวเตอร์เพื่อการออกแบบ3 โดยใช้การจัดการเรียนรู้แบบสืบเสาะหาความรู้ (5E)ร่วมกับระบบบันทึกนำทาง(Scaffolded Logbook) มีประสิทธิภาพและสามารถแก้ปัญหาการทำงานของนักเรียนได้หรือไม่อย่างไร</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2"></div>
                  <p>2) ผลสัมฤทธิ์ด้านทักษะกระบวนการออกแบบเชิงวิศวกรรม(EDP) ของนักเรียนหลังได้รับการจัดการเรียนรู้ สูงกว่าก่อนเรียนหรือไม่</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2"></div>
                  <p>3) พฤติกรรมการทำงานอย่างเป็นระบบ(การส่งงานตามขั้นตอนและการไม่ลอกเลียนแบบผลงาน) ของนักเรียน จากการใช้ระบบบันทึกนำทาง(Scaffolded Logbook) มีลักษณะเป็นอย่างไร</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-2"></div>
                  <p>4) นักเรียนมีความพึงพอใจต่อการจัดการเรียนรู้โดยใช้การจัดการเรียนรู้แบบสืบเสาะหาความรู้ (5E) ร่วมกับระบบบันทึกนำทาง(Scaffolded Logbook) อยู่ในระดับใด</p>
                </li>
              </ul>
            </div>

            {/* Right: สมมติฐานการวิจัย */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col h-full">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2 border-b border-emerald-200/50 pb-3">
                <CheckCircle className="text-emerald-500" size={24} /> สมมติฐานการวิจัย
              </h3>
              <ul className="space-y-4 text-emerald-900 leading-relaxed text-sm flex-1">
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <p>1) ทักษะกระบวนการออกแบบเชิงวิศวกรรม (EDP) ของนักเรียนชั้นมัธยมศึกษาปีที่ 3 หลังได้รับการจัดการเรียนรู้แบบสืบเสาะหาความรู้ (5E)ร่วมกับระบบบันทึกนำทาง สูงกว่าก่อนเรียน</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <p>2) นักเรียนมีพฤติกรรมการทำงานอย่างเป็นระบบสามารถดำเนินการแก้ปัญหาตามขั้นตอนโดยไม่ลอกเลียนแบบผลงาน อยู่ในเกณฑ์ที่ผ่านการประเมิน</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2"></div>
                  <p>3) นักเรียนมีความพึงพอใจต่อการจัดการเรียนรู้แบบสืบเสาะหาความรู้(5E) ร่วมกับระบบบันทึกนำทาง(Scaffolded Logbook) อยู่ในระดับมาก</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 Expected Benefits */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <SectionHeading
            title="ประโยชน์ที่คาดว่าจะได้รับ"
            subtitle=""
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 border-t-4 border-t-amber-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
                <Lightbulb size={28} />
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">1) ได้แนวทางการจัดการเรียนรู้และนวัตกรรม (EDP Smart Log) ที่สามารถแก้ปัญหาผู้เรียนทำงานไม่สำเร็จและลดพฤติกรรมการลอกเลียนแบบผลงาน</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 border-t-4 border-t-blue-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                <TrendingUp size={28} />
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">2) นักเรียนได้รับการพัฒนาทักษะกระบวนการออกแบบเชิงวิศวกรรม สามารถทำงานได้อย่างเป็นระบบและมีความคิดสร้างสรรค์</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 border-t-4 border-t-purple-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-500">
                <Presentation size={28} />
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">3) เป็นแนวทางสำหรับครูผู้สอนและผู้ที่เกี่ยวข้องในการนำเทคโนโลยีมาใช้เป็นเครื่องมือช่วยติดตามความก้าวหน้าของผู้เรียน (Progress Tracking) ในรายวิชาโครงงานหรือวิชาปฏิบัติอื่น ๆ</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Research Framework - Interactive Cards */}
      <section id="framework" className="py-24 bg-slate-50 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-60"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <SectionHeading
            title="วัตถุประสงค์ สมมติฐาน และขอบเขตการวิจัย"
            subtitle="คลิกที่การ์ดเพื่ออ่านรายละเอียดกรอบแนวคิดที่ใช้ในการวิจัยครั้งนี้"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Objectives */}
            <motion.div
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onClick={() => setActiveFrameworkCard('objectives')}
              className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 border-t-4 border-t-blue-600 cursor-pointer transition-colors duration-300 hover:border-blue-300 group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-700">วัตถุประสงค์การวิจัย</h3>
              <p className="text-gray-500 text-sm mb-6">คลิกเพื่อดูเป้าหมายหลักของการพัฒนาระบบ EDP Smart Logbook</p>
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                อ่านรายละเอียด <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>

            {/* Hypotheses */}
            <motion.div
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onClick={() => setActiveFrameworkCard('hypotheses')}
              className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 border-t-4 border-t-emerald-500 cursor-pointer transition-colors duration-300 hover:border-emerald-300 group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2 group-hover:text-emerald-700">สมมติฐานการวิจัย</h3>
              <p className="text-gray-500 text-sm mb-6">คลิกเพื่อดูผลลัพธ์ที่คาดหวังด้านทักษะและความพึงพอใจ</p>
              <div className="flex items-center text-emerald-600 font-semibold text-sm">
                อ่านรายละเอียด <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>

            {/* Scope */}
            <motion.div
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onClick={() => setActiveFrameworkCard('scope')}
              className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 border-t-4 border-t-purple-500 cursor-pointer transition-colors duration-300 hover:border-purple-300 group"
            >
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-500 group-hover:text-white">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700">ขอบเขตการวิจัย</h3>
              <p className="text-gray-500 text-sm mb-6">คลิกเพื่อดูกลุ่มตัวอย่างและตัวแปรที่ใช้ในการทดลอง</p>
              <div className="flex items-center text-purple-600 font-semibold text-sm">
                อ่านรายละเอียด <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Modal for Framework Cards */}
      <AnimatePresence>
        {activeFrameworkCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveFrameworkCard(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative border border-white/20"
            >
              <button
                onClick={() => setActiveFrameworkCard(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 sm:p-12">
                {activeFrameworkCard === 'objectives' && (
                  <div>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                      <Target size={32} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-center text-blue-950 mb-8 border-b border-slate-100 pb-6">วัตถุประสงค์การวิจัย</h3>
                    <div className="space-y-6">
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                        <div className="flex gap-4">
                          <span className="text-3xl font-black text-blue-200">01</span>
                          <p className="text-slate-700 leading-relaxed text-lg">เพื่อพัฒนาทักษะกระบวนการออกแบบเชิงวิศวกรรม (Engineering Design Process: EDP) ของนักเรียน <strong className="text-blue-700">โดยใช้การจัดการเรียนรู้แบบ 5E ร่วมกับระบบ EDP Smart Logbook</strong> ให้ผ่านเกณฑ์ร้อยละ 70</p>
                        </div>
                      </div>
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                        <div className="flex gap-4">
                          <span className="text-3xl font-black text-blue-200">02</span>
                          <p className="text-slate-700 leading-relaxed text-lg">เพื่อศึกษา<strong className="text-blue-700">ความพึงพอใจ</strong>ของนักเรียนที่มีต่อการใช้ระบบบันทึกนำทาง (Scaffolded Logbook) ในการสร้างสรรค์นวัตกรรม</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFrameworkCard === 'hypotheses' && (
                  <div>
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-center text-emerald-950 mb-8 border-b border-slate-100 pb-6">สมมติฐานการวิจัย</h3>
                    <div className="space-y-6">
                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                        <div className="flex gap-4 items-center">
                          <span className="text-3xl font-black text-emerald-200">H1</span>
                          <p className="text-slate-700 leading-relaxed text-lg">นักเรียนที่เรียนด้วยการจัดการเรียนรู้แบบ 5E ร่วมกับระบบ EDP Smart Logbook <strong className="text-emerald-700">มีคะแนนทักษะกระบวนการออกแบบเชิงวิศวกรรม ผ่านเกณฑ์ร้อยละ 70</strong></p>
                        </div>
                      </div>
                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                        <div className="flex gap-4 items-center">
                          <span className="text-3xl font-black text-emerald-200">H2</span>
                          <p className="text-slate-700 leading-relaxed text-lg">นักเรียนมี<strong className="text-emerald-700">ความพึงพอใจระดับ "มาก" ถึง "มากที่สุด"</strong> ต่อระบบบันทึกนำทางที่พัฒนาขึ้น</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFrameworkCard === 'scope' && (
                  <div>
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                      <Users size={32} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-center text-purple-950 mb-8 border-b border-slate-100 pb-6">ขอบเขตการวิจัย</h3>
                    <div className="space-y-4">
                      <div className="bg-purple-50/30 p-5 rounded-xl border border-purple-100/30">
                        <span className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">กลุ่มตัวอย่าง (Sample)</span>
                        <p className="text-slate-800 font-medium">นักเรียนชั้นมัธยมศึกษาปีที่ 3/9 และ 3/10 โรงเรียนหอวัง ภาคเรียนที่ 2 ปีการศึกษา 2568 จำนวน 74 คน (ได้มาจากการสุ่มแบบเจาะจง Purposive Sampling)</p>
                      </div>
                      <div className="bg-purple-50/30 p-5 rounded-xl border border-purple-100/30">
                        <span className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">ตัวแปรอิสระ (Independent Variable)</span>
                        <p className="text-slate-800 font-medium">การจัดการเรียนรู้แบบสืบเสาะหาความรู้ 5 ขั้น (5E) ร่วมกับ <strong className="text-purple-700">ระบบบันทึกนำทาง (EDP Smart Logbook)</strong></p>
                      </div>
                      <div className="bg-purple-50/30 p-5 rounded-xl border border-purple-100/30">
                        <span className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">ตัวแปรตาม (Dependent Variables)</span>
                        <p className="text-slate-800 font-medium">1. ทักษะกระบวนการออกแบบเชิงวิศวกรรม (EDP Skills)<br />2. ความพึงพอใจของนักเรียน</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4.5 Literature Review */}
      <section className="py-24 bg-white relative border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <SectionHeading
            title="เอกสารและงานวิจัยที่เกี่ยวข้อง"
            subtitle="อ้างอิงบุคคลที่น่าเชื่อถือ หรือเจ้าของทฤษฏีต่างๆ"
          />
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <ul className="space-y-4 relative z-10">
              {[
                "1.หลักสูตรแกนกลางและสาระการเรียนรู้เทคโนโลยีการออกแบบและเทคโนโลยี",
                "2. การจัดการเรียนรู้แบบสืบเสาะหาความรู้ (5E)",
                "3. กระบวนการออกแบบเชิงวิศวกรรม (EDP)",
                "4. ทฤษฎีฐานการช่วยเหลือ (Scaffolding Theory) และระบบบันทึกนำทาง (Scaffolded Logbook)",
                "5. งานวิจัยที่เกี่ยวข้อง",
                "6.กรอบแนวคิดการวิจัย"
              ].map((text, i) => (
                <li key={i} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100/50 hover:border-blue-200 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                    <Layers size={20} />
                  </div>
                  <span className="text-slate-700 font-medium md:text-base text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Innovation Section */}
      <section id="innovation" className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title={`การพัฒนานวัตกรรม "EDP Smart Logbook"`}
            subtitle="บูรณาการทฤษฎีการเรียนรู้สามแนวทางสู่ระบบบันทึกนำทางเชิงดิจิทัล"
          />

          {/* Conceptual Framework Equation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.3 } },
              hidden: {}
            }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" } } }} className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-4 border-blue-500 text-center w-full md:w-48 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute inset-0 bg-blue-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-blue-900">การสืบเสาะหาความรู้ 5E</h4>
                <p className="text-xs text-gray-500 mt-1">กระบวนการจัดการเรียนรู้</p>
              </div>
            </motion.div>

            <motion.span variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="text-2xl font-black text-gray-300">+</motion.span>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" } } }} className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-4 border-green-500 text-center w-full md:w-48 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute inset-0 bg-green-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-green-900">ทักษะ EDP (สสวท.)</h4>
                <p className="text-xs text-gray-500 mt-1">กระบวนการออกแบบวิศวกรรม 6 ขั้น</p>
              </div>
            </motion.div>

            <motion.span variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="text-2xl font-black text-gray-300">+</motion.span>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" } } }} className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-4 border-purple-500 text-center w-full md:w-48 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute inset-0 bg-purple-50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-purple-900">ทฤษฎีนั่งร้านทางปัญญา</h4>
                <p className="text-xs text-gray-500 mt-1">(Scaffolding Theory)</p>
              </div>
            </motion.div>

            <motion.span variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="text-2xl font-black text-gray-300">=</motion.span>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.5, rotate: -5 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } } }} className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] text-center w-full md:w-72 text-white relative group overflow-hidden hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.6)] hover:-translate-y-2 transition-all duration-300">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h4 className="font-black text-xl tracking-tight mb-1 drop-shadow-md">ระบบ EDP Smart Logbook</h4>
                <p className="text-xs text-amber-50 font-medium bg-black/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">นวัตกรรมตัวแปรอิสระของการวิจัย</p>
              </div>
            </motion.div>
          </motion.div>

          {/* App Features matching research variables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } }, hidden: {} }}
              className="order-2 lg:order-1 space-y-5"
            >
              <motion.h3 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Wrench size={18} /></span>
                ฟังก์ชันสนับสนุนกระบวนการคิด
              </motion.h3>
              {[
                { icon: ShieldCheck, title: "ฟังก์ชันจำกัดความยาวข้อความ", label: "Gatekeeper", desc: "จำกัดการตอบแบบผิวเผิน หากอธิบายน้อยกว่าเกณฑ์ระบบจะไม่อนุญาตให้ผ่าน", color: "blue" },
                { icon: Search, title: "ตารางตัดสินใจอัตโนมัติ", label: "Interactive Matrix", desc: "ตารางคำนวณคะแนนเปรียบเทียบอัตโนมัติ ลด Cognitive Load ในการประมวลผล", color: "emerald" },
                { icon: Camera, title: "ระบบบันทึกหลักฐานตามสภาพจริง", label: "Real-time Log", desc: "บังคับบันทึกภาพหลักฐานแก้ปัญหาการเขียนย้อนหลังและการคัดลอกผ่าน Digital Footprint", color: "purple" },
                { icon: PieChart, title: "แฟ้มสะสมงานอัตโนมัติ", label: "Auto-Portfolio", desc: "ระบบสังเคราะห์ร่องรอยการเรียนรู้เป็นสื่อนำเสนอผลงานและส่งออก CSV อัตโนมัติ", color: "amber" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.3 } } }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all cursor-default"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600`}>
                    <feature.icon size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-${feature.color}-100 text-${feature.color}-700`}>{feature.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* App Image Actual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-2xl relative group"
            >
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition duration-500 z-10 pointer-events-none"></div>
              <img src="/framework/research-framework.png" alt="Research Framework" className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition duration-700" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="bg-slate-100 min-h-[480px] flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-300 rounded-3xl"><TrendingUp size={48} class="mb-4 text-blue-300"/><p class="font-bold">ภาพแสดงกรอบแนวคิด (Framework)</p><p class="text-xs">/framework/research-framework.png</p></div>'; }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Implementation Timeline */}
      <section id="journey" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            title="กระบวนการจัดการเรียนรู้ (การดำเนินการ 5 สัปดาห์)"
            subtitle="ขั้นตอนการจัดการเรียนรู้แบบสืบเสาะหาความรู้ 5E ร่วมกับระบบ EDP Smart Logbook"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">

            {/* Left: Population & Downloads */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Users size={20} /> กลุ่มประชากรและกลุ่มตัวอย่าง
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  ระยะเวลา จำนวน 5 สัปดาห์ (สัปดาห์ละ2 คาบ รวมเวลาเรียนทั้งหมด 10 คาบ)ตั้งแต่เดือน มกราคม พ.ศ. 2568 ถึงเดือน กุมภาพันธ์ พ.ศ. 2569 ม.3/9 นักเรียน 40 คน ม.3/10 นักเรียน 34 คน
                </p>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mt-6">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Wrench size={20} /> เครื่องมือที่ใช้
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed max-w-none">
                  เครื่องมือคือ แผนการจัดการเรียนรู้ Models 5E + เรื่องกระบวนการออกแบบเชิงวิศวกรรม + นวัตกรรม EDP Smart Logbook
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mt-6">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Layers size={20} /> ขั้นตอนพัฒนานวัตกรรม
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  ขั้นตอนพัฒนานวัตกรรม EDP Smart Log ใช้พัฒนาโค้ดที่ google Antigravity / Cursor และระบบฐานข้อมูลของ Google firebase และมีรูปแสดง
                </p>
                <img src="/methodology/tech-stack.jpg" alt="Innovation Development" className="rounded-xl shadow-lg mt-4 w-full" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<div class="text-center p-6 mt-4 text-purple-400 bg-white rounded-xl shadow-sm"><Activity size="32" class="mx-auto mb-2 opacity-50"/><p class="text-xs font-bold">Tech Stack Visual Placeholder</p></div>' }} />
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                <h4 className="font-bold text-slate-800 mb-4">ดาวน์โหลดเอกสารงานวิจัยและแผนการสอน</h4>
                <div className="space-y-3">
                  {[
                    { file: "lesson-plan-1.pdf", title: "แผนที่ 6: การระบุและวิเคราะห์ปัญหา (Week 1)", num: 1 },
                    { file: "lesson-plan-2.pdf", title: "แผนที่ 7: การรวบรวมข้อมูลและวางแผนแก้ปัญหา (Week 2)", num: 2 },
                    { file: "lesson-plan-3.pdf", title: "แผนที่ 8: ดำเนินการแก้ไขปัญหา (Week 3)", num: 3 },
                    { file: "lesson-plan-4.pdf", title: "แผนที่ 9: การทดสอบและประเมินผล (Week 4)", num: 4 },
                    { file: "lesson-plan-5.pdf", title: "แผนที่ 10: การนำเสนอและประเมินผลรวบยอด (Week 5)", num: 5 }
                  ].map((plan, idx) => (
                    <a key={idx} href={`./downloads/${plan.file}`} target="_blank" rel="noopener noreferrer" download={`แผนการสอนที่-${plan.num}.pdf`} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm group shadow-sm hover:-translate-y-1 duration-200">
                      <span className="font-medium text-slate-700 group-hover:text-blue-800">{plan.title}</span>
                      <Download size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                  {/* เล่มวิจัยฉบับเต็ม */}
                  <a href="./downloads/full-research.pdf" target="_blank" rel="noopener noreferrer" download="วิจัยในชั้นเรียน-ฉบับเต็ม.pdf" className="flex items-center justify-between p-3 mt-4 bg-blue-600 border border-blue-700 rounded-lg hover:bg-blue-700 transition-colors text-sm text-white shadow-md group border-t border-blue-500">
                    <span className="font-bold">เล่มวิจัยฉบับเต็ม (Full Research)</span>
                    <Download size={18} className="text-white group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Timeline with Images */}
            <div className="lg:col-span-8 pl-4 lg:pl-8 border-l-2 border-slate-100">
              <div className="space-y-12">
                {[
                  { w: 1, title: 'การระบุและวิเคราะห์ปัญหา', phase: 'Engage', icon: Search, slug: 'week1-problem', desc: 'นักเรียนระบุปัญหาด้วยกรอบ 5W1H และวิเคราะห์สาเหตุที่แท้จริงด้วยเทคนิค 5 Whys' },
                  { w: 2, title: 'รวบรวมข้อมูลและออกแบบชิ้นงาน', phase: 'Explore', icon: Lightbulb, slug: 'week2-design', desc: 'ออกแบบชิ้นงาน (Blueprint) และประเมินความเป็นไปได้ผ่านตาราง Decision Matrix' },
                  { w: 3, title: 'ลงมือสร้างและบันทึกตามสภาพจริง', phase: 'Explain', icon: Wrench, slug: 'week3-maker', desc: 'สร้างชิ้นงานและบันทึกภาพถ่ายแต่ละขั้นตอนใน Construction Log แบบเรียลไทม์' },
                  { w: 4, title: 'ทดสอบประสิทธิภาพและปรับปรุง', phase: 'Elaborate', icon: CheckCircle, slug: 'week4-test', desc: 'ทดสอบชิ้นงาน บันทึกข้อบกพร่อง (Defect Log) และจัดทำแผนปรับปรุง (Redesign Plan)' },
                  { w: 5, title: 'นำเสนอผลงานและสะท้อนคิด', phase: 'Evaluate', icon: Presentation, slug: 'week5-pitch', desc: 'ระบบแปลงร่องรอยเป็นแฟ้มสะสมงาน นำเสนอ (Pitching) และสะท้อนคิด (Reflection)' }
                ].map((step, i) => (
                  <div key={i} className="relative flex flex-col sm:flex-row gap-6 group">
                    <div className="absolute top-8 -left-[2.15rem] lg:-left-[2.65rem] w-4 h-4 rounded-full bg-slate-200 border-4 border-white group-hover:bg-blue-500 transition-colors z-10 hidden sm:block"></div>

                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                      <step.icon size={28} />
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:border-blue-200 group-hover:shadow-md transition duration-300 flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">Week {step.w} : {step.phase}</span>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.desc}</p>
                      </div>

                      <div className="relative w-full md:w-48 h-40 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/img cursor-pointer">
                        <SmartCarousel basePath={`/methodology/${step.slug}`} setLightboxImage={setLightboxImage} containerClassName="relative w-full h-full bg-slate-100 cursor-pointer overflow-hidden group" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: วิเคราะห์ผลสัมฤทธิ์รายกลุ่มแบบเจาะลึก --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading
            title="การประเมินทักษะ EDP เชิงลึกรายกลุ่ม"
            subtitle="คลิกที่ชื่อกลุ่มเพื่อดูรายละเอียดคะแนนและพัฒนาการในแต่ละสัปดาห์ (ข้อมูลจริง 15 กลุ่ม)"
          />

          {/* ปุ่มสลับห้องเรียน */}
          <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
              <button
                onClick={() => { setActiveRoom('3/9'); setExpandedTeam(null); }}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${activeRoom === '3/9' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                นักเรียนชั้น ม.3/9
              </button>
              <button
                onClick={() => { setActiveRoom('3/10'); setExpandedTeam(null); }}
                className={`px-8 py-3 rounded-lg font-bold transition-all ${activeRoom === '3/10' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                นักเรียนชั้น ม.3/10
              </button>
            </div>
          </div>

          {/* แสดงรายชื่อกลุ่ม */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamScores[activeRoom].map((team, idx) => {
              const isExpanded = expandedTeam === team.name;
              const percentage = (team.total / 50) * 100;
              const strokeDasharray = `${percentage} 100`;

              return (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* กล่องหัวข้อ (กดเพื่อกางออก) */}
                  <div
                    onClick={() => setExpandedTeam(isExpanded ? null : team.name)}
                    className="p-5 cursor-pointer flex items-center justify-between bg-white hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* กราฟวงกลมจิ๋ว (Donut Chart) */}
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path className={`${percentage >= 80 ? 'text-emerald-500' : percentage >= 70 ? 'text-blue-500' : 'text-amber-500'}`} strokeDasharray={strokeDasharray} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-700">{Math.round(percentage)}%</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{team.name}</h4>
                        <p className="text-sm text-slate-500">คะแนนรวม: <span className="font-bold text-blue-600">{team.total}</span> / 50</p>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isExpanded ? <X size={20} /> : <ArrowRight size={20} />}
                    </div>
                  </div>

                  {/* รายละเอียดแต่ละ Week (แสดงเมื่อถูกกด) */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50 border-t border-slate-100 text-sm">
                      <p className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" /> ความละเอียดของชิ้นงานรายสัปดาห์
                      </p>
                      <div className="space-y-3">
                        {[
                          { label: 'W1: ระบุปัญหา', score: team.w1 },
                          { label: 'W2: ออกแบบ', score: team.w2 },
                          { label: 'W3: สร้างชิ้นงาน', score: team.w3 },
                          { label: 'W4: ทดสอบ', score: team.w4 },
                          { label: 'W5: นำเสนอ', score: team.w5 }
                        ].map((w, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-24 text-slate-600">{w.label}</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${w.score === 10 ? 'bg-emerald-500' : w.score >= 7 ? 'bg-blue-400' : 'bg-amber-400'}`} style={{ width: `${w.score * 10}%` }}></div>
                            </div>
                            <span className="w-8 text-right font-medium text-slate-700">{w.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* สรุป Insight ด้านล่าง */}
          <div className="mt-12 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex gap-4 items-start shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 flex-shrink-0">
              <Lightbulb size={24} />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 mb-2">ข้อค้นพบจากการวิเคราะห์รายกลุ่ม (Group Insight)</h4>
              <p className="text-sm text-indigo-800 leading-relaxed">
                กลุ่มที่มีคะแนนนำเสนอ (W5) สูง เช่น <strong className="font-black">SHANNY</strong> และ <strong className="font-black">Zootopia</strong> สามารถทำคะแนนรวมทะลุ 40/50 ชี้ให้เห็นว่าระบบช่วยปรับพฤติกรรมให้เด็กมีความละเอียดรอบคอบตั้งแต่กระบวนการออกแบบ (W2) และลงมือสร้าง (W3) ซึ่งส่งผลให้การรวบรวมข้อมูลลง Auto-Portfolio ทำได้สมบูรณ์ ในขณะที่บางกลุ่มที่สอบตกในสัปดาห์ที่ 5 สะท้อนถึงการบริหารเวลาที่บกพร่องในช่วงปลายโปรเจกต์
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Student Showcase (Firebase live) */}
      <section id="showcase" className="py-24 bg-slate-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ผลงานนักเรียนเชิงประจักษ์ (Student Work Exhibition)</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              นิทรรศการชิ้นงานนวัตกรรมของนักเรียนที่ใช้ระบบ EDP Smart Logbook ดึงข้อมูลตรงจากฐานข้อมูลแบบเรียลไทม์ คลิกเพื่อดูร่องรอยกระบวนการคิด EDP แต่ละทีม
            </p>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="animate-spin text-amber-500 mb-4" size={48} />
              <p className="text-slate-400">กำลังโหลดผลงานนวัตกร...</p>
            </div>
          ) : allTeams.length === 0 ? (
            <div className="text-center text-slate-500 py-20 bg-slate-800 rounded-2xl border border-slate-700">
              ยังไม่มีทีมไหนส่งผลงานเข้าสู่ระบบ
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allTeams.map(team => {
                const w1 = team.data?.w1 || {};
                const w5 = team.data?.w5 || {};
                const coverImage = w5.pitchThumbnail || w5.finalProductImage || w1.problemImage;
                return (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="bg-white text-slate-800 rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all duration-300 shadow-xl border-4 border-transparent hover:border-amber-400 flex flex-col h-full"
                  >
                    <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <ImageIcon size={48} className="text-blue-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-slate-900/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur flex items-center gap-1 shadow-lg">
                        <TrendingUp size={12} /> {(w5.raised_capital || 0).toLocaleString()} Coins
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                        <Users size={14} /> {team.teamName}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
                        {w5.projectName || w1.projectName || 'โครงงานไร้ชื่อ'}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                        <span className="font-semibold text-slate-800">ปัญหา: </span>
                        {w1.rootCause || 'ยังไม่ระบุปัญหา'}
                      </p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-amber-600">
                        ดูร่องรอยการคิด (Portfolio) <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 7. Research Results */}
      <section id="results" className="py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <SectionHeading
            title={<span className="text-white">สรุปผลการวิจัยเชิงประจักษ์</span>}
            subtitle={<span className="text-slate-400">หลักฐานเชิงประจักษ์จากการดำเนินการวิจัย 5 สัปดาห์ ตอบสมมติฐาน H1 และ H2</span>}
          />

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-12">
            {[
              { label: "Task Completion", value: "100%", sub: "ทุกกลุ่มส่งงานสำเร็จตามเวลา", icon: CheckCircle, colorClass: "text-emerald-400" },
              { label: "Plagiarism Rate", value: "0%", sub: "ไม่พบการคัดลอกด้วย Gatekeeper", icon: ShieldCheck, colorClass: "text-blue-400" },
              { label: "Average Score", value: "86.68%", sub: "43.34/50 (ระดับคุณภาพ: ดีเยี่ยม)", icon: TrendingUp, colorClass: "text-indigo-400" },
              { label: "Satisfaction", value: "4.65", sub: "เต็ม 5.00 (ระดับคุณภาพ: มากที่สุด)", icon: Star, colorClass: "text-amber-400" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors"
              >
                <stat.icon size={28} className={`${stat.colorClass} mb-3`} />
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-[10px] text-slate-500">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Weekly EDP Performance Progress Bars */}
            <div className="lg:col-span-8 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
                <Target className="text-blue-400" /> สมมติฐาน H1: ทักษะ EDP (รายสัปดาห์)
              </h3>
              <div className="space-y-6">
                {[
                  { w: 1, label: "การระบุปัญหา", score: 7.15, pct: 71.5, qual: "ดี", bgClass: "bg-blue-500", badgeClass: "bg-blue-500/20 text-blue-400" },
                  { w: 2, label: "การออกแบบ", score: 9.07, pct: 90.7, qual: "ดีเยี่ยม", bgClass: "bg-indigo-500", badgeClass: "bg-indigo-500/20 text-indigo-400" },
                  { w: 3, label: "การลงมือสร้าง", score: 9.42, pct: 94.2, qual: "ดีเยี่ยม", bgClass: "bg-emerald-500", badgeClass: "bg-emerald-500/20 text-emerald-400" },
                  { w: 4, label: "การทดสอบ", score: 8.95, pct: 89.5, qual: "ดีเยี่ยม", bgClass: "bg-emerald-500", badgeClass: "bg-emerald-500/20 text-emerald-400" },
                  { w: 5, label: "การนำเสนอ (Pitching)", score: 8.75, pct: 87.5, qual: "ดีเยี่ยม", bgClass: "bg-emerald-500", badgeClass: "bg-emerald-500/20 text-emerald-400" }
                ].map((bar, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-semibold text-sm">
                        <span className="text-slate-400 mr-2">Week {bar.w}:</span>
                        {bar.label}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg leading-none">{bar.score}</span>
                        <span className="text-slate-500 text-xs ml-1">/ 10</span>
                        <span className={`ml-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${bar.badgeClass}`}>
                          {bar.qual}
                        </span>
                      </div>
                    </div>
                    <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                        className={`absolute top-0 left-0 h-full rounded-full ${bar.bgClass}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Insight & Discussion Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 bg-gradient-to-br from-indigo-900/50 to-blue-900/50 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-center h-full"
            >
              <div className="absolute -top-10 -right-10 text-indigo-500/10 pointer-events-none">
                <Lightbulb size={160} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center gap-2 relative z-10">
                <Lightbulb size={24} className="text-amber-400" /> Discussion & Insight
              </h3>
              <div className="relative z-10 space-y-4 text-sm leading-relaxed text-indigo-100">
                <div>
                  <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-1"><CheckCircle size={14} className="text-emerald-400" /> บทสรุปผลการวิจัย (Chapter 5)</h4>
                  <p>ผลการวิจัยพบว่านักเรียนมีทักษะ EDP ในระดับดีเยี่ยม (ร้อยละ 86.68) ระบบ EDP Smart Log ช่วยรักษามาตรฐานการทำงานได้ดีเยี่ยมแม้ในช่วงที่มีภาระงานสูง ระบบอัตโนมัติช่วยให้การสรุปบทเรียนรวดเร็วและมีคุณภาพ</p>
                </div>

                <div className="pt-3 border-t border-indigo-500/30">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-1"><Search size={14} className="text-blue-400" /> ข้อค้นพบเพิ่มเติม (Chapter 4)</h4>
                  <p>จากการติดตามผลการดำเนินงานในสัปดาห์ที่ 5 พบว่าข้อจำกัดด้านเวลาในช่วงการทดสอบของสถานศึกษาทำให้การส่งงานล่าช้าเล็กน้อย แต่คุณภาพเชิงประจักษ์และการนำเสนอผ่านระบบ Auto-Portfolio ยังคงอยู่ในระดับดีเยี่ยม โดยมีคะแนนเฉลี่ยที่ 8.75 (ร้อยละ 87.50)</p>
                </div>

                <div className="pt-3 border-t border-indigo-500/30">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-1"><Lightbulb size={14} className="text-amber-400" /> อภิปรายผล (Discussion)</h4>
                  <p>ระบบช่วยลดภาระทางปัญญา (Cognitive Overload) ในช่วงสัปดาห์ที่ 2-4 ส่งผลให้ทักษะการออกแบบและสร้างอยู่ในระดับดีเยี่ยม</p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200 mt-6 shadow-inner">
                  <p className="font-bold mb-2 flex items-center gap-2 text-amber-400"><TrendingUp size={16} /> ข้อเสนอแนะเพื่อการพัฒนา (Future Work)</p>
                  <p className="text-xs leading-relaxed">เตรียมพัฒนาฟีเจอร์ส่งเสริมทักษะการสื่อสารสาธารณะ (Public Speaking) เพื่อลดช่องว่างความมั่นใจในขั้นตอนการนำเสนอผลงาน</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. Student Voice & Satisfaction */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <SectionHeading
            title={<span className="text-slate-900">เสียงสะท้อนจากผู้เรียน (Student Voice)</span>}
            subtitle={<span className="text-slate-500">ความคิดเห็นและระดับความพึงพอใจของนักเรียนกลุ่มตัวอย่าง 58 คน ที่มีต่อระบบ EDP Smart Logbook</span>}
          />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Hero Score & Analysis Panel */}
            <div className="lg:col-span-4 space-y-6">

              {/* Satisfaction Hero Block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Average Satisfaction</h3>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="text-7xl font-black text-slate-800 tracking-tighter">4.65</div>
                  <div className="text-slate-400 font-bold self-end pb-2">/ 5.00</div>
                </div>
                <div className="flex justify-center gap-1 text-amber-500 mb-4">
                  <Star size={24} fill="currentColor" />
                  <Star size={24} fill="currentColor" />
                  <Star size={24} fill="currentColor" />
                  <Star size={24} fill="currentColor" />
                  <div className="relative">
                    <Star size={24} className="text-slate-200" fill="currentColor" />
                    <Star size={24} className="absolute top-0 left-0 overflow-hidden text-amber-500" fill="currentColor" style={{ clipPath: 'inset(0 35% 0 0)' }} />
                  </div>
                </div>
                <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-full text-sm border border-emerald-100">
                  ระดับคุณภาพ: มากที่สุด
                </div>
              </motion.div>

              {/* Academic Content Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-blue-900 p-8 rounded-3xl shadow-lg text-white"
              >
                <h3 className="text-lg font-bold text-amber-400 mb-6 border-b border-blue-800 pb-4 flex items-center gap-2">
                  <TrendingUp size={20} /> สรุปประเด็นความประทับใจหลัก
                </h3>
                <ul className="space-y-5">
                  <li className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-800/50 flex-shrink-0 flex items-center justify-center text-blue-300 font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-bold text-blue-100 text-sm mb-1">Cognitive Scaffolding</h4>
                      <p className="text-xs text-blue-200/80 leading-relaxed">ช่วยจัดระเบียบความคิดและกระบวนการทำงานให้เป็นขั้นเป็นตอน</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-800/50 flex-shrink-0 flex items-center justify-center text-blue-300 font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-bold text-blue-100 text-sm mb-1">Efficiency</h4>
                      <p className="text-xs text-blue-200/80 leading-relaxed">ลดภาระการเขียนและจัดการเอกสาร (Paperless)</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-800/50 flex-shrink-0 flex items-center justify-center text-blue-300 font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-bold text-blue-100 text-sm mb-1">UX/UI</h4>
                      <p className="text-xs text-blue-200/80 leading-relaxed">อินเทอร์เฟซทันสมัย ใช้งานง่าย และเข้าถึงได้ทุกที่ทุกเวลา</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

            </div>

            {/* Right Column: Qualitative Feedback Wall */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "ฐิตินันท์ แก้วโกย", quote: "ใช้งานง่าย เป็นระบบมากขึ้น มีระบบความคิดที่เป็นกระบวนการมากขึ้น", color: "blue" },
                  { name: "นลิญา แก้วขาว", quote: "ตรวจสอบงานค้างได้ง่าย สะดวกในการกรอกข้อความไม่ต้องเขียนเยอะให้วุ่นวาย", color: "emerald" },
                  { name: "ญาณกร จารุตามระ", quote: "บันทึกข้อมูลสะดวก ดูย้อนหลังได้ง่าย ช่วยให้จัดการข้อมูลเป็นระเบียบ", color: "indigo" },
                  { name: "พิชานันท์ นิตินาวาการ", quote: "ระบบเท่ ใช้งานง่าย สะดวกต่อการเรียนมาก", color: "purple" },
                  { name: "ศริญรัตน์ กิจเรือนทอง", quote: "หน้าเว็บสวย สนุก ช่วยให้การทำงานกลุ่มไม่น่าเบื่อ", color: "pink" },
                  { name: "ธนวิชญ์ ไชยบำรุง", quote: "รายละเอียดชัดเจน ใช้งานง่าย ไม่สับสน", color: "amber" }
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all group flex flex-col h-full"
                  >
                    <div className={`text-${testimonial.color}-200 mb-3`}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21L16.417 14C16.6669 13.0645 16.7112 12.0699 16.5458 11.1158C16.3804 10.1616 16.011 9.2635 15.474 8.51475C14.9369 7.76599 14.2514 7.1942 13.486 6.85806C12.7206 6.52191 11.9038 6.43431 11.117 6.606C10.5144 6.74106 9.96253 7.03212 9.51036 7.45265C9.05819 7.87317 8.72007 8.41031 8.52599 9.01701H11.017C11.5474 9.01701 12.0561 9.22772 12.4312 9.60279C12.8063 9.97787 13.017 10.4866 13.017 11.017C13.017 11.5474 12.8063 12.0561 12.4312 12.4312C12.0561 12.8063 11.5474 13.017 11.017 13.017H6.01699C5.48656 13.017 4.97785 12.8063 4.60278 12.4312C4.2277 12.0561 4.01699 11.5474 4.01699 11.017V9.01701C4.01699 7.50974 4.54462 6.0463 5.5161 4.90806C6.48757 3.76982 7.83617 3.03606 9.2995 2.84601L9.75699 2.78401L9.36699 1.57701L8.91699 1.63701C7.03961 1.88414 5.30906 2.83696 4.07283 4.3105C2.83659 5.78404 2.18349 7.67138 2.23699 9.59301V11.017C2.23699 12.0224 2.63646 12.9867 3.34739 13.6976C4.05833 14.4085 5.02263 14.808 6.01699 14.808H9.86699L7.46699 21H14.017Z" />
                        <path d="M22.017 21L24.417 14C24.6669 13.0645 24.7112 12.0699 24.5458 11.1158C24.3804 10.1616 24.011 9.2635 23.474 8.51475C22.9369 7.76599 22.2514 7.1942 21.486 6.85806C20.7206 6.52191 19.9038 6.43431 19.117 6.606C18.5144 6.74106 17.9625 7.03212 17.5104 7.45265C17.0582 7.87317 16.7201 8.41031 16.526 9.01701H19.017C19.5474 9.01701 20.0561 9.22772 20.4312 9.60279C20.8063 9.97787 21.017 10.4866 21.017 11.017C21.017 11.5474 20.8063 12.0561 20.4312 12.4312C20.0561 12.8063 19.5474 13.017 19.017 13.017H14.017C13.4866 13.017 12.9779 12.8063 12.6028 12.4312C12.2277 12.0561 12.017 11.5474 12.017 11.017V9.01701C12.017 7.50974 12.5446 6.0463 13.5161 4.90806C14.4876 3.76982 15.8362 3.03606 17.2995 2.84601L17.757 2.78401L17.367 1.57701L16.917 1.63701C15.0396 1.88414 13.3091 2.83696 12.0728 4.3105C10.8366 5.78404 10.1835 7.67138 10.237 9.59301V11.017C10.237 12.0224 10.6365 12.9867 11.3474 13.6976C12.0583 14.4085 13.0226 14.808 14.017 14.808H17.867L15.467 21H22.017Z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className={`w-8 h-8 rounded-full bg-${testimonial.color}-100 flex items-center justify-center text-${testimonial.color}-600 font-bold text-xs uppercase`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{testimonial.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Section พิเศษ: คณะผู้จัดทำและผู้เชี่ยวชาญ (The Advisory Team) */}
      <section className="w-full py-20 bg-white border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading title="คณะผู้วิจัยและที่ปรึกษา" subtitle="ขอขอบพระคุณอาจารย์ที่ปรึกษา ครูพี่เลี้ยง และผู้เชี่ยวชาญที่ให้ความอนุเคราะห์ในการวิจัย" />

          {/* แถวที่ 1: ผู้วิจัย & ที่ปรึกษา */}
          <div className="flex flex-wrap justify-center gap-10 mt-12 w-full">
            {/* ผู้วิจัย */}
            <div className="flex flex-col items-center text-center group w-full sm:w-64 md:w-72 px-2">
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-blue-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                <img src="/team/1.jpg" alt="นายบุญวิชญ์ ปวโรภาส" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <h4 className="font-bold text-slate-800 text-lg md:text-xl break-words w-full">นายบุญวิชญ์ ปวโรภาส</h4>
              <p className="text-sm text-blue-600 font-medium mb-1 break-words w-full">ผู้วิจัย</p>
              <p className="text-xs text-slate-500 break-words w-full">นิสิตสาขาเทคโนโลยีดิจิทัลเพื่อการศึกษา<br />มหาวิทยาลัยเกษตรศาสตร์</p>
            </div>

            {/* อาจารย์ที่ปรึกษา */}
            <div className="flex flex-col items-center text-center group w-full sm:w-64 md:w-80 px-2">
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-amber-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                <img src="/team/2.jpg" alt="ผศ. ดร. ณัฏฐ์วิชิดา เลิศพงศ์รุจิกร" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
              </div>
              <h4 className="font-bold text-slate-800 text-lg md:text-xl break-words w-full leading-snug">ผศ. ดร. ณัฏฐ์วิชิดา เลิศพงศ์รุจิกร</h4>
              <p className="text-sm text-amber-600 font-medium mb-1 mt-1 break-words w-full">อาจารย์ที่ปรึกษางานวิจัย</p>
              <p className="text-xs text-slate-500 break-words w-full">คณะศึกษาศาสตร์<br />มหาวิทยาลัยเกษตรศาสตร์</p>
            </div>
          </div>

          {/* แถวที่ 2: ครูพี่เลี้ยง */}
          <div className="mt-20 text-center w-full">
            <h3 className="text-xl font-bold text-slate-700 mb-8 border-b-2 border-emerald-200 inline-block pb-2 px-8">ครูพี่เลี้ยง</h3>
            <div className="flex flex-wrap justify-center gap-10 w-full">
              {/* ครูพี่เลี้ยง 1 */}
              <div className="flex flex-col items-center text-center group w-full sm:w-60 md:w-72 px-2">
                <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-emerald-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <img src="/team/3.jpg" alt="นางสาวอณิมา รอตเสียงล้ำ" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h4 className="font-bold text-slate-800 text-base md:text-lg break-words w-full">นางสาวอณิมา รอตเสียงล้ำ</h4>
                <p className="text-sm text-emerald-600 font-medium mb-1 break-words w-full">ครูพี่เลี้ยง</p>
                <p className="text-xs text-slate-500 break-words w-full">ครูชำนาญการพิเศษ<br />โรงเรียนหอวัง</p>
              </div>

              {/* ครูพี่เลี้ยง 2 */}
              <div className="flex flex-col items-center text-center group w-full sm:w-60 md:w-72 px-2">
                <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-emerald-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <img src="/team/4.jpg" alt="นางสาวประภัสสร ดลดุสิตา" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h4 className="font-bold text-slate-800 text-base md:text-lg break-words w-full">นางสาวประภัสสร ดลดุสิตา</h4>
                <p className="text-sm text-emerald-600 font-medium mb-1 break-words w-full">ครูพี่เลี้ยง</p>
                <p className="text-xs text-slate-500 break-words w-full">ครูชำนาญการพิเศษ<br />โรงเรียนหอวัง</p>
              </div>
            </div>
          </div>

          {/* แถวที่ 3: ผู้เชี่ยวชาญ */}
          <div className="mt-20 text-center w-full">
            <h3 className="text-xl font-bold text-slate-700 mb-8 border-b-2 border-purple-200 inline-block pb-2 px-8">ผู้เชี่ยวชาญประเมินเครื่องมือวิจัย (IOC)</h3>
            <div className="flex flex-wrap justify-center gap-10 w-full">
              {/* ผู้เชี่ยวชาญ 1 */}
              <div className="flex flex-col items-center text-center group w-full sm:w-60 md:w-72 px-2">
                <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-purple-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <img src="/team/5.jpg" alt="นายชำนาญ เปตามะนัง" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h4 className="font-bold text-slate-800 text-base md:text-lg break-words w-full">นายชำนาญ เปตามะนัง</h4>
                <p className="text-sm text-purple-600 font-medium mb-1 break-words w-full">ผู้เชี่ยวชาญ</p>
                <p className="text-xs text-slate-500 break-words w-full">ครูชำนาญการ / หัวหน้างานคอมพิวเตอร์<br />โรงเรียนหอวัง</p>
              </div>

              {/* ผู้เชี่ยวชาญ 2 */}
              <div className="flex flex-col items-center text-center group w-full sm:w-60 md:w-72 px-2">
                <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-purple-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <img src="/team/6.jpg" alt="นางสาววรวรรณ แซ่ซิ้ม" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h4 className="font-bold text-slate-800 text-base md:text-lg break-words w-full">นางสาววรวรรณ แซ่ซิ้ม</h4>
                <p className="text-sm text-purple-600 font-medium mb-1 break-words w-full">ผู้เชี่ยวชาญ</p>
                <p className="text-xs text-slate-500 break-words w-full">ครูชำนาญการพิเศษ<br />โรงเรียนหอวัง</p>
              </div>

              {/* ผู้เชี่ยวชาญ 3 */}
              <div className="flex flex-col items-center text-center group w-full sm:w-60 md:w-72 px-2">
                <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden mb-4 border-4 border-purple-100 shadow-md group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center">
                  <img src="/team/7.jpg" alt="นางสาววิมล สายทองมี" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h4 className="font-bold text-slate-800 text-base md:text-lg break-words w-full">นางสาววิมล สายทองมี</h4>
                <p className="text-sm text-purple-600 font-medium mb-1 break-words w-full">ผู้เชี่ยวชาญ</p>
                <p className="text-xs text-slate-500 break-words w-full">ครูชำนาญการ<br />โรงเรียนหอวัง</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">

          {/* Test Credentials & QR Code */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-center shadow-xl mb-16 relative overflow-hidden">
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>

            <div className="w-48 h-48 bg-white p-2 text-center rounded-2xl shrink-0 shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform flex flex-col items-center justify-center border-4 border-slate-700 relative">
              <Activity size={32} className="text-slate-300 absolute" />
              <img src="/qrcode.png" alt="System QR Code" className="w-full h-full object-contain relative z-10" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="text-slate-900 font-bold text-xs mt-1 block w-full bg-slate-100 py-1 rounded relative z-10">สแกนเพื่อทดลองใช้</span>
            </div>

            <div className="text-center md:text-left relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-2"><Lightbulb className="text-amber-400" /> ทดลองใช้งานระบบ ( สำหรับคณะกรรมการ )</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md">เชิญทดลองเข้าสู่ระบบในฐานะ "ครูผู้สอน" เพื่อดูหน้าจอ Teacher Dashboard และทดลองตรวจประเมินผลงานผ่าน Interactive Matrix</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex-1 items-center justify-between flex">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Username (Email)</span>
                    <span className="text-blue-400 font-mono text-sm leading-none">test@gmail.com</span>
                  </div>
                  <button className="text-slate-500 hover:text-white transition"><Copy size={16} /></button>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex-1 items-center justify-between flex">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Password</span>
                    <span className="text-white font-mono text-sm leading-none">123456</span>
                  </div>
                  <button className="text-slate-500 hover:text-white transition"><Copy size={16} /></button>
                </div>
              </div>

              <div className="mt-6 flex justify-center md:justify-start">
                <a href="https://scaffolded-logbook-research.web.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-full transition-colors shadow-lg">
                  เข้าสู่ระบบ <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p>© 2026 EDP Smart Logbook Research Project. All rights reserved.</p>
            <p className="flex items-center gap-2"><Activity size={14} className="text-blue-500" /> Designed for Educational Action Research (KU)</p>
          </div>
        </div>
      </footer>

      {/* Modal — rendered at root level, z-[100] sits above the sticky nav (z-40) */}
      <ProjectDetailModal selectedTeam={selectedTeam} evaluations={evaluations} onClose={() => setSelectedTeam(null)} />

    </div>
  );
}
