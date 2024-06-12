#! /bin/sh
echo "==============================="
echo "Welcome to flask Devlopment. This"
echo "is local setup bash script which"
echo "will checks or create .env and then"
echo "install all the required libraries"
echo "from requirements.txt file."
echo "You can rerun this without any issue."
echo "^()^ Happy learning ^()^"

if [ -d ".env" ];
then
    echo ".env folder exits. Installing using pip"
else
    echo "creating .env and install using pip"
    python3 -m venv .env
fi

. .env/bin/activate

pip install -r requirements.txt
echo "work done deactivating .env"
deactivate