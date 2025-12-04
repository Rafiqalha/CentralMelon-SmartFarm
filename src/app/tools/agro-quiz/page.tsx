'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, Trophy, RefreshCw, Loader2, Play, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AgroQuizPage() {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Topik Kuis
    const topics = [
        { id: 'hama', label: 'Pengendalian Hama & Penyakit', icon: '🐛' },
        { id: 'nutrisi', label: 'Manajemen Nutrisi AB Mix', icon: '💧' },
        { id: 'panen', label: 'Teknik Panen & Pasca Panen', icon: '🍈' },
    ];

    const startQuiz = async (topic: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, difficulty: 'Intermediate' }),
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
                setGameState('playing');
                setCurrentIndex(0);
                setScore(0);
                setSelectedOption(null);
                setShowExplanation(false);
            }
        } catch (e) {
            alert("Gagal memuat soal. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (index: number) => {
        setSelectedOption(index);
        setShowExplanation(true);

        if (index === questions[currentIndex].correctAnswer) {
            setScore(s => s + 20); // 20 poin per soal (5 soal)
            if (currentIndex === questions.length - 1) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setGameState('result');
        }
    };

    // Helper untuk gambar visual (Unsplash Source)
    const getVisualImage = (keyword: string) => {
        // Koleksi Gambar Relevan (Curated Unsplash URLs)
        const IMAGE_LIBRARY: Record<string, string> = {
            'hama': 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=1000&auto=format&fit=crop', // Daun rusak/hama
            'jamur': 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1000&auto=format&fit=crop', // Jamur/penyakit
            'nutrisi': 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop', // Buah sehat
            'panen': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop', // Panen melon
            'default': 'https://images.unsplash.com/photo-1492496913980-501348b61369?q=80&w=1000&auto=format&fit=crop' // Greenhouse umum
        };

        // Helper cerdas untuk memilih gambar
        const getVisualImage = (keyword: string) => {
            const lowerKey = keyword.toLowerCase();
            if (lowerKey.includes('hama') || lowerKey.includes('ulat') || lowerKey.includes('kutu')) return IMAGE_LIBRARY['hama'];
            if (lowerKey.includes('jamur') || lowerKey.includes('bercak') || lowerKey.includes('layu')) return IMAGE_LIBRARY['jamur'];
            if (lowerKey.includes('panen') || lowerKey.includes('matang') || lowerKey.includes('petik')) return IMAGE_LIBRARY['panen'];
            if (lowerKey.includes('nutrisi') || lowerKey.includes('pupuk') || lowerKey.includes('air')) return IMAGE_LIBRARY['nutrisi'];
            return IMAGE_LIBRARY['default'];
        };
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">

                {/* --- STATE: MENU UTAMA --- */}
                {gameState === 'menu' && (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div>
                            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                🎓 MelonMastery Academy
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-4">
                                Uji Pengetahuan <span className="text-emerald-600">Agronomi</span>
                            </h1>
                            <p className="text-slate-500 text-lg max-w-xl mx-auto">
                                Belajar budidaya melon premium melalui kuis interaktif bertenaga AI. Pilih topik untuk memulai.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {topics.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => startQuiz(t.label)}
                                    disabled={loading}
                                    className="group relative bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-500 transition-all text-left flex items-center gap-4 hover:shadow-lg active:scale-95"
                                >
                                    <span className="text-4xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-xl group-hover:bg-emerald-50 transition">
                                        {t.icon}
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-emerald-700 transition">{t.label}</h3>
                                        <p className="text-sm text-slate-400">5 Pertanyaan • {loading ? 'Memuat...' : 'Mulai Belajar'}</p>
                                    </div>
                                    <div className="ml-auto bg-slate-100 p-3 rounded-full text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                                        {loading ? <Loader2 className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- STATE: PLAYING --- */}
                {gameState === 'playing' && questions.length > 0 && (
                    <div className="w-full">
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between mb-6 text-sm font-bold text-slate-400">
                            <span>Soal {currentIndex + 1} dari {questions.length}</span>
                            <span className="text-emerald-600">{score} Poin</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                            <motion.div
                                className="h-full bg-emerald-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question Card */}
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                            >
                                {/* Label Tipe Soal */}
                                <div className="mb-4 flex gap-2">
                                    {questions[currentIndex].type === 'visual' && (
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <ImageIcon size={12} /> Analisis Visual
                                        </span>
                                    )}
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                                        {questions[currentIndex].type === 'multiple_choice' ? 'Teori Dasar' : questions[currentIndex].type === 'visual' ? 'Studi Kasus' : 'Analisis'}
                                    </span>
                                </div>

                                {/* Gambar (Jika Visual Question) */}
                                {questions[currentIndex].type === 'visual' && (
                                    <div className="mb-6 rounded-2xl overflow-hidden h-48 bg-gray-100 relative">
                                        {/* Fallback image logic sederhana */}
                                        <img
                                            src={`https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=1000&auto=format&fit=crop`} // Dummy image agar tidak blank (realitanya gunakan API search gambar)
                                            alt="Quiz Visual"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center p-4">
                                            <p className="text-sm font-medium opacity-80">(Simulasi Visual AI: {questions[currentIndex].imageKeyword})</p>
                                        </div>
                                    </div>
                                )}

                                <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
                                    {questions[currentIndex].question}
                                </h2>

                                <div className="space-y-3">
                                    {questions[currentIndex].options.map((opt: string, idx: number) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrect = idx === questions[currentIndex].correctAnswer;
                                        const showResult = showExplanation;

                                        let btnClass = "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"; // Default
                                        if (showResult) {
                                            if (isCorrect) btnClass = "bg-emerald-100 border-emerald-500 text-emerald-800"; // Jawaban Benar
                                            else if (isSelected && !isCorrect) btnClass = "bg-red-100 border-red-500 text-red-800"; // Jawaban Salah User
                                            else btnClass = "border-gray-200 opacity-50"; // Sisa opsi
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => !showExplanation && handleAnswer(idx)}
                                                disabled={showExplanation}
                                                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ${btnClass}`}
                                            >
                                                <span>{opt}</span>
                                                {showResult && isCorrect && <CheckCircle className="text-emerald-600" />}
                                                {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* EXPLANATION BOX */}
                                {showExplanation && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-6 bg-blue-50 p-5 rounded-2xl border border-blue-100 text-sm text-blue-800"
                                    >
                                        <p className="font-bold mb-1 flex items-center gap-2">
                                            <BookOpen size={16} /> Penjelasan Ahli:
                                        </p>
                                        {questions[currentIndex].explanation}
                                    </motion.div>
                                )}

                                {/* NEXT BUTTON */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={nextQuestion}
                                        disabled={!showExplanation}
                                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjut'}
                                    </button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                {/* --- STATE: RESULT --- */}
                {gameState === 'result' && (
                    <div className="text-center bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy size={48} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quiz Selesai!</h2>
                        <p className="text-gray-500 mb-8">Kamu telah menyelesaikan modul ini.</p>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-xs text-gray-400 uppercase font-bold">Skor Kamu</p>
                                <p className="text-4xl font-black text-emerald-600">{score}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-xs text-gray-400 uppercase font-bold">Benar</p>
                                <p className="text-4xl font-black text-slate-800">{score / 20} / 5</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setGameState('menu')}
                                className="px-6 py-3 border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition"
                            >
                                Menu Utama
                            </button>
                            <button
                                onClick={() => startQuiz(topics[0].label)} // Restart logic simple
                                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                            >
                                <RefreshCw size={18} /> Coba Lagi
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}