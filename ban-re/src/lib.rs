/*!
 * BAN Reverse Engineering Library
 *
 * Analyse et parsing des fichiers d'animation Silkroad Online (.BAN)
 */

pub mod error;
pub mod parser;
pub mod types;

pub use error::{BanError, BanResult};
pub use parser::BanParser;
pub use types::*;

// Réexporter les utilitaires communs
pub mod prelude {
    pub use crate::error::{BanError, BanResult};
    pub use crate::parser::BanParser;
    pub use crate::types::*;
}
