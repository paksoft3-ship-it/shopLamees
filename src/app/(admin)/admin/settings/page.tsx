'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AdminSettingsDTO, getAdminStoreSettings, updateAdminStoreSettings } from '@/lib/actions/adminInsights';
import { updateAdminLoginCredentials } from '@/lib/actions/adminAuth';
import { useAdminAuth } from '@/lib/stores/adminAuth';

const emptySettings: AdminSettingsDTO = {
  storeName: '',
  whatsappNumber: '',
  shippingQarQA: 0,
  shippingSarSA: 0,
  freeShipAbove: 0,
  defaultCurrency: 'QAR',
  vatPercent: 0,
};

export default function SettingsPage() {
  const t = useTranslations('Admin.Settings');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user, login } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState<AdminSettingsDTO>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [credentialSaving, setCredentialSaving] = useState(false);
  const [credentialMessage, setCredentialMessage] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const [credentialsForm, setCredentialsForm] = useState({
    currentEmail: '',
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [extras, setExtras] = useState({
    storeNameEn: 'Shop Lamees',
    storeDescriptionAr: 'متجر لاميس لأرقى العبايات والأزياء النسائية الفاخرة',
    storeDescriptionEn: 'Lamees - Premium Abayas and Women\'s Fashion',
    domain: 'shop-lamees.com',
    phone: '+974 3311 4232',
    email: 'info@shop-lamees.com',
    country: 'QA',
    city: 'الدوحة',
    district: 'الوعب',
    address: 'شارع العروبة، برج لاميس للأزياء',
    currencyRateQarSar: '1.02',
    currencyRateSarQar: '0.98',
    deliveryWindowDays: '3-5',
    instagram: 'https://instagram.com/shoplamees',
    tiktok: '',
    snapchat: '',
    twitter: '',
    facebook: '',
    pinterest: '',
    ogTitle: 'شوب لاميس - عبايات فاخرة',
    ogDescription: 'اكتشفي أرقى العبايات والأزياء النسائية من لاميس',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpEmail: 'no-reply@shop-lamees.com',
    smtpPassword: '',
  });

  useEffect(() => {
    getAdminStoreSettings().then((data) => {
      setForm(data);
      setExtras((prev) => ({ ...prev, phone: data.whatsappNumber }));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      setCredentialsForm((prev) => ({ ...prev, currentEmail: user.email, newEmail: user.email }));
    }
  }, [user?.email]);

  const handleSave = async () => {
    setSaving(true);
    await updateAdminStoreSettings({
      ...form,
      whatsappNumber: extras.phone || form.whatsappNumber,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCredentialsSave = async () => {
    setCredentialMessage('');
    setCredentialError('');

    if (!credentialsForm.currentEmail.trim() || !credentialsForm.currentPassword.trim()) {
      setCredentialError(L('البريد الحالي وكلمة المرور الحالية مطلوبان', 'Current email and current password are required'));
      return;
    }

    if (credentialsForm.newPassword && credentialsForm.newPassword !== credentialsForm.confirmPassword) {
      setCredentialError(L('تأكيد كلمة المرور غير مطابق', 'Password confirmation does not match'));
      return;
    }

    setCredentialSaving(true);
    const result = await updateAdminLoginCredentials({
      currentEmail: credentialsForm.currentEmail,
      currentPassword: credentialsForm.currentPassword,
      newEmail: credentialsForm.newEmail,
      newPassword: credentialsForm.newPassword,
    });
    setCredentialSaving(false);

    if (!result.ok) {
      setCredentialError(result.message);
      return;
    }

    const updatedEmail = result.email || credentialsForm.currentEmail;
    if (user?.role) {
      login(updatedEmail, user.role);
    }

    setCredentialsForm((prev) => ({
      ...prev,
      currentEmail: updatedEmail,
      newEmail: updatedEmail,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setCredentialMessage(L('تم تحديث بيانات تسجيل الدخول بنجاح', 'Login credentials updated successfully'));
  };

  const tabs = [
    { id: 'general', label: t('tab_general'), icon: 'store' },
    { id: 'contact', label: t('tab_contact'), icon: 'contact_phone' },
    { id: 'pricing', label: t('tab_pricing'), icon: 'payments' },
    { id: 'shipping', label: t('tab_shipping'), icon: 'local_shipping' },
    { id: 'social', label: t('tab_social'), icon: 'share' },
    { id: 'notifications', label: t('tab_notifications'), icon: 'notifications' },
  ];

  const L = (ar: string, en: string) => (isRtl ? ar : en);

  if (loading) {
    return <div className="p-8 text-neutral-500">{L('جاري تحميل الإعدادات...', 'Loading settings...')}</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1b170d]">{t('title')}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#edab1d] disabled:opacity-60 hover:bg-[#d49511] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          {saving ? L('جاري الحفظ...', 'Saving...') : saved ? t('saved') : t('save_changes')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-neutral-50 last:border-0 ${
                  activeTab === tab.id ? 'bg-[#edab1d]/10 text-[#d49511] font-bold' : 'text-[#1b170d] hover:bg-neutral-50'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'general' && (
            <div>
              <SettingsCard title={L('معلومات المتجر', 'Store Information')} description={L('البيانات الأساسية لمتجرك', 'Basic store identity')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <InputField label={L('اسم المتجر (عربي)', 'Store Name (Arabic)')} value={form.storeName} onChange={(v) => setForm((f) => ({ ...f, storeName: v }))} />
                  <InputField label={L('اسم المتجر (إنجليزي)', 'Store Name (English)')} value={extras.storeNameEn} onChange={(v) => setExtras((e) => ({ ...e, storeNameEn: v }))} />
                </div>
                <TextAreaField label={L('وصف المتجر (عربي)', 'Store Description (Arabic)')} value={extras.storeDescriptionAr} onChange={(v) => setExtras((e) => ({ ...e, storeDescriptionAr: v }))} />
                <TextAreaField label={L('وصف المتجر (إنجليزي)', 'Store Description (English)')} value={extras.storeDescriptionEn} onChange={(v) => setExtras((e) => ({ ...e, storeDescriptionEn: v }))} />
                <InputField label={L('الدومين الرئيسي', 'Primary Domain')} value={extras.domain} onChange={(v) => setExtras((e) => ({ ...e, domain: v }))} dir="ltr" />
              </SettingsCard>

              <SettingsCard title={L('اللغة والمنطقة', 'Language & Locale')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <SelectField label={L('اللغة الافتراضية', 'Default Language')} value={isRtl ? 'ar' : 'en'} onChange={() => { }} options={[{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }]} />
                  <SelectField label={L('المنطقة الزمنية', 'Time Zone')} value={'AST'} onChange={() => { }} options={[{ value: 'AST', label: L('توقيت الخليج (+3)', 'Gulf Time (+3)') }, { value: 'UTC', label: 'UTC' }]} />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <SettingsCard title={L('بيانات التواصل', 'Contact Information')} description={L('معلومات الاتصال الظاهرة للعملاء', 'Public contact details')}>
                <InputField label={L('رقم الهاتف', 'Phone Number')} value={extras.phone} onChange={(v) => setExtras((e) => ({ ...e, phone: v }))} dir="ltr" />
                <InputField label={'WhatsApp'} value={form.whatsappNumber} onChange={(v) => setForm((f) => ({ ...f, whatsappNumber: v }))} dir="ltr" />
                <InputField label={L('البريد الإلكتروني', 'Email')} value={extras.email} onChange={(v) => setExtras((e) => ({ ...e, email: v }))} type="email" dir="ltr" />
              </SettingsCard>

              <SettingsCard title={L('العنوان', 'Address')} description={L('عنوان المتجر الفيزيائي', 'Physical store address')}>
                <SelectField label={L('الدولة', 'Country')} value={extras.country} onChange={(v) => setExtras((e) => ({ ...e, country: v }))} options={[{ value: 'QA', label: L('قطر 🇶🇦', 'Qatar 🇶🇦') }, { value: 'SA', label: L('المملكة العربية السعودية 🇸🇦', 'Saudi Arabia 🇸🇦') }]} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <InputField label={L('المدينة', 'City')} value={extras.city} onChange={(v) => setExtras((e) => ({ ...e, city: v }))} />
                  <InputField label={L('المنطقة', 'District')} value={extras.district} onChange={(v) => setExtras((e) => ({ ...e, district: v }))} />
                </div>
                <InputField label={L('العنوان التفصيلي', 'Detailed Address')} value={extras.address} onChange={(v) => setExtras((e) => ({ ...e, address: v }))} />
              </SettingsCard>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <SettingsCard title={L('العملة والأسعار', 'Currency & Pricing')}>
                <SelectField label={L('العملة الافتراضية', 'Default Currency')} value={form.defaultCurrency} onChange={(v) => setForm((f) => ({ ...f, defaultCurrency: v as 'QAR' | 'SAR' }))} options={[{ value: 'QAR', label: 'QAR' }, { value: 'SAR', label: 'SAR' }]} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <InputField label={'QAR → SAR'} value={extras.currencyRateQarSar} onChange={(v) => setExtras((e) => ({ ...e, currencyRateQarSar: v }))} type="number" dir="ltr" />
                  <InputField label={'SAR → QAR'} value={extras.currencyRateSarQar} onChange={(v) => setExtras((e) => ({ ...e, currencyRateSarQar: v }))} type="number" dir="ltr" />
                </div>
              </SettingsCard>

              <SettingsCard title={L('الضريبة (VAT)', 'Tax (VAT)')} description={L('إعدادات ضريبة القيمة المضافة', 'Value-added tax settings')}>
                <InputField label={L('نسبة الضريبة %', 'VAT Percent %')} value={String(form.vatPercent)} onChange={(v) => setForm((f) => ({ ...f, vatPercent: Number(v) }))} type="number" dir="ltr" />
                <div className="text-xs text-neutral-500">{L('يتم تطبيق هذه النسبة في الحسابات.', 'This percentage is used in checkout calculations.')}</div>
              </SettingsCard>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <SettingsCard title={L('رسوم الشحن', 'Shipping Fees')} description={L('حدد تكلفة الشحن لكل دولة', 'Set shipping fees by country')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <InputField label={L('رسوم الشحن - قطر (QAR)', 'Qatar Shipping Fee (QAR)')} value={String(form.shippingQarQA)} onChange={(v) => setForm((f) => ({ ...f, shippingQarQA: Number(v) }))} type="number" dir="ltr" />
                  <InputField label={L('رسوم الشحن - السعودية (SAR)', 'Saudi Shipping Fee (SAR)')} value={String(form.shippingSarSA)} onChange={(v) => setForm((f) => ({ ...f, shippingSarSA: Number(v) }))} type="number" dir="ltr" />
                </div>
                <InputField label={L('حد الشحن المجاني', 'Free Shipping Threshold')} value={String(form.freeShipAbove)} onChange={(v) => setForm((f) => ({ ...f, freeShipAbove: Number(v) }))} type="number" dir="ltr" />
                <InputField label={L('مدة التوصيل المتوقعة (أيام)', 'Estimated Delivery Window (days)')} value={extras.deliveryWindowDays} onChange={(v) => setExtras((e) => ({ ...e, deliveryWindowDays: v }))} dir="ltr" />
              </SettingsCard>
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <SettingsCard title={L('حسابات التواصل الاجتماعي', 'Social Accounts')}>
                <InputField label={'Instagram'} value={extras.instagram} onChange={(v) => setExtras((e) => ({ ...e, instagram: v }))} dir="ltr" />
                <InputField label={'TikTok'} value={extras.tiktok} onChange={(v) => setExtras((e) => ({ ...e, tiktok: v }))} dir="ltr" />
                <InputField label={'Snapchat'} value={extras.snapchat} onChange={(v) => setExtras((e) => ({ ...e, snapchat: v }))} dir="ltr" />
                <InputField label={'X / Twitter'} value={extras.twitter} onChange={(v) => setExtras((e) => ({ ...e, twitter: v }))} dir="ltr" />
                <InputField label={'Facebook'} value={extras.facebook} onChange={(v) => setExtras((e) => ({ ...e, facebook: v }))} dir="ltr" />
                <InputField label={'Pinterest'} value={extras.pinterest} onChange={(v) => setExtras((e) => ({ ...e, pinterest: v }))} dir="ltr" />
              </SettingsCard>

              <SettingsCard title={L('Open Graph (مشاركة روابط)', 'Open Graph (Link sharing)')} description={L('الصورة والعنوان عند مشاركة رابط المتجر', 'Preview title/description when sharing links')}>
                <InputField label={L('عنوان الصفحة الرئيسية', 'Homepage Title')} value={extras.ogTitle} onChange={(v) => setExtras((e) => ({ ...e, ogTitle: v }))} />
                <TextAreaField label={L('وصف المشاركة', 'Share Description')} value={extras.ogDescription} onChange={(v) => setExtras((e) => ({ ...e, ogDescription: v }))} />
              </SettingsCard>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <SettingsCard title={L('تسجيل دخول الإدارة', 'Admin Login Credentials')} description={L('تحديث بريد وكلمة مرور تسجيل دخول لوحة التحكم', 'Update admin panel login email and password')}>
                <InputField label={L('البريد الحالي', 'Current Email')} value={credentialsForm.currentEmail} onChange={(v) => setCredentialsForm((f) => ({ ...f, currentEmail: v }))} type="email" dir="ltr" />
                <InputField label={L('كلمة المرور الحالية', 'Current Password')} value={credentialsForm.currentPassword} onChange={(v) => setCredentialsForm((f) => ({ ...f, currentPassword: v }))} type="password" dir="ltr" />
                <InputField label={L('البريد الجديد', 'New Email')} value={credentialsForm.newEmail} onChange={(v) => setCredentialsForm((f) => ({ ...f, newEmail: v }))} type="email" dir="ltr" />
                <InputField label={L('كلمة المرور الجديدة', 'New Password')} value={credentialsForm.newPassword} onChange={(v) => setCredentialsForm((f) => ({ ...f, newPassword: v }))} type="password" dir="ltr" />
                <InputField label={L('تأكيد كلمة المرور الجديدة', 'Confirm New Password')} value={credentialsForm.confirmPassword} onChange={(v) => setCredentialsForm((f) => ({ ...f, confirmPassword: v }))} type="password" dir="ltr" />
                {credentialError && <p className="text-sm text-red-600 mb-3">{credentialError}</p>}
                {credentialMessage && <p className="text-sm text-green-600 mb-3">{credentialMessage}</p>}
                <button
                  onClick={handleCredentialsSave}
                  disabled={credentialSaving}
                  className="inline-flex items-center gap-2 bg-[#1b170d] hover:bg-[#30291b] disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  {credentialSaving ? L('جاري التحديث...', 'Updating...') : L('تحديث بيانات الدخول', 'Update Login Credentials')}
                </button>
              </SettingsCard>

              <SettingsCard title={L('إشعارات البريد الإلكتروني', 'Email Notifications')} description={L('تحكم في الإشعارات التلقائية المرسلة', 'Control automated notification emails')}>
                <ToggleField label={L('طلب جديد', 'New Order')} defaultChecked />
                <ToggleField label={L('تأكيد الطلب للعميل', 'Order Confirmation')} defaultChecked />
                <ToggleField label={L('تحديث حالة الطلب', 'Order Status Update')} defaultChecked />
                <ToggleField label={L('مخزون منخفض', 'Low Stock Alert')} defaultChecked />
              </SettingsCard>

              <SettingsCard title={L('إعدادات SMTP', 'SMTP Settings')} description={L('لإرسال البريد الإلكتروني من اسم المتجر', 'Used for outgoing transactional emails')}>
                <InputField label={'SMTP Host'} value={extras.smtpHost} onChange={(v) => setExtras((e) => ({ ...e, smtpHost: v }))} dir="ltr" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <InputField label={'Port'} value={extras.smtpPort} onChange={(v) => setExtras((e) => ({ ...e, smtpPort: v }))} dir="ltr" />
                  <SelectField label={L('التشفير', 'Encryption')} value={'TLS'} onChange={() => { }} options={[{ value: 'TLS', label: 'TLS' }, { value: 'SSL', label: 'SSL' }]} />
                </div>
                <InputField label={L('البريد الإلكتروني', 'Email')} value={extras.smtpEmail} onChange={(v) => setExtras((e) => ({ ...e, smtpEmail: v }))} dir="ltr" />
                <InputField label={L('كلمة المرور', 'Password')} value={extras.smtpPassword} onChange={(v) => setExtras((e) => ({ ...e, smtpPassword: v }))} type="password" dir="ltr" />
              </SettingsCard>
            </div>
          )}
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

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  dir?: 'rtl' | 'ltr';
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1b170d] mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#edab1d]/30 focus:border-[#edab1d] bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
      <p className="text-sm font-medium text-[#1b170d]">{label}</p>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#edab1d]' : 'bg-neutral-200'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'right-1' : 'left-1'}`} />
      </button>
    </div>
  );
}
