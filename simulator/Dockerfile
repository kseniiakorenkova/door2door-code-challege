FROM python:3.8
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
ENV FLASK_APP=app
CMD ["flask", "run", "--host", "0.0.0.0","--port", "5000"]
EXPOSE 5000
