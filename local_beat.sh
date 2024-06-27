if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi
. .env/bin/activate
celery -A app.celery beat --max-interval 1 -l info
deactivate