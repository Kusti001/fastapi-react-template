import uuid
from fastapi_users import FastAPIUsers

from .auth_backend import auth_backend
from app.models.user import User
from app.services.user_manager import get_user_manager

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)
