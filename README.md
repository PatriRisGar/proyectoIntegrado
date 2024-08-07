# equiTrack

## 1.Introducción

A día de hoy el mundo continúa adaptándose a las nuevas tecnologías. Hay sectores que acogieron las TIC tan pronto como pudieron, pero aún hay quien continúa con métodos tradicionales.

Es el caso de la equitación. He trabajado en escuelas hípicas y yeguadas, y en ambas se sigue haciendo uso de enormes libros que llevan contabilidad, clases, informes veterinarios, etc…
Por ello quiero aportar una pequeña visión de lo que en mi opinión ayudaría muchísimo a la gestión de una yeguada.

## 2. Datos generales del Proyecto

### 2.1 Título del proyecto

EquiTrack

### 2.2 Descripción del proyecto

Informatizar el trabajo diario de la gestión de una yeguada.

### 2.3 Necesidades a cubrir

He estado trabajando con Marion Hughes, una jinete olímpica de salto que tiene yeguada en Irlanda. Allí además de tener una veterinaria encargada de gestar a las yeguas y hacer seguimiento, también convivíamos los jinetes y mozos. A primera hora de la mañana el manager nos asignaba en una pizarra las cuadras que limpiar, a los caballos que montaba cada jinete y cuál sería el entrenamiento específico de ese caballo.
A la mañana siguiente esa pizarra se borraba, después de haber copiado todo en un libro y vuelta a empezar.

EquiTrack llega para sustituir esa pizarra y tener un control más organizado de la información, evitar inconsistencia/pérdida de datos y ahorrar mucho tiempo.

### 2.3. Entorno Tecnológico del proyecto

Front y la lógica de la aplicación es implementado con Ionic. La base de datos es no relacional, trabajando la persistencia de datos en Firebase.

Ionic framework, es gratis y de código abierto, ofrece una biblioteca de componentes y herramientas de interfaz de usuario optimizados para dispositivos móviles. Esto permite crear aplicaciones rápidas y altamente interactivas.
Ventajas:
Es multiplataforma: dado que el objetivo de Ionic es crear aplicaciones híbridas, es compatible y permite el desarrollo de aplicaciones para Android, iOS, Windows, WebApps y Amazon FireOS.
Usa HTML5 y Angular con TypeScript: al basar la maquetación en HTML y Angular, Ionic permite el diseño de interfaces interactivas de forma muy sencilla.
Los componentes UI: Ionic cuenta con un catálogo amplio de componentes prediseñados que se adaptan a las interfaces nativas de los diferentes sistemas, y permiten trabajar de forma productiva y veloz.

Firebase FIRESTORE

Firebase Firestore es una de las herramientas fundamentales de Firebase, proporciona una base de datos NoSQL en la nube.

A diferencia de Firebase Realtime Database, Firestore organiza los datos en colecciones y documentos, lo que ofrece una estructura de datos más jerárquica y escalable.

Una de las características más destacadas de Firestore es su capacidad para realizar consultas avanzadas y realizar operaciones complejas en los datos. También permite alojar y disponer de los datos e información de la aplicación en tiempo real, asegurando que los datos estén siempre actualizados para todos los usuarios, incluso sin interacción directa.

Las reglas de seguridad de Firestore permiten especificar condiciones dependiendo de la identidad del usuario, el contenido de los datos, etc. Así tengo un mayor control sobre quién puede acceder a qué datos y qué acciones pueden realizar en ellos.

### 2.4. Software

Node v20.11.1, Ionic v7.2.0, Firebase FIRESTORE para la base de datos,Firebase Storage para almacenar las imagenes, Firebase Authentication para gestión usuarios y Firebase Hosting para desplegar.

## 3. Descripción del proyecto

El proyecto se compone de cuatro bloques.

REGISTRO DE CABALLOS.- Registrar información detallada de cada caballo de la yeguada.
Imagen, nombre, raza, capa, fecha nacimiento, sexo, reproductor e historial clinico, referencia de sus historiales clinicos.

