Actúa como Arquitecto de Software y Experto en Spec-Driven Development (SDD). Genera un SRS completo, verificable y listo para implementación con agentes IA, basado en:

**Proyecto:** [Nombre]
**Descripción:** [Qué hace y para quién]
**Funcionalidades Clave:** [Lista breve]
**Stack/Restricciones:** [Lenguajes, DB, compliance, performance, etc.]

Genera el SRS en Markdown siguiendo EXACTAMENTE esta estructura:
1. INTRODUCCIÓN: Propósito, Alcance (dentro/fuera), Glosario, Visión General.
2. DESCRIPCIÓN GENERAL: Perspectiva, Funciones, Roles/Permisos, Restricciones, Suposiciones.
3. REQUISITOS FUNCIONALES (RF-XXX): ID único, Prioridad (MoSCoW), Descripción precisa, Pre/Postcondiciones, Flujo principal, Alternativos/Excepciones, Criterios de aceptación MEDIBLES, Validaciones explícitas, Dependencias.
4. REQUISITOS NO FUNCIONALES (RNF-XXX): Performance (p95, throughput, escalabilidad), Seguridad (TLS, encriptación, rate limiting), Disponibilidad (SLA, RTO/RPO), Mantenibilidad (cobertura >80%, logging), Usabilidad/Accesibilidad.
5. CASOS DE USO (UC-XXX): Actor, Stakeholders, Precondiciones, Flujo básico, Alternativos, Excepciones, Postcondiciones.
6. MODELOS DE DATOS: Entidades con campos, tipos, constraints y relaciones.
7. INTERFACES/APIs: Endpoints, Request/Response JSON, Códigos de error, Rate limits.

REGLAS OBLIGATORIAS:
- Cero ambigüedad: Prohibido usar "aproximadamente", "fácil", "user-friendly", etc.
- Verificable: Cada requisito debe tener criterios de aceptación cuantificables y testeables.
- Trazable: IDs únicos (RF-XXX, RNF-XXX, UC-XXX) y coherencia terminológica.
- Edge cases: Incluye explícitamente flujos de error, validaciones por campo y límites del sistema.
- Formato estricto: Markdown, tablas para criterios, listas numeradas para flujos.
- Enfoque SDD: La spec debe ser Single Source of Truth, sin referencias a código futuro, lista para generar tests de conformidad automáticamente.

Si falta información crítica, infiérela lógicamente y márcala como [ASUMIDO]. Entrega únicamente el SRS final.