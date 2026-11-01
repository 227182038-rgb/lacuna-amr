"""Offline guard: sockets must be blocked while the guard is active."""
import pytest

from lacuna.errors import OfflineViolation
from lacuna.offline import OfflineGuard


def test_guard_blocks_socket():
    with pytest.raises(OfflineViolation):
        with OfflineGuard():
            import socket
            socket.socket()


def test_guard_restores_socket():
    import socket
    before = socket.socket
    with OfflineGuard():
        pass
    assert socket.socket is before


def test_guard_inactive_is_transparent():
    import socket
    with OfflineGuard(active=False):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.close()


def test_guard_allows_module_imports():
    """ssl/asyncio subclass socket.socket at import time; the guard must not
    break imports, only actual socket creation."""
    with OfflineGuard():
        import asyncio  # noqa: F401
        import ssl  # noqa: F401
        import socket
        with pytest.raises(OfflineViolation):
            socket.socket()
        with pytest.raises(OfflineViolation):
            socket.create_connection(("example.invalid", 80))


def test_cli_runs_fully_offline():
    """license-check completes with the socket guard armed (default CLI mode)."""
    from lacuna.cli import main
    rc = main(["license-check"])
    assert rc == 0
