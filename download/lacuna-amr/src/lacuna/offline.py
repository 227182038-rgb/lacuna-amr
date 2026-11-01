"""Offline enforcement.

lacuna performs no network I/O at run time — not for lookups, not for
telemetry, not for updates. The CLI installs this guard by default; creating a
socket (or resolving a name) then raises :class:`OfflineViolation` immediately.

Implementation note: ``socket.socket`` is replaced by a *class* so that
``import ssl`` / ``import asyncio`` (which subclass it at import time) still
work inside the guard — only actual socket creation is blocked.
``--allow-network`` removes the guard for users who want to run their own
network-dependent code in the same process (not recommended).
"""
from __future__ import annotations

import socket

from .errors import OfflineViolation

_MSG = ("lacuna runs fully offline: a network socket was created. If you "
        "really want this, re-run with --allow-network (not recommended: no "
        "lacuna command needs the network).")


class _BlockedSocket:
    """Stand-in for socket.socket: any instantiation raises OfflineViolation."""

    def __init__(self, *args, **kwargs):
        raise OfflineViolation(_MSG)


def _blocked(*args, **kwargs):
    raise OfflineViolation(_MSG)


class OfflineGuard:
    """Context manager that blocks socket creation (fail loudly, not silently)."""

    def __init__(self, active: bool = True):
        self.active = active
        self._patched: list[tuple[object, str, object]] = []

    def __enter__(self):
        if self.active:
            for obj, name in ((socket, "socket"), (socket, "create_connection"),
                              (socket, "getaddrinfo")):
                if hasattr(obj, name):
                    self._patched.append((obj, name, getattr(obj, name)))
                    setattr(obj, name,
                            _BlockedSocket if name == "socket" else _blocked)
        return self

    def __exit__(self, *exc):
        for obj, name, orig in reversed(self._patched):
            setattr(obj, name, orig)
        self._patched = []
        return False


def assert_offline() -> None:
    """Probe: raise OfflineViolation if a socket can still be created."""
    with OfflineGuard():
        socket.socket()
