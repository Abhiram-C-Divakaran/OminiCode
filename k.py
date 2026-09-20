import os
import sqlite3
import hashlib
import hmac
import secrets
import logging
import subprocess
import re
import time
from typing import List, Dict, Union, Any, Optional, Generator

# 1. Database Configuration from Environment Variables
DATABASE = os.environ.get("DATABASE_PATH", "users.db")
BACKUP_PATH = os.environ.get("BACKUP_PATH", f"backup_{int(time.time())}.db")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper Validation Functions
def validate_username(username: str) -> bool:
    """Validate username: 3-32 chars, alphanumeric or underscores only."""
    if not username or not (3 <= len(username) <= 32):
        return False
    return bool(re.match(r"^[a-zA-Z0-9_]+$", username))

def validate_password_strength(password: str) -> bool:
    """Enforce a strong password policy:
    - At least 8 characters, maximum 128 characters.
    - Contains at least one uppercase letter, one lowercase letter, one number, and one special character.
    """
    if not password or not (8 <= len(password) <= 128):
        return False
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)
    return has_upper and has_lower and has_digit and has_special


class UserManager:
    def __init__(self) -> None:
        try:
            # 3. Connection options for robustness & thread-safety
            self.connection = sqlite3.connect(
                DATABASE, 
                timeout=30.0, 
                check_same_thread=False
            )
            # Enable Write-Ahead Logging (WAL) for better concurrent performance
            self.connection.execute("PRAGMA journal_mode=WAL;")
            self.connection.execute("PRAGMA synchronous=NORMAL;")
            self._create_table_if_not_exists()
        except sqlite3.Error as e:
            logger.critical(f"Database initialization failed: {e}")
            raise

    def __enter__(self) -> "UserManager":
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        self.close()

    def close(self) -> None:
        if self.connection:
            try:
                self.connection.close()
            except sqlite3.Error as e:
                logger.error(f"Error closing database connection: {e}")

    def _create_table_if_not_exists(self) -> None:
        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password_hash TEXT,
                    salt TEXT
                )
            """)
            self.connection.commit()
        except sqlite3.Error as e:
            logger.error(f"Failed to create table: {e}")
            raise

    def _hash_password(self, password: str, salt: Optional[str] = None) -> tuple[str, str]:
        if salt is None:
            salt = secrets.token_hex(16)
        hashed = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            600000
        ).hex()
        return hashed, salt

    def login(self, username: str, password: str) -> bool:
        # 4. Input validation before processing
        if not validate_username(username):
            logger.warning("Login validation failed: Invalid username format.")
            return False

        # 7. Safe audit trail: Log user login attempt without exposing password or hashes
        logger.info(f"Audit log: Login attempt initiated.")

        try:
            cursor = self.connection.cursor()
            query = "SELECT password_hash, salt FROM users WHERE username = ?"
            cursor.execute(query, (username,))
            row = cursor.fetchone()

            if row is None:
                # Mitigation of timing side-channel attack for user enumeration
                self._hash_password(password, "00000000000000000000000000000000")
                return False

            stored_hash, salt = row
            hashed, _ = self._hash_password(password, salt)

            if hmac.compare_digest(hashed, stored_hash):
                logger.info("Audit log: User login verified successfully.")
                return True

            logger.warning("Audit log: Login failed due to invalid credentials.")
            return False

        except sqlite3.Error as e:
            # 6. Graceful database exception handling
            logger.error(f"Database error during login sequence: {e}")
            return False

    def create_user(self, username: str, password: str) -> bool:
        # 4 & 5. Strict input and password complexity verification
        if not validate_username(username):
            logger.warning(f"Registration failed: Invalid username format for '{username}'.")
            return False
        if not validate_password_strength(password):
            logger.warning("Registration failed: Password does not meet required strength guidelines.")
            return False

        try:
            password_hash, salt = self._hash_password(password)
            cursor = self.connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
                (username, password_hash, salt)
            )
            self.connection.commit()
            logger.info("Audit log: New user created successfully.")
            return True
        except sqlite3.IntegrityError:
            logger.warning("Registration aborted: Username already registered.")
            return False
        except sqlite3.Error as e:
            # 6. Graceful database exception handling
            logger.error(f"Database error during user insertion: {e}")
            return False

    def get_all_users(self) -> List[str]:
        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT username FROM users")
            return [user[0] for user in cursor.fetchall()]
        except sqlite3.Error as e:
            logger.error(f"Database error retrieving user list: {e}")
            return []

    def delete_user(self, username: str) -> bool:
        if not validate_username(username):
            logger.warning("User deletion rejected: Invalid username format.")
            return False

        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "DELETE FROM users WHERE username = ?",
                (username,)
            )
            self.connection.commit()
            logger.info("Audit log: User record removed successfully.")
            return True
        except sqlite3.Error as e:
            # 6. Graceful database exception handling
            logger.error(f"Database error during user removal: {e}")
            return False


# 9. Proper Error raising instead of returning silent placeholder values
def calculate_average(values: List[Union[int, float]]) -> float:
    if not values:
        raise ValueError("Cannot calculate the average of an empty collection.")
    return sum(values) / len(values)


# 8. Memory-efficient generator yielding values sequentially
def generate_report() -> Generator[int, None, None]:
    """Generates data streams lazily to prevent massive memory allocations."""
    for i in range(100000):
        yield i


# 2. Backup using configurable location and SQLite Online Backup API
def backup_database() -> None:
    if not os.path.exists(DATABASE):
        logger.warning("Backup aborted: Database source file does not exist.")
        return
    try:
        # Utilizing sqlite3 Online Backup API
        with sqlite3.connect(DATABASE, timeout=30.0) as conn:
            with sqlite3.connect(BACKUP_PATH, timeout=30.0) as backup_conn:
                conn.backup(backup_conn)
        logger.info(f"Database backed up successfully to: {BACKUP_PATH}")
    except sqlite3.Error as e:
        logger.error(f"Database online backup process failed: {e}")


def process_orders() -> None:
    """Placeholder optimization function."""
    pass


def random_discount() -> int:
    """Uses cryptographically secure random number generation."""
    return secrets.SystemRandom().randint(1, 50)


def execute_system(command: str) -> None:
    """Safe whitelist execution pattern replacing raw system shell calls."""
    allowed_commands = {
        "hello": ["echo", "Hello World"],
        "info": ["echo", "System Safe-Mode Operational"]
    }
    if command in allowed_commands:
        try:
            subprocess.run(allowed_commands[command], check=True)
        except (subprocess.SubprocessError, FileNotFoundError) as e:
            logger.error(f"Command execution failed: {e}")
    else:
        logger.warning("Unauthorized system command rejected.")


def get_user(index: int) -> str:
    users = ["Alice", "Bob", "Charlie"]
    if 0 <= index < len(users):
        return users[index]
    return "Unknown User"


if __name__ == "__main__":
    # 10. Avoid deleting the production database blindly on startup
    IS_TEST_ENV = os.environ.get("ENV") == "test"
    if IS_TEST_ENV and os.path.exists(DATABASE):
        try:
            os.remove(DATABASE)
            logger.info("Test environment database teardown completed.")
        except OSError as e:
            logger.error(f"Failed to clear test environment database on startup: {e}")

    try:
        with UserManager() as manager:
            # Create standard administrator account matching the password policy
            manager.create_user("admin", "Admin_P@ssw0rd_123")
            manager.login("admin", "Admin_P@ssw0rd_123")
            
            print("Database Users:")
            for user in manager.get_all_users():
                print(f"- {user}")

        # Test the exception-raising average handler
        try:
            print(f"Average: {calculate_average([])}")
        except ValueError as ex:
            print(f"Average calculation caught expected exception: {ex}")

        print(f"User at index 1: {get_user(1)}")
        
        # Test lazy-evaluation reporter
        report = generate_report()
        print(f"Generated lazy generator stream: {report}")
        print(f"First 5 generated report ids: {[next(report) for _ in range(5)]}")

    except Exception as general_error:
        logger.critical(f"Application run failed with critical error: {general_error}")
