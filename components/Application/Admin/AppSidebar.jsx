'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

function AppSidebar() {
    const {toggleSidebar} = useSidebar();
  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center  px-2 py-1">
          <Image
            src={logoBlack.src}
            height={50}
            width={logoBlack.width}
            className="block dark:hidden h-[43px] w-[190px]"
            alt="logo dark"
          />
          <Image
            src={logoWhite.src}
            height={50}
            width={logoWhite.width}
            className="hidden dark:block h-[43px] w-[190px]"
            alt="logo White"
          />
          <Button onClick={toggleSidebar} type="button" size="icon" className="h-[30px] w-[30px] md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild className="font-semibold px-2 py-5">
                    <Link href={menu?.url}>
                      <menu.icon /> {menu.title}

                      {menu.submenu && menu.submenu.length > 0 && 
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                      }
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {menu.submenu && menu.submenu.length > 0 && 
                  <CollapsibleContent>
                        <SidebarMenuSub>
                            {
                                menu.submenu.map((subMenuItem, subMenuIndex)=>(
                                    <SidebarMenuSubItem key={subMenuIndex}>
                                        <SidebarMenuSubButton asChild className="px-2 py-4">
                                            <Link href={subMenuItem.url}>
                                                {subMenuItem.title}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))
                            }
                        </SidebarMenuSub>
                  </CollapsibleContent>
                }
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
