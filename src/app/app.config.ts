import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {errorLoggerInterceptor} from './interceptors/error-logger-interceptor';
import {authInterceptor} from './interceptors/auth.interceptor';
import {portugueseLanguageHeaderInterceptor} from './interceptors/portuguese-language-header-interceptor';
import {provideEnvironmentNgxMask} from 'ngx-mask';
import {NgxEditorModule} from 'ngx-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    // provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorLoggerInterceptor, portugueseLanguageHeaderInterceptor])
    ),
    provideEnvironmentNgxMask(),
    importProvidersFrom(NgxEditorModule.forRoot({locals: {
        // menu
        bold: 'Negrito',
        italic: 'Itálico',
        code: 'Código',
        underline: 'Sublinhado',
        strike: 'Tachado',
        blockquote: 'Citação',
        bullet_list: 'Lista não ordenada',
        ordered_list: 'Lista ordenada',
        heading: 'Texto comum',
        h1: 'Título 1',
        h2: 'Título 2',
        h3: 'Título 3',
        h4: 'Título 4',
        h5: 'Título 5',
        h6: 'Título 6',
        align_left: 'Alinhado à esquerda',
        align_center: 'Alinhado ao centro',
        align_right: 'Alinhado à direita',
        align_justify: 'Justificar',
        text_color: 'Cor do texto',
        background_color: 'Cor do fundo',
        horizontal_rule: 'Régua horizontal',
        format_clear: 'Limpar formatação',
        insertLink: 'Inserir Link',
        removeLink: 'Remover Link',
        insertImage: 'Inserir Imagem',
        indent: 'Aumentar Indentação',
        outdent: 'Diminuir Indentação',
        superscript: 'Sobrescrito',
        subscript: 'Subescrito',
        undo: 'Desfazer',
        redo: 'Refazer',

        // pupups, forms, others...
        url: 'URL',
        text: 'Texto',
        openInNewTab: 'Abrir em nova aba',
        insert: 'Inserir',
        altText: 'Texto alternativo',
        title: 'Título',
        remove: 'Remover',
        enterValidUrl: 'Por favor, insira uma URL válida',
      }}))
  ]
};

export const API_BASE_URL = 'http://localhost:8000';
