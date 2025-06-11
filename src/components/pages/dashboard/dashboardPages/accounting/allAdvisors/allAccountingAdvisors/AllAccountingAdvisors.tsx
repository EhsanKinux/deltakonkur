import AccountantExel from "../accountantExel/AccountantExel";
import AdvisorsList from "./parts/AdvisorsList";

const AllAccountingAdvisors = () => {
  return (
    <div className="flex flex-col">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl">
        مشاوران
      </h1>
      {/* <AccountantExel /> */}
      <AdvisorsList />
    </div>
  );
};

export default AllAccountingAdvisors;
