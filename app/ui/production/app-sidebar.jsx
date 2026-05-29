"use client";
import { UserContext } from "@/app/ui/context/User_Context";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Coffee,
  FileSymlink,
  LayoutDashboard,
  Factory,
  Inbox,
  Settings,
  Search,
  Beaker,
  Package,
  Microscope,
  Tag,
  BarChart3,
  Sliders,
  Scroll,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
// This is sample data.
const menuItems = {
  navMain: [
    // {
    //   title: "Dashboard (Vue d'ensemble)",
    //   url: "/odeca-production/home",
    //   icon: LayoutDashboard,
    //   keyword: "odeca-production/home",
    // },
    {
      title: "Usine",
      items: [
        {
          title: "Réception",
          url: "/odeca-production/usine/reception",
          icon: Inbox,
        },
        {
          title: "Usinage",
          url: "/odeca-production/usine/usinage",
          icon: Settings,
        },
        {
          title: "Triage",
          url: "/odeca-production/usine/triage",
          icon: Search,
        },
        {
          title: "Échantillonnage",
          url: "/odeca-production/usine/echantillonnage",
          icon: Beaker,
        },
        {
          title: "Stockage & Retour",
          url: "/odeca-production/usine/stockage",
          icon: Package,
        },
      ],
      icon: Factory,
      keyword: "odeca-production/usine",
    },
    {
      title: "Laboratoire",
      items: [
        {
          title: "Réception & Codage",
          url: "/odeca-production/laboratoire/reception",
          icon: Tag,
        },
        {
          title: "Analyse Granulométrique",
          url: "/odeca-production/laboratoire/granulometrie",
          icon: BarChart3,
        },
        {
          title: "Triage Manuel",
          url: "/odeca-production/laboratoire/triage",
          icon: Sliders,
        },
        {
          title: "Torréfaction & Cupping",
          url: "/odeca-production/laboratoire/cupping",
          icon: Coffee,
        },
        {
          title: "Décisions & Rapports",
          url: "/odeca-production/laboratoire/rapports",
          icon: Scroll,
        },
      ],
      icon: Microscope,
      keyword: "odeca-production/laboratoire",
    },
  ],
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

function CollapsibleMenuItem({ item, isCollapsed, isActive }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true); //isActive);

  // Automatically open if one of the subitems is active
  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isActive}
        className="flex items-center group/collapsible-btn w-full"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.icon &&
          (React.isValidElement(item.icon) ? (
            React.cloneElement(item.icon, {
              className: cn(
                isActive ? "text-white" : "text-sidebar-foreground/70",
                isCollapsed ? "size-6! ml-1" : "size-8!",
                item.icon.props?.className,
              ),
            })
          ) : (
            <Icon className={isCollapsed ? "size-6!" : "size-8!"} />
          ))}
        <span className="flex-1 text-left">{item.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
      </SidebarMenuButton>

      {isOpen && !isCollapsed && (
        <SidebarMenuSub className="mt-2">
          {item.items.map((subItem) => {
            const isSubActive = pathname === subItem.url;
            const SubIcon = subItem.icon;
            return (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild isActive={isSubActive}>
                  <a href={subItem.url} className="flex items-center gap-2">
                    {isSubActive ? (
                      <div className="h-2 w-2 rounded-full bg-primary mr-1" />
                    ) : (
                      subItem.icon && <div className="w-2" />
                    )}
                    {subItem.icon && (
                      <SubIcon className={cn("size-5 text-sidebar-foreground/70", isSubActive && "text-primary")} />
                    )}
                    <span>{subItem.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  // Function that checks if menu item is active
  const isActive = (keyword) => pathname.includes(keyword);
  const { isMobile, state } = useSidebar();
  const [isHovered, setIsHovered] = React.useState(false);
  const isCollapsed = !isMobile && state === "collapsed" && !isHovered;
  const user = React.useContext(UserContext);
  const filteredMenuItems = menuItems.navMain
    .filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.session?.category);
    })
    .map((item) => {
      if (!item.items) return item;
      return {
        ...item,
        items: item.items.filter((subItem) => {
          if (!subItem.roles) return true;
          return subItem.roles.includes(user?.session?.category);
        }),
      };
    });

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-state={isCollapsed ? "collapsed" : "expanded"}
      data-collapsible={isCollapsed ? "icon" : ""}
    >
      <SidebarHeader className="mb-3 flex items-center">
        <Image src="/images/logo_1.png" alt="Logo" width={100} height={100} />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu
              className={cn("flex flex-col ", isCollapsed ? "gap-y-2" : "")}
            >

              {filteredMenuItems?.map((item) => {
                const active = isActive(item.keyword);

                if (item.items && item.items.length > 0) {
                  return (
                    <CollapsibleMenuItem
                      key={item.title}
                      item={item}
                      isCollapsed={isCollapsed}
                      isActive={active}
                    />
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={active}
                      className="flex items-center"
                      size="lg"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        {item.icon &&
                          (React.isValidElement(item.icon) ? (
                            React.cloneElement(item.icon, {
                              className: cn(
                                active
                                  ? "text-white"
                                  : "text-sidebar-foreground/70",
                                isCollapsed ? "size-6! ml-1" : "size-8!",
                                item.icon.props?.className,
                              ),
                            })
                          ) : (
                            <item.icon
                              className={isCollapsed ? "size-6!" : "size-8!"}
                            />
                          ))}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
