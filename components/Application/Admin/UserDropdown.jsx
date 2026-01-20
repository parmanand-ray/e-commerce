import { Button } from "@/components/ui/button";
import { MdManageAccounts } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { IoSettings } from "react-icons/io5";
import { RxBorderWidth } from "react-icons/rx";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUserGear } from "react-icons/fa6";

function UserDropdown() {
  const auth = useSelector((store) => store.authStore.auth);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-5 w-56" align="start">
        <DropdownMenuLabel>
          <p className="font-semibold">{auth?.name}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>
              <FaUserGear />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="" className="cursor-pointer">
              New Product
            </Link>
            <DropdownMenuShortcut>
              <MdOutlineProductionQuantityLimits />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="" className="cursor-pointer">
              Orders
            </Link>
            <DropdownMenuShortcut>
              <RxBorderWidth />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="" className="cursor-pointer">
              Settings
            </Link>

            <DropdownMenuShortcut>
              <IoSettings />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserDropdown;
