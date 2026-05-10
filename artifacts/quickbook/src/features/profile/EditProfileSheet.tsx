import { useState } from "react";
import { X, User, Mail, Phone, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { toast } from "@/components/ui/Toast";
import type { ApiUser } from "@/services/api";

interface EditProfileSheetProps {
  user: ApiUser;
  onClose: () => void;
  onSave: (updated: ApiUser) => void;
}

export function EditProfileSheet({ user, onClose, onSave }: EditProfileSheetProps) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required";
    else if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    return errs;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.updateProfile({ name: name.trim(), email: email.trim() || undefined });
      onSave(res.user);
      toast("Profile updated", "success");
      onClose();
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[480px] md:max-w-md rounded-t-3xl md:rounded-3xl animate-slide-up md:mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <h2 className="font-bold flex-1">Edit Profile</h2>
        </div>

        <form onSubmit={handleSave} className="px-5 py-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Name</label>
            <div className={cn("flex items-center gap-3 bg-slate-50 rounded-2xl border px-4 h-13 transition-colors",
              errors.name ? "border-red-300" : "border-slate-100 focus-within:border-indigo-300")}>
              <User size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                placeholder="Your full name"
                className="flex-1 bg-transparent outline-none text-sm py-3.5"
                autoFocus
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email (optional)</label>
            <div className={cn("flex items-center gap-3 bg-slate-50 rounded-2xl border px-4 h-13 transition-colors",
              errors.email ? "border-red-300" : "border-slate-100 focus-within:border-indigo-300")}>
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="your@email.com"
                className="flex-1 bg-transparent outline-none text-sm py-3.5"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-100 px-4 h-13 opacity-60">
            <Phone size={16} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500">{user.phone}</span>
            <span className="text-xs text-slate-400 ml-auto">Cannot change</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-2xl text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all shadow-md shadow-indigo-200"
          >
            {loading ? "Saving…" : <><CheckCircle2 size={16} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
