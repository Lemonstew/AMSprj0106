import { HStack, Table } from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import React from "react";

export function SortableColumnHeader({ columnKey, label, sort, handleSort }) {
  return (
    <Table.ColumnHeader onClick={() => handleSort(columnKey)}>
      <HStack>
        {label}
        {sort.column === columnKey &&
          (sort.order === "asc" ? <FaCaretUp /> : <FaCaretDown />)}
      </HStack>
    </Table.ColumnHeader>
  );
}