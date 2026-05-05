import { AppShell } from "@/features/shared/AppShell";
import { ToastContainer } from "@/components/ui/Toast";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-[540px] mx-auto min-h-screen relative bg-slate-50 shadow-xl shadow-slate-200/50">
          <AppShell />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
