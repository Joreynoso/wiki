Actúa como Arquitecto de Software experto en Spec-Driven Development (SDD). Genera la estructura base de un proyecto nuevo siguiendo EXACTAMENTE la guía SRS/SDD proporcionada.

**Objetivo:** Crear el esqueleto de directorios y poblar los archivos críticos con las plantillas base definidas en la guía.

**Estructura Obligatoria:**
project-root/
├── specs/{README.md, SRS.md, architecture/{system-design.md, data-models.md, api-contracts.md}, features/{auth/{spec.md, test-scenarios.md, acceptance-criteria.md}}, non-functional/{performance.md, security.md, scalability.md}, versions/v1.0.0/}
├── src/{shared/}
├── tests/{unit/, integration/, e2e/, conformance/}
├── docs/{api/, guides/, changelog/}
├── .ai/{agents.yml, prompts/, workflows/}
├── scripts/{validate-spec.sh, generate-tests.sh, sync-docs.sh}
└── package.json

**Contenido Inicial (USA SOLO LAS PLANTILLAS DE LA GUÍA):**
1. `specs/README.md`: "Índice Maestro" (Versión, Estado, Mapa de Specs, Reglas de Modificación).
2. `.ai/agents.yml`: Configuración con `backend-agent`, `test-agent`, `reviewer-agent` (roles, responsabilidades, constraints).
3. `scripts/*.sh`: Placeholders funcionales (validate-spec compara versiones, generate-tests y sync-docs con comandos base).
4. `specs/SRS.md`: Estructura vacía con los 7 apartados exactos (1. Introducción → 7. Interfaces).
5. Resto de archivos: Header `# [Nombre] - Spec-Driven Development` + `<!-- TO BE SPECIFIED -->`.

**REGLAS:**
- Cero archivos o carpetas extra. Solo lo indicado.
- Mantén formato exacto (Markdown, YAML, Bash).
- Prioriza "Spec-First, Single Source of Truth".
- Output: Lista plana de archivos con su contenido, lista para copiar/pegar.