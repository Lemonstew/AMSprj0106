CREATE TABLE TB_CUSTMST
(
    customer_key             INT PRIMARY KEY AUTO_INCREMENT,
    item_code                VARCHAR(5),
    customer_code            VARCHAR(13) NOT NULL,
    customer_name            VARCHAR(30) NOT NULL,
    customer_rep             VARCHAR(5)  NOT NULL,
    customer_no              VARCHAR(13) NOT NULL,
    customer_tel             VARCHAR(15) NOT NULL,
    customer_fax             VARCHAR(15),
    customer_address         VARCHAR(50) NOT NULL,
    customer_address_details VARCHAR(50),
    customer_post            VARCHAR(10) NOT NULL,
    customer_active          BOOLEAN DEFAULT true,
    customer_note            VARCHAR(50)
);


# DROP TABLE partner;


INSERT INTO TB_CUSTMST
(customer_name, customer_code, item_code, customer_rep, customer_no,
 customer_tel, customer_fax, customer_address, customer_address_details,
 customer_post, customer_active, customer_note)
VALUES ('중앙셀로', 'CUS0002', 'CEL', '백종원', '1123027845',
        '0321223213', '0321223213', '용산', null,
        '10327', true, null);