FROM node:10 as build-stage

WORKDIR /app
COPY ./frontend/package.json ./

RUN npm install --no-packge-lock

COPY ./frontend/ .

RUN npm run build

FROM python:3
ENV PYTHONUNBUFFERED=1
RUN mkdir /app
WORKDIR /app
COPY --from=build-stage /app/build /app/build
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY . /app

ENTRYPOINT [ "/app/entrypoint.sh" ]

ENTRYPOINT [ "/app/entrypoint.sh" ]
