import { AppSidebar } from "@/app/ui/dashboard/app-sidebar";
import { AppHeader } from "@/app/ui/dashboard/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 50)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="p-/4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
