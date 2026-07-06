import json
from pathlib import Path
from typing import Any, Protocol

from app.core.config import Settings
from app.schemas import DiscoveryImportItem, ProductCandidate, ProductDiscoveryQuery


class CatalogConnector(Protocol):
    def load_catalog(self) -> list[dict[str, Any]]:
        ...


class JsonFileCatalogConnector:
    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path
        self._cached: list[dict[str, Any]] | None = None

    def load_catalog(self) -> list[dict[str, Any]]:
        if self._cached is not None:
            return self._cached

        if not self._file_path.exists():
            self._cached = []
            return self._cached

        with self._file_path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)

        if not isinstance(payload, list):
            self._cached = []
            return self._cached

        self._cached = [row for row in payload if isinstance(row, dict)]
        return self._cached


def _default_catalog_path() -> Path:
    return Path(__file__).resolve().parent / "data" / "public_catalog.json"


class DiscoveryConnectorService:
    """Compliant connector service with pluggable catalog providers."""

    _catalog_connector: CatalogConnector = JsonFileCatalogConnector(_default_catalog_path())

    @classmethod
    def configure_from_settings(cls, settings: Settings) -> None:
        provider = settings.discovery_catalog_provider.strip().lower()
        catalog_path = Path(settings.discovery_catalog_file).expanduser()
        if not catalog_path.is_absolute():
            catalog_path = Path(__file__).resolve().parent / catalog_path

        if provider == "json_file":
            cls._catalog_connector = JsonFileCatalogConnector(catalog_path)
            return

        # Fallback to the default local catalog if provider value is unknown.
        cls._catalog_connector = JsonFileCatalogConnector(_default_catalog_path())

    @classmethod
    def configure_catalog_connector(cls, connector: CatalogConnector) -> None:
        cls._catalog_connector = connector

    @classmethod
    def reset_catalog_connector(cls) -> None:
        cls._catalog_connector = JsonFileCatalogConnector(_default_catalog_path())

    @classmethod
    def _catalog_rows(cls) -> list[dict[str, Any]]:
        return cls._catalog_connector.load_catalog()

    @staticmethod
    def _source_allowed(candidate_source: str, requested_sources: list[str]) -> bool:
        if not requested_sources:
            return True
        normalized = {source.strip().lower() for source in requested_sources}
        return candidate_source.lower() in normalized

    @staticmethod
    def _sort_candidates(candidates: list[ProductCandidate], query: ProductDiscoveryQuery) -> list[ProductCandidate]:
        reverse = query.sort_order == "desc"
        sort_key = query.sort_by
        return sorted(candidates, key=lambda item: getattr(item, sort_key), reverse=reverse)

    @staticmethod
    def _paginate_candidates(candidates: list[ProductCandidate], query: ProductDiscoveryQuery) -> list[ProductCandidate]:
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return candidates[start:end]

    @staticmethod
    def count_public_catalog_matches(query: ProductDiscoveryQuery) -> int:
        return len(DiscoveryConnectorService.search_public_catalog(query, include_pagination=False))

    @staticmethod
    def search_public_catalog(
        query: ProductDiscoveryQuery,
        include_pagination: bool = True,
    ) -> list[ProductCandidate]:
        keyword = query.keyword.strip().lower()
        category = (query.category or "").strip().lower()

        matches: list[ProductCandidate] = []
        for candidate in DiscoveryConnectorService._catalog_rows():
            try:
                source = str(candidate.get("source", "")).strip()
                title = str(candidate.get("title", "")).strip()
                markets = candidate.get("markets", [])
                category_value = str(candidate.get("category", "")).strip()
                price = float(candidate.get("price", 0))
                rating = float(candidate.get("rating", 0))
                reviews = int(candidate.get("reviews", 0))
                brand = candidate.get("brand")
                dimensions = candidate.get("dimensions")
                weight_kg_raw = candidate.get("weight_kg")
                weight_kg = float(weight_kg_raw) if weight_kg_raw is not None else None
            except (TypeError, ValueError):
                # Ignore malformed rows from external connectors and keep the response stable.
                continue

            if not source or not title:
                continue

            if not isinstance(markets, list):
                continue

            title_match = keyword in title.lower()
            if keyword and not title_match:
                continue

            if category and category != category_value.lower():
                continue

            if not (query.min_price <= price <= query.max_price):
                continue

            if query.market not in markets:
                continue

            if not DiscoveryConnectorService._source_allowed(source, query.sources):
                continue

            matches.append(
                ProductCandidate(
                    source=source,
                    title=title,
                    price=price,
                    rating=rating,
                    reviews=reviews,
                    brand=str(brand) if brand is not None else None,
                    dimensions=str(dimensions) if dimensions is not None else None,
                    weight_kg=weight_kg,
                )
            )

        sorted_matches = DiscoveryConnectorService._sort_candidates(matches, query)
        if not include_pagination:
            return sorted_matches

        return DiscoveryConnectorService._paginate_candidates(sorted_matches, query)

    @staticmethod
    def import_user_records(items: list[DiscoveryImportItem]) -> list[ProductCandidate]:
        records: list[ProductCandidate] = []
        for item in items:
            records.append(
                ProductCandidate(
                    source=item.source,
                    title=item.title,
                    price=item.price,
                    rating=item.rating,
                    reviews=item.reviews,
                    brand=item.brand,
                    dimensions=item.dimensions,
                    weight_kg=item.weight_kg,
                )
            )
        return records
