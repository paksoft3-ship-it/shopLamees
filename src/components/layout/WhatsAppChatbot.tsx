"use client";
import { useState } from "react";
import { Link } from '@/i18n/navigation';
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhatsAppChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Home.Layout.WhatsAppChatbot');

    return (
        <>
            {/* AI Chatbot Floating Box & Button */}
            <div className="fixed bottom-24 lg:bottom-6 rtl:right-6 ltr:left-6 z-50 flex flex-col items-end gap-4">
                {isOpen && (
                    <div className="w-80 h-96 bg-surface shadow-soft rounded-2xl border border-[#e5e0d8] flex flex-col overflow-hidden">
                        <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
                            <span className="font-heading font-medium">{t('ai_title')}</span>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-lg">&times;</button>
                        </div>
                        <div className="flex-1 bg-background-light flex flex-col p-4 text-center">
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <p className="text-subtle font-body text-sm mb-4">{t('ai_greeting')}</p>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-14 w-14 rounded-full bg-on-surface text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform rtl:mr-auto ltr:ml-auto"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Dedicated WhatsApp Button (from Mobile Reference) */}
            <Link
                className="fixed bottom-24 lg:bottom-6 rtl:left-6 ltr:right-6 z-50 bg-[#25D366] text-white p-3 lg:p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center"
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
            >
                <svg className="bi bi-whatsapp" fill="currentColor" height="28" viewBox="0 0 16 16" width="28" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                </svg>
            </Link>
        </>
    );
}
