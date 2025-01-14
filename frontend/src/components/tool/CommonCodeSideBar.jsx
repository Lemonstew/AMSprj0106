import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function SidebarItem({ children, path, ...rest }) {
  const navigate = useNavigate();

  return (
    <Box
      h="40px"
      display="flex"
      alignItems="center"
      px="4"
      _hover={{ bgColor: "gray.200", cursor: "pointer" }}
      onClick={() => path && navigate(path)}
      {...rest}
    >
      <Text fontWeight="medium" color="gray.700">
        {children}
      </Text>
    </Box>
  );
}

export function CommonCodeSideBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      {/*SideBar 영역*/}
      <Box
        w="300px"
        pb="4"
        bg="gray.100"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Box
          bgColor={"steelBlue"}
          h={"70px"}
          display="flex"
          justifyContent="center" // 가로 방향 가운데 정렬
          alignItems="center" // 세로 방향 가운데 정렬
        >
          <Text fontWeight="bold" color={"white"} fontSize={"25px"}>
            기준정보 관리
          </Text>
        </Box>

        <Stack spacing="2" mt="4">
          <SidebarItem path="/branch">사업장/부서 관리</SidebarItem>
          <SidebarItem path="/employee">인사 관리</SidebarItem>
          <SidebarItem path="/franchise">가맹점 관리</SidebarItem>
          <SidebarItem path="/customer">협력업체 관리</SidebarItem>
          <SidebarItem path="/item">품목 관리</SidebarItem>
          <SidebarItem path="/warehouse">창고 관리</SidebarItem>
          <SidebarItem path="/location">로케이션 관리</SidebarItem>
        </Stack>
      </Box>
    </Flex>
  );
}
