import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("CRITICAL: SUPABASE_URL or SUPABASE_ANON_KEY missing in environment!")

supabase: Client = create_client(url, key)

from datetime import datetime, date, timedelta

def set_auth(access_token):
    if access_token:
        try:
            # Note: For public anon keys, we set the session to simulate the user
            supabase.auth.set_session(access_token, "fake_refresh_token")
        except:
            pass # Ignore if token is invalid or already set

def add_expense(**kwargs):
    access_token = kwargs.get("access_token")
    set_auth(access_token)
    
    user_id = kwargs.get("user_id")
    amount = kwargs.get("amount")
    category = kwargs.get("category")
    description = kwargs.get("description", "")
    raw_query = kwargs.get("raw_query", "")

    if not user_id or amount is None or not category:
        return {"error": "Missing required fields (user_id, amount, category)"}

    data = {
        "user_id": user_id,
        "amount": amount,
        "category": category,
        "description": description,
        "raw_query": raw_query
    }
    try:
        response = supabase.table("expenses").insert(data).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}

def delete_expense(**kwargs):
    set_auth(kwargs.get("access_token"))
    user_id = kwargs.get("user_id")
    description = kwargs.get("description")
    category = kwargs.get("category")
    
    query = supabase.table("expenses").delete().eq("user_id", user_id)
    if description:
        query = query.ilike("description", f"%{description}%")
    if category:
        query = query.eq("category", category)
    
    response = query.execute()
    return {"message": f"Deleted {len(response.data)} records", "deleted": response.data}

def update_expense(**kwargs):
    set_auth(kwargs.get("access_token"))
    user_id = kwargs.get("user_id")
    description = kwargs.get("description")
    new_amount = kwargs.get("amount")
    
    if not description or not new_amount:
        return {"error": "Need description to match and new amount to update"}
        
    response = supabase.table("expenses").update({"amount": new_amount}).eq("user_id", user_id).ilike("description", f"%{description}%").execute()
    return {"message": f"Updated {len(response.data)} records", "updated": response.data}

def get_expenses(**kwargs):
    set_auth(kwargs.get("access_token"))
    user_id = kwargs.get("user_id")
    limit = kwargs.get("limit", 10)
    response = supabase.table("expenses").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
    return response.data

def get_summary(**kwargs):
    set_auth(kwargs.get("access_token"))
    user_id = kwargs.get("user_id")
    period = kwargs.get("period", "total")
    category = kwargs.get("category")
    
    query = supabase.table("expenses").select("amount", "created_at").eq("user_id", user_id)
    
    if category:
        query = query.eq("category", category)
        
    now = datetime.now()
    if period == "today":
        today_str = now.strftime("%Y-%m-%d")
        query = query.gte("created_at", today_str)
    elif period == "month":
        month_start = now.replace(day=1).strftime("%Y-%m-%d")
        query = query.gte("created_at", month_start)
    elif period == "year":
        year_start = now.replace(month=1, day=1).strftime("%Y-%m-%d")
        query = query.gte("created_at", year_start)
        
    response = query.execute()
    total = sum(item['amount'] for item in response.data)
    return {"total": total, "count": len(response.data), "period": period, "category": category}
