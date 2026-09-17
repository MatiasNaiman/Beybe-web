"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-section empty-bag">
      <h1>Algo no salió como esperábamos.</h1>
      <p>
        Volvé a intentarlo en un momento. Tu bolsa sigue guardada en este
        navegador.
      </p>
      <button className="button" onClick={reset}>
        Volver a intentar
      </button>
    </div>
  );
}
