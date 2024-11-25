from datetime import datetime
import pytz

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