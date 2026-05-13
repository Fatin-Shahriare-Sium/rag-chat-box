import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="md:ml-64 flex-1 overflow-auto w-full">
        <div className="pt-20 md:pt-8 px-4 md:px-8 pb-8">{children}</div>
      </main>
    </div>
  );
}
