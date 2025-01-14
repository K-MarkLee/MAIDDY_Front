from django.urls import path
from . import views


app_name = "schedules"

urlpatterns = [
    path('', views.schedule_list, name='schedule-list'), # 일정표 표시 (GET)  (api/schedule/?date=2025-01-09) 됨
    path('pinned/', views.schedule_pinned, name='schedule-pinned'),  # 중요도 표시 (PATCH) (api/schedule/pinned/?date=2025-01-09&schedule_id=13) 됨
    path('create/', views.schedule_create, name='schedule-create'),  # 일정표 생성 (POST)  됨
    path('update/', views.schedule_update, name='schedule-update'),  # 일정표 수정 (PUT) 됨
    path('detail/<int:schedule_id>/', views.schedule_detail, name='schedule-detail'), # 일정표 디테일(GET) 됨
    path('delete/<int:schedule_id>/', views.schedule_delete, name='schedule-delete'), # 일정표 삭제(DELETE) 됨

]
    


