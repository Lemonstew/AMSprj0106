import { Box } from "@chakra-ui/react";
import { EmployeeAdd } from "../../components/employee/EmployeeAdd.jsx";
import { AccountSideBar } from "../../components/employee/AccountSideBar.jsx";
import React, { useEffect, useState } from "react";
import { EmployeeList } from "../../components/employee/EmployeeList.jsx";

// 왼쪽 탭에 따라서 > 오른쪽을 다르게 보이게 할건가 ?
export function Employee() {
  const [selectedMenu, setSelectedMenu] = useState("list");
  const [selectedEmployeeNo, setSelectedEmployeeNo] = useState(-1);

  useEffect(() => {}, [selectedEmployeeNo]);

  const handleSelectedNo = (selectedEmployeeNo) => {
    setSelectedEmployeeNo(selectedEmployeeNo);
  };

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <Box display={"flex"}>
      <AccountSideBar onSelect={handleSelectMenu} />
      {selectedMenu === "list" && <EmployeeList onSelect={handleSelectedNo} />}
      <EmployeeAdd viewKey={selectedEmployeeNo} />
    </Box>
  );
}
