import { createContext } from 'react';

export type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextProps | null>(null);
