try:
    from drf_spectacular.utils import OpenApiResponse, OpenApiTypes, extend_schema
except ModuleNotFoundError:
    def extend_schema(*args, **kwargs):
        def decorator(func):
            return func

        return decorator

    class OpenApiResponse:  # pragma: no cover - fallback only
        def __init__(self, response=None, description=""):
            self.response = response
            self.description = description

    class OpenApiTypes:  # pragma: no cover - fallback only
        OBJECT = dict
