def _register(client, email: str) -> dict:
    response = client.post(
        "/api/auth/register-company",
        json={
            "company_name": "Acme UK Ltd",
            "full_name": "Owner User",
            "email": email,
            "password": "StrongPass123!",
        },
    )
    assert response.status_code == 200
    return response.json()


def test_owner_can_create_and_list_accounts(client):
    register = _register(client, "owner3@acme.co.uk")
    access_token = register["data"]["tokens"]["access_token"]

    create_res = client.post(
        "/api/accounts",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "code": "4010",
            "name": "Sales Revenue",
            "category": "income",
            "subtype": "sales",
            "vat_rate": "20%",
        },
    )
    assert create_res.status_code == 200
    assert create_res.json()["data"]["code"] == "4010"

    list_res = client.get("/api/accounts", headers={"Authorization": f"Bearer {access_token}"})
    assert list_res.status_code == 200
    accounts = list_res.json()["data"]["accounts"]
    assert len(accounts) >= 9
    created = next(account for account in accounts if account["code"] == "4010" and account["name"] == "Sales Revenue")
    assert created["name"] == "Sales Revenue"


def test_owner_can_update_and_deactivate_custom_account(client):
    register = _register(client, "owner4@acme.co.uk")
    access_token = register["data"]["tokens"]["access_token"]

    create_res = client.post(
        "/api/accounts",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "code": "6100",
            "name": "Subscriptions",
            "category": "expenses",
            "subtype": "software",
            "vat_rate": "20%",
        },
    )
    assert create_res.status_code == 200
    account_id = create_res.json()["data"]["id"]

    update_res = client.put(
        f"/api/accounts/{account_id}",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "name": "Software Subscriptions",
            "category": "expenses",
            "subtype": "software",
            "vat_rate": "20%",
            "is_active": True,
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["data"]["name"] == "Software Subscriptions"

    deactivate_res = client.post(
        f"/api/accounts/{account_id}/deactivate",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert deactivate_res.status_code == 200
    assert deactivate_res.json()["data"]["is_active"] is False


def test_accounts_are_company_scoped(client):
    company_one = _register(client, "owner5@acme.co.uk")
    token_one = company_one["data"]["tokens"]["access_token"]
    company_two = _register(client, "owner6@acme.co.uk")
    token_two = company_two["data"]["tokens"]["access_token"]

    create_res = client.post(
        "/api/accounts",
        headers={"Authorization": f"Bearer {token_one}"},
        json={
            "code": "6200",
            "name": "Telephone",
            "category": "expenses",
            "subtype": "utilities",
            "vat_rate": "20%",
        },
    )
    assert create_res.status_code == 200
    account_id = create_res.json()["data"]["id"]

    list_two = client.get("/api/accounts", headers={"Authorization": f"Bearer {token_two}"})
    assert list_two.status_code == 200
    assert all(account["id"] != account_id for account in list_two.json()["data"]["accounts"])

    cross_update = client.put(
        f"/api/accounts/{account_id}",
        headers={"Authorization": f"Bearer {token_two}"},
        json={
            "name": "Should Not Work",
            "category": "expenses",
            "subtype": "utilities",
            "vat_rate": "20%",
            "is_active": True,
        },
    )
    assert cross_update.status_code == 404


def test_account_requires_authentication(client):
    list_res = client.get("/api/accounts")
    assert list_res.status_code == 401
