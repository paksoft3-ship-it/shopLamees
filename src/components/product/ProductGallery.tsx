'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 h-fit">
            {/* Thumbnails (Desktop Only) */}
            <div className="hidden md:flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 lg:h-[600px] no-scrollbar py-1">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-24 lg:w-full lg:h-32 rounded-lg overflow-hidden transition-colors ${activeIndex === idx
                            ? 'border-2 border-primary ring-2 ring-primary/20 ring-offset-2'
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

            {/* Main Image */}
            <div className="relative flex-1 bg-gray-100 aspect-[3/4] lg:aspect-auto lg:h-[600px] group cursor-zoom-in md:rounded-lg overflow-hidden">
                <Image
                    src={images[activeIndex]}
                    alt={`${productName} main view`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                />

                {/* Desktop Zoom Icon */}
                <div className="hidden md:block absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[#374151]">zoom_in</span>
                </div>

                {/* Mobile Pagination Dots */}
                {images.length > 1 && (
                    <div className="md:hidden absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full backdrop-blur-sm transition-all ${idx === activeIndex ? 'w-6 bg-primary shadow-sm' : 'w-1.5 bg-white/60'
                                    }`}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
