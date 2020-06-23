
ALTER TABLE senders_copy MODIFY COLUMN amount double; UPDATE senders_copy SET amount=amount/100000000.0 WHERE id = id; ALTER TABLE senders_copy MODIFY COLUMN amount varchar(64);
