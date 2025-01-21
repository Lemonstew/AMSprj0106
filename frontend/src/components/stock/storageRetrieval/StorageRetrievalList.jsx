import React, { useState } from "react";
import { Box, Center, HStack, Stack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../ui/pagination.jsx";
import StorageRetrievalDetail from "./StorageRetrievalDetail.jsx";
import StorageRetrievalListPage from "./StorageRetrievalListPage.jsx";

function StorageRetrievalList({
  storageRetrievalList,
  countStorageRetrieval,
  handlePageChangeClick,
  currentPage,
}) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedStorageRetrieval, setSelectedStorageRetrieval] =
    useState(null);

  return (
    <Box>
      <Stack>
        <Box>
          <Table.Root interactive showColumnBorder>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader
                  width="80px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  #
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  입출 구분
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  시리얼 번호
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  품목명
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  창고명
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  가맹점명
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  본사 직원
                </Table.ColumnHeader>

                <Table.ColumnHeader
                  width="200px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  협력업체 직원
                </Table.ColumnHeader>

                <Table.ColumnHeader
                  width="150px"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  날짜
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {storageRetrievalList.map((storageRetrieval) => (
                <StorageRetrievalListPage
                  storageRetrieval={storageRetrieval}
                  setSelectedStorageRetrieval={setSelectedStorageRetrieval}
                  setIsDetailDialogOpen={setIsDetailDialogOpen}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        <Center>
          <PaginationRoot
            onPageChange={handlePageChangeClick}
            count={countStorageRetrieval}
            pageSize={10}
            // page={page}
            siblingCount={2}
            defaultPage={currentPage}
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Center>
        <StorageRetrievalDetail
          storageRetrieval={selectedStorageRetrieval}
          isOpened={isDetailDialogOpen}
          onClosed={() => setIsDetailDialogOpen(false)}
        />
      </Stack>
    </Box>
  );
}

export default StorageRetrievalList;
