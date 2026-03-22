import { useState } from "react";

export const useModals = () => {
  const [modals, setModals] = useState({
    register: false,
    delete: false,
    edit: false,
    details: false,
  });

  const toggleModal = (type: keyof typeof modals, state: boolean) => {
    setModals((prev) => ({
      ...prev,
      [type]: state,
    }));
  };

  return { modals, toggleModal };
};
