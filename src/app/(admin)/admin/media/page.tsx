'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { useTranslations, useLocale } from 'next-intl';
import { buildDefaultHomeVideos, type HomeVideoItem } from '@/lib/homeVideos';
import {
  getAdminStoreSettings,
  getAdminProductImages,
  type AdminSettingsDTO,
  type AdminMediaImage,
  updateAdminStoreSettings,
} from '@/lib/actions/adminInsights';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-m4v',
  'video/mpeg',
]);

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

function toSortedVideos(videos: HomeVideoItem[]): HomeVideoItem[] {
  return videos
    .filter((video) => video.src.trim().length > 0)
    .map((video, index) => ({
      ...video,
      src: video.src.trim(),
      poster: video.poster.trim(),
      label: video.label.trim(),
      sortOrder: index + 1,
    }));
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exp;
  return `${value.toFixed(value >= 100 || exp === 0 ? 0 : value >= 10 ? 1 : 2)} ${units[exp]}`;
}

export default function MediaPage() {
  const t = useTranslations('Admin.Media');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const L = (ar: string, en: string) => (isRtl ? ar : en);

  const [images, setImages] = useState<AdminMediaImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [preview, setPreview] = useState<AdminMediaImage | null>(null);

  const [activeTab, setActiveTab] = useState<'images' | 'homeVideos'>('images');
  const [videoSelected, setVideoSelected] = useState<number[]>([]);
  const [videoViewMode, setVideoViewMode] = useState<'grid' | 'list'>('grid');
  const [videoSearch, setVideoSearch] = useState('');
  const [videoPreview, setVideoPreview] = useState<HomeVideoItem | null>(null);
  const [videoSizes, setVideoSizes] = useState<Record<string, number>>({});

  const [settings, setSettings] = useState<AdminSettingsDTO | null>(null);
  const [homeVideos, setHomeVideos] = useState<HomeVideoItem[]>([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [posterUploadingIndex, setPosterUploadingIndex] = useState<number | null>(null);
  const [videoMessage, setVideoMessage] = useState('');
  const [videoError, setVideoError] = useState('');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const posterTargetIndexRef = useRef<number | null>(null);

  useEffect(() => {
    getAdminProductImages().then((data) => {
      setImages(data);
      setImagesLoading(false);
    });
  }, []);

  useEffect(() => {
    getAdminStoreSettings()
      .then((data) => {
        setSettings(data);
        setHomeVideos(data.homeVideos.length ? data.homeVideos : buildDefaultHomeVideos());
      })
      .catch(() => setVideoError(L('تعذر تحميل فيديوهات الصفحة الرئيسية', 'Failed to load homepage videos')))
      .finally(() => setVideoLoading(false));
  }, [isRtl]);

  useEffect(() => {
    let cancelled = false;

    const urls = Array.from(new Set(homeVideos.map((v) => v.src.trim()).filter(Boolean)));
    const pending = urls.filter((url) => videoSizes[url] === undefined);
    if (!pending.length) return;

    const readSize = async (url: string): Promise<number> => {
      const parseHeader = (value: string | null): number => {
        const n = Number(value || 0);
        return Number.isFinite(n) && n > 0 ? n : 0;
      };

      try {
        const head = await fetch(url, { method: 'HEAD' });
        const size = parseHeader(head.headers.get('content-length'));
        if (size > 0) return size;
      } catch {}

      try {
        const ranged = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } });
        const contentRange = ranged.headers.get('content-range');
        if (contentRange) {
          const match = contentRange.match(/\/(\d+)$/);
          const size = Number(match?.[1] || 0);
          if (Number.isFinite(size) && size > 0) return size;
        }
        const fallback = parseHeader(ranged.headers.get('content-length'));
        if (fallback > 0) return fallback;
      } catch {}

      return 0;
    };

    Promise.all(pending.map(async (url) => ({ url, size: await readSize(url) }))).then((rows) => {
      if (cancelled) return;
      setVideoSizes((prev) => {
        const next = { ...prev };
        for (const row of rows) next[row.url] = row.size;
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [homeVideos, videoSizes]);

  const setVideoField = (index: number, patch: Partial<HomeVideoItem>) => {
    setHomeVideos((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setVideoError('');
    setVideoMessage('');

    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      setVideoError(L('نوع الفيديو غير مدعوم. استخدمي MP4 أو WEBM أو MOV.', 'Unsupported video type. Use MP4, WEBM, or MOV.'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_VIDEO_BYTES) {
      setVideoError(L('حجم الفيديو كبير جداً. الحد الأقصى 100MB.', 'Video is too large. Max size is 100MB.'));
      event.target.value = '';
      return;
    }

    setVideoUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const blob = await upload(uniqueName, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setHomeVideos((prev) => [
        ...prev,
        {
          src: blob.url,
          poster: '',
          label: file.name.replace(/\.[^.]+$/, ''),
          enabled: true,
          sortOrder: prev.length + 1,
        },
      ]);
      setVideoMessage(L('تم رفع الفيديو. اضغط حفظ التغييرات.', 'Video uploaded. Click Save Changes.'));
    } catch {
      setVideoError(L('فشل رفع الفيديو', 'Video upload failed'));
    } finally {
      setVideoUploading(false);
      event.target.value = '';
    }
  };

  const openPosterPicker = (index: number) => {
    posterTargetIndexRef.current = index;
    posterInputRef.current?.click();
  };

  const handleUploadPoster = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const targetIndex = posterTargetIndexRef.current;
    if (!file || targetIndex === null) return;

    setVideoError('');
    setVideoMessage('');

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setVideoError(L('نوع الصورة غير مدعوم', 'Unsupported image type'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setVideoError(L('حجم الصورة كبير جداً. الحد الأقصى 8MB.', 'Image is too large. Max size is 8MB.'));
      event.target.value = '';
      return;
    }

    setPosterUploadingIndex(targetIndex);
    try {
      const ext = file.name.split('.').pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const blob = await upload(uniqueName, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setVideoField(targetIndex, { poster: blob.url });
      setVideoMessage(L('تم رفع صورة الغلاف. اضغط حفظ التغييرات.', 'Poster uploaded. Click Save Changes.'));
    } catch {
      setVideoError(L('فشل رفع صورة الغلاف', 'Poster upload failed'));
    } finally {
      setPosterUploadingIndex(null);
      posterTargetIndexRef.current = null;
      event.target.value = '';
    }
  };

  const handleSaveHomeVideos = async () => {
    if (!settings) return;
    setVideoSaving(true);
    setVideoError('');
    setVideoMessage('');
    try {
      const normalized = toSortedVideos(homeVideos);
      await updateAdminStoreSettings({ ...settings, homeVideos: normalized });
      setHomeVideos(normalized);
      setSettings((prev) => (prev ? { ...prev, homeVideos: normalized } : prev));
      setVideoMessage(L('تم حفظ فيديوهات الصفحة الرئيسية', 'Homepage videos saved'));
    } catch {
      setVideoError(L('تعذر حفظ الفيديوهات', 'Unable to save videos'));
    } finally {
      setVideoSaving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleVideoSelect = (index: number) => {
    setVideoSelected((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const totalSize = images.length;
  const videoRows = useMemo(
    () =>
      homeVideos
        .map((video, index) => ({ video, index }))
        .filter(({ video }) => {
          const q = videoSearch.trim().toLowerCase();
          if (!q) return true;
          return (
            video.label.toLowerCase().includes(q) ||
            video.src.toLowerCase().includes(q) ||
            video.poster.toLowerCase().includes(q)
          );
        }),
    [homeVideos, videoSearch],
  );
  const totalVideoBytes = homeVideos.reduce((sum, video) => sum + (videoSizes[video.src] || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'images' && selected.length > 0 && (
            <button className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
              <span className="material-symbols-outlined text-lg">delete</span>
              {t('delete_selected', { count: selected.length })}
            </button>
          )}
          {activeTab === 'homeVideos' && videoSelected.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setHomeVideos((prev) => prev.filter((_, index) => !videoSelected.includes(index)));
                setVideoSelected([]);
              }}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              {t('delete_selected', { count: videoSelected.length })}
            </button>
          )}
          {activeTab === 'images' && (
            <label className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md cursor-pointer">
              <span className="material-symbols-outlined text-lg">upload</span>
              {t('upload')}
              <input type="file" multiple accept="image/*" className="hidden" />
            </label>
          )}
          {activeTab === 'homeVideos' && (
            <>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={videoUploading || videoLoading}
                className="inline-flex items-center gap-2 bg-[#1b170d] hover:bg-[#30291b] disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-lg">video_call</span>
                {videoUploading ? L('جاري الرفع...', 'Uploading...') : L('رفع فيديو', 'Upload Video')}
              </button>
              <button
                type="button"
                onClick={handleSaveHomeVideos}
                disabled={videoSaving || videoLoading}
                className="inline-flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                {videoSaving ? L('جاري الحفظ...', 'Saving...') : t('save_changes')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'images' ? 'bg-[#edab1d]/15 text-[#d49511]' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {isRtl ? 'الصور' : 'Images'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('homeVideos')}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'homeVideos' ? 'bg-[#edab1d]/15 text-[#d49511]' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {isRtl ? 'فيديوهات الرئيسية' : 'Homepage Videos'}
          </button>
        </div>
      </div>

      {activeTab === 'homeVideos' && (
        <>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/mpeg"
            className="hidden"
            onChange={handleUploadVideo}
          />

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: L('إجمالي الفيديوهات', 'Total Videos'), value: homeVideos.length, icon: 'movie', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: t('total_size'), value: formatBytes(totalVideoBytes), icon: 'storage', color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: t('selected'), value: videoSelected.length, icon: 'check_box', color: 'text-green-600', bg: 'bg-green-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{m.label}</p>
                  <p className="text-lg font-bold text-[#1b170d]">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-white border border-neutral-100 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setVideoSelected(homeVideos.map((_, i) => i))} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('select_all')}</button>
              <button onClick={() => setVideoSelected([])} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('deselect_all')}</button>
              <button
                type="button"
                onClick={() => setHomeVideos(buildDefaultHomeVideos())}
                disabled={videoLoading}
                className="inline-flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-50 disabled:opacity-60 text-[#1b170d] px-3 py-2 rounded-lg text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                {L('استرجاع الافتراضي', 'Restore Defaults')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className={`material-symbols-outlined absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-neutral-400 text-[16px]`}>search</span>
                <input value={videoSearch} onChange={(e) => setVideoSearch(e.target.value)} placeholder={t('search')} className={`border border-neutral-200 rounded-lg ${isRtl ? 'pr-8 pl-4 text-right' : 'pl-8 pr-4 text-left'} py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 w-40`} />
              </div>
              <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                <button onClick={() => setVideoViewMode('grid')} className={`p-2 ${videoViewMode === 'grid' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button onClick={() => setVideoViewMode('list')} className={`p-2 ${videoViewMode === 'list' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                  <span className="material-symbols-outlined text-[18px]">list</span>
                </button>
              </div>
            </div>
          </div>

          {videoError && <p className="text-xs text-red-600 mb-3">{videoError}</p>}
          {videoMessage && <p className="text-xs text-green-600 mb-3">{videoMessage}</p>}

          <input ref={posterInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPoster} />
          {videoLoading && <p className="text-xs text-neutral-500 mt-4">{L('جاري التحميل...', 'Loading...')}</p>}

          {!videoLoading && (videoViewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videoRows.map(({ video, index }) => (
                <div
                  key={`${video.src}-${index}`}
                  onClick={() => toggleVideoSelect(index)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${videoSelected.includes(index) ? 'border-[#edab1d] shadow-lg shadow-[#edab1d]/20' : 'border-neutral-100 hover:border-neutral-300'}`}
                >
                  <div className="aspect-square relative bg-neutral-100">
                    {video.poster ? (
                      <Image src={video.poster} alt={video.label || `Video ${index + 1}`} fill className="object-cover" sizes="200px" />
                    ) : (
                      <div className="absolute inset-0 bg-[#1b170d] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl">movie</span>
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-black/35 transition-opacity ${videoSelected.includes(index) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    {videoSelected.includes(index) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#edab1d] rounded-full flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoPreview(video);
                      }}
                      className="absolute bottom-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#1b170d]">play_circle</span>
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium text-[#1b170d] truncate">{video.label || `${L('فيديو', 'Video')} ${index + 1}`}</p>
                    <p className="text-[10px] text-neutral-400">{formatBytes(videoSizes[video.src] || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                  <tr>
                    <th className="px-5 py-3">{L('الفيديو', 'Video')}</th>
                    <th className="px-5 py-3">{L('العنوان', 'Label')}</th>
                    <th className="px-5 py-3">{L('الحجم', 'Size')}</th>
                    <th className="px-5 py-3">{L('الحالة', 'Status')}</th>
                    <th className="px-5 py-3">{t('col_action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {videoRows.map(({ video, index }) => (
                    <tr key={`${video.src}-${index}`} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden relative bg-neutral-100">
                          {video.poster ? (
                            <Image src={video.poster} alt={video.label || `Video ${index + 1}`} fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="absolute inset-0 bg-[#1b170d] flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">movie</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-[#1b170d]">{video.label || '-'}</td>
                      <td className="px-5 py-3 text-sm text-neutral-400">{formatBytes(videoSizes[video.src] || 0)}</td>
                      <td className="px-5 py-3">
                        <label className="inline-flex items-center gap-2 text-xs text-neutral-600">
                          <input type="checkbox" checked={video.enabled} onChange={(e) => setVideoField(index, { enabled: e.target.checked })} />
                          {video.enabled ? L('مفعل', 'Enabled') : L('معطل', 'Disabled')}
                        </label>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setVideoPreview(video)} className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg">
                            <span className="material-symbols-outlined text-[16px]">play_circle</span>
                          </button>
                          <button onClick={() => openPosterPicker(index)} disabled={posterUploadingIndex === index} className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-lg disabled:opacity-60">
                            <span className="material-symbols-outlined text-[16px]">image</span>
                          </button>
                          <button onClick={() => setHomeVideos((prev) => prev.filter((_, i) => i !== index))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {!videoLoading && videoRows.length === 0 && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
              {L('لا توجد فيديوهات مطابقة', 'No matching videos found')}
            </div>
          )}

          {videoPreview && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setVideoPreview(null)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="relative bg-black aspect-video">
                  <video src={videoPreview.src} poster={videoPreview.poster || undefined} controls className="w-full h-full object-contain" />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#1b170d]">{videoPreview.label || L('فيديو بدون عنوان', 'Untitled video')}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[420px]" dir="ltr">{videoPreview.src}</p>
                  </div>
                  <button onClick={() => setVideoPreview(null)} className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium">{t('close')}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'images' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t('total_images'), value: images.length, icon: 'image', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: t('total_size'), value: `${totalSize} files`, icon: 'storage', color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: t('selected'), value: selected.length, icon: 'check_box', color: 'text-green-600', bg: 'bg-green-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${m.bg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined ${m.color} text-[18px]`}>{m.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{m.label}</p>
                  <p className="text-lg font-bold text-[#1b170d]">{m.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-white border border-neutral-100 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(images.map((i) => i.id))} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('select_all')}</button>
              <button onClick={() => setSelected([])} className="text-xs text-neutral-500 hover:text-[#1b170d] px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">{t('deselect_all')}</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className={`material-symbols-outlined absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-neutral-400 text-[16px]`}>search</span>
                <input placeholder={t('search')} className={`border border-neutral-200 rounded-lg ${isRtl ? 'pr-8 pl-4 text-right' : 'pl-8 pr-4 text-left'} py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 w-40`} />
              </div>
              <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#edab1d] text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
                  <span className="material-symbols-outlined text-[18px]">list</span>
                </button>
              </div>
            </div>
          </div>

          {imagesLoading ? (
            <div className="text-center py-12 text-neutral-400">{L('جاري تحميل الصور...', 'Loading images...')}</div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => toggleSelect(img.id)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selected.includes(img.id) ? 'border-[#edab1d] shadow-lg shadow-[#edab1d]/20' : 'border-neutral-100 hover:border-neutral-300'}`}
                >
                  <div className="aspect-square relative bg-neutral-100">
                    <Image src={img.url} alt={img.name} fill className="object-cover" sizes="200px" />
                    <div className={`absolute inset-0 bg-black/30 transition-opacity ${selected.includes(img.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    {selected.includes(img.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#edab1d] rounded-full flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-[14px]">check</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreview(img); }}
                      className="absolute bottom-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#1b170d]">open_in_full</span>
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium text-[#1b170d] truncate">{img.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{locale === 'ar' ? img.productNameAr : img.productNameEn}</p>
                  </div>
                </div>
              ))}

              {images.length === 0 && (
                <div className="col-span-5 text-center py-12 text-neutral-400">
                  <span className="material-symbols-outlined text-5xl mb-2 block">image_not_supported</span>
                  {L('لا توجد صور منتجات بعد', 'No product images yet')}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
              <table className="w-full text-right">
                <thead className="bg-neutral-50 text-xs text-neutral-500 font-medium">
                  <tr>
                    <th className="px-5 py-3">{t('col_image')}</th>
                    <th className="px-5 py-3">{t('col_name')}</th>
                    <th className="px-5 py-3">{L('المنتج', 'Product')}</th>
                    <th className="px-5 py-3">{t('col_action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {images.map((img) => (
                    <tr key={img.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-neutral-100">
                          <Image src={img.url} alt={img.name} fill className="object-cover" sizes="48px" />
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-[#1b170d] text-sm">{img.name}</td>
                      <td className="px-5 py-3 text-sm text-neutral-500">{locale === 'ar' ? img.productNameAr : img.productNameEn}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setPreview(img)} className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg">
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                          <button onClick={() => navigator.clipboard?.writeText(img.url)} className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square">
              <Image src={preview.url} alt={preview.name} fill className="object-cover" sizes="500px" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#1b170d]">{preview.name}</p>
                <p className="text-xs text-neutral-400">{locale === 'ar' ? preview.productNameAr : preview.productNameEn}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard?.writeText(preview.url)} className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  {t('copy_link')}
                </button>
                <button onClick={() => setPreview(null)} className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg font-medium">{t('close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
