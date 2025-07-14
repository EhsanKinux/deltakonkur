import { useState } from "react";
import { ISalesManager } from "./interface";
import { SalesManagersTable } from "./SalesManagersTable";
import { Button } from "@/components/ui/button";
import AddEditSalesManagerDialog from "./dialogs/AddEditSalesManagerDialog";
import { FaPlus } from "react-icons/fa";
import DeleteSalesManagerDialog from "./dialogs/DeleteSalesManagerDialog";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/assets/icons/search.svg";
import showToast from "@/components/ui/toast";

const mockData: ISalesManager[] = [
  {
    id: "1",
    first_name: "علی",
    last_name: "محمدی",
    phone_number: "09121234567",
    email: "ali@example.com",
  },
  {
    id: "2",
    first_name: "زهرا",
    last_name: "کاظمی",
    phone_number: "09351234567",
    email: "zahra@example.com",
  },
];

const SalesManagers = () => {
  const [data, setData] = useState<ISalesManager[]>(mockData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRow, setEditRow] = useState<ISalesManager | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ISalesManager | null>(null);
  const [filters, setFilters] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter(
    (item) =>
      item.first_name
        .toLowerCase()
        .includes(filters.first_name.toLowerCase()) &&
      item.last_name.toLowerCase().includes(filters.last_name.toLowerCase()) &&
      item.phone_number
        .toLowerCase()
        .includes(filters.phone_number.toLowerCase()) &&
      item.email.toLowerCase().includes(filters.email.toLowerCase())
  );

  const handleAdd = () => {
    setEditRow(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: ISalesManager) => {
    setEditRow(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: ISalesManager) => {
    setRowToDelete(row);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setData((prev) => prev.filter((item) => item.id !== rowToDelete.id));
      showToast.success(`مسئول فروش با موفقیت حذف شد.`);
    }
    setDeleteDialog(false);
    setRowToDelete(null);
  };

  const handleSave = (manager: ISalesManager) => {
    if (
      !manager.first_name ||
      !manager.last_name ||
      !manager.phone_number ||
      !manager.email
    ) {
      showToast.error("لطفاً همه فیلدها را کامل کنید.");
      return;
    }
    if (editRow) {
      setData((prev) =>
        prev.map((item) => (item.id === manager.id ? manager : item))
      );
      showToast.success("ویرایش مسئول فروش با موفقیت انجام شد.");
    } else {
      setData((prev) => [...prev, { ...manager, id: Date.now().toString() }]);
      showToast.success("مسئول فروش جدید با موفقیت افزوده شد.");
    }
    setOpenDialog(false);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h1 className="border-b-2 border-slate-300 w-fit font-bold text-xl mb-4">
        مسئولان فروش
      </h1>
      <div className="flex flex-col justify-center items-center gap-3 p-10 mt-4 shadow-sidebar bg-slate-100 rounded-xl relative min-h-[60vh] w-full overflow-auto">
        <div className="w-full flex flex-col gap-4 mb-4">
          <div className="w-full flex justify-start">
            <Button
              className="hover:bg-green-100 text-green-700 border border-green-200 flex-1 text-base py-2 rounded-xl font-bold shadow-sm transition-all duration-200 flex gap-2 items-center "
              onClick={handleAdd}
              aria-label="افزودن مسئول فروش"
            >
              افزودن مسئول فروش
              <FaPlus />
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2 py-2 w-full ">
            <div className="relative flex items-center w-full text-14 rounded-[8px] ">
              <img
                src={SearchIcon}
                alt="searchicon"
                className="absolute left-3 w-6 h-6 text-gray-500"
              />
              <Input
                name="first_name"
                value={filters.first_name}
                onChange={handleFilterChange}
                placeholder="جستجو براساس نام"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer pl-12"
              />
            </div>
            <div className="relative flex items-center w-full text-14 rounded-[8px] ">
              <img
                src={SearchIcon}
                alt="searchicon"
                className="absolute left-3 w-6 h-6 text-gray-500"
              />
              <Input
                name="last_name"
                value={filters.last_name}
                onChange={handleFilterChange}
                placeholder="جستجو براساس نام خانوادگی"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer pl-12"
              />
            </div>
            <div className="relative flex items-center w-full text-14 rounded-[8px] ">
              <img
                src={SearchIcon}
                alt="searchicon"
                className="absolute left-3 w-6 h-6 text-gray-500"
              />
              <Input
                name="phone_number"
                value={filters.phone_number}
                onChange={handleFilterChange}
                placeholder="جستجو براساس شماره تماس"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer pl-12"
              />
            </div>
            <div className="relative flex items-center w-full text-14 rounded-[8px] ">
              <img
                src={SearchIcon}
                alt="searchicon"
                className="absolute left-3 w-6 h-6 text-gray-500"
              />
              <Input
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="جستجو براساس ایمیل"
                className="text-xs placeholder:text-xs rounded-[8px] text-gray-900 border-slate-400 placeholder:text-gray-500 hover:placeholder:text-blue-500 hover:cursor-pointer pl-12"
              />
            </div>
          </div>
        </div>
        <SalesManagersTable
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <AddEditSalesManagerDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        editRow={editRow}
      />
      <DeleteSalesManagerDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
        manager={rowToDelete}
      />
    </div>
  );
};

export default SalesManagers;
