import {
  Box,
  createListCollection,
  createToaster,
  Heading,
  Input,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster.jsx";

export function EmployeeAdd({ viewKey, onChange, onSelect }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    employeeNo: "",
    password: "",
    selectedCommonCode: "",
    name: "",
    tel: "",
    note: "",
    workPlace: "",
    departMent: "",
  });

  const frameworks = createListCollection({
    items: [
      { label: "협력업체", value: "CUS" },
      { label: "직원", value: "EMP" },
    ],
  });

  // 공통 코드 조회
  useEffect(() => {
    getCommonCode();
  }, []);

  const getCommonCode = () => {
    axios.get("api/commonCode/list").then((res) => {
      console.log(res.data);
    });
  };

  // 상세 정보 조회
  useEffect(() => {
    if (viewKey !== -1) {
      fetchEmployeeData();
      setIsEditMode(false);
    }
  }, [viewKey]);

  const fetchEmployeeData = () => {
    axios
      .get("api/employee/view", {
        params: { viewKey },
      })
      .then((res) => {
        setFormData({
          employeeNo: res.data.employeeNo || "",
          selectedCommonCode: res.data.employeeCommonCode || "",
          password: res.data.employeePassword || "",
          tel: res.data.employeeTel || "",
          workPlace: res.data.employeeWorkPlaceCode || "",
          note: res.data.employeeNote || "",
          name: res.data.employeeName || "",
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      selectedCommonCode: value,
    }));
  };

  const formDataClear = () => {
    setFormData({
      employeeNo: "",
      password: "",
      selectedCommonCode: "",
      name: "",
      tel: "",
      note: "",
      workPlace: "",
      department: "",
    });
  };

  const handleSubmit = () => {
    // 수정일 때
    if (viewKey !== -1) {
      if (!isEditMode) {
        setIsEditMode(true);
        return;
      }

      const data = {
        employeeKey: viewKey,
        employeeCommonCode: formData.selectedCommonCode,
        employeeWorkPlaceCode: formData.workPlace,
        employeeNo: formData.employeeNo,
        employeeName: formData.name,
        employeeTel: formData.tel,
        employeeNote: formData.note,
        employeeDepartment: formData.department,
        employeePassword: formData.password,
      };

      axios
        .put("/api/employee/update", data)
        .then((res) => {
          toaster.create({
            type: res.data.message.type,
            description: res.data.message.text,
          });
          setIsEditMode(false);
          onChange();
        })
        .catch((error) => {
          console.error("수정 중 오류 발생:", error);
          toaster.create({
            type: error.response.data.message.type,
            description: error.response.data.message.text,
          });
        });
    } else {
      // 등록일 때
      const data = {
        employeeCommonCode: formData.selectedCommonCode.value.join(""),
        employeeWorkPlaceCode: formData.workPlace,
        employeeName: formData.name,
        employeeTel: formData.tel,
        employeeNote: formData.note,
        employeeDepartment: formData.department,
        employeeNo: "",
      };

      axios
        .post("/api/employee/add", data)
        .then((res) => {
          formDataClear();
          toaster.create({
            type: res.data.message.type,
            description: res.data.message.text,
          });
          onChange();
        })
        .catch((error) => {
          console.error("등록 중 오류 발생:", error);
          toaster.create({
            type: error.response.data.message.type,
            description: error.response.data.message.text,
            쳐,
          });
        });
    }
  };

  const handleDelete = () => {
    axios
      .put("api/employee/delete", { employeeKey: viewKey })
      .then((res) => {
        formDataClear();
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
        onChange();
      })
      .catch((error) => {
        console.error("삭제 실패:", error);
        toaster.create({
          type: error.response.data.message.type,
          description: error.response.data.message.text,
        });
      });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    fetchEmployeeData(); // 원래 데이터로 복원
  };

  return (
    <Box>
      <Heading>{viewKey === -1 ? "회원 등록" : "회원 정보"}</Heading>
      <Stack spacing={4}>
        <SelectRoot
          collection={frameworks}
          value={formData.selectedCommonCode}
          onValueChange={handleSelectChange}
          disabled={viewKey !== -1}
        >
          <SelectLabel>상위 구분 코드</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder={"선택 해 주세요"} />
          </SelectTrigger>
          <SelectContent>
            {frameworks.items.map((code) => (
              <SelectItem item={code} key={code.value}>
                {code.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <Input
          name="workPlace"
          placeholder={"소속 코드 / 소속 명"}
          value={formData.workPlace}
          onChange={handleInputChange}
          readOnly={viewKey !== -1}
        />

        <Input
          name="name"
          placeholder={"직원명"}
          value={formData.name}
          onChange={handleInputChange}
          readOnly={viewKey !== -1 && !isEditMode}
        />

        {viewKey !== -1 && (
          <Input
            name="employeeNo"
            placeholder={"사번"}
            value={formData.employeeNo}
            onChange={handleInputChange}
            readOnly={viewKey !== -1}
          />
        )}

        <Input
          name="tel"
          placeholder={"전화번호"}
          value={formData.tel}
          onChange={handleInputChange}
          readOnly={viewKey !== -1 && !isEditMode}
        />

        <Input
          name="note"
          placeholder={"비고"}
          value={formData.note}
          onChange={handleInputChange}
          readOnly={viewKey !== -1 && !isEditMode}
        />

        {viewKey !== -1 && (
          <Input
            name="password"
            placeholder={"비밀번호"}
            value={formData.password}
            onChange={handleInputChange}
            readOnly={viewKey !== -1 && !isEditMode}
          />
        )}
      </Stack>

      <Box mt={4}>
        <Button onClick={handleSubmit}>
          {viewKey === -1 ? "회원 등록" : isEditMode ? "저장" : "수정하기"}
        </Button>

        {viewKey !== -1 && isEditMode && (
          <Button onClick={handleCancel} ml={2}>
            취소
          </Button>
        )}

        {viewKey !== -1 && (
          <Button onClick={handleDelete} ml={2}>
            회원 삭제
          </Button>
        )}
      </Box>
    </Box>
  );
}
