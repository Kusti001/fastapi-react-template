from app.core.fastapi_users import fastapi_users


get_current_user = fastapi_users.current_user(active=True)
