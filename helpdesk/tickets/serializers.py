from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Ticket
        fields = '__all__'