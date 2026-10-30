# Bitácora de Prompts de IA — Laboratorio Spring Boot Banco

**Institución:** Tecnológico de Antioquia — 2026  
**Curso:** Diseño de Sistemas  
**Herramienta IA:** Antigravity (OmniSpec Framework)  
**Estudiante:** Entrega Laboratorio Spring Boot Banco  

---

## Índice de Prompts
1. [Paso 1: Reglas de Arquitectura y Buenas Prácticas Java 25 y Spring Boot 4](#paso-1-reglas-de-arquitectura-y-buenas-prácticas-java-25-y-spring-boot-4)
2. [Paso 2: Configuración de Base de Datos PostgreSQL y application.properties](#paso-2-configuración-de-base-de-datos-postgresql-y-applicationproperties)
3. [Paso 3: Generación de Entity Beans JPA y DTOs Records](#paso-3-generación-de-entity-beans-jpa-y-dtos-records)
4. [Paso 4: Repositorios Spring Data JPA y Seeding de Datos](#paso-4-repositorios-spring-data-jpa-y-seeding-de-datos)
5. [Paso 5: Capa de Servicio Transaccional y Generación de Código QR](#paso-5-capa-de-servicio-transaccional-y-generación-de-código-qr)
6. [Paso 6: Controladores REST y Documentación OpenAPI Swagger](#paso-6-controladores-rest-y-documentación-openapi-swagger)
7. [Paso 7: Configuración de Filtro CORS](#paso-7-configuración-de-filtro-cors)
8. [Paso 8: Cliente Frontend React + TypeScript y Servicio de API](#paso-8-cliente-frontend-react--typescript-y-servicio-de-api)
9. [Paso 9: Componentes de UI: Login Editorial, Tarjetas 3D y 4 Estados](#paso-9-componentes-de-ui-login-editorial-tarjetas-3d-y-4-estados)
10. [Paso 10: Pruebas Automatizadas y Documentación Técnica Final](#paso-10-pruebas-automatizadas-y-documentación-técnica-final)
11. [Paso 11: Auditoría de Interfaz (`better-interface`) y Rediseño "Boutique Minimalist" (Editorial Suizo)](#paso-11-auditoría-de-interfaz-better-interface-y-rediseño-boutique-minimalist-editorial-suizo)
12. [Paso 12: Corrección Responsive, Eliminación de Scrollbar en Modal QR e Informe Técnico](#paso-12-corrección-responsive-eliminación-de-scrollbar-en-modal-qr-e-informe-técnico)

---

### Paso 1: Reglas de Arquitectura y Buenas Prácticas Java 25 y Spring Boot 4
* **Objetivo:** Establecer las convenciones de nomenclatura en inglés, uso estricto de Java records para DTOs, documentación Javadoc obligatoria y políticas anti-slop / fail-fast bajo Java 25 LTS y Spring Boot 4.
* **Prompt Utilizado:**
  > "Configura el entorno de desarrollo con las reglas de ingeniería para Java 25 y Spring Boot 4.
  > Ten en cuenta que los nombres de clases, métodos, variables y atributos deben ser estrictamente en inglés.
  > Cada método público debe contar con documentación Javadoc explicativa.
  > Para los objetos de transferencia de datos (DTOs) usamos Java records inmutables.
  > Prohibido envolver código en try/catch defensivos que traguen excepciones o devuelvan null silenciosamente."
* **Archivos Afectados:** `CONSTITUTION.md`, `.agents/skills/*`, `specs/001-bank-transfers-qr/spec.md`.
* **Resultado:** Gobernanza configurada y validada en OmniSpec.

---

### Paso 2: Configuración de Base de Datos PostgreSQL y application.properties
* **Objetivo:** Crear la base de datos `bankdb` en PostgreSQL 18 local y configurar el archivo de propiedades de Spring Boot con el dialecto JPA correspondiente.
* **Prompt Utilizado:**
  > "Crea la configuración para la conexión a la base de datos PostgreSQL de nombre 'bankdb' en el puerto 5432 con el usuario 'postgres' y contraseña 'postgres'.
  > Habilita la actualización automática del esquema en Hibernate (`update`), el dialecto JPA para PostgreSQL, formatea las sentencias SQL en consola y deshabilita open-in-view.
  > Configura además los endpoints para la documentación de Swagger OpenAPI en `/swagger-ui.html`."
* **Archivos Generados:** `backend/src/main/resources/application.properties`, `backend/pom.xml`, `backend/.mvn/wrapper/*`.
* **Resultado:** Base de datos `bankdb` creada en PostgreSQL 18 local y Maven Wrapper operativo.

---

### Paso 3: Generación de Entity Beans JPA y DTOs Records
* **Objetivo:** Definir las entidades persistentes `Account` y `Transaction` con anotaciones JPA y los contratos inmutables `TransferRequest`, `TransferResponse`, `AccountDto`, `TransactionDto` y `ErrorResponse` usando Java records.
* **Prompt Utilizado:**
  > "Crea las entidades JPA para el sistema bancario:
  > 1. Entidad `Account` con id (clave primaria autogenerada), accountNumber (String único), holderName (String), balance (BigDecimal con 2 decimales), accountType (String), currency (String) y createdAt (LocalDateTime). Incluye métodos helper debit y credit.
  > 2. Entidad `Transaction` con id (autogenerado), transactionId (UUID único), sourceAccountNumber (String), destinationAccountNumber (String), amount (BigDecimal), currency (String), timestamp (LocalDateTime), status (String) y qrPayload (String en columna TEXT).
  > Usa las anotaciones JPA correctas y genera constructores, getters y setters con Javadoc.
  > Para la comunicación REST, crea los DTOs usando Java records: `TransferRequest` (con validaciones @NotBlank y @Positive), `TransferResponse` (con nuevo saldo y QR), `AccountDto`, `TransactionDto` y `ErrorResponse`."
* **Archivos Generados:** `backend/src/main/java/com/udea/banco/entity/*`, `backend/src/main/java/com/udea/banco/dto/*`.
* **Resultado:** Entidades JPA y DTOs inmutables creados bajo estándares Java 25.

---

### Paso 4: Repositorios Spring Data JPA y Seeding de Datos
* **Objetivo:** Crear las interfaces de persistencia para `Account` y `Transaction` con consultas especializadas y un sembrador de datos (`DataInitializer`) que precargue las cuentas de prueba iniciales (Diego, Pedro y María).
* **Prompt Utilizado:**
  > "Crea los repositorios de Spring Data JPA para la entidad `Account` y la entidad `Transaction`.
  > En `AccountRepository`, incluye métodos para buscar por número de cuenta (`findByAccountNumber`) y verificar su existencia (`existsByAccountNumber`).
  > En `TransactionRepository`, incluye el método para listar todas las transacciones ordenadas descendentemente por fecha (`findAllByOrderByTimestampDesc`).
  > Crea además una clase `DataInitializer` que implemente `CommandLineRunner` para sembrar automáticamente en la base de datos las cuentas de prueba iniciales si la tabla se encuentra vacía:
  > - CTA-1001: Diego Ramirez con saldo de 1.500.000 COP
  > - CTA-1002: Pedro Gomez con saldo de 500.000 COP
  > - CTA-1003: Maria Restrepo con saldo de 2.800.000 COP"
* **Archivos Generados:** `backend/src/main/java/com/udea/banco/repository/*`, `backend/src/main/java/com/udea/banco/config/DataInitializer.java`.
* **Resultado:** Repositorios e inicialización automática de datos listos y enlazados a PostgreSQL.

---

### Paso 5: Capa de Servicio Transaccional y Generación de Código QR
* **Objetivo:** Implementar la lógica de negocio en `TransferService` con validaciones de saldo, transaccionalidad atómica (`@Transactional`) y generación de código QR con ZXing en `QrCodeService`.
* **Prompt Utilizado:**
  > "Crea la clase `QrCodeService` que utilice la librería ZXing para generar códigos QR en formato Base64 PNG data URI con un tamaño de 250x250 píxeles.
  > Crea la clase `TransferService` que contenga la lógica de negocio del sistema bancario:
  > Debe:
  > - Ejecutar la transferencia de dinero entre cuentas con `@Transactional(isolation = Isolation.READ_COMMITTED)`.
  > - Validar que la cuenta de origen y destino no sean iguales.
  > - Validar que el monto a transferir sea estrictamente mayor a cero.
  > - Verificar la existencia de ambas cuentas y lanzar `AccountNotFoundException` si alguna no existe.
  > - Comprobar que la cuenta de origen tenga fondos suficientes y lanzar `InsufficientFundsException` si el saldo es inferior al monto.
  > - Debitar de la cuenta de origen, acreditar en la cuenta de destino y persistir los cambios atómicamente.
  > - Generar un código QR con los datos de la transacción (ID único, cuenta origen, titular, cuenta destino, monto y fecha).
  > - Registrar la transacción en el histórico y retornar la respuesta con el nuevo saldo de la cuenta de origen.
  > - Exponer métodos para consultar todas las cuentas, buscar una cuenta por número y obtener el histórico cronológico."
* **Archivos Generados:** `backend/src/main/java/com/udea/banco/service/*`, `backend/src/main/java/com/udea/banco/exception/*`.
* **Resultado:** Capa de servicio transaccional con generación de QR y manejo de excepciones de dominio lista.

---

### Paso 6: Controladores REST y Documentación OpenAPI Swagger
* **Objetivo:** Exponer los endpoints REST para transferencias (`POST /api/transfers`), cuentas (`GET /api/accounts`) e historial (`GET /api/transactions`), con manejador global de excepciones y Swagger UI.
* **Prompt Utilizado:**
  > "Crea la CAPA CONTROLLER para la aplicación bancaria:
  > Debe exponer los siguientes endpoints:
  > - `POST /api/transfers`: Recibe el DTO de transferencia con `@Valid` y devuelve la transacción y el código QR generado con código HTTP 201 Created.
  > - `GET /api/accounts`: Retorna el listado de todas las cuentas y sus saldos con código HTTP 200 OK.
  > - `GET /api/accounts/{accountNumber}`: Retorna los detalles de una cuenta específica o 404 si no existe.
  > - `GET /api/transactions`: Lista el histórico completo de transacciones en orden cronológico inverso con código HTTP 200 OK.
  > Agrega un controlador de asesoría `@RestControllerAdvice` llamado `GlobalExceptionHandler` que capture `InsufficientFundsException` (400), `AccountNotFoundException` (404), `InvalidTransferException` (400) y `MethodArgumentNotValidException` (400) retornando un objeto estructurado `ErrorResponse`.
  > Configura la documentación OpenAPI en `/swagger-ui.html` para probar interactivamente los endpoints."
* **Archivos Generados:** `backend/src/main/java/com/udea/banco/controller/*`, `backend/src/main/java/com/udea/banco/exception/GlobalExceptionHandler.java`, `backend/src/main/java/com/udea/banco/config/OpenApiConfig.java`.
* **Resultado:** Endpoints REST, control de errores y Swagger UI listos.

---

### Paso 7: Configuración de Filtro CORS
* **Objetivo:** Permitir la comunicación bidireccional segura entre el backend Spring Boot (`http://localhost:8080`) y el cliente frontend React en desarrollo (`http://localhost:5173` y `http://localhost:3000`).
* **Prompt Utilizado:**
  > "Crea una clase Configuration llamada `CorsConfig` para crear un filtro de CORS que se aplicará a todas las rutas (`/**`).
  > Le indica a Spring Boot que debe aceptar peticiones de los orígenes `http://localhost:5173` y `http://localhost:3000`, permitiendo los métodos HTTP GET, POST, PUT, DELETE y OPTIONS con todas las cabeceras requeridas y credenciales habilitadas."
* **Archivos Generados:** `backend/src/main/java/com/udea/banco/config/CorsConfig.java`.
* **Resultado:** Filtro CORS activo y probado.

---

### Paso 8: Cliente Frontend React + TypeScript y Servicio de API
* **Objetivo:** Inicializar la aplicación web desacoplada en `frontend/` con Vite, TypeScript y Axios (`bankApi.ts`), modelando los tipos de datos bancarios con estricta seguridad tipográfica (cero `any`).
* **Prompt Utilizado:**
  > "Usando las reglas de buenas prácticas y directrices anti-slop, crea la estructura del proyecto frontend con ReactJS, Vite y TypeScript.
  > Debe:
  > - Usar AXIOS para la capa de servicios HTTP (`bankApi.ts`).
  > - Definir interfaces TypeScript estrictas para `Account`, `Transaction`, `TransferRequest`, `TransferResponse` y `ApiError`.
  > - Implementar métodos para:
  >   1. Obtener todas las cuentas bancarias (`getAccounts`).
  >   2. Consultar una cuenta específica (`getAccount`).
  >   3. Listar el histórico de transacciones (`getTransactions`).
  >   4. Ejecutar transferencias de fondos (`executeTransfer`).
  > - Usar la URL base del backend `http://localhost:8080/api` y un helper para extracción limpia de mensajes de error de la API."
* **Archivos Generados:** `frontend/src/types/bank.ts`, `frontend/src/services/bankApi.ts`.
* **Resultado:** Capa de servicios frontend tipada y conectada al backend.

---

### Paso 9: Componentes de UI: Login Editorial, Tarjetas 3D y 4 Estados
* **Objetivo:** Construir la interfaz de usuario con Tailwind CSS puro bajo directrices de Better UI/Accessibility, implementando la pantalla editorial de Login, la tarjeta bancaria táctil con perspectiva física CSS 3D y los 4 estados obligatorios en el historial y modal de comprobante con código QR.
* **Prompt Utilizado:**
  > "Crea las vistas de la aplicación en React con Tailwind CSS puro:
  > 1. Pantalla de presentación `LoginView`: Interfaz institucional de bienvenida con diseño editorial y selector ágil de las cuentas de prueba del sistema (Diego, Pedro, María).
  > 2. Componente `BankCard3D`: Tarjeta bancaria táctil con perspectiva CSS 3D (`perspective: 1000px`, `transform-style: preserve-3d`), inclinación óptica dinámica al mover el cursor, chip EMV en SVG dorado, cifras con `tabular-nums` y respeto a `prefers-reduced-motion`.
  > 3. Componente `TransferModal`: Formulario de transferencias con validación de saldo en vivo, selector de cuenta destino, chips de montos rápidos y feedback de error inline.
  > 4. Componente `ReceiptModal`: Comprobante de transferencia exitosa de alto contraste que renderice el código QR generado (`qrPayload`), detalle de la transacción y botón para copiar el ID.
  > 5. Componente `TransactionHistory`: Tabla dinámica de movimientos bancarios que contemple de forma estricta los 4 estados de interfaz:
  >    - Loading: Skeletons contextuales con CLS = 0.
  >    - Empty: Mensaje explicativo con acción inmediata para realizar la primera transferencia.
  >    - Error: Banner con mensaje claro de fallo y botón de reintento.
  >    - Ideal: Tabla completa con montos coloreados (+/-) y botón para visualizar el código QR de cada transacción."
* **Archivos Generados:** `frontend/src/components/*`, `frontend/src/App.tsx`, `frontend/src/index.css`.
* **Resultado:** Interfaz completa, sin plantillas genéricas, con física 3D real y comprobante QR integrado.

---

### Paso 10: Pruebas Automatizadas y Documentación Técnica Final
* **Objetivo:** Crear y ejecutar la batería de pruebas unitarias y de integración para la capa de servicio y el generador QR, compilando el proyecto completo y generando la documentación técnica del repositorio.
* **Prompt Utilizado:**
  > "Crea las pruebas unitarias en Spring Boot (`TransferServiceTest` y `QrCodeServiceTest`) para validar:
  > - Transferencia exitosa con débito y crédito atómico (`AC-01`, `AC-04`).
  > - Generación y prefijo correcto del código QR en Base64 (`AC-03`).
  > - Rechazo y rollback cuando el saldo es insuficiente (`AC-07`).
  > - Rechazo cuando una cuenta no existe (`AC-08`).
  > - Rechazo cuando origen y destino son la misma cuenta o el monto es menor o igual a cero (`AC-09`).
  > Configura el plugin maven-surefire-plugin para Java 25.
  > Genera un `README.md` exhaustivo y profesional que documente la arquitectura, stack tecnológico, instrucciones de instalación, endpoints REST y ejecución del proyecto para su entrega en GitHub."
* **Archivos Generados:** `backend/src/test/java/com/udea/banco/*`, `README.md`.
* **Resultado:** 100% de pruebas pasando (6/6), build de frontend exitoso y documentación para entrega universitaria completada.

---

### Paso 11: Auditoría de Interfaz (`better-interface`) y Rediseño "Boutique Minimalist" (Editorial Suizo)
* **Objetivo:** Auditar la interfaz bajo directrices estrictas de `/better-colors` y `/better-interface`, eliminando clichés visuales de IA (modo oscuro genérico con acentos neón) y transformando el sistema visual hacia una dirección "Boutique Minimalist" inspirada en diseño editorial suizo y banca de alta gama.
* **Prompt Utilizado:**
  > "Ejecuta una auditoría estricta de la interfaz con `/better-interface` y `/better-colors`. Rediseña los componentes visuales hacia la 'Opción B: Boutique Minimalist' (Editorial Suizo / Luxury Fintech):
  > 1. Paleta de Colores: Rampa de alabastro cálido (#FBFBFA) para el lienzo, tarjetas blancas puras elevadas (#FFFFFF) con micro-bordes de 1px (#E5E2DA) y contraste de texto superior a 14:1 con tinta carbón (#18181B). Una única acción primaria destacada en negro onix.
  > 2. Tarjeta 3D Ultra-Táctil (`BankCard3D`): Física tridimensional con perspectiva de 1200px, reflejo especular reactivo al puntero (specular glare dinámico), y capacidad de giro completo de 180° (flip 3D) para ver el reverso físico (banda magnética, panel de firma, CVV 842 y sello holográfico de seguridad).
  > 3. Portal de Login Asimétrico (`LoginView`): Presentación editorial bancaria de bienvenida con exhibidor en relieve de las tarjetas físicas de prueba (Diego, Pedro, María).
  > 4. Comprobante de Transferencia (`ReceiptModal`): Rediseñado como voucher de caja bancaria perforado, código QR nítido, código monoespaciado copiable y botón de impresión de comprobante fiscal.
  > 5. Ledger Financiero (`TransactionHistory`): Tabla de movimientos con tipografía tabular (`tabular-nums`), badges discretos y cumplimiento riguroso de WCAG 2.2 y los 4 estados de UI."
* **Archivos Modificados:** `frontend/tailwind.config.js`, `frontend/src/index.css`, `frontend/src/components/*`.
* **Resultado:** Interfaz bancaria con calidad de producto comercial de alta gama, aprobada por auditoría `better-interface` en accesibilidad, colorimetría, tipografía y movimiento.

---

### Paso 12: Corrección Responsive, Eliminación de Scrollbar en Modal QR e Informe Técnico
* **Objetivo:** Resolver el desbordamiento vertical y eliminar completamente la barra de desplazamiento en el comprobante modal del código QR (`ReceiptModal`), asegurando que todos los elementos (título, QR escaneable, metadatos y botones de acción) encajen perfectamente en pantalla sin recortes en resoluciones móviles (375x667) y laptops (800x600/1280x800). Contrastar la lógica implementada contra la Especificación de Requerimientos del Sistema (SRS en `SpringBoot AI.pdf` Pág. 11) y generar el informe técnico estructurado y exportado a PDF.
* **Prompt Utilizado:**
  > "Optimiza el diseño responsive del modal de comprobante QR (`ReceiptModal`): elimina la barra de desplazamiento vertical (`no scrollbar`) y previene cualquier recorte en pantallas de baja altura o dispositivos móviles, manteniendo la visualización completa del código QR y las acciones de usuario.
  > Contrasta la lógica de transferencias atómicas, saldos e histórico contra los requerimientos técnicos formales del sistema (`SpringBoot AI.pdf` Pág. 11). Ejecuta las pruebas automatizadas y visuales, documentando la evidencia en el informe técnico formal (`INFORME_LABORATORIO.md`) y exporta el informe a formato PDF profesional sin elementos superfluos."
* **Archivos Modificados / Generados:**
  - `frontend/src/components/ReceiptModal.tsx` (rediseño compacto fit-to-viewport sin scrollbar).
  - `frontend/src/components/TransferModal.tsx` (optimización de alturas relativas y campos).
  - `specs/001-bank-transfers-qr/evidence/*` (capturas en Chrome DevTools MCP en móvil y escritorio).
  - `INFORME_LABORATORIO.md` e `INFORME_LABORATORIO.pdf` (informe técnico formal con evidencias y matriz de trazabilidad).
* **Resultado:** Modal QR completamente visible sin barra de desplazamiento, 6/6 pruebas unitarias exitosas, pruebas visuales capturadas en móvil y escritorio, informe técnico consolidado y exportado a PDF.
