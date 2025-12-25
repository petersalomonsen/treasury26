# Balance Change Data Collection Implementation Plan

The purpose is to collect data to fill in the table `balance_changes`. The concept is simple:

- Define a starting point, in most cases that will be the block_height of the current time, but there might also be scenarios where we want to start from an earlier block_height to capture only historic data
- From the chosen block height, ask the following: what is the balance difference compared to the previous recorded balance for that token/account (If we don't have a previous recorded balance, then let's say it is zero, since we don't have any recorded history ).
    - If the difference is zero, then assume nothing has happened in the interval between the chosen block and the previous recorded block
    - If there is a difference, search backwards for a block with a change, record the balance before and after that block in a new balance change entry
- Iterate through the recorded data. If the balance_after of one record does not match the balance_before of the next record for the given token/account - then consider it as a "gap", and search backwards between these records for a block with a change
    - Iterate through the recorded data until all gaps are filled

## How to search backwards

### Third party API approach

Use APIs like nearblocks, pikespeak and NEAR Intents explorer API to query transactions for the given account and token in the specified range. Order descending and take the last. Cache results in memory to avoid querying the API again for the same data.

### RPC Fallback approach

If unable to resolve the gap from third party API data, use archival RPC to query balances at specific block heights.

- Query the block in the middle of the current block searching range
    - If the last half has a change, then select that as the current block searching range
    - If only the first half has a change, then select that as the current block searching range
- Loop this until the exact block of change is found

## How to analyze/record a block that has balance changes

Simply query the balance for the specified account and token on the block before, and after and record the values in the balance change entry

## How to discover which tokens to scan

When starting with no data, the first thing to check is the native NEAR balance. If the account has interacted with Fungible Tokens there will also be balance changes in NEAR for gas fees when interacting with the Fungible Token contracts. When the NEAR balance change is caused by a contract interaction, then the receipts (that can span over multiple following blocks) of that transaction should also be checked for token transfer events, which also then will reveal which Fungible Tokens that changed balances. NEAR Intents follow a similar patterns, though it is also possible to transfer tokens without a NEAR transaction initiated by the account owner ( the intent resolution can be posted to the intents.near contract by the solver, and so it is not seen as a transaction initiated by the account ). It is easy to query the full asset balance on NEAR Intents, as you can just call `mt_tokens_for_owner` to get the list of all tokens that the account holds on NEAR Intents, and then call `mt_batch_balance_of` to get the balances. For NEAR Intents there should be frequent balance snapshots ( e.g. twice per day ) to reduce the chance of missing transfers in and out on the same day.

# Questions and answers

*Starting Point Clarification: Consider adding a "sync_status" tracking mechanism to persist where each account/token is synced to, so you can resume after interruptions.*

You should be able to resume at any starting point. The existing data should be checked for gaps from the starting point you define. No sync_status should be needed here, as scanning through existing data for gaps should be able to identify what is missing.

*API Rate Limiting: The plan should mention handling rate limits for third-party APIs (nearblocks, pikespeak) and potentially implementing exponential backoff.*

The fallback is to the RPC binary search, but should resume to third-party APIs when available.

*Transaction Actions Field: The current database has an actions JSONB field. The plan should specify what data to store there - full transaction details, receipt data, or just the relevant events?*

The transaction actions are the arguments to the transactions, and is different from receipt logs where the events are visible. The arguments and outcome should be stored separately.

The `actions` JSONB field should stay as it is, storing the transaction arguments on the initiating block. 

The `raw_data` JSONB field can contain the full receipt data, including the logs that also contains the events/outcomes. We can rename this to `receipt`.

*Counterparty Discovery: Should clarify how to determine the counterparty field - from transfer events, receipt predecessors, or transaction signer?*

The counterparty is always the account that sent or received the tokens that have changed balance. So should not be confused with predecessor or signer, which might have not been sending / receiving the token that we are recording the balance change for.

*Multi-Receipt Transactions: NEAR transactions can span multiple blocks with receipts. Should specify how to handle this - which block_height to use (transaction block vs receipt execution block)?*

The records are per receipt execution block. We are always checking the balance of a token before and after a receipt execution block.

*Intents Edge Case: You mention intents can be resolved without account-initiated transactions. Should there be a separate polling mechanism for mt_tokens_for_owner to catch these, or rely on periodic balance checks?*

We need to get as much transfers as possible from the third party APIs, but in case they don't fill the gaps, we need additional frequent polling to ensure that we don't miss transfers in and out within short timeframes ( e.g. the same day ).

*Gap Detection on Startup: When resuming, should it validate existing records for gaps, or trust the existing data?*

Yes, it should always ensure that the records are connected so that the balance_after matches balance_before on the next record.

*Error Handling: What happens if APIs are unavailable or RPC nodes are out of sync? Should it mark gaps as "unresolved" and retry later?*

Since we can resume at any time, the data collection job can exit in such cases, and when retriggered, it will figure out where the gap is and start from there.

*Block timestamp*

The block timestamp is available by querying the block from RPC ( see the Typescript implementation https://github.com/petersalomonsen/near-accounting-export/blob/main/scripts/balance-tracker.ts#L1258 ).

# Performance considerations

Alternate between searching accounts, to avoid hitting rate limits. Process one account at the time, and also one block at the time.

# Reference project

A project that already does this is https://github.com/petersalomonsen/near-accounting-export/. It is written in TypeScript, but has most of the features mentioned here. In this project we want to improve the structure compared to the TypeScript implementaiton, and also simplify the implementation.

