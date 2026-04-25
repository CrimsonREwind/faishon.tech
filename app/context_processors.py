# context_processors.py
# Makes the user's total fAishon coin balance available in every template
from django.db.models import Sum

def coin_balance(request):
    if request.user.is_authenticated:
        # Only count coins from donations that have been received or completed by admin
        earned = request.user.donations.filter(
            status__in=['received', 'completed']
        ).aggregate(total=Sum('coins_earned'))['total'] or 0

        # Subtract coins spent on marketplace orders (only non-cancelled orders)
        spent = request.user.orders.exclude(status='cancelled').aggregate(total=Sum('total_coins'))['total'] or 0

        # Pending coins (donations not yet received)
        pending = request.user.donations.exclude(
            status__in=['received', 'completed']
        ).aggregate(total=Sum('coins_earned'))['total'] or 0

        count = request.user.donations.count()
        return {
            'coin_balance': earned - spent,
            'coins_earned': earned,
            'coins_spent': spent,
            'coins_pending': pending,
            'total_donations': count,
        }
    return {'coin_balance': 0, 'coins_earned': 0, 'coins_spent': 0, 'coins_pending': 0, 'total_donations': 0}
