from rest_framework import serializers
from .models import Schedule

class ScheduleListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) # 유저 정보를 read_only로 설정

    class Meta:
        model = Schedule
        fields = ['id', 'user', 'title', 'select_date', 'time', 'pinned']
        

class ScheduleDetailSerializer(serializers.ModelSerializer): # 어떻게 보여지는지에 따른 목적.
    user = serializers.StringRelatedField(read_only=True) # 유저 정보를 read_only로 설정

    class Meta:
        model = Schedule
        fields = ['id', 'title', 'select_date', 'time', 'content', 'pinned', 'user']
        read_only_fields = ['id', 'select_date']  # select_date 이전페이지에서 처리했기에, 사용자 보이는게 필요 없음

