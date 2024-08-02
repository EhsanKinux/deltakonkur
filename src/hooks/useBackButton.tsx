import { useState, useEffect, useCallback } from "react";

type ModalType = "edit" | "delete" | "restart" | "realrestart" | "stop";

interface ModalState {
  edit: boolean;
  delete: boolean;
  restart: boolean;
  realrestart: boolean;
  stop: boolean;
}

const useModalHistory = () => {
  const [modalState, setModalState] = useState<ModalState>({
    edit: false,
    delete: false,
    restart: false,
    realrestart: false,
    stop: false,
  });

  const openModal = useCallback((modalType: ModalType) => {
    // Push a new state into the history stack
    window.history.pushState({ modalOpen: modalType }, "");
    setModalState((prevState) => ({ ...prevState, [modalType]: true }));
  }, []);

  const closeModal = useCallback(() => {
    // Remove the state from the history stack
    window.history.back();
  }, []);

  const handlePopState = useCallback((event: PopStateEvent) => {
    if (event.state && event.state.modalOpen) {
      setModalState((prevState) => ({
        ...prevState,
        [event.state.modalOpen]: true,
      }));
    } else {
      setModalState({
        edit: false,
        delete: false,
        restart: false,
        realrestart: false,
        stop: false,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState]);

  return { modalState, openModal, closeModal };
};

export default useModalHistory;
