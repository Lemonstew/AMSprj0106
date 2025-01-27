import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { useNavigate } from "react-router-dom";
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

function TextItem({ children, path, ...rest }) {
  const navigate = useNavigate();

  return (
    <Box
      h={"40px"}
      w={{ base: "90px", sm: "110px" }} // 반응형: 작은 화면에서는 더 좁게
      display="flex" // Flexbox 활성화
      justifyContent="center" // 가로 방향 가운데 정렬
      alignItems="center" // 세로 방향 가운데 정렬
      _hover={{ cursor: "pointer", bgColor: "whiteAlpha.700" }}
      onClick={() => path && navigate(path)}
      {...rest}
    >
      <Text fontWeight={"bold"} color={"gray.700"} whiteSpace={"nowrap"}>
        {children}
      </Text>
    </Box>
  );
}

function MemberInfo() {
  // const { id } = useParams();
  const { id } = useContext(AuthenticationContext);
  const [employee, setEmployee] = useState(null);
  const [empChange, setEmpChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 상태 관리

  useEffect(() => {
    axios
      .get(`/api/info/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setEmployee(data);
        setEmpChange(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const handleSaveInfo = () => {
    axios
      .put("/api/info/update", {
        employeeKey: employee.employeeKey,
        employeeWorkPlaceName: employee.employeeWorkPlaceName,
        employeeNo: employee.employeeNo,
        employeeName: employee.employeeName,
        employeePassword: employee.employeePassword,
        employeeTel: employee.employeeTel,
        employeeNote: employee.employeeNote,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setEmpChange(employee);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };
  const handleClose = () => {
    setEmployee(empChange);
    setIsDialogOpen(false);
  };

  return (
    <DialogRoot
      onOpenChange={(isOpen) => {
        setEmployee(empChange);
      }}
    >
      <DialogTrigger asChild>
        <TextItem
          onClick={() => {
            setEmployee(empChange);
          }}
        >
          내 정보
        </TextItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>내 정보</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field label={"소속"} orientation="horizontal" mb={15}>
            <Input
              value={employee.employeeWorkPlaceName}
              readOnly
              variant="subtle"
            />
          </Field>
          <Field label={"아이디"} orientation="horizontal" mb={15}>
            <Input value={employee.employeeNo} readOnly variant="subtle" />
          </Field>
          <Field label={"이름"} orientation="horizontal" mb={15}>
            <Input
              value={employee.employeeName}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeName: e.target.value,
                }))
              }
            />
          </Field>
          <Field label={"비밀번호"} orientation="horizontal" mb={15}>
            <Input
              value={employee.employeePassword}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeePassword: e.target.value,
                }))
              }
            />
          </Field>
          <Field label={"전화번호"} orientation="horizontal" mb={15}>
            <Input
              value={employee.employeeTel}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeTel: e.target.value,
                }))
              }
            />
          </Field>
          <Field label={"비고"} orientation="horizontal" mb={15}>
            <Input
              value={employee.employeeNote}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeNote: e.target.value,
                }))
              }
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={handleClose}>
              닫기
            </Button>
          </DialogActionTrigger>
          <Button onClick={handleSaveInfo}>저장</Button>
        </DialogFooter>
        <DialogCloseTrigger></DialogCloseTrigger>
      </DialogContent>
    </DialogRoot>
  );
}

export default MemberInfo;
