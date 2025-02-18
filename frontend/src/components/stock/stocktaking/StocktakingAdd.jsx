import React, { useEffect, useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Button } from "../../ui/button.jsx";
import axios from "axios";
import { toaster } from "../../ui/toaster.jsx";
import { Field } from "../../ui/field.jsx";
import Select from "react-select";
import { Radio, RadioGroup } from "../../ui/radio.jsx";
import { Tooltip } from "../../ui/tooltip.jsx";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";

function StocktakingAdd({
  isOpen,
  onClose,
  title,
  setStocktakingList,
  searchParams,
}) {
  const [warehouseCode, setWarehouseCode] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState(null);
  const [countCurrent, setCountCurrent] = useState("");
  const [countConfiguration, setCountConfiguration] = useState("");
  const [stocktakingNote, setStocktakingNote] = useState("");
  const [stocktakingType, setStocktakingType] = useState(true);
  const initialStocktakingAdd = {
    warehouseName: "",
    warehouseCode: null,
    itemCode: "",
    itemName: "",
    countCurrent: "",
    countConfiguration: "",
    stocktakingNote: "",
    stocktakingType: true,
    row: null,
    col: null,
    shelf: null,
    locationKey: null,
    setRowList: [],
    setColList: [],
    setShelfList: [],
  };
  const [stocktakingAdd, setStocktakingAdd] = useState(initialStocktakingAdd);
  const [warehouseList, setWarehouseList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [stockLocation, setStockLocation] = useState([]);
  const [searchClick, setSearchClick] = useState(false);
  // 여기서부터 새롭게 추가된 실사에 쓰이는 애들
  const [difference, setDifference] = useState(null);
  const [makeDifference, setMakeDifference] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [row, setRow] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [colList, setColList] = useState([]);
  const [col, setCol] = useState("");
  const [selectedCol, setSelectedCol] = useState("");
  const [shelfList, setShelfList] = useState([]);
  const [shelf, setShelf] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("");
  const [locationKey, setLocationKey] = useState("");
  const [putStocktakingType, setPutStocktakingType] = useState(null);
  const [serialNo, setSerialNo] = useState(null);
  const [tooltip, setTooltip] = useState(false);
  const [selectWarehouse, setSelectWarehouse] = useState(false);

  const resetState = () => {
    setWarehouseCode(null);
    setWarehouseName("");
    setItemName("");
    setItemCode(null);
    setCountCurrent("");
    setCountConfiguration("");
    setStocktakingNote("");
    setStocktakingType(true);
    setSearchClick(false);
    setDifference(null);
    setSerialNo(null);
    setPutStocktakingType(null);
    setLocationKey(null);
    setRow(null);
    setCol(null);
    setShelf(null);
    setRowList([]);
    setColList([]);
    setShelfList([]);
    setMakeDifference(null);
    setSelectWarehouse(false);
  };

  // 요청 창 닫히면 초기화
  const handleClose = () => {
    setStocktakingAdd(initialStocktakingAdd);
    resetState();
    onClose();
  };

  // 창고 정보 가져오기
  useEffect(() => {
    axios.get(`/api/stocktaking/warehouse`).then((res) => {
      const warehouseOptions = res.data.map((warehouse) => ({
        value: warehouse.warehouseCode,
        label: warehouse.warehouseName,
      }));
      setWarehouseList(warehouseOptions);
    });
  }, []);

  // 물품 정보 가져오기
  useEffect(() => {
    if (warehouseCode) {
      axios.get(`/api/stocktaking/item/${warehouseCode}`).then((res) => {
        const itemOptions = res.data.map((item) => ({
          value: item.itemCode,
          label: item.itemName,
        }));
        setItemList(itemOptions);
      });
    }
  }, [warehouseCode]);

  // location row 정보 가져오기
  useEffect(() => {
    if (warehouseCode && itemCode !== null) {
      axios.get(`/api/stocktaking/row/${warehouseCode}`).then((res) => {
        const rowOptions = res.data.map((location) => ({
          value: location,
          label: location,
        }));
        setRowList(rowOptions);
      });
    }
  }, [warehouseCode, itemCode]);

  // location col 정보 가져오기
  useEffect(() => {
    if (warehouseCode && row) {
      axios.get(`/api/stocktaking/col/${warehouseCode}/${row}`).then((res) => {
        const colOptions = res.data.map((col) => ({
          value: col,
          label: col,
        }));
        setColList(colOptions);
      });
    }
  }, [warehouseCode, row]);

  // location shelf 정보 가져오기
  useEffect(() => {
    if (warehouseCode && row && col) {
      axios
        .get(`/api/stocktaking/shelf/${warehouseCode}/${row}/${col}`)
        .then((res) => {
          const shelfOptions = res.data.map((shelf) => ({
            value: shelf,
            label: shelf,
          }));
          setShelfList(shelfOptions);
        });
    }
  }, [warehouseCode, row, col]);

  // location_key 정보 가져오기
  useEffect(() => {
    if (warehouseCode && row && col && shelf) {
      axios
        .get(
          `/api/stocktaking/location/${warehouseCode}/${row}/${col}/${shelf}`,
        )
        .then((res) => {
          setLocationKey(res.data);
        });
    }
  }, [warehouseCode, row, col, shelf]);

  // 창고 & 품목 변경 시 전산 수량(countCurrent) 불러오기
  useEffect(() => {
    if (warehouseCode && itemCode !== null) {
      axios
        .get(`/api/stocktaking/count/${warehouseCode}`)
        .then((res) => {
          setCountCurrent(res.data); // 백엔드에서 받은 전산 수량 값 설정
          setCountConfiguration(res.data); // 초기 실제수량은 전산 값과 동일
          setStocktakingAdd((prev) => ({
            ...prev,
            countCurrent: res.data, // stocktakingAdd에도 값 반영
          }));
        })
        .catch((err) => {
          console.error("전산 수량 조회 실패", err);
          setCountCurrent(""); // 에러 발생 시 초기화
        });
    }
  }, [warehouseCode, itemCode]);

  useEffect(() => {}, [countCurrent]);

  // 창고 변경 시 관리자 컬렉션 생성
  const handleWarehouseChange = (selectedOption) => {
    setWarehouseName(selectedOption.label);
    setWarehouseCode(selectedOption.value);
    setSelectedWarehouse(selectedOption);

    setMakeDifference(null);
    setPutStocktakingType(null);
    setRow(null);
    setCol(null);
    setShelf(null);
    setStocktakingAdd({
      row: null,
      col: null,
      shelf: null,
      itemCode: null,
      itemName: null,
      countCurrent: null,
      countConfiguration: null,
      setRowList: [],
      setColList: [],
      setShelfList: [],
    });
    setSerialNo(null);
    setColList([]);
    setLocationKey("");

    setShelfList([]);

    setItemCode(null);
    setItemName(null);
    setCountCurrent("");
    setCountConfiguration("");

    // 선택 즉시 stocktakingAdd 업데이트
    setStocktakingAdd((prev) => ({
      ...prev,
      warehouseName: selectedOption.label,
      warehouseCode: selectedOption.value,
    }));
  };

  // 행 변경 시 열 컬렉션 생성
  const handleRowChange = (selectedOption) => {
    setRow(selectedOption.label);
    setRow(selectedOption.value);
    setSelectedRow(selectedOption);

    // 선택 즉시 stocktakingAdd 업데이트
    setStocktakingAdd((prev) => ({
      ...prev,
      row: selectedOption.value,
    }));
  };
  // 열 변경 시 단 컬렉션 생성
  const handleColChange = (selectedOption) => {
    setCol(selectedOption.label);
    setCol(selectedOption.value);
    setSelectedCol(selectedOption);

    // 선택 즉시 stocktakingAdd 업데이트
    setStocktakingAdd((prev) => ({
      ...prev,
      col: selectedOption.value,
    }));
  };
  // 단 변경
  const handleShelfChange = (selectedOption) => {
    setShelf(selectedOption.label);
    setShelf(selectedOption.value);
    setSelectedShelf(selectedOption);

    // 선택 즉시 stocktakingAdd 업데이트
    setStocktakingAdd((prev) => ({
      ...prev,
      shelf: selectedOption.value,
    }));
  };

  // 유효성 검증
  const isValid =
    warehouseCode && itemCode && countCurrent && countConfiguration;

  // 물품 변경
  const handleItemChange = (selectedOption) => {
    setItemName(selectedOption.label);
    setItemCode(selectedOption.value);
    setSelectedItem(selectedOption);

    // 선택 즉시 stocktakingAdd 업데이트
    setStocktakingAdd((prev) => ({
      ...prev,
      itemName: selectedOption.label,
      itemCode: selectedOption.value,
    }));
  };

  const handleSaveClick = () => {
    axios
      .post(`/api/stocktaking/add`, {
        warehouseCode,
        itemCode,
        countCurrent,
        countConfiguration,
        stocktakingNote,
        stocktakingType,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        handleClose();
        onClose();
      })
      .catch((e) => {
        const message = e.response?.data?.message;
        toaster.create({ description: message.text, type: message.type });
      });
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose(); // 다이얼로그가 닫히면 항상 초기화
    }
  }, [isOpen]);

  //유효성 검사
  const validate = () => {
    return (
      warehouseCode != "" &&
      itemCode != "" &&
      countCurrent !== null &&
      countCurrent !== undefined && // ✅ 0도 유효한 값이므로 null/undefined만 체크
      countConfiguration !== null &&
      countConfiguration !== undefined &&
      countConfiguration !== ""

      //   makeDifference 를 통해 값이 같을 때 등록 가능하게 하기
    );
  };

  const serialValidate = () => {
    return serialNo !== "" && serialNo !== null && tooltip === true;
  };

  const shelfValidate = () => {
    return (
      shelf !== "" &&
      shelf !== null &&
      stocktakingAdd.shelf !== "" &&
      stocktakingAdd.shelf !== null &&
      col !== "" &&
      col !== null &&
      stocktakingAdd.col !== "" &&
      stocktakingAdd.col !== null &&
      row !== "" &&
      row !== null &&
      stocktakingAdd.row !== "" &&
      stocktakingAdd.row !== null
    );
  };

  const handleDifferentClick = () => {
    axios.get(`/api/stocktaking/checkLocation/${locationKey}`).then((res) => {
      setSerialNo(res.data);
      setPutStocktakingType("");
      if (
        res.data === ""
          ? setMakeDifference("in") || setPutStocktakingType("new")
          : setMakeDifference("out") || setPutStocktakingType("lost")
      );
    });
    setTooltip(true);
  };

  useEffect(() => {
    console.log("difference 값 변경됨:", difference);
  }, [difference]);

  const handleAddLocation = () => {
    axios
      .post(`/api/stocktaking/updateStock`, {
        locationKey,
        row,
        col,
        shelf,
        serialNo,
        makeDifference,
        putStocktakingType,
        warehouseCode,
        itemCode,
        itemName,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        if (makeDifference === "out") {
          setCountConfiguration(countConfiguration - 1);
        } else if (makeDifference === "in") {
          setCountConfiguration(countConfiguration + 1);
        }
      })
      .catch((e) => {
        const message = e.response?.data?.message;
        toaster.create({ description: message.text, type: message.type });
      });

    setMakeDifference(null);
    setPutStocktakingType(null);
    setRow(null);
    setCol(null);
    setShelf(null);
    setSerialNo(null);
    setColList([]);
    setLocationKey("");
    setStocktakingAdd({
      row: null,
      col: null,
      shelf: null,
    });

    setShelfList([]);

    // axios.put(`/api/stocktaking/stockStatus`)
  };

  console.log(serialNo);
  useEffect(() => {
    if (putStocktakingType === "old") {
      setSerialNo("");
    } else if (putStocktakingType === "new") {
      setSerialNo("시리얼 번호 생성");
    }
  }, [putStocktakingType]);

  useEffect(() => {
    if (putStocktakingType === "new") {
      setSerialNo("시리얼 번호 생성");
    }
  }, [serialNo]);

  useEffect(() => {
    setTooltip(false);
    setSerialNo("");
  }, [row, col, shelf, warehouseCode, itemCode]);

  const handleContinueClick = () => {
    setSelectWarehouse(true);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size="lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
            css={{ "--field-label-width": "85px" }}
          >
            {selectWarehouse ? (
              <Box>
                <Field
                  label={<SpacedLabel text="창고" />}
                  orientation="horizontal"
                  mb={15}
                >
                  <Input value={warehouseName} readOnly variant="subtle" />
                </Field>
                <Field
                  label={<SpacedLabel text="품목" />}
                  orientation="horizontal"
                  mb={15}
                >
                  <Input value={itemName} readOnly variant="subtle" />
                </Field>
                <Box display="flex" gap={5}>
                  <Field
                    label={<SpacedLabel text="전산 수량" />}
                    orientation="horizontal"
                    mb={15}
                  >
                    <Input
                      type={"text"}
                      value={countCurrent}
                      readOnly
                      variant="subtle"
                    />
                  </Field>
                  <Field
                    label={<SpacedLabel text="실제 수량" />}
                    orientation="horizontal"
                    mb={15}
                  >
                    <Input
                      type={"text"}
                      value={countConfiguration}
                      onChange={(e) => {
                        setCountConfiguration(e.target.value);
                        setSearchClick(false);
                      }}
                      readOnly
                      variant="subtle"
                    />
                  </Field>
                </Box>

                <Field
                  label={<SpacedLabel text="로케이션" />}
                  orientation="horizontal"
                  mb={15}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    {/* 왼쪽 선택박스 그룹 */}
                    <Box display="flex" gap={30}>
                      <Select
                        options={rowList}
                        value={row && rowList.find((opt) => opt.value === row)}
                        onChange={handleRowChange}
                        placeholder="행 선택"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "120px",
                            height: "40px",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 100,
                            width: "120px",
                          }),
                        }}
                      />
                      <Select
                        options={colList}
                        value={col && colList.find((opt) => opt.value === col)}
                        onChange={handleColChange}
                        placeholder="열 선택"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "120px",
                            height: "40px",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 100,
                            width: "120px",
                          }),
                        }}
                      />
                      <Select
                        options={shelfList}
                        value={
                          shelf && shelfList.find((opt) => opt.value === shelf)
                        }
                        onChange={handleShelfChange}
                        placeholder="단 선택"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "120px",
                            height: "40px",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 100,
                            width: "120px",
                          }),
                        }}
                      />
                    </Box>
                    <Tooltip
                      content="로케이션 입력을 완료해 주세요."
                      openDelay={100}
                      closeDelay={100}
                      disabled={shelfValidate()}
                    >
                      <Button
                        onClick={handleDifferentClick}
                        disabled={!shelfValidate()}
                        variant="outline"
                        width="90px"
                      >
                        조회
                      </Button>
                    </Tooltip>
                  </Box>
                </Field>
                {makeDifference === null ? (
                  <Box display="flex" gap={18}>
                    <Field
                      label={<SpacedLabel text="시리얼 번호" />}
                      orientation="horizontal"
                      mb={15}
                    >
                      <Input value={serialNo} readOnly />
                    </Field>

                    <Tooltip
                      content={"로케이션 조회를 완료해 주세요."}
                      openDelay={100}
                      closeDelay={100}
                      disabled={serialValidate()}
                    >
                      <Button
                        onClick={handleAddLocation}
                        disabled={!serialValidate()}
                        width="90px"
                      >
                        실사 반영
                      </Button>
                    </Tooltip>
                  </Box>
                ) : makeDifference === "" ? (
                  <Box display="flex" gap={18}>
                    <Field
                      label={<SpacedLabel text="시리얼 번호" />}
                      orientation="horizontal"
                      mb={15}
                    >
                      <Input value={serialNo} readOnly />
                    </Field>

                    <Tooltip
                      content={"로케이션 조회를 완료해 주세요."}
                      openDelay={100}
                      closeDelay={100}
                      disabled={serialValidate()}
                    >
                      <Button
                        onClick={handleAddLocation}
                        disabled={!serialValidate()}
                        width="90px"
                      >
                        실사 반영
                      </Button>
                    </Tooltip>
                  </Box>
                ) : makeDifference === "in" ? (
                  putStocktakingType === "new" ? (
                    <>
                      <Box display="flex" gap={18}>
                        <Field
                          label={<SpacedLabel text="시리얼 번호" />}
                          orientation="horizontal"
                          mb={15}
                        >
                          {serialNo === "시리얼 번호 생성" ? (
                            <Input
                              type={"text"}
                              placeholder="시리얼 번호 생성"
                              readOnly
                            />
                          ) : (
                            <Input
                              type={"text"}
                              value="시리얼 번호 생성"
                              placeholder="시리얼 번호 생성"
                              readOnly
                              color="gray.200" // 입력 값의 색상
                              _placeholder={{ color: "gray.200" }} // placeholder 색상
                            />
                          )}
                        </Field>

                        <Tooltip
                          content={"시리얼 번호를 입력해 주세요."}
                          openDelay={100}
                          closeDelay={100}
                          disabled={serialValidate()}
                        >
                          <Button
                            onClick={handleAddLocation}
                            disabled={!serialValidate()}
                            width="90px"
                          >
                            {tooltip === false ? "실사 반영" : "재고 추가"}
                          </Button>
                        </Tooltip>
                      </Box>
                      <Field
                        label={<SpacedLabel text="등록 분류" />}
                        orientation="horizontal"
                        mb={15}
                        required
                      >
                        <Box
                          ml={"92px"}
                          style={{ position: "absolute" }}
                          gap={18}
                        >
                          <RadioGroup
                            value={putStocktakingType} // ✅ Boolean 값을 문자열로 변환
                            onChange={(e) =>
                              setPutStocktakingType(e.target.value)
                            }
                          >
                            <HStack gap="9">
                              <Radio value="new">새 물품</Radio>
                              <Radio value="old">기존 물품</Radio>
                            </HStack>
                          </RadioGroup>
                        </Box>
                        {/*<Input*/}
                        {/*  type={"text"}*/}
                        {/*  value={stocktakingType}*/}
                        {/*  onChange={(e) => setStocktakingType(e.target.value)}*/}
                        {/*/>*/}
                      </Field>
                    </>
                  ) : (
                    <>
                      <Box display="flex" gap={18}>
                        <Field
                          label={<SpacedLabel text="시리얼 번호" />}
                          orientation="horizontal"
                          mb={15}
                        >
                          {serialNo === "시리얼 번호 생성" ? (
                            <Input />
                          ) : (
                            <Input
                              type={"text"}
                              value={serialNo}
                              onChange={(e) => setSerialNo(e.target.value)}
                            />
                          )}
                        </Field>

                        <Tooltip
                          content={
                            tooltip === false
                              ? "로케이션 조회를 완료해 주세요."
                              : "시리얼 번호를 입력해 주세요."
                          }
                          openDelay={100}
                          closeDelay={100}
                          disabled={serialValidate()}
                        >
                          <Button
                            onClick={handleAddLocation}
                            disabled={!serialValidate()}
                            width="90px"
                          >
                            {tooltip === false ? "실사 반영" : "재고 추가"}
                          </Button>
                        </Tooltip>
                      </Box>
                      <Field
                        label={<SpacedLabel text="등록 분류" />}
                        orientation="horizontal"
                        mb={15}
                        required
                      >
                        <Box
                          ml={"92px"}
                          style={{ position: "absolute" }}
                          gap={18}
                        >
                          <RadioGroup
                            value={putStocktakingType} // ✅ Boolean 값을 문자열로 변환
                            onChange={(e) =>
                              setPutStocktakingType(e.target.value)
                            }
                          >
                            <HStack gap="9">
                              <Radio value="new">새 물품</Radio>
                              <Radio value="old">기존 물품</Radio>
                            </HStack>
                          </RadioGroup>
                        </Box>
                      </Field>
                    </>
                  )
                ) : (
                  // TODO: 실사 출고
                  <>
                    <Box display="flex" gap={18}>
                      <Field
                        label={<SpacedLabel text="시리얼 번호" />}
                        orientation="horizontal"
                        mb={15}
                      >
                        <Input type={"text"} value={serialNo} readOnly />
                      </Field>

                      <Tooltip
                        content={"로케이션 조회를 완료해 주세요."}
                        openDelay={100}
                        closeDelay={100}
                        disabled={serialValidate()}
                      >
                        <Button
                          onClick={handleAddLocation}
                          disabled={!serialValidate()}
                          width="90px"
                        >
                          {tooltip === false ? "실사 반영" : "재고 분실"}
                        </Button>
                      </Tooltip>
                    </Box>
                  </>
                )}
                <Field
                  label={<SpacedLabel text="비고" />}
                  orientation="horizontal"
                  mb={15}
                >
                  <Textarea
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                    placeholder="최대 50자"
                    type={"text"}
                    value={stocktakingNote}
                    onChange={(e) => setStocktakingNote(e.target.value)}
                  />
                </Field>
                <Box display="flex" gap={5}>
                  <Field
                    label={<SpacedLabel text="실사 유형" req />}
                    orientation="horizontal"
                    required
                  >
                    <Box ml={"92px"} style={{ position: "absolute" }}>
                      <RadioGroup
                        defaultValue="true" // ✅ Boolean 값을 문자열로 변환
                        onChange={(e) => setStocktakingType(e.target.value)} // ✅ 문자열을 다시 Boolean으로 변환
                      >
                        <HStack gap="6">
                          <Radio value="true">정기 실사</Radio>
                          <Radio value="false">비정기 실사</Radio>
                        </HStack>
                      </RadioGroup>
                    </Box>
                  </Field>
                </Box>
              </Box>
            ) : (
              <Box>
                <Field
                  label={<SpacedLabel text="창고" req />}
                  orientation="horizontal"
                  mb={15}
                  required
                >
                  <Select
                    options={warehouseList}
                    value={
                      warehouseName &&
                      warehouseList.find(
                        (opt) => opt.value === stocktakingAdd.warehouseName,
                      )
                    }
                    onChange={handleWarehouseChange}
                    placeholder="창고 선택"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "538.5px", // 너비 고정
                        height: "40px",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 100, // 선택 목록이 다른 요소를 덮도록
                        width: "538.5px",
                      }),
                    }}
                  />
                </Field>
                <Field
                  label={<SpacedLabel text="품목" req />}
                  orientation="horizontal"
                  mb={15}
                  required
                >
                  <Select
                    options={itemList}
                    value={
                      itemName &&
                      itemList.find(
                        (opt) => opt.value === stocktakingAdd.itemName,
                      )
                    }
                    onChange={handleItemChange}
                    placeholder="물품 선택"
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "538.5px", // 너비 고정
                        height: "40px",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 100, // 선택 목록이 다른 요소를 덮도록
                        width: "538.5px",
                      }),
                    }}
                  />
                </Field>
              </Box>
            )}

            <Box></Box>
          </Box>
        </DialogBody>
        {selectWarehouse ? (
          <DialogFooter>
            <DialogCloseTrigger onClick={onClose} />

            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
            </DialogActionTrigger>
            <Tooltip
              content={"입력을 완료해 주세요."}
              openDelay={100}
              closeDelay={100}
              disabled={validate()}
            >
              <Button
                variant="solid"
                onClick={() => {
                  handleSaveClick();
                }}
                disabled={!validate()}
              >
                등록
              </Button>
            </Tooltip>
          </DialogFooter>
        ) : (
          <DialogFooter>
            <DialogCloseTrigger onClick={onClose} />

            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
            </DialogActionTrigger>
            <Tooltip
              content={"입력을 완료해 주세요."}
              openDelay={100}
              closeDelay={100}
              disabled={validate()}
            >
              <Button
                variant="solid"
                onClick={() => {
                  handleContinueClick();
                }}
                disabled={!validate()}
              >
                계속
              </Button>
            </Tooltip>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}

export default StocktakingAdd;
