-- goose up
ALTER TABLE senders ADD COLUMN address_name varchar(128) DEFAULT NULL AFTER address;
ALTER TABLE senders ADD COLUMN asset_id varchar(64) DEFAULT 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' AFTER address_name;

-- goose down
ALTER TABLE senders DROP COLUMN address_name;
ALTER TABLE senders DROP COLUMN asset_id;
