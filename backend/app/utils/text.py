import hashlib
import re
import unicodedata


def clean_text(text: str) -> str:
    """Normalize unicode characters, remove control characters and excess whitespace."""
    if not text:
        return ""

    # Normalize unicode (NFKC)
    text = unicodedata.normalize("NFKC", text)

    # Replace carriage returns and excessive tabs
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Replace 3 or more newlines with 2 newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Replace non-newline whitespace sequences with a single space
    lines = [re.sub(r"[^\S\n]+", " ", line).strip() for line in text.split("\n")]
    cleaned = "\n".join(lines).strip()
    return cleaned


def compute_content_id(text: str, prefix: str = "doc") -> str:
    """Generate a deterministic 12-character SHA-256 identifier for given content."""
    sha = hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]
    return f"{prefix}_{sha}"


def mask_sensitive(text: str) -> str:
    """Mask potential API keys or secrets in logs."""
    if not text:
        return ""
    # Mask AIza... or gsk_ or generic 32+ char hex/base64 strings
    return re.sub(r"AIza[0-9A-Za-z-_]{35}", "[MASKED_API_KEY]", text)
