from datetime import datetime
import pytz
from typing import Optional, List, Any

def standard_response(
    status: str, status_code: int, message_code: str, data: any = None
):
    """
    Helper function to standardize response structure.

    Args:
        status (str): Status message, e.g., "success" or "error".
        status_code (int): HTTP status code.
        message_code (str): Message code for easier identification.
        data (any): The response payload.

    Returns:
        dict: Standardized response structure with timestamp.
    """
    # Get current time in Jakarta timezone
    jakarta_timezone = pytz.timezone("Asia/Jakarta")
    current_time = datetime.now(jakarta_timezone).strftime("%Y-%m-%d %H:%M:%S")

    count = len(data) if isinstance(data, list) else (1 if data else 0)
    return {
        "status": status,
        "status_code": status_code,
        "message_code": message_code,
        "data_count": count,
        "data": data,
        "timestamp": current_time,
    }

def standard_pagination_response(
    status: str,
    status_code: int,
    message_code: str,
    data: list,
    count: int,
    per_page: int,
    next_page: Optional[str] = None,
    previous_page: Optional[str] = None,
    total_pages: Optional[int] = None,
):
    """
    Helper function to standardize paginated response structure.

    Args:
        status (str): Status message, e.g., "success" or "error".
        status_code (int): HTTP status code.
        message_code (str): Message code for easier identification.
        data (list): The response payload containing paginated items.
        count (int): Total number of items.
        per_page (int): Number of items per page.
        next_page (Optional[str]): URL of the next page, if applicable.
        previous_page (Optional[str]): URL of the previous page, if applicable.
        total_pages (Optional[int]): Total number of pages.

    Returns:
        dict: Standardized paginated response structure with timestamp.
    """
    from datetime import datetime
    import pytz

    # Get current time in Jakarta timezone
    jakarta_timezone = pytz.timezone("Asia/Jakarta")
    current_time = datetime.now(jakarta_timezone).strftime("%Y-%m-%d %H:%M:%S")

    return {
        "status": status,
        "status_code": status_code,
        "message_code": message_code,
        "pagination": {
            "total_items": count,
            "total_pages": total_pages,
            "max_items_per_page": per_page,
            # "max_items_displayed": per_page,
            "next_page": next_page,
            "previous_page": previous_page,
        },
        "data": data,
        "timestamp": current_time,
    }
