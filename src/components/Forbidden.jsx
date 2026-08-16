import { ShieldX } from "lucide-react";

function Forbidden({
  title = "Access restricted",
  message = "Your role does not have permission to view this section.",
}) {
  return (
    <div className="rounded-lg border border-rose-200 bg-white px-4 py-12 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
        <ShieldX className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-950">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}

export { Forbidden };
