from django import template
register = template.Library()


@register.filter
def convert_none(value):
    if value is None:
        return ''
    return value
