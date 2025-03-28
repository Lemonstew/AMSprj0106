import React from "react";
import {
  Box,
  createListCollection,
  Flex,
  HStack,
  Table,
} from "@chakra-ui/react";
import { ActiveSwitch } from "../../tool/form/ActiveSwitch.jsx";
import { Sort } from "../../tool/form/Sort.jsx";
import { Pagination } from "../../tool/form/Pagination.jsx";
import { SearchBar } from "../../tool/form/SearchBar.jsx";
import { Field } from "../../ui/field.jsx";
import { CommonCodeSelect } from "./CommonCodeSelect.jsx";

export function CommonCodeList({
  commonCodeList,
  count,
  searchParams,
  setSearchParams,
  onRowClick,
}) {
  // 검색 옵션
  const searchOptions = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "코드", value: "commonCode" },
      { label: "코드명", value: "commonCodeName" },
    ],
  });

  // 정렬 헤더
  const sortOptions = [
    { key: "commonCodeKey", label: "#" },
    { key: "commonCodeType", label: "코드 구분" },
    { key: "commonCode", label: "코드" },
    { key: "commonCodeName", label: "코드명" },
  ];

  return (
    <Box>
      <SearchBar
        searchOptions={searchOptions}
        onSearchChange={(nextSearchParam) => setSearchParams(nextSearchParam)}
      />
      <HStack alignItems="center" justifyContent="space-between" width="100%">
        <ActiveSwitch
          onActiveChange={(nextSearchParam) => setSearchParams(nextSearchParam)}
        />
        <Box css={{ "--field-label-width": "70px" }}>
          <Field label={"코드 구분"} orientation="horizontal" gap={0}>
            <CommonCodeSelect
              onSelectChange={(nextSearchParam) =>
                setSearchParams(nextSearchParam)
              }
            />
          </Field>
        </Box>
      </HStack>
      <Box>
        <Table.Root>
          <Table.Header>
            <Table.Row whiteSpace={"nowrap"} bg={"gray.100"}>
              <Sort
                sortOptions={sortOptions}
                onSortChange={(nextSearchParam) =>
                  setSearchParams(nextSearchParam)
                }
                defaultSortKey={"commonCodeKey"}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {commonCodeList.length > 0 ? (
              commonCodeList?.map((code, index) => (
                <Table.Row
                  key={code.commonCodeKey ? code.commonCodeKey : index}
                  onDoubleClick={() => {
                    onRowClick(code.commonCodeKey);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                  bg={code.commonCodeActive ? "white" : "gray.100"}
                  _hover={{ backgroundColor: "gray.200" }}
                >
                  <Table.Cell textAlign="center" width={"90px"}>
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell textAlign="center" width="35%">
                    {code.commonCodeType}
                  </Table.Cell>
                  <Table.Cell textAlign="center" width="25%">
                    {code.commonCode}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {code.commonCodeName}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan="4">
                  정보가 존재하지 않습니다.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        <Flex justify="center">
          <HStack w={"100%"}>
            <Pagination
              count={count}
              pageSize={10}
              onPageChange={(newPage) => {
                const nextSearchParam = new URLSearchParams(searchParams);
                nextSearchParam.set("page", newPage);
                setSearchParams(nextSearchParam);
              }}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
