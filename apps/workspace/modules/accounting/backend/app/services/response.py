def ok(data: object, message: str = "") -> dict[str, object]:
    return {
        "success": True,
        "data": data,
        "message": message,
    }
