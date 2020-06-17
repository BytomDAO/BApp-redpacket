-- goose up
ALTER TABLE senders ADD COLUMN address_name varchar(128) DEFAULT NULL AFTER address;

-- goose down
ALTER TABLE senders DROP COLUMN address_name;
