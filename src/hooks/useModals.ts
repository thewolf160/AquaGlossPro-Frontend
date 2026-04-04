import { useState } from "react";

export const useModals = () => {
  const [modals, setModals] = useState({
    register: false,
    delete: false,
    edit: false,
    details: false,
    vehicles: false,
    stockMovement: false,
    restore: false,
  });

  const toggleModal = (type: keyof typeof modals, state: boolean) => {
    setModals((prev) => ({
      ...prev,
      [type]: state,
    }));
  };

  return { modals, toggleModal };
};
