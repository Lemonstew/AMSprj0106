import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import React, { useEffect } from "react";
import { FranchiseView } from "./FranchiseView.jsx";
import { FranchiseAdd } from "./FranchiseAdd.jsx";

export function FranchiseDialog({
  isOpen,
  onClose,
  franchiseKey,
  isAddDialogOpen,
  onSave,
  onDelete,
}) {
  useEffect(() => {
    if (franchiseKey) {
    }
  }, [franchiseKey]);

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size={"lg"}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAddDialogOpen ? "가맹점 등록" : "가맹점 정보"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {isAddDialogOpen ? (
            <FranchiseAdd onClose={onClose} onSave={onSave} />
          ) : franchiseKey ? (
            <FranchiseView
              franchiseKey={franchiseKey}
              onClose={onClose}
              onSave={onSave}
              onDelete={onDelete}
            />
          ) : (
            "선택된 가맹점이 없습니다."
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
