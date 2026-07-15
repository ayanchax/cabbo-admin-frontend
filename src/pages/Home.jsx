function Home() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="grid grid-cols-[1.1fr_0.8fr_1.5fr_0.8fr_0.8fr] bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Booking</span>
        <span>Status</span>
        <span>Route</span>
        <span>Driver</span>
        <span>Action</span>
      </div>
      <div className="flex min-h-64 items-center justify-center border-t border-slate-200 bg-white px-4 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Trips operations table will appear here.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Next step is wiring the bookings list endpoint, filters, pagination,
            and row-level trip detail navigation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
