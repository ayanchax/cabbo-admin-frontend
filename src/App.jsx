import { AppRouter } from "@/routes";
import { Toaster } from "react-hot-toast";
import { useToast } from "@/hooks";

function App() {
  const { DEFAULT_TOAST_OPTIONS } = useToast();
  return (
    <>
      <AppRouter />
      {/* Industry standard positioning and ordering for toast notifications across the application */}
      <Toaster
        reverseOrder
        position="bottom-center"
        containerStyle={{ bottom: 20 }}
        toastOptions={DEFAULT_TOAST_OPTIONS}
      />
      </>
  );
}

export default App;
