'use client';

import { useState, MouseEvent } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [bgPosition, setBgPosition] = useState('0% 0%');

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setBgPosition(`${x}% ${y}%`);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="lg:col-span-7 flex flex-col lg:flex-row gap-4 h-fit relative z-20">
            <div 
                className="relative flex-1 aspect-[3/4] lg:aspect-auto lg:h-[600px] cursor-zoom-in order-1 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
            >
                {/* Default Main Image Container */}
                <div className="absolute inset-0 bg-gray-100 md:rounded-lg overflow-hidden">
                    <Image
                        src={images[activeIndex]}
                        alt={`${productName} main view`}
                        fill
                        className="object-cover transition-opacity duration-200"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                    />
                </div>

                {/* Hover Zoom Center Popup (Desktop Only) */}
                {isHovered && (
                    <div className="hidden md:block fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300">
                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] bg-white border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-2xl pointer-events-none overflow-hidden"
                            style={{
                                backgroundImage: `url(${images[activeIndex]})`,
                                backgroundPosition: bgPosition,
                                backgroundSize: '200%',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    </div>
                )}

                {/* Desktop Zoom Icon */}
                <div className={`hidden md:block absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100 pointer-events-none'}`}>
                    <span className="material-symbols-outlined text-[#374151]">zoom_in</span>
                </div>
            </div>

            {/* Thumbnails — horizontal row on mobile, vertical column on desktop */}
            {images.length > 1 && (
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-24 lg:h-[600px] no-scrollbar py-1 order-2 lg:order-none">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative flex-shrink-0 w-16 h-20 lg:w-full lg:h-32 rounded-lg overflow-hidden transition-colors ${activeIndex === idx
                                ? 'border-2 border-primary ring-2 ring-primary/20 ring-offset-1'
                                : 'border border-[#e5e7eb] hover:border-[#9ca3af]'
                                }`}
                            aria-label={`${productName} image ${idx + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
