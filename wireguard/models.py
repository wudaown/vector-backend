from django.db import models


class Client(models.Model):

    class Meta:
        unique_together = ['device', 'platform']

    ip = models.CharField(max_length=50)
    private_key = models.CharField(max_length=50)
    public_key = models.CharField(max_length=50)
    mode = models.CharField(max_length=50)
    platform = models.CharField(max_length=50)
    device = models.CharField(max_length=50)
    ip_range = models.CharField(max_length=50)


class Server(models.Model):
    wan_ip = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    port = models.IntegerField()
    private_key = models.CharField(max_length=50)
    public_key = models.CharField(max_length=50)
