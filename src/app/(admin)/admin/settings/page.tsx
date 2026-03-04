'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
    const t = useTranslations('Admin.Settings');
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const tabs = [
        { id: 'general', label: t('tab_general'), icon: 'store' },
        { id: 'contact', label: t('tab_contact'), icon: 'contact_phone' },
        { id: 'pricing', label: t('tab_pricing'), icon: 'payments' },
        { id: 'shipping', label: t('tab_shipping'), icon: 'local_shipping' },
        { id: 'social', label: t('tab_social'), icon: 'share' },
        { id: 'notifications', label: t('tab_notifications'), icon: 'notifications' },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
                    <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#edab1d] hover:bg-[#d49511] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md"
                >
                    <span className="material-symbols-outlined text-lg">save</span>
                    {saved ? t('saved') : t('save_changes')}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs sidebar */}
                <div className="lg:w-56 shrink-0">
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-neutral-50 last:border-0 text-right
                                    ${activeTab === tab.id ? 'bg-[#edab1d]/10 text-[#d49511] font-bold' : 'text-[#1b170d] hover:bg-neutral-50'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1">
                    {activeTab === 'general' && <GeneralSettings />}
                    {activeTab === 'contact' && <ContactSettings />}
                    {activeTab === 'pricing' && <PricingSettings />}
                    {activeTab === 'shipping' && <ShippingSettingsTab />}
                    {activeTab === 'social' && <SocialSettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                </div>
            </div>
        </div>
    );
}

function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-6 mb-4">
            <div className="mb-5">
                <h3 className="text-base font-bold text-[#1b170d]">{title}</h3>
                {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );
}

function InputField({ label, defaultValue, type = 'text', placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
            <input
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white text-right"
            />
        </div>
    );
}

function TextAreaField({ label, defaultValue, rows = 3 }: { label: string; defaultValue?: string; rows?: number }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
            <textarea
                defaultValue={defaultValue}
                rows={rows}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white text-right resize-none"
            />
        </div>
    );
}

