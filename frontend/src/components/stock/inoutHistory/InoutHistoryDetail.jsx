import React from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { Box } from "@chakra-ui/react";
import { Button } from "../../ui/button.jsx";
import InoutHistoryView from "./InoutHistoryView.jsx";

function InoutHistoryDetail({ inoutHistoryKey, isOpened, onClosed }) {
  return (
    <DialogRoot open={isOpened} onOpenChange={onClosed} size="lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Box>입출 내역 상세</Box>
          </DialogTitle>
        </DialogHeader>
        <DialogBody
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/*팝업창 내부 내용*/}

          <InoutHistoryView inoutHistoryKey={inoutHistoryKey} />
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger onClick={onClosed} />
          <DialogActionTrigger>
            <Button variant="outline" onClick={onClosed}>
              닫기
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default InoutHistoryDetail;
