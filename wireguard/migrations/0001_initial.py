# Generated by Django 2.2.1 on 2019-08-02 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.CharField(max_length=50)),
                ('private_key', models.CharField(max_length=50)),
                ('public_key', models.CharField(max_length=50)),
                ('mode', models.CharField(max_length=50)),
                ('platform', models.CharField(max_length=50)),
                ('device', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Server',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wan_ip', models.CharField(max_length=50)),
                ('ip', models.CharField(max_length=50)),
                ('port', models.IntegerField()),
                ('private_key', models.CharField(max_length=50)),
                ('public_key', models.CharField(max_length=50)),
            ],
        ),
    ]
