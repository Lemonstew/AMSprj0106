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

export function EmployeeAdd({ viewKey, onChange }) {
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

  // 이거 백으로 가져와야 하나  흠 ,
  const frameworks = createListCollection({
    items: [
      { label: "협력업체", value: "PAR" },
      { label: "직원", value: "EMP" },
    ],
  });

  //  viewKey 값이 변동 되었을경우  출력을 위해 서버에서 받아오는 코드
  useEffect(() => {
    if (viewKey !== -1) {
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
            departMent: res.data.department || "",
            note: res.data.employeeNote || "",
            name: res.data.employeeName || "",
          });
        });
    }
  }, [viewKey]);

  // 사번 부여 함수
  function createEmployeeNo() {
    const randomNumber = Math.floor(Math.random() * 1e10); // 1e10은 10자리 숫자
    var randomNo = formData.selectedCommonCode.join("") + randomNumber;

    return randomNo;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
      departMent: "",
    });
  };

  //  클릭 버튼 시
  const handleSubmit = () => {
    // 수정 일때와 , 추가 일때의 경로 매핑
    const url = viewKey === -1 ? "/api/employee/add" : "/api/employee/update";
    const method = viewKey === -1 ? "post" : "put";
    // selectedCommonCode.join(""),
    var data;

    if (viewKey === -1) {
      // 등록 데이터 폼

      console.log(formData.employeeNo);
      data = {
        employeeCommonCode: formData.selectedCommonCode.join(""),
        employeeWorkPlaceCode: formData.workPlace,
        employeeName: formData.name,
        employeeTel: formData.tel,
        employeeNote: formData.note,
        employeeDepartment: formData.departMent,
        employeeNo: createEmployeeNo(),
      };
    } else {
      // 수정 데이터 폼
      data = {
        // 공통 코드  , 소속 코드 , 사번 , 이름 , 전화 번호 , 비고 , 부서 , 비번
        employeeKey: viewKey,
        employeeCommonCode: formData.selectedCommonCode,
        employeeWorkPlaceCode: formData.workPlace,
        employeeNo: formData.employeeNo,
        employeeName: formData.name,
        employeeTel: formData.tel,
        employeeNote: formData.note,
        employeeDepartment: formData.departMent,
        employeePassword: formData.password,
      };
    }

    axios[method](url, data)
      .then((res) => {
        formDataClear();
        // setFormData({
        //   employeeNo: "",
        //   password: "",
        //   selectedCommonCode: "",
        //   name: "",
        //   tel: "",
        //   note: "",
        //   workPlace: "",
        //   departMent: "",
        // });
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
      })
      .catch((error) => {
        console.error("전송중 오류 발생:", error);
        toaster.create({
          type: error.response.data.message.type,
          description: error.response.data.message.text,
        });
      })
      .finally(() => {
        onChange();
      });
  };

  const handleDelete = () => {
    console.log("실행");
    axios
      .put("api/employee/delete", { employeeKey: viewKey })
      .then((res) => {
        console.log(res);
        console.log(res.data); // 응답 데이터 로그
        toaster.create({
          type: res.data.message.type,
          description: res.data.message.text,
        });
      })
      .catch((error) => {
        console.error("삭제 실패:", error);
        // 오류가 발생하면 사용자에게 알림을 주는 것도 좋습니다.
        console.log(error);
        toaster.create({
          type: error.response.data.message.type,
          description: error.response.data.message.text,
        });
      });
  };

  return (
    <Box border={"1px solid black"}>
      <Heading>{viewKey === -1 ? "회원 등록" : "회원 수정"}</Heading>
      <Stack spacing={4}>
        <SelectRoot
          collection={frameworks}
          value={
            viewKey === -1
              ? formData.selectedCommonCode
              : [formData.selectedCommonCode]
          }
          onValueChange={(e) =>
            setFormData({ ...formData, selectedCommonCode: e.value })
          }
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
        />
        <Input
          name="departMent"
          placeholder={"부서 코드 / 부서 명"}
          value={formData.departMent}
          onChange={handleInputChange}
        />
        <Input
          name="name"
          placeholder={"직원명"}
          value={formData.name}
          onChange={handleInputChange}
        />
        {viewKey === -1 || (
          <Input
            name="employeeNo"
            placeholder={"사번"}
            value={formData.employeeNo}
            onChange={handleInputChange}
          />
        )}
        <Input
          name="tel"
          placeholder={"전화번호"}
          value={formData.tel}
          onChange={handleInputChange}
        />
        <Input
          name="note"
          placeholder={"비고"}
          value={formData.note}
          onChange={handleInputChange}
        />
        {viewKey !== -1 && (
          <Input
            name="password"
            placeholder={"비밀번호"}
            value={formData.password}
            onChange={handleInputChange}
          />
        )}
      </Stack>

      <Button onClick={handleSubmit}>
        {viewKey === -1 ? "회원 등록" : "회원 수정"}
      </Button>
      {/*view 화면 일때만 보여주기*/}
      {viewKey !== -1 && (
        <Button
          onClick={() => {
            handleDelete();
          }}
        >
          {" "}
          회원 삭제
        </Button>
      )}
    </Box>
  );
}