import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isDevMode } from "@/api";
import { useAuth, useToast } from "@/hooks";
import {
  APP,
  ROUTES,
  SERVER_ERROR_CODES,
  V1_ALLOWED_ADMIN_ROLES,
} from "@/utils";

const LOGIN_MESSAGES = {
  missingFields: "Enter your username and password.",
  invalidCredentials: "The credentials do not match our records.",
  forbidden: "This account does not have access to Cabbo Admin.",
  inactive: "This account is inactive. Contact a super admin.",
  alreadyLoggedIn:
    "This account is already signed in on another device. Log out from the active session first.",
  passwordNotSet:
    "This account does not have a password set yet. Contact a super admin.",
  roleError: "This account role is not configured correctly.",
  unsupportedRole:
    "This admin role is not enabled in the V1 operations console.",
  unavailable: "Cabbo Admin is unavailable right now. Please try again in sometime.",
};

const getLoginErrorMessage = (error) => {
  const status = error?.response?.status;
  const errorCode = error?.response?.data?.error_code;

  if (errorCode === SERVER_ERROR_CODES.CREDENTIALS_NOT_PROVIDED) {
    return LOGIN_MESSAGES.missingFields;
  }
  if (
    errorCode === SERVER_ERROR_CODES.USER_NOT_FOUND ||
    errorCode === SERVER_ERROR_CODES.INCORRECT_PASSWORD
  ) {
    return LOGIN_MESSAGES.invalidCredentials;
  }
  if (errorCode === SERVER_ERROR_CODES.USER_INACTIVE) {
    return LOGIN_MESSAGES.inactive;
  }
  if (errorCode === SERVER_ERROR_CODES.ALREADY_LOGGED_IN) {
    return LOGIN_MESSAGES.alreadyLoggedIn;
  }
  if (errorCode === SERVER_ERROR_CODES.USER_PASSWORD_NOT_SET) {
    return LOGIN_MESSAGES.passwordNotSet;
  }
  if (errorCode === SERVER_ERROR_CODES.ROLE_ERROR) {
    return LOGIN_MESSAGES.roleError;
  }

  if (status === 401) return LOGIN_MESSAGES.invalidCredentials;
  if (status === 403) return LOGIN_MESSAGES.forbidden;
  return LOGIN_MESSAGES.unavailable;
};

const getLoginResponse = (response) => response?.data || {};

function Login() {
  const navigate = useNavigate();
  const { login, setSession } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isSubmitting = login.isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError(LOGIN_MESSAGES.missingFields);
      return;
    }

    setError("");

    try {
      const response = await login.mutateAsync({
        username: trimmedUsername,
        password,
      });
      const {
        access_token: token,
        expires_in: expiresIn,
        role,
        user_id: userId,
      } = getLoginResponse(response);

      if (!V1_ALLOWED_ADMIN_ROLES.includes(role)) {
        setError(LOGIN_MESSAGES.unsupportedRole);
        showToast(LOGIN_MESSAGES.unsupportedRole, "error");
        return;
      }

      setSession({ token, role, expiresIn, userId });
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      if (isDevMode) {
        console.error("Admin login failed:", error);
      }

      const message = getLoginErrorMessage(error);
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,440px)] lg:items-center lg:gap-10 lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-4">
              <img
                src={import.meta.env.VITE_APP_LOGO_URL}
                alt={APP.name}
                className="h-9 w-auto object-contain"
              />
              <div className="h-8 w-px bg-slate-300" />
              <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                Admin Console
              </p>
            </div>

            <h1 className="max-w-lg text-3xl font-semibold tracking-normal text-slate-950">
              Operations console for daily booking control.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">
              Review trips, assign drivers, update operational status, and keep
              the rest of daily operations moving from one focused surface.
            </p>

            <div className="mt-8 max-w-lg">
              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Internal access only
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your access is verified before protected resources and
                    booking records are shown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center py-8 lg:min-h-0">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <div className="mb-5 flex items-center justify-between gap-4 lg:justify-start">
                <div className="flex items-center gap-3 lg:hidden">
                  <img
                    src={import.meta.env.VITE_APP_LOGO_URL}
                    alt={APP.name}
                    className="h-8 w-auto object-contain"
                  />
                  <div className="h-6 w-px bg-slate-200" />
                  <span className="text-sm font-semibold text-slate-700">
                    Admin Console
                  </span>
                </div>
                <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 lg:ml-0 lg:h-10 lg:w-10 lg:border-slate-950 lg:bg-slate-950 lg:text-white">
                  <LockKeyhole className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-950">
                Sign in to Cabbo Admin
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use your internal admin credentials to access console.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    if (error) setError("");
                  }}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="driver_ops"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError("");
                    }}
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-950 outline-none"
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                    className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs leading-5 text-slate-500">
                Access is limited to authorized Cabbo operations users. Activity
                may be logged for security and audit review.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
