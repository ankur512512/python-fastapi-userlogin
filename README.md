# python-fastapi-userlogin
A simple userlogin flow using python fastapi


## Development

First build the image using:

docker build -t ankur512512/python-fastapi-userlogin .

Then run it locally using below command:

docker run --name pythonauth -d --network=host ankur512512/python-fastapi-userlogin
