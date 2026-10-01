from typing import Optional

from backend.app.llm.gemini import GeminiClient, get_gemini_client
from backend.app.llm.groq import GroqClient, get_groq_client
from backend.app.utils.logging import logger


class GenerationClient:
    """Run Groq first and use Gemini when Groq is unavailable or fails."""

    def __init__(
        self,
        groq_client: Optional[GroqClient] = None,
        gemini_client: Optional[GeminiClient] = None,
    ):
        self.groq = groq_client or get_groq_client()
        self.gemini = gemini_client or get_gemini_client()

    def generate_answer(self, question: str, context: str, **kwargs) -> str:
        groq_error = None
        if self.groq.is_configured:
            try:
                logger.info("Using Groq as the primary generation provider.")
                return self.groq.generate_answer(question, context, **kwargs)
            except Exception as exc:
                groq_error = exc
                logger.warning("Groq failed; trying Gemini fallback.")

        if self.gemini.is_configured:
            try:
                logger.info("Using Gemini as the fallback generation provider.")
                return self.gemini.generate_answer(question, context, **kwargs)
            except Exception as exc:
                if groq_error is not None:
                    raise RuntimeError(
                        f"Groq and Gemini generation failed: {exc}"
                    ) from None
                raise

        if groq_error is not None:
            raise groq_error
        raise ValueError(
            "No generation provider is configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env."
        )


_GENERATION_CLIENT_INSTANCE: Optional[GenerationClient] = None


def get_generation_client() -> GenerationClient:
    global _GENERATION_CLIENT_INSTANCE
    if _GENERATION_CLIENT_INSTANCE is None:
        _GENERATION_CLIENT_INSTANCE = GenerationClient()
    return _GENERATION_CLIENT_INSTANCE