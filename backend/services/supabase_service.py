from supabase import create_client, Client
from core.config import settings
from core.logging import logger

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.warning("Supabase URL or Service Role Key is not configured. Supabase client will not work.")
    
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )

supabase_client = get_supabase_client()
