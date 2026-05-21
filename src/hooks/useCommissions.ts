import React, { useState, useEffect, useRef } from "react";
import { CommissionsService } from "../services/commissions.services";
import {
  type Commission,
  type CommissionApi,
  type CommissionsData,
  InitialCommission,
  InitialCommissionsData,
} from "../types/commissions.types";
import { capitalizeFull, statusPayment } from "../utils/employees.utils";

export const useCommissions = () => {
  const [commissionsData, setCommissionsData] = useState<CommissionsData>(
    InitialCommissionsData,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isLoadingCommissions, setIsLoadingCommissions] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [currentPageCommissions, setCurrentPageCommissions] = useState(1);
  const [totalPagesCommissions, setTotalPagesCommisions] = useState(1);

  const [currentCommission, setCurrentCommission] =
    useState<Commission>(InitialCommission);

  const [searchParameter, setSearchParameter] = useState<string>("");

  const getCommissions = async (page: number = 1) => {
    setIsLoadingCommissions(true);
    try {
      const response = await CommissionsService.getCommissions({
        page: page.toString(),
        param: searchParameter,
      });

      const data = response.data.data;

      const formattedData = data.map((com: CommissionApi) => ({
        ...com,
        id: com.employeeId,
        names: capitalizeFull(com.names),
        lastnames: capitalizeFull(com.lastnames),
        statusPaymentConmission: statusPayment(com.statusPaymentConmission),
      }));

      setCommissionsData((prev) => ({
        ...prev,
        data: formattedData,
        totalCancelled: response.data.meta.cancelledCount,
        totalPaid: response.data.meta.paidCount,
        totalPending: response.data.meta.pendingCount,
      }));

      if (response.data.meta.totalPages) {
        setTotalPagesCommisions(response.data.meta.totalPages);
        console.log("Ahshajsb");
      }

      console.log(response);

      console.log(totalPagesCommissions);
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCommissions(false);
    }
  };

  const statusPay = async (id: string) => {
    setIsSubmitting(true);

    try {
      await CommissionsService.changeStatus(id, {
        statusPaymentConmission: "P",
      });
      getCommissions();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusCanceled = async (id: string) => {
    setIsSubmitting(true);
    try {
      await CommissionsService.changeStatus(id, {
        statusPaymentConmission: "C",
      });
      getCommissions();
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getCommissions(currentPageCommissions);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getCommissions(currentPageCommissions);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPageCommissions, searchParameter]);

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPageCommissions(1);
  };

  return {
    commissionsData,
    isLoadingCommissions,
    currentPageCommissions,
    setCurrentPageCommissions,
    totalPagesCommissions,
    searchParameter,
    handleSearchChange,
    getCommissions,
    currentCommission,
    setCurrentCommission,
    statusPay,
    isSubmitting,
    successMessage,
    setSuccessMessage,
    statusCanceled,
  };
};
