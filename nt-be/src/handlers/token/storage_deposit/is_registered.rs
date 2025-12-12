use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use near_api::{AccountId, Contract};
use serde::Deserialize;
use std::sync::Arc;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct GetStorageDepositQuery {
    #[serde(rename = "accountId")]
    pub account_id: AccountId,
    #[serde(rename = "tokenId")]
    pub token_id: AccountId,
}

pub async fn is_storage_deposit_registered(
    State(state): State<Arc<AppState>>,
    Query(params): Query<GetStorageDepositQuery>,
) -> Result<Json<bool>, (StatusCode, String)> {
    let account_id = params.account_id.clone();
    let token_id = params.token_id;

    if token_id == "near" || token_id == "NEAR" {
        return Ok(Json(true));
    }

    let cache_key = format!("storage-deposit:{}:{}", account_id, token_id);
    if let Some(cached_storage_deposit) = state.cache.get(&cache_key).await {
        println!(
            "🔁 Returning cached storage deposit for {} / {}",
            account_id, token_id
        );
        return Ok(Json(cached_storage_deposit == "true"));
    }

    let storage_deposit = Contract(token_id.clone())
        .storage_deposit()
        .view_account_storage(account_id.clone())
        .fetch_from(&state.network)
        .await
        .map_err(|e| {
            eprintln!(
                "Error fetching storage deposit with account_id: {} and token_id: {}: {e}",
                account_id, token_id,
            );
            (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
        })?
        .data;

    let is_registered = storage_deposit.is_some();
    state
        .cache
        .insert(cache_key, serde_json::Value::Bool(is_registered))
        .await;
    Ok(Json(is_registered))
}
