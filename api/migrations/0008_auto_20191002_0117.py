# Generated by Django 2.2.5 on 2019-10-02 01:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20190927_0112'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='movement',
            new_name='entering',
        ),
    ]
