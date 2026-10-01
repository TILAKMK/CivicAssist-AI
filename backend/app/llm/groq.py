import os
import time
from typing import Optional

from groq import Groq

from backend.app.config import get_settings
from backend.app.utils.logging import logger
from backend.app.utils.text import mask_sensitive


class GroqClient:
    """Primary grounded generation client using the official Groq SDK."""

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
            else settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
        )
        self.model_name = model_name or settings.GROQ_MODEL
        self.timeout_seconds = timeout_seconds or settings.REQUEST_TIMEOUT_SECONDS
        self._client: Optional[Groq] = None

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def _get_client(self) -> Groq:
        if not self.is_configured:
            raise ValueError(
                "Groq API key is not configured. Please set GROQ_API_KEY in your .env file."
            )
        if self._client is None:
            self._client = Groq(api_key=self.api_key, timeout=self.timeout_seconds)
        return self._client

    def generate_answer(
        self,
        question: str,
        context: str,
        temperature: float = 0.2,
        max_output_tokens: int = 1024,
    ) -> str:
        if not self.is_configured:
            raise ValueError(
                "Groq API key is not configured. Please set GROQ_API_KEY in your .env file."
            )

        start_time = time.perf_counter()
        try:
            from backend.app.rag.prompt import build_prompt

            response = self._get_client().chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "user",
                        "content": build_prompt(question=question, context=context),
                    }
                ],
                temperature=temperature,
                max_tokens=max_output_tokens,
            )
            answer = response.choices[0].message.content if response.choices else None
            if not answer:
                raise RuntimeError("Groq returned an empty response.")

            latency = round((time.perf_counter() - start_time) * 1000, 2)
            logger.info("Groq generation completed in %sms", latency)
            return answer.strip()
        except Exception as exc:
            safe_message = mask_sensitive(str(exc))
            logger.error("Groq generation failed: %s", safe_message)
            raise RuntimeError(f"Groq generation failed: {safe_message}") from None


_GROQ_CLIENT_INSTANCE: Optional[GroqClient] = None


def get_groq_client() -> GroqClient:
    global _GROQ_CLIENT_INSTANCE
    if _GROQ_CLIENT_INSTANCE is None:
        _GROQ_CLIENT_INSTANCE = GroqClient()
    return _GROQ_CLIENT_INSTANCE