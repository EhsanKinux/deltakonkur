// import { useStudentList } from "@/functions/hooks/studentsList/useStudentList";
import { StudentWithDetails } from "../../interface";
// import { toast } from "sonner";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteDialog = ({
  setDeleteDialogOpen,
  formData,
}: {
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: StudentWithDetails;
}) => {
  //   const { deleteStudent } = useStudentList();

  const handleDeleteConfirm = async () => {
    console.log(formData);
    // const loadingToastId = toast.loading("در حال حذف کردن...");
    // try {
    //   await deleteStudent(formData?.id);
    //   toast.dismiss(loadingToastId);
    //   toast.success(`حذف کردن ${formData?.first_name} ${formData?.last_name} با موفقیت انجام شد!`);
    //   setTimeout(() => {
    //     setDeleteDialogOpen(false);
    //     window.location.reload();
    //   }, 2000);
    // } catch (error) {
    //   toast.dismiss(loadingToastId);
    //   toast.error("خطایی رخ داده است");
    //   // toast.error(error);
    // } finally {
    //   setDeleteDialogOpen(false);
    // }
    setDeleteDialogOpen(false);
  };

  return (
    <DialogContent className="bg-slate-100 !rounded-[10px]">
      <DialogHeader>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogDescription className="flex flex-col gap-2">
          <span>آیا از حذف این دانش‌آموز مطمئن هستید؟</span>
          <span className="text-orange-600 text-sm">دقت داشته باشید که این کار خطرناک است و پیشنهاد نمیشود</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <Button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl pt-2" onClick={handleDeleteConfirm}>
            حذف دانش‌آموز
          </Button>
          <DialogClose asChild>
            <Button className="bg-gray-300 text-black hover:bg-slate-700 hover:text-white rounded-xl pt-2">لغو</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteDialog;