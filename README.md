# NOTIJS
Notijs es una aplicación que permite el control de notificaciones para usuarios al estilo facebook. El backend está construido en NodeJS con persistencia de datos en MongoDB y uso de web sockets para envío de notificaciones en tiempo real. Esta aplicación frontend esta construida con AngularJS.

## Backend
[Ir a repositorio de aplicación backend](https://github.com/DMalagonH/notijs-backend)

## Frontend
Este demo hace uso de un template en bootstrap que puede ser facilmente remplazado segun las necesidades de su aplicación. El demo corre en un servidor básico en nodejs, sin embargo es independiente al tipo de servidor desde donde se ejecute. Todos los archivos que importan realmente están en la carpeta public/. 

### Scripts en template HTML
En el index.html o página principal de su aplicación debe agregar las siguientes lineas teniendo en cuenta la URL del servidor backend y el id del usuario visitante de la página:

    <!-- Socket -->
    <script type="text/javascript" src="http://localhost:2100/socket.io/socket.io.js"></script>

    <!-- Angular -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.1/angular.min.js"></script>

    <!-- Angular app -->
    <script type="text/javascript">
        var NotiJSConfig = {
            user_id:        "1",
            api_url:        "http://localhost:2100",
            socket_url:     "http://localhost:2100/Notijs",
            limit_latest:   10 
        };
    </script>
    <script src="js/notijs/notijs.min.js"></script>

### Personalización de HTML
En el archivo public/js/notijs/partials/notice.html esta la vista para la lista de notificaciones y sus funciones, este puede ser adecuado según el diseño de su aplicación. 

Además en index.html de este demo esta el controlador de Angular para notificaciones instantáneas que puede personalizar facilmente.

No olvide incluir en su página principal la siguiente linea: 
    <html ng-app="notijs">

### Personalización de aplicación Angular
En la ruta public/js/notijs/ estan los archivos correspondientes a la aplicación en AngularJS que pueden ser modificados para adecuarlos a las necesidades de su aplicación
