use axum::{Router, routing::{get, post}};
use std::sync::Arc;

use crate::{AppState, handlers};

pub fn create_routes(state: Arc<AppState>) -> Router {
    Router::new()
        // Token endpoints
        .route(
            "/api/token/price",
            get(handlers::token::price::get_token_price),
        )
        .route(
            "/api/token/price/batch",
            get(handlers::token::price::get_batch_token_prices),
        )
        // User endpoints
        .route(
            "/api/user/balance",
            get(handlers::user::balance::get_token_balance),
        )
        .route(
            "/api/user/balance/batch",
            get(handlers::user::balance::get_batch_token_balances),
        )
        .route(
            "/api/user/balance/history",
            get(handlers::user::balance_history::get_token_balance_history),
        )
        .route(
            "/api/user/treasuries",
            get(handlers::user::treasuries::get_user_treasuries),
        )
        .route(
            "/api/user/assets",
            get(handlers::user::assets::get_user_assets),
        )
        .route(
            "/api/token/storage-deposit/is-registered",
            get(handlers::token::storage_deposit::is_registered::is_storage_deposit_registered),
        )
        .route(
            "/api/token/storage-deposit/is-registered/batch",
            post(handlers::token::storage_deposit::is_registered::get_batch_storage_deposit_is_registered),
        )
        .route(
            "/api/treasury/policy",
            get(handlers::treasury::policy::get_treasury_policy),
        )
        .with_state(state)
}
