/*!
 * Gestion des erreurs pour le parsing BAN
 */

use std::fmt;
use std::io;
use std::string::FromUtf8Error;

pub type BanResult<T> = Result<T, BanError>;

#[derive(Debug)]
pub enum BanError {
    /// Erreur d'IO
    Io(io::Error),

    /// Signature invalide du fichier
    InvalidSignature { found: Vec<u8> },

    /// Version non supportée
    UnsupportedVersion { version: u8 },

    /// Erreur de parsing
    ParseError { message: String },

    /// Données corrompues
    CorruptedData { offset: usize, message: String },

    /// Fin de fichier atteinte inopinément
    UnexpectedEof { offset: usize, expected: usize },

    /// Erreur de conversion UTF-8
    Utf8Error(FromUtf8Error),

    /// Autre erreur
    Other(String),
}

impl fmt::Display for BanError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            BanError::Io(err) => write!(f, "IO error: {}", err),
            BanError::InvalidSignature { found } => write!(
                f,
                "Invalid signature: expected 'JMXVBAN ', got {:?}",
                String::from_utf8_lossy(found)
            ),
            BanError::UnsupportedVersion { version } => {
                write!(f, "Unsupported version: {}", version)
            }
            BanError::ParseError { message } => write!(f, "Parse error: {}", message),
            BanError::CorruptedData { offset, message } => {
                write!(f, "Corrupted data at offset 0x{:04X}: {}", offset, message)
            }
            BanError::UnexpectedEof { offset, expected } => write!(
                f,
                "Unexpected EOF at offset 0x{:04X}, expected {} more bytes",
                offset, expected
            ),
            BanError::Utf8Error(err) => write!(f, "UTF-8 error: {}", err),
            BanError::Other(msg) => write!(f, "Error: {}", msg),
        }
    }
}

impl std::error::Error for BanError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            BanError::Io(err) => Some(err),
            BanError::Utf8Error(err) => Some(err),
            _ => None,
        }
    }
}

impl From<io::Error> for BanError {
    fn from(err: io::Error) -> Self {
        BanError::Io(err)
    }
}

impl From<FromUtf8Error> for BanError {
    fn from(err: FromUtf8Error) -> Self {
        BanError::Utf8Error(err)
    }
}
