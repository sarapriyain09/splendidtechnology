from sqlalchemy.orm import Session

from app.models import AuditEvent


def log_audit_event(
    db: Session,
    *,
    company_id: str,
    actor_id: str,
    action: str,
    entity_type: str,
    entity_id: str,
    payload: dict | None = None,
    note: str = "",
) -> AuditEvent:
    event = AuditEvent(
        company_id=company_id,
        created_by=actor_id,
        updated_by=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        payload=payload or {},
        note=note,
    )
    db.add(event)
    return event
