-- Add block_time as timestamptz for API responses
ALTER TABLE balance_changes 
ADD COLUMN block_time TIMESTAMPTZ;

-- Populate block_time from block_timestamp (nanoseconds since Unix epoch)
-- NEAR timestamps are in nanoseconds, convert to seconds for timestamp
UPDATE balance_changes 
SET block_time = to_timestamp(block_timestamp::DOUBLE PRECISION / 1000000000);

-- Make it NOT NULL after populating
ALTER TABLE balance_changes 
ALTER COLUMN block_time SET NOT NULL;

-- Add index for time-based queries
CREATE INDEX idx_balance_changes_block_time ON balance_changes(block_time DESC);

COMMENT ON COLUMN balance_changes.block_time IS 'Block timestamp as timestamptz for API responses (derived from block_timestamp)';
