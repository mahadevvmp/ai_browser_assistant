from app.safety import DANGEROUS_NAME

def test_external_side_effect_names_are_flagged():
    for label in ["Submit", "Buy now", "Confirm booking", "Send message", "Delete account"]:
        assert DANGEROUS_NAME.search(label)

def test_normal_navigation_names_are_not_flagged():
    for label in ["About us", "Read more", "Products", "Next page"]:
        assert not DANGEROUS_NAME.search(label)
