from app.models import Rules, Total


def create_rules(count=1000):
    i = 0
    while i < count:
        r = Rules.objects.create()
        r.save()
        i += 1
    total = Total.objects.first()
    total.rules = Rules.objects.count()
    total.save()
