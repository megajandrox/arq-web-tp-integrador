from api.helpers.security import hash_password, verify_password

def test_hash_password():
    password = "my_secure_password"
    hashed = hash_password(password)
    assert hashed != password

def test_verify_password():
    password = "my_secure_password"
    hashed = hash_password(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed) 