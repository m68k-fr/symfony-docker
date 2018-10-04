# A Docker Environment for Symfony on Windows

A general purpose Symfony project using Docker on Windows.  
The project is configured for a development environment, please do not use this in production environment.

## Technology included

* [Apache](https://httpd.apache.org/)
* [MySQL](https://www.mysql.com/)
* [PHP 7](https://php.net/)
* [PhpMyAdmin](https://www.phpmyadmin.net/)
* [Symfony](https://symfony.com/)
* [Composer](https://getcomposer.org/)
* [XDebug](https://xdebug.org/)

## Requirements

* [Docker for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows)
* [Git for Windows](https://gitforwindows.org/)

## Installation

Clone the repository.  

```sh
git clone https://github.com/ngc5128/symfony-docker.git
```


## Configuring Docker for XDebug

In your **docker-compose.yml** file, update the **DOCKER_NAT_IP** argument with your own vEthernet DockerNAT ip.  
On Windows system, you can use the following command to spot it. 
```sh
ipconfig /all
```

## Start all Docker services

Change directory into the cloned project.

```sh
docker-compose up -d
```

## PhpMyAdmin
phpmyAdmin should be available on http://localhost:8080 (user: root password:root)


## Install Symfony 3.4 Standard Edition

After starting all Docker services, open a Bash session on the Symfony container and update composer:  
```sh
docker-compose exec symfony-app /bin/bash
cd ..
composer create-project symfony/framework-standard-edition symfony-app
exit
```

Now, you should be able to access the symfony app by browsing http://localhost



## Configuring XDebug for VS Code

Using VS Code, install the [PHP Debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) extension published by Felix Becker.  
Select the debug tab using the icon on the left sidebar, then click on the cog next to the *Listen for XDebug* dropdown to open **launch.json** file.   
Update the *Listen for XDebug* profile in the **launch.json** file with the following:
```
{
    "name": "Listen for XDebug",
    "type": "php",
    "request": "launch",
    "port": 9000,
    "pathMappings": {
        "/var/www/symfony-app": "${workspaceRoot}/symfony-app"
    }            
},     
```

## Configuring XDebug for PhpStorm

In settings / Language & Frameworks / PHP / Debug / DBGPproxy:  
* Port: 9000
* Host: Use the **DOCKER_NAT_IP** ip


## Stop all Docker services
```sh
docker-compose down -v
```