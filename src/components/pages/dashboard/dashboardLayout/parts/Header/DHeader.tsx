import UserAccoutn from "./parts/UserAccoutn";

export default function DHeader() {
  return (
    <div className="p-8 w-full border-b-2 border-slate-300 h-10 flex justify-between items-center mt-5 mr-0 ml-8 max-h-screen">
      <span className="text-black">سلام احسان</span>
      <UserAccoutn />
    </div>
  );
}
