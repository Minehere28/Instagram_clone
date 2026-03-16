from rest_framework.response import Response


def api_success(data=None, message="OK", status_code=200):
    payload = {
        "success": True,
        "message": message,
        "data": data,
    }
    return Response(payload, status=status_code)


def api_error(message="Error", errors=None, status_code=400):
    payload = {
        "success": False,
        "message": message,
        "errors": errors,
    }
    return Response(payload, status=status_code)
