from app.models import Rules


def create_rules(count=1000):
    i = 0
    while i < count:
        r = Rules.objects.create()
        r.save()
        i += 1
