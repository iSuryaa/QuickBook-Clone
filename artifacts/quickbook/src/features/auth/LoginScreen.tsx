import { useState, useRef, useEffect, type FormEvent } from "react";
import { X, Phone, Lock, User, Mail, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendOtp, useVerifyOtp, useUpdateProfile } from "@/hooks/useAuth";
import type { ApiUser } from "@/services/api";

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: (user: ApiUser, token: string) => void;
}

type Step = "phone" | "otp" | "profile";

export function LoginScreen({ onBack, onSuccess }: LoginScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [pendingUser, setPendingUser] = useState<ApiUser | null>(null);
  const [pendingToken, setPendingToken] = useState<string>("");
  const [isNewUser, setIsNewUser] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit mobile number"); return;
    }
    setPhoneError("");
    sendOtp.mutate(`+91${phone}`, {
      onSuccess: () => {
        setStep("otp");
        setCountdown(30);
        setTimeout(() => otpRefs[0].current?.focus(), 100);
      },
      onError: (e: any) => setPhoneError(e.message ?? "Failed to send OTP"),
    });
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  }

  function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setOtpError("Enter the 6-digit OTP"); return; }
    verifyOtp.mutate({ phone: `+91${phone}`, code }, {
      onSuccess: (data) => {
        setPendingUser(data.user);
        setPendingToken(data.token);
        setIsNewUser(data.isNewUser);
        if (data.isNewUser || !data.user.name) {
          setStep("profile");
        } else {
          onSuccess(data.user, data.token);
        }
      },
      onError: (e: any) => setOtpError(e.message ?? "Invalid OTP. Try 123456 for demo."),
    });
  }

  function handleSignup(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !pendingToken) return;
    updateProfile.mutate({ name: name.trim(), email: email || undefined }, {
      onSuccess: (data) => {
        onSuccess(data.user, pendingToken);
      },
      onError: () => {
        if (pendingUser) onSuccess({ ...pendingUser, name: name.trim() }, pendingToken);
      },
    });
  }

  function handleResend() {
    if (countdown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setCountdown(30);
    sendOtp.mutate(`+91${phone}`, { onSuccess: () => setTimeout(() => otpRefs[0].current?.focus(), 100) });
  }

  const loading = sendOtp.isPending || verifyOtp.isPending || updateProfile.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onBack}>
      <div className="bg-white w-full max-w-[540px] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white flex items-center gap-3 px-5 pt-5 pb-4 border-b border-slate-100 z-10">
          <button onClick={step === "phone" ? onBack : () => {
            if (step === "otp") { setStep("phone"); setOtp(["","","","","",""]); }
            else setStep("otp");
          }} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            {step === "phone" ? <X size={18} /> : <ChevronLeft size={18} />}
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">
              {step === "phone" ? "Sign in" : step === "otp" ? "Verify OTP" : "Your profile"}
            </h1>
          </div>
          <div className="flex gap-1.5">
            {(["phone","otp","profile"] as Step[]).map((s, i) => {
              const idx = ["phone","otp","profile"].indexOf(step);
              return <div key={s} className={cn("h-1.5 rounded-full transition-all", i <= idx ? "bg-indigo-500 w-4" : "bg-slate-200 w-1.5")} />;
            })}
          </div>
        </div>

        <div className="px-5 py-7">
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
                <p className="text-slate-500 text-sm">Enter your mobile number to continue</p>
              </div>
              <div className={cn("bg-slate-50 rounded-2xl border flex items-center gap-3 px-4 h-14 transition-colors", phoneError ? "border-red-300" : "border-slate-100 focus-within:border-indigo-300")}>
                <span className="text-sm font-bold text-slate-500">+91</span>
                <div className="w-px h-5 bg-slate-200" />
                <Phone size={16} className="text-slate-400 shrink-0" />
                <input
                  type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number"
                  value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,"")); setPhoneError(""); }}
                  className="flex-1 outline-none text-sm bg-transparent tracking-wide"
                  autoFocus
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs -mt-2">{phoneError}</p>}
              <p className="text-xs text-slate-400">Demo: any 10-digit number. OTP: <strong>123456</strong></p>
              <button type="submit" disabled={loading} className="h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-indigo-200">
                {loading ? <LoadingDots /> : <><span>Get OTP</span><ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold mb-1">Enter OTP</h2>
                <p className="text-slate-500 text-sm">Sent to <strong className="text-slate-700">+91 {phone}</strong></p>
              </div>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i} ref={otpRefs[i]} type="tel" inputMode="numeric" maxLength={1}
                    value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={cn("w-12 h-14 rounded-2xl border text-center text-xl font-bold outline-none transition-all",
                      digit ? "border-indigo-400 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-slate-50",
                      otpError ? "border-red-300" : "focus:border-indigo-400")}
                  />
                ))}
              </div>
              {otpError && <p className="text-red-500 text-xs -mt-2">{otpError}</p>}
              <button type="submit" disabled={loading} className="h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-indigo-200">
                {loading ? <LoadingDots /> : "Verify OTP"}
              </button>
              <button type="button" onClick={handleResend} disabled={countdown > 0} className={cn("text-sm text-center transition-colors", countdown > 0 ? "text-slate-400" : "text-indigo-500 font-semibold")}>
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </form>
          )}

          {step === "profile" && (
            <form onSubmit={handleSignup} className="flex flex-col gap-5 animate-fade-up">
              <div>
                <h2 className="text-2xl font-bold mb-1">Complete profile</h2>
                <p className="text-slate-500 text-sm">Just a few details to get started</p>
              </div>
              <FieldInput icon={<User size={16} className="text-slate-400" />} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
              <FieldInput icon={<Mail size={16} className="text-slate-400" />} placeholder="Email (optional)" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <button type="submit" disabled={loading || !name.trim()} className="h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-indigo-200">
                {loading ? <LoadingDots /> : "Get started"}
              </button>
            </form>
          )}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}

function FieldInput({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 px-4 h-14 focus-within:border-indigo-300 transition-colors">
      {icon}
      <input className="flex-1 outline-none text-sm bg-transparent" {...props} />
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" style={{ animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}
