from api.lib.security import hash_password, verify_password

def test_hash_password():
    password = "my_secure_password"
    hashed = hash_password(password)
    assert hashed != password  # El hash debe ser diferente a la contraseña original

def test_verify_password():
    password = "my_secure_password"
    hashed = hash_password(password)
    assert verify_password(password, hashed)  # La contraseña debe coincidir con el hash
    assert not verify_password("wrong_password", hashed)  # Una contraseña incorrecta no debe coincidir