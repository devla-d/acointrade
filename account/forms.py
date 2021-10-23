from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.contrib.auth  import authenticate
from .models import Account

COUNTRY  = (
		('Choose  Currency', "Choose  Currency"),
		('USD', "USD"),
        ('GBP', "GBP"),
        ('EUR', "EUR"),
        ('YEN', "YEN"),
        ('INR', "INR"),
        ('RUP', "RUP"),
        ('TRY', "TRY"),
        ('WON', "WON"),
        ('RUB', "RUB"),
        ('ILS', "ILS"),
	)



class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    fullname = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'placeholder':"Fullname"
            }
        ),
        label = '',
        required=True
    )
    email = forms.EmailField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'email',
                'class': 'form-control',
                'placeholder':"Email"
            }
        ),
        label = '',
        required=True
    )
    phone = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'tel',
                'class': 'form-control',
                'placeholder':"Phone Number"
            }
        ),
        label = '',
        required=True
    )
    username = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'placeholder':"Username"
            }
        ),
        label = '',
        required=True
    )
    country = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'placeholder':"Country"
            }
        ),
        label = '',
        required=True
    )
    address = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                "placeholder":'ADDRESS'
            }
        ),
        label = '',
        required=True
    )
    currency = forms.CharField(
            widget=forms.Select(
                choices = COUNTRY,
                attrs={
                    'class': '  form-control mb-4',
                     #'class': 'form-control',
                }
            ),
            label = "",
            required=True
        )
    password1 = forms.CharField( max_length=30, min_length=6,label='', widget=forms.PasswordInput(attrs={'placeholder': "PASSWORD", 'class': 'form-control',}))
    password2 = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder': "CONFIRM PASSWORD", 'class': 'form-control',}))

    class Meta:
        model = Account
        fields = ('fullname','username','email','phone','country','address','currency','password1','password2')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = Account
        fields = ('email', 'password', 'date_of_birth', 'is_active', 'is_staff')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]




class LoginForm(forms.ModelForm):
    email = forms.EmailField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'email',
                'class': 'form-control',
                'placeholder':"Email"
            }
        ),
        label = '',
        required=True
    )
    password = forms.CharField( max_length=30, min_length=6,label='', widget=forms.PasswordInput(attrs={'placeholder': "PASSWORD", 'class': 'form-control',}))

    class Meta:
        model = Account
        fields = ['email','password']

    def clean(self):
        if self.is_valid():
            email = self.cleaned_data['email']
            password =  self.cleaned_data['password']
            if not authenticate(email=email,password=password):
                raise forms.ValidationError('Invalid Credentials Note : Make Sure Your Email Address Is Verified')




class UserUpdateForm(forms.ModelForm):
 
    fullname = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                "placeholder":'Fullname'
            }
        ),
        label = 'Fullname',
        required=True
    )
 
    postalcode = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                "placeholder":'ZIPCODE'
            }
        ),
        label = 'ZIPCODE',
        required=True
    )
    address = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                "placeholder":'ADDRESS'
            }
        ),
        label = 'ADDRESS',
        required=True
    )
    country = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'text',
                'class': 'form-control',
                'placeholder':"Country"
            }
        ),
        label = 'Country',
        required=True
    )

    date_of_birth = forms.DateTimeField(
            widget=forms.TextInput(
                attrs={
                    'type': 'date',
                     'class': 'form-control',
                }
            ),
             label = 'Date Of Birth',
            required=True)

    phone = forms.CharField(
        max_length=30,
        widget=forms.TextInput(
            attrs={
                'type': 'tel',
                'class': 'form-control',
                'placeholder':'9090775808'
            }
        ),
        label = "Phone Number",
         required=True
    )
    currency = forms.CharField(
            widget=forms.Select(
                choices = COUNTRY,
                attrs={
                    'class': '  form-control mb-4',
                     #'class': 'form-control',
                }
            ),
            label = "Currency",
            required=True
        ) 
    class Meta:
        model = Account
        fields = ['fullname','address','phone','date_of_birth','country','postalcode','currency']






            