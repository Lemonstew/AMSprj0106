import React from "react";
import {
  Box,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
} from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";

function WarehouseSearch({
  warehouseOptionList,
  setSearch,
  handleSearchClick,
  search,
}) {
  return (
    <Box>
      <Stack justify={"top"} direction={"row"}>
        <Box>
          <SelectRoot
            collection={warehouseOptionList}
            defaultValue={["all"]}
            width="120px"
            onChange={(oc) => setSearch({ ...search, type: oc.target.value })}
          >
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent>
              {warehouseOptionList.items.map((items) => (
                <SelectItem item={items} key={items.value}>
                  {items.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>

        <Box>
          <Input
            placeholder="키워드를 입력해주세요"
            width="400px"
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          ></Input>
        </Box>
        <Box>
          <Button onClick={handleSearchClick}>검색</Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default WarehouseSearch;
