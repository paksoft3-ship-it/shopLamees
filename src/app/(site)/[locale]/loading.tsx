export default function LocaleLoading() {
  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
      <div className="h-7 w-56 rounded bg-slate-200 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-[360px] rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="h-8 w-3/4 rounded bg-slate-200" />
          <div className="h-6 w-1/2 rounded bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
          <div className="h-12 rounded-xl bg-slate-300" />
        </div>
      </div>
    </main>
  );
}
