import pytest


def test_property_summary_route(client):
    # Call the endpoint with any property_id; it uses mock inputs internally
    response = client.post('/property-summary/123', json={})
    assert response.status_code == 200
    data = response.get_json()

    # Expected values based on MOCK_PROPERTY_INPUTS
    # Updated to match values from the Excel model
    assert data['All-in Basis'] == 25407936
    assert data['Going-in Cap Rate (%)'] == 6.5
    assert data['Price/SF'] == pytest.approx(490.17, rel=1e-3)
    assert data['Year 1 NOI'] == 1593050
    assert data['Year 3 NOI'] == 1568002
    assert data['Terminal Cap Rate (%)'] == 7.0
    assert data['Terminal Value'] == pytest.approx(24365431.89, rel=1e-3)
