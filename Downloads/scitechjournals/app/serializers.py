# serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'password',
            'user_type', 'username', 'is_login', 'image', 'status'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)
