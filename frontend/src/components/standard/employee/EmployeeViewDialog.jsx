import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { EmployeeAdd } from "./EmployeeAdd.jsx";
import React from "react";

export function EmployeeViewDialog({
  isModalOpen,
  viewKey,
  onChange,
  onSelect,
  modalChange,
}) {
  const changeModalView = () => {
    onChange();
    // modalChange();
  };

  return (
    <DialogRoot size={"lg"} open={isModalOpen} onOpenChange={modalChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {viewKey === -1 ? "회원 등록" : "회원 정보"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <EmployeeAdd
            viewKey={viewKey}
            onChange={changeModalView}
            onSelect={onSelect}
          />
        </DialogBody>
        <DialogFooter></DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
