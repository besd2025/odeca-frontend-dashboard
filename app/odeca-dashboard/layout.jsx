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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-/4">{children}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
