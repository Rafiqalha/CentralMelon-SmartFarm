'use client';

import { X, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'danger' | 'success' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    type = 'info',
    onConfirm,
    onCancel,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    // Warna berdasarkan tipe
    const colors = {
        danger: { bg: 'bg-red-50', icon: 'text-red-500', btn: 'bg-red-600 hover:bg-red-700' },
        success: { bg: 'bg-emerald-50', icon: 'text-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700' },
        info: { bg: 'bg-blue-50', icon: 'text-blue-500', btn: 'bg-slate-900 hover:bg-slate-800' },
    };

    const currentStyle = colors[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 ${currentStyle.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {type === 'danger' && <AlertTriangle className={currentStyle.icon} size={32} />}
                        {type === 'success' && <CheckCircle className={currentStyle.icon} size={32} />}
                        {type === 'info' && <HelpCircle className={currentStyle.icon} size={32} />}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 ${currentStyle.btn}`}
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}