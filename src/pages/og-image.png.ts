import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { APIRoute } from 'astro';

const h = (type: string, style: Record<string, unknown>, children: unknown[]) => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

const text = (type: string, content: string, style: Record<string, unknown>) => ({
  type,
  props: { style: { display: 'flex', ...style }, children: [content] },
});

export const GET: APIRoute = async () => {
  const fontRegular = readFileSync(
    resolve('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
  );
  const fontBold = readFileSync(
    resolve('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
  );

  const tags = ['Laravel', 'Vue 3', 'TypeScript', 'Astro'];

  const svg = await satori(
    h(
      'div',
      {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1200px',
        height: '630px',
        background: '#0a0a0f',
        padding: '64px 72px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      [
        // Glow de fondo
        h('div', {
          position: 'absolute',
          top: '-120px',
          left: '20px',
          width: '560px',
          height: '560px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        }, []),

        // Bloque central
        h('div', { flexDirection: 'column', gap: '20px' }, [
          text('div', 'Desarrollador Full Stack', {
            fontSize: '18px',
            color: '#6366f1',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }),
          text('div', 'Sebastian Rojas', {
            fontSize: '92px',
            fontWeight: 700,
            color: '#f1f5f9',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
          }),
          text('div', 'Hub · TalentTrack · MiEntreno', {
            fontSize: '28px',
            color: 'rgba(148,163,184,0.6)',
            fontWeight: 400,
          }),
        ]),

        // Footer
        h('div', { justifyContent: 'space-between', alignItems: 'flex-end' }, [
          h('div', { gap: '10px', alignItems: 'center' }, [
            ...tags.map((tag) =>
              text('div', tag, {
                fontSize: '16px',
                color: 'rgba(148,163,184,0.45)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: 400,
              })
            ),
          ]),
          text('div', 'srojas.app', {
            fontSize: '22px',
            color: 'rgba(99,102,241,0.7)',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }),
        ]),
      ]
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
