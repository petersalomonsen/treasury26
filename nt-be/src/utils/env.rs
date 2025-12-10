#[derive(Clone, Debug)]
pub struct EnvVars {
    pub pikespeak_key: String,
    pub fastnear_api_key: String,
}

impl Default for EnvVars {
    fn default() -> Self {
        Self {
            pikespeak_key: std::env::var("PIKESPEAK_KEY").expect("PIKESPEAK_KEY is not set"),
            fastnear_api_key: std::env::var("FASTNEAR_API_KEY")
                .expect("FASTNEAR_API_KEY is not set"),
        }
    }
}
