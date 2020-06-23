-- goose up
ALTER TABLE senders ADD COLUMN address_name varchar(128) DEFAULT NULL AFTER address;
ALTER TABLE senders ADD COLUMN asset_id varchar(64) DEFAULT 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' AFTER address_name;
ALTER TABLE senders MODIFY COLUMN amount double;
UPDATE senders SET amount=amount/100000000.0 WHERE id = id;
ALTER TABLE senders MODIFY COLUMN amount varchar(64);
ALTER TABLE receivers MODIFY COLUMN amount double;
UPDATE receivers SET amount=amount/100000000.0 WHERE id = id;
ALTER TABLE receivers MODIFY COLUMN amount varchar(64);

-- goose down
ALTER TABLE senders DROP COLUMN address_name;
ALTER TABLE senders DROP COLUMN asset_id;
