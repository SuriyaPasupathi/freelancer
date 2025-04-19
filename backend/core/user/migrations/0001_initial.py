# Generated by Django 5.2 on 2025-04-19 05:05

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('google_id', models.CharField(blank=True, max_length=255, null=True)),
                ('is_google_user', models.BooleanField(default=False)),
                ('reset_token', models.CharField(blank=True, max_length=255, null=True)),
                ('token_created_at', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subscription_type', models.CharField(choices=[('free', 'Free'), ('standard', 'Standard'), ('premium', 'Premium')], default='free', max_length=10)),
                ('name', models.CharField(max_length=100)),
                ('profile_pic', models.ImageField(blank=True, null=True, upload_to='profiles/')),
                ('job_title', models.CharField(max_length=100)),
                ('job_specialization', models.CharField(max_length=100)),
                ('rating', models.FloatField(default=0)),
                ('profile_url', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('mobile', models.CharField(blank=True, max_length=15)),
                ('services', models.TextField(blank=True)),
                ('experiences', models.TextField(blank=True)),
                ('skills', models.TextField(blank=True)),
                ('tools', models.TextField(blank=True)),
                ('education', models.TextField(blank=True)),
                ('certifications', models.TextField(blank=True)),
                ('video_intro', models.FileField(blank=True, null=True, upload_to='videos/')),
                ('portfolio', models.TextField(blank=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reviewer_name', models.CharField(max_length=100)),
                ('rating', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('comment', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_reviews', to='user.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='SocialLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(choices=[('linkedin', 'LinkedIn'), ('facebook', 'Facebook'), ('twitter', 'Twitter'), ('instagram', 'Instagram'), ('github', 'GitHub'), ('other', 'Other')], max_length=20)),
                ('url', models.URLField()),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_links', to='user.userprofile')),
            ],
            options={
                'unique_together': {('user_profile', 'platform')},
            },
        ),
    ]
