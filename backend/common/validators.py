import os

from django.core.exceptions import ValidationError

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024


def validate_image_file(image):
    extension = os.path.splitext(image.name)[1].lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError("Unsupported image type. Allowed: jpg, jpeg, png, webp.")

    if image.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError("Image file too large. Max size is 5MB.")
