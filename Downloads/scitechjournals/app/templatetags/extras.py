# app/templatetags/extras.py
from django import template

register = template.Library()

@register.filter
def dict_get(d, key):
    return d.get(key)

@register.filter
def replace(value, arg):
    """Usage: {{ value|replace:'old::new' }} """
    try:
        old, new = arg.split("::")
        return value.replace(old, new)
    except ValueError:
        return value  # in case of malformed input

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key, 'Unknown')

@register.filter
def get_group(dictionary, key):
    return dictionary.get(key)