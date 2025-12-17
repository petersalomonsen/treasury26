use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
    response::IntoResponse,
};
use near_api::{AccountId, Contract, NetworkConfig};
use reqwest::StatusCode;
use serde::Deserialize;

use crate::AppState;

#[derive(Deserialize)]
pub struct PoolLookupQuery {
    #[serde(rename = "accountId")]
    pub account_id: AccountId,
}

async fn fetch_pool(
    token_id: AccountId,
    network: &NetworkConfig,
) -> Result<Option<AccountId>, (StatusCode, String)> {
    let pool: Option<AccountId> = Contract(token_id.clone())
        .call_function("get_staking_pool_account_id", ())
        .read_only()
        .fetch_from(network)
        .await
        .map_err(|e| {
            eprintln!("Error fetching pool for {}: {}", token_id, e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch pool: {}", e),
            )
        })?
        .data;

    Ok(pool)
}

pub async fn get_lockup_pool(
    State(state): State<Arc<AppState>>,
    Query(params): Query<PoolLookupQuery>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let cache_key = format!("pool-lookup:{}", params.account_id);
    if let Some(cached_data) = state.cache.get(&cache_key).await {
        return Ok((StatusCode::OK, Json(cached_data.clone())));
    }

    let pool = fetch_pool(params.account_id.clone(), &state.network).await?;

    let result_value = serde_json::to_value(&pool).map_err(|e| {
        eprintln!("Error serializing pool: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to serialize pool: {}", e),
        )
    })?;

    state.cache.insert(cache_key, result_value.clone()).await;

    Ok((StatusCode::OK, Json(result_value)))
}
