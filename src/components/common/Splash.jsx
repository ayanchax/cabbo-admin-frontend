import { CabboSplashIllustration } from "@/components";

const Splash = ({
  message = "Loading your experience..."
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="flex flex-col items-center">

        <CabboSplashIllustration className="w-64 h-auto animate-fade-in" />

        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>

        <p className="text-sm text-gray-400 mt-5 tracking-wide">
          {message}
        </p>

      </div>
    </div>
  );
};

export { Splash };