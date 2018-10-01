# General purpose Symfony project using Docker

A general purpose Symfony project using Docker.  
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

* [Docker Native](https://www.docker.com/products/overview)

## Installation

Clone the repository.  

## Configuration

You can skip this step, but it is mandatory for XDebug to work correctly.  
In your **docker-compose.yml** file, update the **DOCKER_NAT_IP** argument with your own vEthernet DockerNAT ip.  
On Windows system, you can use the following command to spot it. 
```sh
ipconfig /all
```


## Running

Change directory into the cloned project.

### Start all services:

```sh
docker-compose up -d
```

You should now be able to access the symfony app by browsing http://localhost  
phpmyAdmin should be available on http://localhost:8080 (root@root)

### Launch a Bash session on the main Symfony container:

```sh
docker-compose exec symfony-app /bin/bash
```

### Shutdown all containers:

```sh
docker-compose down -v
```

## Configuring XDebug for VS Code

Install the [PHP Debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) extension published by Felix Becker.  
Once done, add this profile in your **.vscode/launch.json** file.
```
{
    "name": "Docker XDebug",
    "type": "php",
    "request": "launch",
    "port": 9000,
    "pathMappings": {
        "/var/www/symfony-app": "${workspaceRoot}/symfony-app"
    }            
}
```