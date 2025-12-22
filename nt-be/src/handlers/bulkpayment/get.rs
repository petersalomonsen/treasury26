use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
};
use near_api::AccountId;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{AppState, constants::BATCH_PAYMENT_ACCOUNT_ID};

#[derive(Deserialize)]
pub struct BatchPaymentQuery {
    #[serde(rename = "batchId")]
    pub batch_id: String,
}

#[derive(Deserialize, Serialize)]
pub struct BatchPayment {
    pub recipient: AccountId,
    pub amount: String,
    pub status: serde_json::Value,
}

#[derive(Deserialize, Serialize)]
pub struct BatchPaymentResponse {
    pub token_id: AccountId,
    pub submitter: AccountId,
    pub status: String,
    pub payments: Vec<BatchPayment>,
}

pub async fn get_batch_payment(
    State(state): State<Arc<AppState>>,
    Query(params): Query<BatchPaymentQuery>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let cache_key = format!("batch-payment:{}", params.batch_id);
    if let Some(cached_data) = state.cache.get(&cache_key).await {
        return Ok((StatusCode::OK, Json(cached_data)));
    }

    let list: BatchPaymentResponse = near_api::Contract(BATCH_PAYMENT_ACCOUNT_ID.into())
        .call_function(
            "view_list",
            serde_json::json!({
                "list_id": params.batch_id,
            }),
        )
        .read_only()
        .fetch_from(&state.network)
        .await
        .map_err(|e| {
            eprintln!("Error fetching batch payment: {}: {}", params.batch_id, e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch batch payment: {}", e),
            )
        })?
        .data;

    let result_value = serde_json::to_value(&list).map_err(|e| {
        eprintln!("Error serializing batch payment: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to serialize batch payment: {}", e),
        )
    })?;
    state.cache.insert(cache_key, result_value.clone()).await;

    Ok((StatusCode::OK, Json(result_value)))
}
