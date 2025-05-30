import { HStack, Input, Separator, Textarea } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
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
import { Button } from "../../ui/button.jsx";
import { Field } from "../../ui/field.jsx";
import axios from "axios";
import { AuthenticationContext } from "../../../context/AuthenticationProvider.jsx";
import { toaster } from "../../ui/toaster.jsx";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";

export function InstkConfirmModal({
  isModalOpen,
  setChangeModal,
  instk,
  onApprovalSuccess,
}) {
  const { id } = useContext(AuthenticationContext);
  const [inputStockNote, setInputStockNote] = useState("");
  const [instkDetail, setInstkDetail] = useState({});

  // 입고 상세
  useEffect(() => {
    axios
      .get(`api/instk/confirmView/${instk.inputNo}`, {
        params: {
          inputCommonCode: instk.inputCommonCode,
        },
      })
      .then((res) => {
        setInstkDetail(res.data);
      });
  }, []);

  console.log(instk);

  // 입고 추가
  const handleAddInstk = () => {
    axios
      .post("/api/instk/add", {
        inputKey: instk.inputKey,
        inputNo: instk.inputNo,
        inputCommonCode: instk.inputCommonCode,
        inputStockEmployeeNo: id,
        inputStockNote: inputStockNote,
        itemCommonName: instk.itemCommonName,
        customerName: instk.customerName,
        employeeWorkPlaceCode: instkDetail.employeeWorkPlaceCode,
        requestEmployeeNo: instk.requestEmployeeNo,
        itemAmount: instk.itemAmount,
      })
      .then((res) => {
        console.log(res);
        toaster.create({
          description: res.data.message.text,
          type: res.data.message.type,
        });
        setChangeModal();
        onApprovalSuccess(); // 승인 성공 후 콜백 실행
      })
      .catch((error) => {
        console.log("입고테이블에 추가중 오류 발생했습니다", error);
      });
  };

  // 입고 반려 메소드
  const handleRejectInstk = () => {
    axios
      .put("/api/instk/reject", {
        inputKey: instk.inputKey,
        customerName: instk.customerName,
        disapproveEmployeeNo: id,
        disapproveNote: inputStockNote,
      })
      .then((res) => {
        console.log(res.data);
        toaster.create({
          description: res.data.message.text,
          type: res.data.message.type,
        });
        setChangeModal();
        onApprovalSuccess();
      })
      .catch((error) => {
        console.log("입고 반려 중 오류 ", error);
        const message = e.response?.data?.message;
        toaster.create({ description: message.text, type: message.type });
      });
  };

  return (
    <DialogRoot size={"lg"} open={isModalOpen} onOpenChange={setChangeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>입고 승인</DialogTitle>
        </DialogHeader>
        <DialogBody
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          css={{ "--field-label-width": "85px" }}
        >
          <HStack gap={5}>
            <Field
              orientation="horizontal"
              label={<SpacedLabel text="입고 구분" />}
              labelProps={{
                sx: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%", // 전체 너비 설정
                },
              }}
            >
              <Input value={instk.inputCommonCodeName} readOnly />
            </Field>
            <Field
              label={<SpacedLabel text="주문 번호" />}
              orientation="horizontal"
            >
              <Input value={instk.inputNo} readOnly />
            </Field>
          </HStack>

          <HStack gap={5}>
            <Field
              orientation="horizontal"
              label={<SpacedLabel text="품 목" />}
            >
              <Input readOnly value={instk.itemCommonName} />
            </Field>
            <Field label={<SpacedLabel text="수량" />} orientation="horizontal">
              <Input readOnly value={instk.itemAmount} />
            </Field>
          </HStack>

          <HStack gap={5}>
            <Field
              label={<SpacedLabel text="담당 업체" />}
              orientation="horizontal"
            >
              <Input value={instk.customerName} readOnly />
            </Field>
            <Field label={<SpacedLabel text="창고" />} orientation="horizontal">
              <Input value={instkDetail.warehouseName} readOnly />
            </Field>
          </HStack>
          <Field
            label={<SpacedLabel text="창고주소" />}
            orientation="horizontal"
          >
            <Input value={instkDetail.warehouseAddress} readOnly />
          </Field>

          <HStack gap={5}>
            <Field
              label={<SpacedLabel text="주문 요청자" />}
              orientation="horizontal"
            >
              <Input readOnly value={instk.requestEmployeeName} />
            </Field>
            <Field label={<SpacedLabel text="사번" />} orientation="horizontal">
              <Input readOnly value={instk.requestEmployeeNo} />
            </Field>
          </HStack>

          <Field orientation="horizontal" label={<SpacedLabel text="요청일" />}>
            <Input readOnly value={instk.requestDate} />
          </Field>

          <HStack gap={5}>
            <Field
              label={<SpacedLabel text="주문 승인자" />}
              orientation="horizontal"
            >
              <Input value={instk.requestApprovalEmployeeName} />
            </Field>
            <Field
              label={<SpacedLabel text="사 번" />}
              orientation="horizontal"
            >
              <Input readOnly value={instk.requestApprovalEmployeeNo} />
            </Field>
          </HStack>

          <Field
            label={<SpacedLabel text="주문 비고" />}
            orientation="horizontal"
          >
            {instk.inputNote ? (
              <Textarea
                value={instk.inputNote}
                readOnly
                style={{ maxHeight: "100px", overflowY: "auto" }}
                placeholder={"최대50자"}
              />
            ) : (
              <Input readOnly value={"내용 없음"} />
            )}
          </Field>
          <Separator />
          <HStack gap={5}>
            {/*TODO FIELD 텍스트 가운데 정렬 */}
            <Field
              label={<SpacedLabel text="반려/승인자" />}
              orientation="horizontal"
              sx={{ justifyContent: "center" }}
            >
              <Input
                variant={"subtle"}
                value={localStorage.getItem("name")}
                readOnly
              />
            </Field>
            <Field
              label={<SpacedLabel text="사번" />}
              orientation="horizontal"
              sx={{
                "& .chakra-field__label": {
                  justifyContent: "center",
                },
              }}
            >
              <Input variant={"subtle"} value={id} readOnly />
            </Field>
          </HStack>

          <Field label={<SpacedLabel text="비고" />} orientation="horizontal">
            <Textarea
              value={inputStockNote}
              style={{ maxHeight: "100px", overflowY: "auto" }}
              placeholder={"최대 50자"}
              onChange={(e) => {
                setInputStockNote(e.target.value);
              }}
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setChangeModal();
            }}
          >
            취소
          </Button>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              colorPalette="red"
              onClick={() => {
                handleRejectInstk();
              }}
            >
              반려
            </Button>
          </DialogActionTrigger>

          <Button
            onClick={() => {
              handleAddInstk();
            }}
          >
            승인
          </Button>
        </DialogFooter>
        <DialogCloseTrigger
          onClick={() => {
            setChangeModal();
          }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
