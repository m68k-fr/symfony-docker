FROM php:7.1-apache

LABEL maintainer="llemoullec@gmail.com"
 
ARG DOCKER_NAT_IP
ENV ICU_RELEASE=62.1

RUN apt-get update
RUN apt-get install --yes --assume-yes cron g++ gettext libicu-dev openssl libc-client-dev libkrb5-dev  libxml2-dev libfreetype6-dev libgd-dev bzip2 libbz2-dev libtidy-dev libcurl4-openssl-dev libz-dev libmemcached-dev libxslt-dev git zip vim

# Use the default php.ini development configuration
RUN mv $PHP_INI_DIR/php.ini-development $PHP_INI_DIR/php.ini

# PHP Configuration
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install bz2
RUN docker-php-ext-install calendar
RUN docker-php-ext-install dba
RUN docker-php-ext-install exif
RUN docker-php-ext-configure gd --with-freetype-dir=/usr --with-jpeg-dir=/usr
RUN docker-php-ext-install gd
RUN docker-php-ext-install gettext
RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl
RUN docker-php-ext-install imap
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install soap
RUN docker-php-ext-install tidy
RUN docker-php-ext-install xmlrpc
RUN docker-php-ext-install mbstring
RUN docker-php-ext-install xsl
RUN docker-php-ext-install zip
RUN docker-php-ext-configure hash --with-mhash

# Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug
RUN echo 'xdebug.remote_enable=1' >> $PHP_INI_DIR/php.ini
RUN echo 'xdebug.remote_port=9000' >> $PHP_INI_DIR/php.ini
RUN echo 'xdebug.remote_autostart=1' >> $PHP_INI_DIR/php.ini
RUN echo "xdebug.remote_host=${DOCKER_NAT_IP}" >> $PHP_INI_DIR/php.ini
RUN echo 'xdebug.remote_connect_back=0' >> $PHP_INI_DIR/php.ini
RUN echo 'xdebug.remote_handler=dbgp' >> $PHP_INI_DIR/php.ini
RUN echo 'xdebug.idekey=docker' >> $PHP_INI_DIR/php.ini

# Imagemagick
RUN apt-get install --yes --assume-yes libmagickwand-dev libmagickcore-dev
RUN yes '' | pecl install -f imagick
RUN docker-php-ext-enable imagick

# Opcache php accelerator
RUN docker-php-ext-configure opcache --enable-opcache && docker-php-ext-install opcache
COPY conf/opcache.ini $PHP_INI_DIR/conf.d/

# Update ICU data bundled to the symfony required version
RUN curl -o /tmp/icu.tar.gz -L http://download.icu-project.org/files/icu4c/$ICU_RELEASE/icu4c-$(echo $ICU_RELEASE | tr '.' '_')-src.tgz && tar -zxf /tmp/icu.tar.gz -C /tmp && cd /tmp/icu/source && ./configure --prefix=/usr/local && make && make install
RUN docker-php-ext-configure intl --with-icu-dir=/usr/local
RUN docker-php-ext-install intl

# Install composer for PHP dependencies
RUN cd /tmp && curl https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

# Set timezone
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime

# Apache Configuration
COPY conf/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite
RUN a2enmod headers

# SSL configuration
COPY conf/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
RUN a2enmod ssl
RUN a2ensite default-ssl
RUN openssl req -subj '/CN=localdevmachine.com/O=My Dev Local Machine LTD./C=US' -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout /etc/ssl/private/ssl-cert-snakeoil.key -out /etc/ssl/certs/ssl-cert-snakeoil.pem

CMD cron && apache2-foreground
