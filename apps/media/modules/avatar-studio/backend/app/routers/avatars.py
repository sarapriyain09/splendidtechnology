from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_avatars() -> dict[str, list[dict[str, str]]]:
    return {
        "avatars": [
            {
                "id": "ava_1",
                "name": "Emma",
                "language": "English",
                "style": "Professional",
                "cloneStatus": "READY",
            }
        ]
    }
