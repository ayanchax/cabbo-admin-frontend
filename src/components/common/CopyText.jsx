import { Check, Copy, LoaderCircle } from "lucide-react";
import { useClipboard } from "@/hooks";

function CopyText({
  className = "",
  label = "Copy",
  showText = true,
  text,
}) {
  const { copy, isCopied, isCopying } = useClipboard();
  const canCopy = Boolean(text) && !isCopying;
  const Icon = isCopied ? Check : Copy;

  const handleCopy = async () => {
    if (!canCopy) return;
    await copy(text);
  };

  return (
    <div
      className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 ${className}`}
    >
      {showText && (
        <span className="min-w-0 truncate font-medium" title={text}>
          {text}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        disabled={!canCopy}
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 ${
          isCopied
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "cursor-pointer text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        }`}
        aria-label={`${label} ${text || "text"}`}
        title={isCopied ? "Copied" : label}
      >
        {isCopying ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { CopyText };
