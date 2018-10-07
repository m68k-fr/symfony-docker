# A Symfony sample project using Docker on Windows

This is a general purpose Symfony project using Docker on Windows.  
It features a use case website, the kind of small project you could encounter in a web agency.   
No special features here, the goal was simply to practice and learn the basis.  
As usual, the repository is configured for a development environment, please do not use this in a production environment.

## Technology included

* [Docker](https://www.docker.com/)
* [Apache](https://httpd.apache.org/)
* [MySQL](https://www.mysql.com/)
* [PHP 7.1](https://php.net/)
* [PhpMyAdmin](https://www.phpmyadmin.net/)
* [Symfony 3.4](https://symfony.com/)
* [Composer](https://getcomposer.org/)
* [XDebug](https://xdebug.org/)
* [Webpack (using Webpack Encore)](https://symfony.com/doc/3.4/frontend/encore/installation-no-flex.html)

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
On Windows system, you can use the following command to find it. 
```sh
ipconfig /all
```

## Start all Docker services

Change directory into the cloned project, then build the Docker image and launch containers.

```sh
docker-compose up -d
```

## PhpMyAdmin
phpmyAdmin should be available on http://localhost:8080 (user: root password:root)


## Update Symfony 3.4 Standard Edition

Install composer dependencies:  
```sh
docker-compose exec symfony composer install
```

Now, you should be able to access the symfony website by browsing http://localhost



## Configure XDebug for VS Code

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
        "/var/www/html": "${workspaceRoot}"
    }            
},     
```

## Configure XDebug for PhpStorm

Using PHPStorm, in settings / Language & Frameworks / PHP / Debug / DBGPproxy:  
* Port: 9000
* Host: Use the **DOCKER_NAT_IP** ip


## Configure PHP-CS-Fixer for PhpStorm

* Install PHP-CS-Fixer globally from composer
```sh
composer global require friendsofphp/php-cs-fixer
```
* Using PHPStorm, add a new "External Tools" and configure it using the following parameters
```
Program: C:\Users\myuser\AppData\Roaming\Composer\vendor\bin\php-cs-fixer.bat
Arguments: fix --verbose --path-mode=intersection "$FileDir$/$FileName$"
Working directory: $ProjectFileDir$
```

## Stop all Docker services
```sh
docker-compose down -v
```