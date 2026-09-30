# Mis Cuentas

Web app para iPhone para llevar los gastos y las inversiones del mes. Está en español y en modo oscuro.

- Indicas cuánto has cobrado este mes y la app te va restando los gastos: los fijos y los que añades.
- Puedes añadir rápidamente gastos, inversiones o ingresos.
- Pagos con Apple Pay: una automatización de Atajos copia el pago y en la app pulsas **Pegar pago**.
- Historial por meses con gráfico y desglose por categoría.
- Cartera de inversiones por plataforma, con rentabilidad.
- Los datos se guardan **solo en tu iPhone** (localStorage). Nada se sube a ningún servidor.

## Instalar en el iPhone

1. Abre en **Safari** la dirección de GitHub Pages del repo.
2. Pulsa **Compartir** → **Añadir a pantalla de inicio**.
3. Abre la app desde el icono: se ve a pantalla completa, como una app normal.

## Detectar pagos con Apple Pay

Tienes los pasos en la app, en **Ajustes → Detectar pagos con Apple Pay**. En resumen:
**Atajos → Automatización → Transacción →** acción *Texto* `ApplePay|Comercio|Importe` → *Copiar al portapapeles* → *Mostrar notificación*.

## Copias de seguridad

**Ajustes → Exportar copia** guarda un `.json` que puedes dejar en Archivos o en iCloud Drive. Con **Importar copia** lo restauras.
Si borras los datos de Safari o eliminas el icono de la pantalla de inicio, se pierden los datos. Exporta una copia de vez en cuando.

## Actualizar la app

Edita los archivos y sube el número de `VERSION` en `sw.js`. Al volver a abrir la app en el iPhone (a veces hace falta abrirla dos veces), cogerá la nueva versión.
