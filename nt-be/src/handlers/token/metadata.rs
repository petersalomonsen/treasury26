use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
    response::IntoResponse,
};
use near_api::{AccountId, NetworkConfig, Tokens};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

use crate::{
    AppState,
    constants::{NEAR_ICON, WRAP_NEAR_ICON},
};

#[derive(Deserialize)]
pub struct TokenMetadataQuery {
    #[serde(rename = "tokenId")]
    pub token_id: AccountId,
    pub network: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct TokenMetadataResponse {
    pub token_id: AccountId,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub icon: Option<String>,
}

async fn fetch_token_metadata(
    token_id: AccountId,
    network: &NetworkConfig,
) -> Result<TokenMetadataResponse, String> {
    let metadata = Tokens::ft_metadata(token_id.clone())
        .fetch_from(network)
        .await
        .map_err(|e| {
            eprintln!("Error fetching token metadata for {}: {}", token_id, e);
            format!("Failed to fetch token metadata: {}", e)
        })?
        .data;

    Ok(TokenMetadataResponse {
        token_id,
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        icon: metadata.icon,
    })
}

pub async fn get_token_metadata(
    State(state): State<Arc<AppState>>,
    Query(params): Query<TokenMetadataQuery>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let cache_key = format!("token-metadata:{}:{}", params.token_id, params.network);
    if let Some(cached_data) = state.cache.get(&cache_key).await {
        return Ok((StatusCode::OK, Json(cached_data)));
    }

    if params.token_id == "near" || params.token_id == "wrap.near" {
        let icon = if params.token_id == "wrap.near" {
            Some(WRAP_NEAR_ICON.to_string())
        } else {
            Some(NEAR_ICON.to_string())
        };
        let value = serde_json::to_value(TokenMetadataResponse {
            token_id: params.token_id.clone(),
            name: "NEAR".to_string(),
            symbol: "NEAR".to_string(),
            decimals: 24,
            icon,
        })
        .map_err(|e| {
            eprintln!("Error serializing token metadata: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to serialize token metadata: {}", e),
            )
        })?;

        return Ok((StatusCode::OK, Json(value)));
    }

    let metadata = fetch_token_metadata(params.token_id.clone(), &state.network)
        .await
        .map_err(|e| {
            eprintln!(
                "Error fetching token metadata for {}: {}",
                params.token_id, e
            );
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch token metadata: {}", e),
            )
        })?;

    let result_value = serde_json::to_value(&metadata).map_err(|e| {
        eprintln!("Error serializing token metadata: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to serialize token metadata: {}", e),
        )
    })?;

    state.cache.insert(cache_key, result_value.clone()).await;

    Ok((StatusCode::OK, Json(result_value)))
}
