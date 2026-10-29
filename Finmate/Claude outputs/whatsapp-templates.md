# WhatsApp Business — Content Templates para Finmate

Estos 3 templates tienen que ser creados por Joaco en Twilio Content Template Builder
y luego aprobados por Meta. Una vez aprobados, Twilio te da un Content SID (HXxxxxx...)
que hay que pegar como variable de entorno en Railway.

**El bot funciona sin estos templates** (sigue mandando texto libre, como hoy).
Solo son necesarios para mensajes que el bot inicia fuera de la ventana de 24hs.

---

## Pasos generales (hacer una vez por template)

1. Ir a https://console.twilio.com/us1/develop/sms/content-template-builder
2. Clic en **"Create new template"**
3. Nombre del template: usar el nombre que se indica abajo (snake_case, sin espacios)
4. Channel: **WhatsApp**
5. Template type: **Text**
6. Pegar el texto del template en el campo "Body" (ver abajo)
7. Clic en **"Create"**
8. Twilio va a mandar el template a Meta para aprobación — puede tardar entre
   unas horas y 2-3 días hábiles.
9. Una vez aprobado (estado "Approved" en la lista de templates), copiar el
   **Content SID** (formato `HXxxxxx...`, lo ves en la columna "SID" o en el
   detalle del template).
10. Ir a Railway → proyecto `melodious-surprise` → servicio `web` → Variables,
    y pegar el Content SID en la variable correspondiente (ver abajo).

---

## Template 1 — Alerta de watchlist

**Nombre del template (campo "Template name" en Twilio):**
`finmate_watchlist_alert`

**Variable de Railway a cargar con el Content SID resultante:**
`TWILIO_TEMPLATE_WATCHLIST_ALERT_SID`

**Variables dinámicas (declaralas en el builder con doble llave):**
- `{{1}}` = símbolo del activo (ej: AAPL)
- `{{2}}` = variación del día con signo y % (ej: +6.3%)
- `{{3}}` = precio actual (ej: $189.50)

**Texto del template (copiar exactamente, incluidas las llaves):**

```
*{{1}}* se movió {{2}} hoy. Precio actual: {{3}}. Respondé para ver el detalle o pedirme que lo saque de tu watchlist.
```

> Nota: ~118 caracteres. Si el builder no acepta el asterisco para negrita, usar:
> `{{1}} se movio {{2}} hoy. Precio actual: {{3}}. Respondeme para ver el detalle.`

---

## Template 2 — Aviso de novedades de mercado

**Nombre del template:**
`finmate_market_notify`

**Variable de Railway:**
`TWILIO_TEMPLATE_MARKET_NOTIFY_SID`

**Variables dinámicas:**
- `{{1}}` = tipo de novedad (ej: earnings, noticias macro, noticias de mercado)

**Texto del template:**

```
Hay novedades de {{1}} disponibles. Respondé "mostrame" para recibirlas.
```

> Nota: ~72 caracteres. Sin variable también es válido si preferís texto fijo:
> `Hay novedades de mercado disponibles. Respondeme "mostrame" para recibirlas.`
> En ese caso, no declarar ninguna variable en el builder.

---

## Template 3 — Aviso de resumen semanal listo

**Nombre del template:**
`finmate_weekly_summary`

**Variable de Railway:**
`TWILIO_TEMPLATE_WEEKLY_SUMMARY_NOTIFY_SID`

**Variables dinámicas:** ninguna

**Texto del template:**

```
Tu resumen semanal de mercados está listo. Respondé "mostrame" para recibirlo.
```

> Nota: ~79 caracteres. Sin variables dinámicas — texto completamente fijo,
> lo que facilita la aprobación de Meta.

---

## Resumen de variables a cargar en Railway una vez aprobados

| Variable de Railway                          | Content SID (completar) |
|----------------------------------------------|-------------------------|
| `TWILIO_TEMPLATE_WATCHLIST_ALERT_SID`        | HX...                   |
| `TWILIO_TEMPLATE_MARKET_NOTIFY_SID`          | HX...                   |
| `TWILIO_TEMPLATE_WEEKLY_SUMMARY_NOTIFY_SID`  | HX...                   |

Railway redeploya automáticamente en cuanto guardás las variables.
No hace falta hacer nada más en el código — ya está todo listo para usarlos.

---

## Consejos para la aprobación de Meta

- Los textos están en español rioplatense — Meta los acepta en cualquier idioma.
- Evitar palabras que Meta marca como spam: "gratis", "oferta", "urgente",
  "premio", "click aquí". Estos templates no las usan.
- El campo "Category" en Twilio debe ser **"Utility"** (no "Marketing") para
  estos tres templates — son avisos funcionales del servicio, no publicidad.
- Si Meta rechaza un template, Twilio muestra el motivo en la lista. Los
  rechazos más comunes son: categoría incorrecta, variables mal declaradas,
  o texto que parece publicidad. Con "Utility" y estos textos el riesgo es bajo.
