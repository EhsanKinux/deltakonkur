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
import profile from "@/assets/icons/profile.svg";

const UserAccoutn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none">
        <div className="flex justify-center items-center gap-2 text-black bg-slate-300 rounded-xl px-3 py-2">
          <p>احسان خداویسی</p>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-xl shadow-lg mt-2 w-48">
        <DropdownMenuLabel className="px-4 py-2 text-gray-700 font-semibold border-b">
          <span>حساب کاربری</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
          <img src={profile} className="ml-2 h-4 w-4" />
          <span>پروفایل</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
          <img src={exitIcon} className="ml-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccoutn;