function SelectField({ label, options, defaultValue }: { label: string; options: { value: string; label: string }[]; defaultValue?: string }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
            <select
                defaultValue={defaultValue}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

function ToggleField({ label, description, defaultChecked }: { label: string; description?: string; defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked ?? false);
    return (
        <div className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
            <div>
                <p className="text-sm font-medium text-[#1b170d]">{label}</p>
                {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}
            >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div>
            <SettingsCard title="معلومات المتجر" description="البيانات الأساسية لمتجرك">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField label="اسم المتجر (عربي)" defaultValue="شوب لاميس" />
                    <InputField label="اسم المتجر (إنجليزي)" defaultValue="Shop Lamees" />
                </div>
                <TextAreaField label="وصف المتجر (عربي)" defaultValue="متجر لاميس لأرقى العبايات والأزياء النسائية الفاخرة" />
                <TextAreaField label="وصف المتجر (إنجليزي)" defaultValue="Lamees - Premium Abayas and Women's Fashion" />
                <InputField label="الدومين الرئيسي" defaultValue="shop-lamees.com" />
            </SettingsCard>

            <SettingsCard title="شعار المتجر" description="قم برفع شعار متجرك بصيغة PNG أو SVG">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-neutral-400 text-3xl">image</span>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <span className="material-symbols-outlined text-lg">upload</span>
                            رفع شعار
                        </button>
                        <p className="text-xs text-neutral-400 mt-2">PNG, SVG أو WebP — الحجم الأقصى 2MB</p>
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title="اللغة والمنطقة">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <SelectField label="اللغة الافتراضية" options={[{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'الإنجليزية' }]} defaultValue="ar" />
                    <SelectField label="المنطقة الزمنية" options={[{ value: 'AST', label: 'توقيت الخليج (+3)' }, { value: 'UTC', label: 'UTC' }]} defaultValue="AST" />
                </div>
            </SettingsCard>
        </div>
    );
}

function ContactSettings() {
    return (
        <div>
            <SettingsCard title="بيانات التواصل" description="معلومات الاتصال الظاهرة للعملاء">
                <InputField label="رقم الهاتف" defaultValue="+974 3311 4232" />
                <InputField label="رقم واتساب" defaultValue="+974 3311 4232" />
                <InputField label="البريد الإلكتروني" defaultValue="info@shop-lamees.com" type="email" />
            </SettingsCard>
            <SettingsCard title="العنوان" description="عنوان المتجر الفيزيائي">
                <SelectField label="الدولة" options={[{ value: 'QA', label: 'قطر 🇶🇦' }, { value: 'SA', label: 'المملكة العربية السعودية 🇸🇦' }]} defaultValue="QA" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField label="المدينة" defaultValue="الدوحة" />
                    <InputField label="المنطقة" defaultValue="الوعب" />
                </div>
                <InputField label="العنوان التفصيلي" defaultValue="شارع العروبة، برج لاميس للأزياء" />
            </SettingsCard>
            <SettingsCard title="رسائل واتساب" description="قوالب رسائل التواصل عبر واتساب">
                <TextAreaField label="رسالة الترحيب" defaultValue="أهلاً بك في شوب لاميس! كيف يمكننا مساعدتك اليوم؟ 👗" rows={2} />
                <TextAreaField label="رسالة تأكيد الطلب" defaultValue="تم استلام طلبك رقم {order_number} بنجاح! سنتواصل معك قريباً للتأكيد. شكراً لثقتك بلاميس ✨" rows={3} />
            </SettingsCard>
        </div>
    );
}

function PricingSettings() {
    return (
        <div>
            <SettingsCard title="العملة والأسعار">
                <SelectField label="العملة الافتراضية" options={[{ value: 'QAR', label: 'ريال قطري (QAR)' }, { value: 'SAR', label: 'ريال سعودي (SAR)' }]} defaultValue="QAR" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField label="تحويل QAR → SAR" defaultValue="1.02" />
                    <InputField label="تحويل SAR → QAR" defaultValue="0.98" />
                </div>
            </SettingsCard>
            <SettingsCard title="الضريبة (VAT)" description="إعدادات ضريبة القيمة المضافة">
                <ToggleField label="تفعيل الضريبة" description="إضافة الضريبة على جميع الطلبات" defaultChecked />
                <div className="pt-3">
                    <InputField label="نسبة الضريبة %" defaultValue="15" />
                    <ToggleField label="عرض الضريبة على الفاتورة" defaultChecked />
                    <ToggleField label="الأسعار شاملة الضريبة" description="عرض الأسعار شاملة الضريبة في المتجر" />
                </div>
            </SettingsCard>
            <SettingsCard title="خيارات الدفع">
                <ToggleField label="الدفع عند الاستلام (COD)" defaultChecked />
                <ToggleField label="بطاقة ائتمانية / مدى" defaultChecked />
                <ToggleField label="Apple Pay" defaultChecked />
                <ToggleField label="تقسيط (تمارا / تابي)" />
            </SettingsCard>
        </div>
    );
}

function ShippingSettingsTab() {
    return (
        <div>
            <SettingsCard title="رسوم الشحن" description="حدد تكلفة الشحن لكل دولة">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField label="رسوم الشحن - قطر (QAR)" defaultValue="0" />
                    <InputField label="رسوم الشحن - السعودية (SAR)" defaultValue="0" />
                </div>
                <InputField label="حد الشحن المجاني (QAR)" defaultValue="500" />
                <ToggleField label="تفعيل الشحن المجاني" description="شحن مجاني عند تجاوز الحد المحدد" defaultChecked />
            </SettingsCard>
            <SettingsCard title="الشركات والمواعيد">
                <ToggleField label="Aramex" defaultChecked />
                <ToggleField label="DHL Express" />
                <ToggleField label="Qatar Post" defaultChecked />
                <div className="pt-3">
                    <InputField label="مدة التوصيل المتوقعة (أيام)" defaultValue="3-5" />
                </div>
            </SettingsCard>
        </div>
    );
}

function SocialSettings() {
    return (
        <div>
            <SettingsCard title="حسابات التواصل الاجتماعي">
                <InputField label="انستغرام" defaultValue="https://instagram.com/shoplamees" placeholder="https://instagram.com/..." />
                <InputField label="تيك توك" placeholder="https://tiktok.com/@..." />
                <InputField label="سناب شات" placeholder="https://snapchat.com/add/..." />
                <InputField label="تويتر / X" placeholder="https://x.com/..." />
                <InputField label="فيسبوك" placeholder="https://facebook.com/..." />
                <InputField label="بينترست" placeholder="https://pinterest.com/..." />
            </SettingsCard>
            <SettingsCard title="Open Graph (مشاركة روابط)" description="الصورة والعنوان عند مشاركة رابط المتجر">
                <InputField label="عنوان الصفحة الرئيسية" defaultValue="شوب لاميس - عبايات فاخرة" />
                <TextAreaField label="وصف المشاركة" defaultValue="اكتشفي أرقى العبايات والأزياء النسائية من لاميس" />
                <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-neutral-400">image</span>
                    </div>
                    <button className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">upload</span>
                        رفع صورة OG
                    </button>
                </div>
            </SettingsCard>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div>
            <SettingsCard title="إشعارات البريد الإلكتروني" description="تحكم في الإشعارات التلقائية المرسلة">
                <ToggleField label="طلب جديد" description="إشعار عند استلام طلب جديد" defaultChecked />
                <ToggleField label="تأكيد الطلب للعميل" description="إرسال بريد تأكيد للعميل" defaultChecked />
                <ToggleField label="تحديث حالة الطلب" description="إشعار العميل عند تغيير الحالة" defaultChecked />
                <ToggleField label="مخزون منخفض" description="تنبيه عند انخفاض المخزون عن 5 قطع" defaultChecked />
                <ToggleField label="تسجيل عميل جديد" />
            </SettingsCard>
            <SettingsCard title="إعدادات SMTP" description="لإرسال البريد الإلكتروني من اسم المتجر">
                <InputField label="SMTP Host" defaultValue="smtp.gmail.com" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField label="Port" defaultValue="587" />
                    <SelectField label="التشفير" options={[{ value: 'TLS', label: 'TLS' }, { value: 'SSL', label: 'SSL' }]} defaultValue="TLS" />
                </div>
                <InputField label="البريد الإلكتروني" defaultValue="no-reply@shop-lamees.com" />
                <InputField label="كلمة المرور" type="password" placeholder="••••••••••" />
            </SettingsCard>
        </div>
    );
}
