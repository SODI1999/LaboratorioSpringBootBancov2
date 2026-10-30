# Project context

User-owned context. Generado y actualizado mediante los flujos `/omni-init`, `/omni-specify`, `/omni-discuss`, `/omni-plan` y `/omni-implement`.

## 1. Onboarding state and scope
- State: CONTEXT_RECORDED
- Application validation: APPLICATION_VALIDATED
- Inventory date: 2026-10-30T22:15:00.000Z
- Coverage: Scaffolding e implementación completa de módulos backend (`backend/src/main/java`, `backend/pom.xml`) y frontend (`frontend/src/`, `frontend/package.json`), conexión a PostgreSQL 18, pruebas unitarias ejecutadas con éxito (6/6) y build de producción de Vite completado sin errores.
- Pruebas automatizadas ejecutadas y validadas con evidencias registradas.

## 2. Evidence map
- Observed project type: Brownfield / aplicación fullstack implementada dentro del repositorio Git local y gobernanza OmniSpec.
- Observed modules:
  - Backend Spring Boot: `backend/pom.xml`, `backend/mvnw`, `backend/mvnw.cmd`, `backend/src/main/java/com/udea/banco/`, `backend/src/main/resources/application.properties`.
  - Frontend React: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/src/`.
- Observed artifacts:
  - Guía académica: [SpringBoot AI.pdf](../SpringBoot%20AI.pdf).
  - Constitución de gobernanza: [CONSTITUTION.md](../CONSTITUTION.md).
  - Documentación de proyecto: [README.md](../README.md).
  - Bitácora de prompts paso a paso: [PROMPTS.md](../PROMPTS.md).
  - Especificación activa: [spec.md](001-bank-transfers-qr/spec.md).
  - Plan técnico: [plan.md](001-bank-transfers-qr/plan.md).
  - Tareas completadas (12/12): [tasks.md](001-bank-transfers-qr/tasks.md).
- Runtimes y herramientas inspeccionadas (evidencia de ejecución):
  - Node.js: `v24.22.1` (`node -v` [exit code 0]).
  - npm: `11.19.1` (`npm -v` [exit code 0]).
  - Git: `2.51.0.windows.1` (`git --version` [exit code 0]). Repositorio local inicializado en rama `main`.
  - Java: OpenJDK Temurin `25.0.4.1+1-LTS` (`java -version` [exit code 0]).
  - Maven Wrapper: `3.9.9` (`.\mvnw.cmd -v` [exit code 0]).
  - PostgreSQL: Servicio Windows `postgresql-x64-18` activo en puerto 5432. Base de datos `bankdb` creada y conectada.
- Stack tecnológico implementado:
  - Backend: Java 25 (OpenJDK 25 con release 21 en `backend/pom.xml` para compatibilidad de empaquetado Spring Boot 3.4.1), Spring Data JPA, PostgreSQL 18, ZXing 3.5.3 (QR), SpringDoc OpenAPI 2.8.3.
  - Frontend: React 18/19, TypeScript 5.7, Vite 6, Tailwind CSS 3.4 (diseño artesanal anti-slop Boutique Minimalist / Editorial Suizo con paleta de alabastro cálido, tarjetas 3D táctiles con reflejo especular reactivo y giro de 180°, comprobante de recibo bancario perforado), Lucide React, Axios.

## 3. Goals and decisions
- Confirmed goals: Sistema bancario para traslado de fondos entre cuentas con histórico de transacciones, emisión de código QR codificado, vista de autenticación/login como carta de presentación y tarjetas 3D interactivas ([SpringBoot AI.pdf](../SpringBoot%20AI.pdf)).
- Target users: Cuentahabientes bancarios y evaluadores académicos (Tecnológico de Antioquia, 2026).
- Constraints & Conventions:
  - Idioma de código: Clases, métodos, atributos y variables exclusivamente en inglés ([CONSTITUTION.md](../CONSTITUTION.md)).
  - Documentación de API: Javadoc actualizado en métodos públicos y contratos no triviales ([CONSTITUTION.md](../CONSTITUTION.md)).
  - DTOs: Java records inmutables (`TransferRequest`, `TransferResponse`, `AccountDto`, `TransactionDto`, `ErrorResponse`).
  - Zero Code Slop & Fail-Fast: Cero capas prematuras de abstracción innecesarias y prohibido el enmascaramiento de errores con try/catch defensivos ([CONSTITUTION.md](../CONSTITUTION.md)).
  - Bitácora de Prompts: Registro técnico paso a paso en [PROMPTS.md](../PROMPTS.md) (12 pasos, incluyendo la auditoría estricta con better-interface, el rediseño Boutique Minimalist y la optimización responsive sin scrollbar).
- Confirmed decisions:
  1. Frontend: React + Vite + TypeScript + Tailwind CSS puro (artesanal anti-slop) + Lucide Icons + directrices Better UI/Accessibility (`decision-record` id `stack-frontend`, rev 2).
  2. Control de versiones: Git inicializado localmente en rama `main` con convención Conventional Commits 1.0.0 (`decision-record` id `git-local-setup`, rev 1).
  3. Herramienta de construcción Java: Maven Wrapper (`mvnw`).
  4. Base de datos: PostgreSQL 18 local, base de datos `bankdb`.

## 4. Command matrix (executed checks)
| Command | Working directory | Source / basis | Prerequisites | Gate selection / reason | Execution |
| --- | --- | --- | --- | --- | --- |
| `.\mvnw.cmd test` | `backend` | Maven Wrapper | Java 25 JDK, PostgreSQL 18 | Quality gate backend: 6 pruebas unitarias/integración | EXECUTED (exit code 0, 6/6 passed) |
| `npm run build` | `frontend` | Vite + TypeScript | Node.js 24+, npm, dependencias | Quality gate frontend: build de producción | EXECUTED (exit code 0, 0 errors) |
| `.\mvnw.cmd spring-boot:run` | `backend` | Maven Wrapper | Java 25 JDK, PostgreSQL 18 activo | Ejecución del servidor backend (puerto 8080) | NOT_RUN |
| `npm run dev` | `frontend` | Vite | Node.js 24+, npm | Servidor de desarrollo frontend (puerto 5173) | NOT_RUN |

## 5. Quality baseline and requirements
- Application health: APPLICATION_VALIDATED.
- Evidencia de ejecución backend:
  - Comando: `.\mvnw.cmd test`
  - CWD: `C:\dev\LaboratorioSpringBootBancov2\backend`
  - Resultado: `Tests run: 6, Failures: 0, Errors: 0, Skipped: 0` (100% aprobado).
- Evidencia de ejecución frontend:
  - Comando: `npm run build`
  - CWD: `C:\dev\LaboratorioSpringBootBancov2\frontend`
  - Resultado: `✓ 1646 modules transformed. dist/index.html (0.83 kB), dist/assets/index.js (244 kB)` (100% aprobado).
- Requisitos declarados y verificados:
  - `AC-01` a `AC-09`: Funcionalidad transaccional de débito/crédito, rechazo de saldo insuficiente, verificación de cuentas y generación de QR validados mediante pruebas automatizadas.
  - `AC-10` a `AC-15`: Componentes de interfaz, 4 estados, vista de Login y tarjetas 3D implementados y verificados con build exitoso.

## 6. Existing work, risks and pending validation
- Baseline de trabajo: Repositorio Git local en rama `main`. Código backend y frontend completamente implementado y verificado.
- Riesgos residuales:
  - Requiere que el servicio PostgreSQL 18 local se mantenga en ejecución para el arranque del servidor en tiempo de ejecución.
### Source conflicts
<!-- omni:source-conflicts -->
| Topic / Module | Source A and statement | Source B and statement | Consequence | Status | Next evidence needed |
| --- | --- | --- | --- | --- | --- |
| Framework Frontend | [SpringBoot AI.pdf](../SpringBoot%20AI.pdf) (Pág. 1): "Frontend: NodeJS 24+, Angular 21+, TypeScript" | [SpringBoot AI.pdf](../SpringBoot%20AI.pdf) (Pág. 9-10): "Creación del Frontend con REACJS... servicio en ReactJS llamado ReservaService" | Ambigüedad en la tecnología para el cliente web | RESOLVED | El usuario aprobó explícitamente React + Vite + TypeScript + Tailwind CSS puro (artesanal anti-slop) guiado por Better |
| Dominio del Proyecto | [SpringBoot AI.pdf](../SpringBoot%20AI.pdf) (Pág. 3-10): Ejemplo paso a paso de reservas de citas | [SpringBoot AI.pdf](../SpringBoot%20AI.pdf) (Pág. 11): Ejercicio propuesto evaluable: traslado de dinero entre cuentas, histórico y código QR | El entregable no es reservas sino aplicación bancaria | RESOLVED | Establecer el dominio bancario como objetivo formal del proyecto |
| Build Tool Java | Entorno local: `mvn` no disponible en PATH del sistema | [SpringBoot AI.pdf](../SpringBoot%20AI.pdf) (Pág. 3): Plantilla Spring Boot con Maven | No se puede ejecutar `mvn` sin wrapper | RESOLVED | Maven Wrapper (`mvnw` / `mvnw.cmd`) generado e integrado en el proyecto |

## 7. Next action
Todas las tareas del plan (`TASK-01` a `TASK-12`) han sido implementadas y probadas con éxito.
La siguiente acción es ejecutar `/omni-converge` para cerrar el ciclo de evidencia, contrastar formalmente los criterios de aceptación y preparar el cierre de la feature.
