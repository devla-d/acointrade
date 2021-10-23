from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group



from .models import Account 

from . forms import UserChangeForm, UserCreationForm




class UserAdmin(BaseUserAdmin):
  form = UserChangeForm
  fieldsets = (
      (None, {'fields': ('email', 'password', )}),
      (_('Personal info'), {'fields': ('username','first_name', 'last_name','postalcode','address','country','date_of_birth','phone')}),
      (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser' )}),
      (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('user_info'), {'fields': ('is_email_verifield','profile_image', 'balance','withdraw_total','uri','wallet_id')}),
  )
  add_fieldsets = (
      (None, {
          'classes': ('wide', ),
          'fields': ('email', 'password1', 'password2'),
      }),
  )
  list_display = ['email', 'username', ]
  search_fields = ('email', 'username' )
  ordering = ('id', )
 
 

# Now register the new UserAdmin...
admin.site.register(Account, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)