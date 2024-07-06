import MobileNav from "./parts/Mobile/MobileNav";
import UserAccoutn from "./parts/UserAccoutn";

export default function DHeader() {
  return (
    <div className="p-8 w-full border-b-2 border-slate-300 h-10 flex justify-between items-center mt-5 mr-0 ml-8">
      <div className="flex gap-2 items-center">
        <MobileNav />
        <span className="text-black text-nowrap">سلام کاربر</span>
      </div>
      <UserAccoutn />
    </div>
  );
}
