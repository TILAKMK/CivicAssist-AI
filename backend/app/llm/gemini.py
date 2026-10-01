import os
import time
from typing import Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError

from backend.app.config import get_settings
from backend.app.utils.logging import logger
from backend.app.utils.text import mask_sensitive


class GeminiClient:
    """Production client for Google Gemini generation using the official google-genai SDK."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
        timeout_seconds: Optional[float] = None,
    ):
        settings = get_settings()
        self.api_key = (
            api_key
            if api_key is not None
            else settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        )
        self.model_name = model_name or settings.GEMINI_MODEL
        self.timeout_seconds = timeout_seconds or settings.REQUEST_TIMEOUT_SECONDS
        self._client: Optional[genai.Client] = None

    @property
    def is_configured(self) -> bool:
        """Return True if an API key is provided and non-empty."""
        return bool(self.api_key and self.api_key.strip())

    def _get_client(self) -> genai.Client:
        """Instantiate client once with secure API key."""
        if not self.is_configured:
            raise ValueError(
                "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
            )
        if self._client is None:
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def generate_answer(
        self,
        question: str,
        context: str,
        temperature: float = 0.2,
        max_output_tokens: int = 1024,
    ) -> str:
        """Generate a strictly grounded municipal FAQ response using Gemini.

        Never exposes the API key in logs or error traces.
        """
        if not self.is_configured:
            raise ValueError(
                "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
            )

        client = self._get_client()
        from backend.app.rag.prompt import build_prompt
        full_prompt = build_prompt(question=question, context=context)

        logger.info(
            f"Sending request to Gemini model '{self.model_name}' (context length: {len(context)} chars)"
        )
        start_time = time.perf_counter()

        try:
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_output_tokens,
            )
            response = client.models.generate_content(
                model=self.model_name,
                contents=full_prompt,
                config=config,
            )

            latency = round((time.perf_counter() - start_time) * 1000, 2)
            logger.info(f"Gemini generation completed in {latency}ms")

            if not response.text:
                logger.warning("Gemini returned an empty response.")
                return "I couldn't find enough information in the available municipal sources to answer that reliably."

            return response.text.strip()

        except APIError as e:
            safe_msg = mask_sensitive(str(e))
            logger.error(f"Gemini API Error: {safe_msg}")
            raise RuntimeError(f"Municipal LLM service error: {safe_msg}") from None

        except Exception as e:
            safe_msg = mask_sensitive(str(e))
            logger.error(f"Gemini Generation Exception: {safe_msg}")
            raise RuntimeError(f"Failed to generate answer: {safe_msg}") from None


# ---------------------------------------------------------------------------
# Global Gemini Client Singleton
# ---------------------------------------------------------------------------

_GEMINI_CLIENT_INSTANCE: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """Return the shared GeminiClient singleton."""
    global _GEMINI_CLIENT_INSTANCE
    if _GEMINI_CLIENT_INSTANCE is None:
        _GEMINI_CLIENT_INSTANCE = GeminiClient()
    return _GEMINI_CLIENT_INSTANCE
