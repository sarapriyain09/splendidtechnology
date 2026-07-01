from app.schemas import DiscoveryImportItem, ProductCandidate, ProductDiscoveryQuery


class DiscoveryConnectorService:
    """Compliant connector service using public metadata and user-provided records."""

    _PUBLIC_CATALOG: list[dict] = [
        {
            "source": "amazon_public_api",
            "title": "Monitor Stand Premium Model",
            "price": 39.99,
            "rating": 4.1,
            "reviews": 1180,
            "brand": "Generic",
            "dimensions": "42x18x8 cm",
            "weight_kg": 1.25,
            "category": "desk_organization",
            "markets": ["amazon_uk", "amazon_eu", "amazon_us"],
        },
        {
            "source": "etsy_public_api",
            "title": "Handmade Desk Organizer",
            "price": 44.50,
            "rating": 4.6,
            "reviews": 230,
            "brand": "Independent Maker",
            "dimensions": "40x16x8 cm",
            "weight_kg": 1.10,
            "category": "desk_organization",
            "markets": ["amazon_uk", "b2b"],
        },
        {
            "source": "alibaba_public_api",
            "title": "Bamboo Laptop Stand Adjustable",
            "price": 26.00,
            "rating": 4.3,
            "reviews": 540,
            "brand": "Factory Direct",
            "dimensions": "28x24x5 cm",
            "weight_kg": 0.95,
            "category": "laptop_accessories",
            "markets": ["amazon_uk", "amazon_eu", "amazon_us", "b2b"],
        },
    ]

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
        for candidate in DiscoveryConnectorService._PUBLIC_CATALOG:
            title_match = keyword in candidate["title"].lower()
            if keyword and not title_match:
                continue

            if category and category != candidate["category"].lower():
                continue

            if not (query.min_price <= candidate["price"] <= query.max_price):
                continue

            if query.market not in candidate["markets"]:
                continue

            if not DiscoveryConnectorService._source_allowed(candidate["source"], query.sources):
                continue

            matches.append(
                ProductCandidate(
                    source=candidate["source"],
                    title=candidate["title"],
                    price=candidate["price"],
                    rating=candidate["rating"],
                    reviews=candidate["reviews"],
                    brand=candidate["brand"],
                    dimensions=candidate["dimensions"],
                    weight_kg=candidate["weight_kg"],
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
