import os
from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

from .models import Server, Client
from .serializers import ClientSerializer, ServerSerializer

from .constants import SERVER_CONFIG

from .utils.Wireguard import Wireguard

wireguard = Wireguard()

SERVER_IP = os.environ['SERVER_IP']

NET_ID = SERVER_IP.split('.')[:3]
NET_ID = '.'.join(NET_ID)
HOST_ID, SUBNET = SERVER_IP.split('.')[-1].split('/')


class ClientViewsets(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        wireguard.delete(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     device = instance.device
    #     platform = instance.platform
    #     url = f"http://192.168.0.20:8000/media/client/{device}_{platform}.conf"
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # data = request.data.dict()
        data = request.data
        if Server.objects.count() == 0:
            server = self.import_server()
        else:
            server = Server.objects.first()
        num_of_client = Client.objects.count()
        if num_of_client >= 243:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            # ip = '10.0.0.{}/24'.format(Client.objects.count() + 10)
            ip = '{net}.{host}/{subnet}'.format(net=NET_ID,
                                                host=Client.objects.count() + 10, subnet=SUBNET)
            device = data.get('device')
            platform = data.get('platform')
            mode = data.get('mode')
            # TODO
            # might need to detect local lan and add as ip range
            if mode == 'lan':
                # ip_range = '10.0.0.0/24'
                ip_range = '{net}.0/{subnet}'.format(net=NET_ID, subnet=SUBNET)
            else:
                ip_range = '0.0.0.0/0'
            server_public_key = server.public_key
            server_wan_ip = server.wan_ip
            server_port = server.port
            client_private_key, client_public_key = wireguard.genkey_client()
            data['public_key'] = client_public_key
            data['private_key'] = client_private_key
            data['ip'] = ip
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            client = serializer.instance
            wireguard.create(client, server, ip_range)
            wireguard.update_server(client)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def import_server(self):
        config = dict()
        with open(SERVER_CONFIG) as fh:
            for i in range(5):
                key, val = fh.readline().split()
                config[key[1:].lower()] = val.strip()
        server = Server(**config)
        server.save()
        return server


class ServerViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
