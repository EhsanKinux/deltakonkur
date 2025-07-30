import { Dialog } from "@/components/ui/dialog";
import { Student } from "@/types";
import { FormData } from "@/lib/store/types";
import { EditStudentDialog } from "../_components/edit/EditStudentDialog";
import DeleteConfirmationDialog from "../_components/delete/DeleteConfirmationDialog";
import useModalHistory from "@/hooks/useBackButton";

// =============================================================================
// DIALOG TYPES
// =============================================================================

export type DialogType = "edit" | "delete" | null;

export interface DialogState {
  type: DialogType;
  data?: Student | FormData;
}

// =============================================================================
// DIALOG MANAGER PROPS
// =============================================================================

export interface StudentDialogManagerProps {
  dialogState: DialogState;
  onClose: () => void;
  onSuccess: () => void;
}

// =============================================================================
// STUDENT DIALOG MANAGER COMPONENT
// =============================================================================

export const StudentDialogManager = ({
  dialogState,
  onClose,
  onSuccess,
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
        return <EditStudentDialog onSuccess={handleSuccess} />;

      case "delete":
        return (
          <DeleteConfirmationDialog
            formData={dialogState.data as FormData}
            onSuccess={handleSuccess}
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
