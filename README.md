NightOwl
=======================

Introduction
------------
An administration panel and server-side facade for Hootsuite's Dark Launch codes. You can use this admin panel to create and edit Dark Launch codes in various contexts and data centres. In addition, there is a history tab in which you can see all the changes made to the codes.

Required Software
-----------------
- Consul
- PHP
- MongoDB
- MongoDB PHP Driver

Configuration
-------------
**config/autoload/local.php**
```PHP
return array(
    'mongo'    => array(
        'url'  => 'mongodb://<user>:<pass>@<host>:<port>/<collection-name>',
        'name' => '<collection-name>',
    ),
    'consul'   => array(
        'host'    => 'localhost',
        'port'    => '8500'
    ),
);
```

**public/app/config.js**
```JS
    "API_URL" : <url to public folder> (e.g. "http://nightowl.local"),
```

Consul Agent Setup
----------------
### OS X

Ensure you have cask plugin installed for homebrew:

    $ brew install caskroom/cask/brew-cask

You can then easily install Consul with:

    $ brew cask install consul
    
### Windows & Linux/Unix

To install Consul, find the appropriate package for your system and download it from here: https://www.consul.io/downloads.html

Unzip the package and copy the Consul binary to somewhere on the PATH so that it can be executed.
- On Unix systems, ~/bin and /usr/local/bin are common installation directories, depending on if you want to restrict the install to a single user or expose it to the entire system.
- On Windows systems, you can put it wherever you would like, as long as that location is on the %PATH%.
    
### Run the Consul agent
    
To run the Consul agent, enter this into your Terminal/Command Prompt:

    $ consul agent -server -bootstrap-expect 1 -data-dir <data-directory>

Web Server Setup
----------------

### PHP CLI Server

The simplest way to get started if you are using PHP 5.4 or above is to start the internal PHP cli-server in the root directory:

    php -S 0.0.0.0:8080 -t public/ public/index.php

This will start the cli-server on port 8080, and bind it to all network
interfaces.

**Note: ** The built-in CLI server is *for development only*.

### Apache Setup

To setup apache, setup a virtual host to point to the public/ directory of the
project and you should be ready to go! It should look something like below:

**Note: ** Ensure that "AllowEncodedSlashes NoDecode" is set.

    <VirtualHost *:80>
        AllowEncodedSlashes NoDecode
        ServerName nightowl.local
        DocumentRoot /path/to/nightowl/public
        SetEnv APPLICATION_ENV "development"
        <Directory /path/to/nightowl/public>
            DirectoryIndex index.php
            AllowOverride All
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost>

CURL Tests
----------

**Note: ** These tests assume that the above setupu has been followed and that the address "http://nightowl.local" points to the public directory of the project.

All requests should return JSON data. If an empty JSON array is returned, add "-i" to the command to see the response headers. If a status of 401 is returned, the session has expired and you will need to login again.

### Create a Test User
curl -H "Content-type: application/json" -c cookies.txt -X POST -d "{\"name\":\"test_user\", \"pass\":\"password\"}" http://nightowl.local/auth/create

### Login as Test User
curl -H "Content-type: application/json" -c cookies.txt -X POST -d "{\"name\":\"test_user\", \"pass\":\"password\"}" http://nightowl.local/auth/login

### Create a Launch Code
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X POST -d "{\"restriction\":\"boolean\", \"value\":\"true\", \"description\":\"test code\", \"availableToJS\":\"true\"}" http://nightowl.local/codes/dc1/test_key

### Retrieve the Launch Code
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X GET http://nightowl.local/codes/dc1/test_key

### Edit the Launch Code
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X POST -d "{\"restriction\":\"boolean\", \"value\":\"true\", \"description\":\"test code\", \"availableToJS\":\"false\"}" http://nightowl.local/codes/dc1/test_key

### View History for the Launch Code
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X GET http://nightowl.local/audit/%7B%22code%22:%7B%22$regex%22:%22test_key%22,%22$options%22:%22-i%22%7D%7D

### Delete the Launch Code
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X DELETE http://nightowl.local/codes/dc1/test_key

### Logout
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X DELETE http://nightowl.local/auth/logout

### Verify Logged Out
curl -H "Content-type: application/json" -c cookies.txt -b cookies.txt -X GET http://nightowl.local/codes/dc1/test_key -i
(Response status will be 401 with message "Auth Token is Required"
