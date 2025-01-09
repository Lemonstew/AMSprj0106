import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const navigate = useNavigate();
  const [memberList, setMemberList] = useState([]);
  useEffect(() => {
    axios.get("/api/member/list").then((res) => {
      console.log(res.data);
      setMemberList(res.data);
    });
  }, []);

  return (
    <Box>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>개인키</Table.ColumnHeader>
            <Table.ColumnHeader>분류 코드</Table.ColumnHeader>
            <Table.ColumnHeader>번호</Table.ColumnHeader>
            <Table.ColumnHeader>비번</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberList.map((item) => (
            <Table.Row
              onClick={() => {
                navigate("memver/view:id");
              }}
            >
              <Table.Cell> {item.memberKey} </Table.Cell>
              <Table.Cell> {item.commonCode} </Table.Cell>
              <Table.Cell> {item.memberId} </Table.Cell>
              <Table.Cell> {item.password} </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Box>
  );
}
