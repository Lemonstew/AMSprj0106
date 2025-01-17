import React from "react";
import { Box, Stack, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function WarehouseList({ warehouseList, onShowDetail, countWarehouse }) {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack>
        <Box>
          <Table.Root interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>#</Table.ColumnHeader>
                <Table.ColumnHeader>창고명</Table.ColumnHeader>
                <Table.ColumnHeader>담당 업체</Table.ColumnHeader>
                <Table.ColumnHeader>업체 직원</Table.ColumnHeader>
                <Table.ColumnHeader>광역 시도</Table.ColumnHeader>
                <Table.ColumnHeader>시군</Table.ColumnHeader>
                <Table.ColumnHeader>사용 여부</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {warehouseList.map((warehouse) => (
                <Table.Row
                  key={warehouse.warehouseKey}
                  onClick={() => {
                    onShowDetail(warehouse.warehouseKey);
                  }}
                >
                  <Table.Cell>{warehouse.warehouseKey}</Table.Cell>
                  <Table.Cell>{warehouse.warehouseName}</Table.Cell>
                  <Table.Cell>{warehouse.customerCode}</Table.Cell>
                  <Table.Cell>{warehouse.customerEmployeeNo}</Table.Cell>
                  <Table.Cell>{warehouse.warehouseState}</Table.Cell>
                  <Table.Cell>{warehouse.warehouseCity}</Table.Cell>
                  <Table.Cell>
                    {warehouse.warehouseActive ? "사용" : "미사용"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Box>
  );
}

export default WarehouseList;
