# Generated by Django 4.1.7 on 2023-08-24 19:21

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('spotilists', '0029_collection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
