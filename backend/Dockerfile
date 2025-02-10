FROM python:3.13.1-slim-bullseye

WORKDIR /root/app
COPY . .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8080
CMD ["uvicorn", "auth:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
