'use client';

import { useState, useRef, useEffect } from 'react';
import { Usb, Lock, Unlock, Activity, Zap, Volume2, Mic } from 'lucide-react';

export default function RealHardwareControl() {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState({ jarak: 0, pintu: 'TUTUP', isManual: false });
    const [logs, setLogs] = useState<string[]>([]);
    const [jarvisText, setJarvisText] = useState("SYSTEM READY. WAITING FOR INPUT...");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const portRef = useRef<any>(null);
    const readerRef = useRef<any>(null);
    const writerRef = useRef<any>(null);
    const keepReading = useRef(false);
    const prevDoorStatus = useRef('TUTUP');

    const typeWriter = (text: string) => {
        setIsSpeaking(true);
        setJarvisText("");
        let i = 0;
        const speed = 30; 

        const typing = setInterval(() => {
            if (i < text.length) {
                setJarvisText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typing);
                setTimeout(() => setIsSpeaking(false), 2000); 
            }
        }, speed);
    };

    const playJarvisVoice = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const textToSpeak = "Sugeng rawuh. Selamat datang di Central Melon Smart Greenhouse.";

            typeWriter("> Sugeng rawuh. Selamat datang di Central Melon Smart Greenhouse.");

            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const voices = window.speechSynthesis.getVoices();

            const indoVoice = voices.find(v => v.name.includes('Google Bahasa Indonesia')) ||
                voices.find(v => v.lang === 'id-ID') ||
                voices[0];

            utterance.voice = indoVoice;
            utterance.pitch = 0.9;
            utterance.rate = 0.9;
            utterance.volume = 1;

            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        if (prevDoorStatus.current === 'TUTUP' && data.pintu === 'BUKA') {
            playJarvisVoice();
        } else if (prevDoorStatus.current === 'BUKA' && data.pintu === 'TUTUP') {
            setJarvisText("DOOR CLOSED. SECURE MODE ACTIVE.");
        }
        prevDoorStatus.current = data.pintu;
    }, [data.pintu]);

    const connectSerial = async () => {
        if (!('serial' in navigator)) {
            alert('Browser Anda tidak mendukung Web Serial API.');
            return;
        }
        try {
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate: 9600 });
            portRef.current = port;
            setIsConnected(true);
            keepReading.current = true;
            setupStreams(port);
        } catch (error) {
            console.error('Gagal connect:', error);
        }
    };

    const setupStreams = (port: any) => {
        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        readerRef.current = textDecoder.readable.getReader();

        const textEncoder = new TextEncoderStream();
        textEncoder.readable.pipeTo(port.writable);
        writerRef.current = textEncoder.writable.getWriter();

        readLoop();
    };

    const readLoop = async () => {
        let buffer = "";
        try {
            while (portRef.current.readable && keepReading.current) {
                const { value, done } = await readerRef.current.read();
                if (done) break;
                if (value) {
                    buffer += value;
                    const lines = buffer.split('\r\n');
                    for (let i = 0; i < lines.length - 1; i++) {
                        parseArduinoJSON(lines[i]);
                    }
                    buffer = lines[lines.length - 1];
                }
            }
        } catch (error) { console.error(error); } finally { readerRef.current.releaseLock(); }
    };

    const parseArduinoJSON = (jsonString: string) => {
        try {
            const cleanString = jsonString.trim();
            if (!cleanString.startsWith('{')) return;
            setData(JSON.parse(cleanString));
        } catch (e) { }
    };

    const sendCommand = async (cmd: string) => {
        if (!writerRef.current) return;
        try {
            await writerRef.current.write(cmd + "\n");
            setJarvisText(`> EXECUTING COMMAND: ${cmd}...`);
        } catch (e) { console.error(e); }
    };

    const disconnect = async () => {
        keepReading.current = false;
        if (readerRef.current) await readerRef.current.cancel();
        if (writerRef.current) await writerRef.current.close();
        if (portRef.current) await portRef.current.close();
        setIsConnected(false);
        setJarvisText("SYSTEM DISCONNECTED.");
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            {/* --- JARVIS HUD DISPLAY (NEW UI) --- */}
            <div className="mb-8 relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-black/80 border border-cyan-500/30 p-4 rounded-lg flex items-center gap-6 backdrop-blur-xl">

                    {/* Sound Wave Animation */}
                    <div className="flex gap-1 items-end h-8 shrink-0">
                        <span className={`w-1.5 bg-cyan-400 rounded-full transition-all duration-100 ${isSpeaking ? 'h-full animate-[bounce_0.5s_infinite]' : 'h-2'}`}></span>
                        <span className={`w-1.5 bg-cyan-400 rounded-full transition-all duration-100 ${isSpeaking ? 'h-3/4 animate-[bounce_0.7s_infinite]' : 'h-3'}`}></span>
                        <span className={`w-1.5 bg-cyan-400 rounded-full transition-all duration-100 ${isSpeaking ? 'h-full animate-[bounce_0.6s_infinite]' : 'h-2'}`}></span>
                        <span className={`w-1.5 bg-cyan-400 rounded-full transition-all duration-100 ${isSpeaking ? 'h-1/2 animate-[bounce_0.8s_infinite]' : 'h-4'}`}></span>
                    </div>

                    {/* Typing Text Area */}
                    <div className="flex-1 font-mono text-cyan-300 text-sm md:text-base tracking-wider uppercase shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                        {jarvisText}<span className="animate-pulse text-white">_</span>
                    </div>

                    {/* Status Badge */}
                    <div className="px-3 py-1 rounded border border-cyan-500/30 bg-cyan-900/20 text-[10px] text-cyan-400 font-bold hidden md:block">
                        AI ACTIVE
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Usb className={isConnected ? "text-emerald-400" : "text-slate-500"} />
                        Hardware Control
                    </h2>
                    <p className="text-slate-400 text-sm">Hubungkan Arduino Uno via USB untuk kontrol langsung.</p>
                </div>

                {!isConnected ? (
                    <button
                        onClick={connectSerial}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center gap-2 transition shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse"
                    >
                        <Usb size={18} /> Connect Device
                    </button>
                ) : (
                    <button
                        onClick={disconnect}
                        className="px-6 py-3 bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white rounded-xl font-bold flex items-center gap-2 transition"
                    >
                        Disconnect
                    </button>
                )}
            </div>

            {/* DASHBOARD AREA */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-500 ${!isConnected ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>

                {/* KIRI: SENSOR MONITOR */}
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-cyan-400 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Activity size={16} /> Live Sensor Data
                    </h3>

                    <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                            <p className="text-slate-400 text-xs uppercase mb-1">Jarak Objek</p>
                            <div className="flex items-end justify-center gap-1">
                                <span className="text-5xl font-mono font-black text-white">{data.jarak}</span>
                                <span className="text-sm font-bold text-emerald-500 mb-2">cm</span>
                            </div>
                        </div>

                        {/* Visualisasi Bar */}
                        <div className="h-32 w-4 bg-slate-800 rounded-full relative overflow-hidden">
                            <div
                                className={`absolute bottom-0 left-0 w-full transition-all duration-300 ${data.jarak < 15 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}
                                style={{ height: `${Math.min(data.jarak * 2, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                        <p className="text-[10px] text-slate-500 font-mono mb-1">RAW SERIAL JSON</p>
                        <p className="text-xs font-mono text-green-400 truncate">
                            {`{"jarak":${data.jarak},"pintu":"${data.pintu}","manual":${data.isManual}}`}
                        </p>
                    </div>
                </div>

                {/* KANAN: SERVO CONTROL */}
                <div className="bg-black/40 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-purple-400 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Zap size={16} /> Servo Actuator
                        </h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-4 rounded-full ${data.pintu === 'BUKA' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500/20 text-red-400 border-red-500'} border-2 transition-all duration-300`}>
                                {data.pintu === 'BUKA' ? <Unlock size={32} /> : <Lock size={32} />}
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase">Status Pintu</p>
                                <p className="text-2xl font-bold">{data.pintu}</p>
                                {data.isManual && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">WEB OVERRIDE</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => sendCommand("DOOR:BUKA")}
                            className="py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition"
                        >
                            <Unlock size={20} /> FORCE OPEN
                        </button>
                        <button
                            onClick={() => sendCommand("DOOR:TUTUP")}
                            className="py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-sm shadow-lg flex flex-col items-center justify-center gap-1 active:scale-95 transition"
                        >
                            <Lock size={20} /> FORCE CLOSE
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}