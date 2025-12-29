-- Increase token_id column length to accommodate long intents tokens
-- Example: intents.near:nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near
-- is 77 characters long, exceeding the original 64 character limit

ALTER TABLE balance_changes 
    ALTER COLUMN token_id TYPE VARCHAR(128);

COMMENT ON COLUMN balance_changes.token_id IS 'Token identifier - supports NEAR, FT contracts, and intents.near multi-tokens (up to 128 characters)';
