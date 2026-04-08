# srojas.app — Landing Personal

Landing page personal desplegada en `https://srojas.app`.

Construida con Astro + TailwindCSS. Dark theme. Presenta el proyecto Hub, TalentTrack y MiEntreno, con SEO completo y OG image para redes sociales.

---

## Stack

| Tecnología | Uso |
|---|---|
| **Astro 6** | Framework — generación estática (SSG) |
| **TailwindCSS 4** | Estilos vía Vite plugin |
| **Satori** (solo en dev/build) | Generó la og-image.png — ya no se usa en runtime |

---

## Estructura

```
src/
├── layouts/
│   └── Layout.astro        # HTML base, SEO completo (OG, Twitter, JSON-LD)
├── pages/
│   └── index.astro         # Landing única — toda la página
└── styles/
    └── global.css          # Tailwind + custom classes (gradient-text, card-hover, code-block)

public/
├── og-image.png            # Imagen para previews en WhatsApp/LinkedIn/Twitter (1200×630)
├── favicon.svg
└── favicon.ico
```

---

## Comandos

```bash
npm run dev        # Dev server en localhost:4321
npm run build      # Build estático → ./dist/
npm run preview    # Preview del build antes de deployar
npm run deploy     # Build + deploy al servidor (ver abajo)
```

---

## Deploy a Producción

### Cómo funciona

El sitio se despliega en un servidor cPanel vía SSH. El comando `npm run deploy` ejecuta `deploy.sh`, que:

1. Corre `npm run build` → genera `dist/`
2. Empaqueta `dist/` en un tar y lo sube por SSH al servidor
3. Extrae en `~/public_html/` preservando los archivos del servidor que no son nuestros

```bash
npm run deploy
```

Eso es todo. Build + deploy en un solo comando.

### Conexión SSH

El alias SSH está configurado en `~/.ssh/config` como `srojasapp`.

```bash
ssh srojasapp   # conecta al servidor
```

### Servidor — cosas a tener en cuenta

- **Document root:** `~/public_html/` → sirve `srojas.app`
- **Servidor web:** Apache (LiteSpeed) — cPanel hosting en `moria.beewh.com`
- **El deploy NO toca:**
  - `.htaccess` — generado por cPanel (PHP handler), si se sobreescribe se rompe
  - `.well-known/` — certificados SSL
  - `hub` — symlink a `/home2/srojasap/hub/public` (subdominio `hub.srojas.app`)
  - `icon.png`, `logo.png` — archivos del servidor que no son de esta landing

### Flujo completo para publicar cambios

```bash
# 1. Hacer cambios en el código
# 2. Probar localmente
npm run dev

# 3. Build + deploy al servidor
npm run deploy

# 4. Pushear al repo remoto
git add .
git commit -m "feat: descripción del cambio"
git push
```

> **Nota:** `npm run deploy` no hace `git push` automáticamente — hacé el push por separado después de verificar que el deploy en producción esté bien.

---

### OG Image

La imagen `public/og-image.png` (1200×630) fue generada con `satori` + `@resvg/resvg-js`. Si necesitás regenerarla con un diseño distinto, el código original está en el commit `2b0cebc` (`src/pages/og-image.png.ts`). Para regenerar:

1. Restaurar el archivo del commit
2. Correr `npm run build`
3. Copiar `dist/og-image.png` a `public/og-image.png`
4. Borrar nuevamente el endpoint

---

## SEO

El `Layout.astro` incluye:

- Open Graph completo (title, description, image, locale, site_name)
- Twitter/X cards con `summary_large_image`
- URL canónica dinámica
- `robots: index, follow, max-image-preview:large`
- Structured Data JSON-LD: `Person` + `WebSite` (Schema.org)
- `apple-touch-icon` apuntando a la og-image
