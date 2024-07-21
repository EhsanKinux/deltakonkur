import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import exitIcon from "@/assets/icons/exit.svg";
import profileIcon from "@/assets/icons/profile.svg";
import downIcon from "@/assets/icons/down.svg";
import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/users/userDetail/interface";
import { getRoleName } from "@/lib/utils/roles/Roles";

const UserAccoutn = ({ user }: { user: IUserDetail | undefined }) => {
  // Helper function to get initials from names
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Determine the role name based on user's role
  const roleName = user ? getRoleName(user.role) : "نامشخص";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border-none hover:cursor-pointer">
        <div className="flex justify-center items-center gap-4 text-black bg-slate-200 rounded-xl px-3 py-2">
          <div className="flex flex-col justify-centerّ">
            <span>
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-black text-sm font-light">{roleName}</span>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-slate-600 text-slate-100">
              {user ? getInitials(user.first_name, user.last_name) : "?"}
            </AvatarFallback>
          </Avatar>
          <img src={downIcon} alt="icon" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-100 rounded-xl shadow-lg mt-2 w-48">
        <DropdownMenuLabel className="px-4 py-2 text-gray-700 font-semibold border-b">
          <span>حساب کاربری</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl px-4 py-2 text-gray-600 cursor-pointer hover:!bg-slate-50">
          <img src={profileIcon} className="ml-2 h-4 w-4" />
          <span>پروفایل</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl px-4 py-2 text-gray-600 cursor-pointer hover:!bg-slate-50">
          <img src={exitIcon} className="ml-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccoutn;