HISTORIAL CLÍNICO.- Cada caballo cuenta con historiales clínicos, aquellas visitas que haya realizado el veterinario. Por tanto será modificado por el veterinario y leído por el resto.
Caballo, motivo de la visita, diagnóstico, tratamientos médicos, vacunas.

REGISTRO DE EMPLEADOS.- Cada tipo de usuario tendrá acceso a determinadas acciones (manager, mozo cuadra, jinete, veterinario).
Foto, nombre, email, contraseña, rol, isActive(Si sigue siendo empleado o no).

GESTIÓN ENTRENAMIENTOS.- Editado por el entrenador, leído por el resto.
El entrenador definirá el tipo de entrenamiento (salto, doma, ruta, coss, paddock) de cada caballo, qué jinete y mozo tiene asignado ese día.
Entrenador, jinete, mozo de cuadra, caballo, fecha y hora, tipo de entreno.


## 4. Planificación de las entregas del proyecto

Fecha de Entrega
Tareas incluidas en la entrega
Hito

12/03/2024
Propuesta informal del proyecto
0
20/03/2024
Descripción detallada del proyecto con hitos
1
10/04/2024
Aprendizaje tecnología. Creación de modelo. CRUD caballos.
2
15/05/2024
CRUD empleados. Login empleados con restricciones y/o permisos según su tipo.
4
14/06/2024
Gestión de entrenamientos. Historial clínico por caballo. Entrega Final

## 5. Desarrollo del Proyecto Integrado

### Hito 1

- Instalación de node.js e ionic framework.
- Creación del proyecto.
- Componente Header.
- Integración con Firebase Firestorage.
- Servicios firebase y utils.
- Componente logo, customInput y createUpdateHorse.
- Plugin cámara e integración herramienta Firebase Storage.
- Modelo caballo.
- Crear, leer, editar y eliminar caballos con validaciones en formularios.
- Despliegue con Firebase Hosting (10/04/2024)

### Hito 2

- Integración herramienta Firebase Authentication.
- Modelo usuario.
- Crear usuario.
- Login.
- Recuperar contraseña.
- Cerrar sesión.
- Control de acceso basado en roles.
- Edición foto perfil.
- Eliminar usuario.
- Filtrado de usuario por tipo de empleado.
- Despliegue con Firebase Hosting (15/05/2024)

### Hito 3

- Modelo entrenamiento
- CRUD entrenamiento
- Modelo Historial Clínico
- CRUD Historial Clínico
- Filtro Historial Clínico por vacunas con fecha
- Filtro Historial Clínico por tratamiento con fecha
- APK
- Despliegue con Firebase Hosting (14/06/2024)

## 6. Pruebas

He facilitado la APK y la URL a diferentes usuarios.
Además he ido probando la aplicación.

## 7. Conclusión final

Finalmente he desarrollado una aplicación completa y funcional para la gestión de una yeguada, utilizando tecnologías modernas como Ionic, Angular y Firebase. Esto ha permitido crear una solución escalable, segura y eficiente. La atención al detalle en la implementación y la integración de servicios en la nube ha asegurado una plataforma robusta para futuras expansiones.
La aplicación permite gestionar tanto la información administrativa como clínica de los caballos, empleados y entrenos, y cuenta con un sistema de autenticación y control de acceso basado en roles, lo que la convierte en una herramienta valiosa para cualquier organización.

## 8. Referencias web

### Ángular

- <https://angular.io/docs>
- <https://www.syncfusion.com/blogs/post/angular-promises-vs-observables>

### Ionic

- <https://ionicframework.com/docs>
- <https://ionicframework.com/docs>
- <https://angular.io/docs>

#### Capacitor

- <https://ionicframework.com/docs/native/camera>

### Firebase

- <https://firebase.google.com/pricing?hl=es-419>
- <https://firebase.google.com/docs/firestore?hl=es-419>
- <https://firebase.google.com/docs/storage/web/start?hl=es-419>
- <https://firebase.google.com/docs/auth/admin/manage-users?hl=es-419>

### Despliegue

- <https://firebase.google.com/docs/hosting?hl=es-419>
- <https://ionicframework.com/docs/angular/pwa>

### APK

- <https://capacitorjs.com/docs/android>
