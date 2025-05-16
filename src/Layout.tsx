import { useLocation } from 'react-router-dom';

import { ChartLine, Logs, Moon, Sun } from 'lucide-react';

import { AppSidebar } from '@/components/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';

import { useTheme } from './context/useTheme';

const menuItems = [
  { title: 'Ad Performance Summary', url: '/', icon: ChartLine },
  { title: 'User Event Logs', url: '/user-event-logs', icon: Logs },
];

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      className="cursor-pointer rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ml-auto"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const current = menuItems.find((item) => item.url === location.pathname);
  const pageTitle = current ? current.title : 'Performance Summary';

  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar menuItems={menuItems} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Ad Performance Monitoring Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ThemeToggleButton />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
