# -- goose up
# ALTER TABLE transactions ADD COLUMN type tinyint(1) DEFAULT '0' AFTER tx_position;
#
# ALTER TABLE fund_managements ADD COLUMN wallet_direction tinyint(1) DEFAULT '0' AFTER amount;
#
# SET SQL_SAFE_UPDATES = 0;
# UPDATE transactions SET type = 1 WHERE wallet_direction = 0;
# UPDATE transactions SET type = 2 WHERE wallet_direction != 0;
# UPDATE fund_managements f SET f.wallet_direction = (SELECT wallet_direction FROM transactions t WHERE t.id = f.tx_id);
# SET SQL_SAFE_UPDATES = 1;
#
# ALTER TABLE transactions DROP COLUMN wallet_direction;
#
# ALTER TABLE life_cycles ADD COLUMN fee bigint(20) unsigned DEFAULT '0' AFTER amount;
#
#
# -- goose down
# ALTER TABLE transactions ADD COLUMN wallet_direction tinyint(1) DEFAULT '0' AFTER tx_position;
#
# SET SQL_SAFE_UPDATES = 0;
# UPDATE transactions t SET t.wallet_direction = (SELECT wallet_direction FROM fund_managements f WHERE t.id = f.tx_id) WHERE t.type = 2;
# SET SQL_SAFE_UPDATES = 1;
#
# ALTER TABLE transactions DROP COLUMN type;
#
# ALTER TABLE fund_managements DROP COLUMN wallet_direction;
#
# ALTER TABLE life_cycles DROP COLUMN fee;
#

-- goose up
ALTER TABLE senders ADD COLUMN type tinyint(1) DEFAULT '0' AFTER tx_position;

ALTER TABLE fund_managements ADD COLUMN wallet_direction tinyint(1) DEFAULT '0' AFTER amount;

SET SQL_SAFE_UPDATES = 0;
UPDATE transactions SET type = 1 WHERE wallet_direction = 0;
UPDATE transactions SET type = 2 WHERE wallet_direction != 0;
UPDATE fund_managements f SET f.wallet_direction = (SELECT wallet_direction FROM transactions t WHERE t.id = f.tx_id);
SET SQL_SAFE_UPDATES = 1;

ALTER TABLE transactions DROP COLUMN wallet_direction;

ALTER TABLE life_cycles ADD COLUMN fee bigint(20) unsigned DEFAULT '0' AFTER amount;


-- goose down
ALTER TABLE transactions ADD COLUMN wallet_direction tinyint(1) DEFAULT '0' AFTER tx_position;

SET SQL_SAFE_UPDATES = 0;
UPDATE transactions t SET t.wallet_direction = (SELECT wallet_direction FROM fund_managements f WHERE t.id = f.tx_id) WHERE t.type = 2;
SET SQL_SAFE_UPDATES = 1;

ALTER TABLE transactions DROP COLUMN type;

ALTER TABLE fund_managements DROP COLUMN wallet_direction;

ALTER TABLE life_cycles DROP COLUMN fee;

