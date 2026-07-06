def test_register_login_refresh_logout_flow(client):
    register_payload = {
        "company_name": "Acme UK Ltd",
        "full_name": "Owner User",
        "email": "owner@acme.co.uk",
        "password": "StrongPass123!",
    }
    register_res = client.post("/api/auth/register-company", json=register_payload)
    assert register_res.status_code == 200
    register_body = register_res.json()
    assert register_body["success"] is True

    tokens = register_body["data"]["tokens"]
    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]

    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["data"]["email"] == "owner@acme.co.uk"

    login_res = client.post(
        "/api/auth/login",
        json={"email": "owner@acme.co.uk", "password": "StrongPass123!"},
    )
    assert login_res.status_code == 200

    refresh_res = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200
    new_access = refresh_res.json()["data"]["tokens"]["access_token"]

    logout_res = client.post(
        "/api/auth/logout",
        json={"refresh_token": refresh_res.json()["data"]["tokens"]["refresh_token"]},
        headers={"Authorization": f"Bearer {new_access}"},
    )
    assert logout_res.status_code == 200
    assert logout_res.json()["success"] is True


def test_duplicate_email_registration_is_blocked(client):
    payload = {
        "company_name": "Acme UK Ltd",
        "full_name": "Owner User",
        "email": "owner2@acme.co.uk",
        "password": "StrongPass123!",
    }
    first = client.post("/api/auth/register-company", json=payload)
    assert first.status_code == 200

    second = client.post("/api/auth/register-company", json=payload)
    assert second.status_code == 409
