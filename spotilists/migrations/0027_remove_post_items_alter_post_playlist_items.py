# Generated by Django 4.1.7 on 2023-06-16 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0026_alter_post_items'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='items',
        ),
        migrations.AlterField(
            model_name='post',
            name='playlist_items',
            field=models.CharField(max_length=2000),
        ),
    ]
