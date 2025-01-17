import React from "react";
import { Box, Center, createListCollection, Table } from "@chakra-ui/react";
import { ActiveSwitch } from "../tool/ActiveSwitch.jsx";
import { Sort } from "../tool/Sort.jsx";
import { Pagination } from "../tool/Pagination.jsx";
import { SearchBar } from "../tool/SearchBar.jsx";

export function ItemCommonCodeList({
  itemCommonCodeList,
  setItemCommonCodeKey,
  count,
  searchParams,
  setSearchParams,
}) {
  // 검색 옵션
  const itemSearchOptions = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "품목코드", value: "itemCommonCode" },
      { label: "품목명", value: "itemCommonName" },
    ],
  });

  // 정렬 헤더
  const sortOptions = [
    { key: "itemCommonCodeKey", label: "#" },
    { key: "itemCommonCode", label: "품목코드" },
    { key: "itemCommonName", label: "품목명" },
  ];

  return (
    <Box>
      <SearchBar
        itemSearchOptions={itemSearchOptions}
        onSearchChange={(nextSearchParam) => setSearchParams(nextSearchParam)}
      />
      <ActiveSwitch
        onActiveChange={(nextSearchParam) => setSearchParams(nextSearchParam)}
      />
      <Box>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Sort
                sortOptions={sortOptions}
                onSortChange={(nextSearchParam) =>
                  setSearchParams(nextSearchParam)
                }
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {itemCommonCodeList?.map((item, index) => (
              <Table.Row
                key={item.itemCommonCodeKey}
                onClick={() => setItemCommonCodeKey(item.itemCommonCodeKey)}
                style={{ cursor: "pointer" }}
              >
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell>{item.itemCommonCode}</Table.Cell>
                <Table.Cell>{item.itemCommonName}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Center>
          <Pagination
            count={count}
            pageSize={10}
            onPageChange={(newPage) => {
              const nextSearchParam = new URLSearchParams(searchParams);
              nextSearchParam.set("page", newPage);
              setSearchParams(nextSearchParam);
            }}
          />
        </Center>
      </Box>
    </Box>
  );
}
