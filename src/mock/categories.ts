export type Category = {
    id: string;
    slug: string;
    name: { ar: string; en: string };
    image?: string;
    icon?: string;
};

export const categories: Category[] = [
    {
        id: "cat_1",
        slug: "niqab",
        name: { ar: "نقاب", en: "Niqab" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxyrF5RLNAVeE_WWk6xnz3PSTm1Fs8UzdZFP5a8qLMyXwt5s0VRYptgEbkOOQdz2gHWBj6j5zzJVNk4rKVplGWwoUiliNRtaqgnAVCJolgztgID-AslN4rsQQYuymZTqJBsfH2ZbvboUyNBdVfdkKL8g6rJkWh9VR_63PW4lid0V57WG3LX9_bfezv42FP8loWMOxvcp9AXXcBFS98JSsDDfHD758rZF2JlR7jKByVzE6snTx6YaqO-BDE3k5fawmUcIoF-net3MY"
    },
    {
        id: "cat_2",
        slug: "abayas",
        name: { ar: "عبايات", en: "Abayas" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfDJOS9mncPW6mkHa4MFsXoN7155qXBfygs-tflceAUTROohGg9jiKwfeXwOo7StFxKorNGJ8u3dNCTuuYb317UXS2gMXZLL70g4PP4pLp0G8P4O05hCrAI3pyzvcBFElaEiZ10YiCcH3PLp9UxdjtoEhiEZpEKgHKDOxFQzGqTSb_e62fxgiCgUuSUegUNbgN8B3yYugsyHbUZz6u9xqlz8Li7SFe_M_yFuRRpU2lIvY7A2xD7w31RUpOGmoInGe_K1RiqS7NU7Y"
    },
    {
        id: "cat_3",
        slug: "velvet",
        name: { ar: "مخمل", en: "Velvet" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXRYj-2o15XygA8yncDw4pc9yZNJU5uvYJn_XMQkNUsz2D4RD8Sn__ZaaoMEDwAHm_cYkkPUbnNv4nsJnWjuF92kusPPQl_plAx4h7TvaSlOhK_XbN3fZC-EIQ0kZExXzcrTZj6CltJOiSwFOkopA4EviraQKrDeG2MKUoiyL5K9GSMjtp-A5-sGWs4NKBKHtJlSvFcummEUMMwinRzYWnZzGp_6_0OuT8k7dQ7yPpuNgxj010sNEcdTeoFkGpwDK6P9nn5InDTGA"
    },
    {
        id: "cat_4",
        slug: "crepe",
        name: { ar: "كريب", en: "Crepe" },
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs3Shac5R085MTcoYQckeNZ96RHIblQEhgWF2egDnTRTrbJHyBrX2wcV8SAVgtAOe9N-PeVmVQp4TQJ4ELlJie52Jw5RIL62U8ln8azO80NHtYCKEUc3rAHc0ztWw9w4OhGgYQC-3arL2sPx720pDKSDqUmeowyl-MKj_oUYTEp7Fx7B0Ij9vFLxAHlIS5veF4CAWU12vYTC0kj61wrOV7BL0CKsOe-Fmq5Y0wU-opz0_fdSLte9dj4QFkQxBb76Fi9bTATRpuNKM"
    }
];