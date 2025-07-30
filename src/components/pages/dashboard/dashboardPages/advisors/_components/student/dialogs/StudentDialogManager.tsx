import { Dialog } from "@/components/ui/dialog";
import { Student } from "@/types";
import { EditStudentDialog } from "./EditStudentDialog";
import { DeleteStudentDialog } from "./DeleteStudentDialog";
import useModalHistory from "@/hooks/useBackButton";

// =============================================================================
// DIALOG TYPES
// =============================================================================

export type DialogType = "edit" | "delete" | null;

export interface DialogState {
  type: DialogType;
  data?: Student;
}

// =============================================================================
// DIALOG MANAGER PROPS
// =============================================================================

export interface StudentDialogManagerProps {
  dialogState: DialogState;
  onClose: () => void;
  onSuccess: () => void;
  onFetchStudent: (id: string) => Promise<Student | null>;
  onUpdateStudent: (data: any) => Promise<boolean>;
  onDeleteStudent: (id: string, name?: string) => Promise<boolean>;
  onUpdateAdvisor: (params: any) => Promise<boolean>;
  onUpdateSupervisor: (params: any) => Promise<boolean>;
}

// =============================================================================
// STUDENT DIALOG MANAGER COMPONENT
// =============================================================================

export const StudentDialogManager = ({
  dialogState,
  onClose,
  onSuccess,
  onFetchStudent,
  onUpdateStudent,
  onDeleteStudent,
  onUpdateAdvisor,
  onUpdateSupervisor,
}: StudentDialogManagerProps) => {
  const { modalState, closeModal } = useModalHistory();

  // =============================================================================
  // DIALOG HANDLERS
  // =============================================================================

  const handleClose = () => {
    closeModal();
    onClose();
  };

  const handleSuccess = () => {
    onSuccess();
    handleClose();
  };

  // =============================================================================
  // RENDER DIALOGS
  // =============================================================================

  const renderDialog = () => {
    switch (dialogState.type) {
      case "edit":
        return (
          <EditStudentDialog
            studentId={dialogState.data?.id}
            onSuccess={handleSuccess}
            onFetchStudent={onFetchStudent}
            onUpdateStudent={onUpdateStudent}
            onUpdateAdvisor={onUpdateAdvisor}
            onUpdateSupervisor={onUpdateSupervisor}
          />
        );

      case "delete":
        return (
          <DeleteStudentDialog
            student={dialogState.data}
            onSuccess={handleSuccess}
            onDeleteStudent={onDeleteStudent}
          />
        );

      default:
        return null;
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  if (!dialogState.type) {
    return null;
  }

  return (
    <Dialog open={modalState[dialogState.type]} onOpenChange={handleClose}>
      {renderDialog()}
    </Dialog>
  );
};
