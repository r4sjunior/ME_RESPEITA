// Mini app ANIMA — Me Respeita. Os dados das artistas ficam em data.js.
const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const papel = (a) => (a.coletivo ? "Artistas expositoras" : "Artista expositora");

function midiaDaObra(a, i) {
  const n = i + 1;
  return a.video
    ? { tipo: "video", src: `/video/${a.slug}-${n}.mp4`, thumb: `/img/obras/${a.slug}/${n}-thumb.webp` }
    : { tipo: "img", src: `/img/obras/${a.slug}/${n}.webp`, thumb: `/img/obras/${a.slug}/${n}-thumb.webp` };
}

const cardArtista = (a) => `
  <li class="card">
    <a href="#artista/${a.slug}">
      <span class="card-retrato"><img src="/img/retratos/${a.slug}.webp" alt="" loading="lazy" width="480" height="480"></span>
      <span class="card-nome titulo-graffiti">${esc(a.nome)}</span>
      <span class="card-cidade">${esc(a.cidade)}</span>
    </a>
  </li>`;

// ---------- telas ----------
const TELAS = {
  inicio: () => `
    <section class="inicio">
      <div class="inicio-arte"><img src="/img/hero.webp" alt="" fetchpriority="high"></div>
      <div class="inicio-texto">
        <p class="anima"><svg class="coroa" viewBox="0 0 120 80" aria-hidden="true"><path d="M10 70 L18 14 L42 46 L60 6 L78 46 L102 14 L110 70 Z"/></svg>ANIMA</p>
        <h1 class="titulo-graffiti">Me Respeita</h1>
        <p class="inicio-sub">Exposição Metaverso</p>
        <p class="inicio-curadoria">Curadoria <strong>Katia Suzue</strong></p>
      </div>
    </section>

    <section class="bloco">
      <div class="bloco-cabeca">
        <h2 class="rotulo">Artistas expositoras</h2>
        <a class="ver-todas" href="#artistas">Ver todas ›</a>
      </div>
      <ul class="trilho">
        ${ARTISTAS.map((a) => `
          <li><a href="#artista/${a.slug}">
            <img src="/img/retratos/${a.slug}.webp" alt="" loading="lazy" width="480" height="480">
            <span>${esc(a.nome)}</span>
          </a></li>`).join("")}
      </ul>
    </section>

    <section class="bloco">
      <a class="cartao-curadoria" href="#curadoria">
        <span class="rotulo">Texto curatorial</span>
        <span class="cartao-frase">“Porque a arte feita por mulheres transforma, ocupa e inspira.”</span>
        <span class="ver-todas">Ler texto ›</span>
      </a>
    </section>`,

  artistas: () => `
    <section class="bloco">
      <h1 class="titulo-graffiti titulo-tela">Quem ocupa</h1>
      <p class="tela-intro">${ARTISTAS.length} artistas e coletivos em exposição.</p>
      <label class="busca">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input type="search" id="busca" placeholder="Buscar artista ou cidade" autocomplete="off">
      </label>
      <ul class="grade" id="grade">${ARTISTAS.map(cardArtista).join("")}</ul>
      <p class="vazio" id="vazio" hidden>Nenhuma artista encontrada.</p>
    </section>`,

  curadoria: () => `
    <section class="bloco curadoria">
      <p class="rotulo">Texto curatorial</p>
      <h1 class="titulo-graffiti titulo-tela">Me Respeita</h1>
      <p class="lead">A exposição <em>Me Respeita</em>, com curadoria de <strong>Katia Suzue</strong>, reúne artistas, equipe de montagem, produção, comunicação e divulgação em uma mostra realizada no Metaverso.</p>
      <p>Mais do que um espaço expositivo, é um lugar de troca, colaboração e fortalecimento coletivo, construído a partir do respeito, da escuta e da valorização do trabalho de cada pessoa envolvida.</p>
      <p>Sejam todas bem-vindas a esta jornada de arte, resistência, afeto e potência feminina.</p>
      <blockquote class="manifesto">
        <span class="titulo-graffiti">Me Respeita</span>
        Porque a arte feita por mulheres transforma, ocupa e inspira.
      </blockquote>
    </section>`,

  artista: (a, idx) => {
    const ant = ARTISTAS[(idx - 1 + ARTISTAS.length) % ARTISTAS.length];
    const prox = ARTISTAS[(idx + 1) % ARTISTAS.length];
    const longa = a.bio.length > 2;
    return `
    <article class="perfil">
      <div class="perfil-capa"><img src="/img/chamadas/${a.slug}.webp" alt="Chamada de ${esc(a.nome)} para a exposição Me Respeita"></div>
      <div class="bloco">
        <p class="rotulo">${papel(a)} · ${esc(a.cidade)}</p>
        <h1 class="titulo-graffiti perfil-nome">${esc(a.nome)}</h1>
        ${a.nomeCivil ? `<p class="perfil-civil">${esc(a.nomeCivil)}</p>` : ""}
        ${a.links.length ? `<p class="perfil-links">${a.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.rotulo)} ↗</a>`).join("")}</p>` : ""}
      </div>

      <div class="bloco">
        <h2 class="rotulo">Obras em exposição</h2>
        <ul class="obras">
          ${a.obras.map((t, i) => {
            const m = midiaDaObra(a, i);
            return `<li><button type="button" class="obra" data-obra="${i}" aria-label="Ampliar: ${esc(t)}">
              <span class="obra-img"><img src="${m.thumb}" alt="" loading="lazy">${m.tipo === "video" ? '<span class="obra-play" aria-hidden="true">▶</span>' : ""}</span>
              <span class="obra-nome">${esc(t)}</span>
            </button></li>`;
          }).join("")}
        </ul>
      </div>

      <div class="bloco">
        <h2 class="rotulo">Sobre</h2>
        <div class="bio${longa ? " recolhida" : ""}" id="bio">${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        ${longa ? `<button type="button" class="ler-mais" id="ler-mais" aria-expanded="false" aria-controls="bio">Ler mais</button>` : ""}
      </div>

      <nav class="perfil-nav" aria-label="Outras artistas">
        <a href="#artista/${ant.slug}" data-dir="voltar"><small>Anterior</small>${esc(ant.nome)}</a>
        <a href="#artista/${prox.slug}"><small>Próxima</small>${esc(prox.nome)}</a>
      </nav>
    </article>`;
  },
};

// ---------- roteador ----------
const tela = $("#tela");
const pilha = []; // histórico interno para saber se "voltar" pode usar history.back()
let rotaAtual = null;

function lerRota() {
  const h = location.hash.replace(/^#\/?/, "");
  const m = h.match(/^artista\/([\w-]+)/);
  if (m) {
    const idx = ARTISTAS.findIndex((a) => a.slug === m[1]);
    if (idx >= 0) return { nome: "artista", idx, chave: h };
  }
  return { nome: TELAS[h] && h !== "artista" ? h : "inicio", chave: h || "inicio" };
}

function render() {
  const r = lerRota();
  const anterior = rotaAtual;
  const voltando = pilha.length > 1 && pilha[pilha.length - 2] === r.chave;
  if (voltando) pilha.pop();
  else if (!anterior || anterior.chave !== r.chave) pilha.push(r.chave);
  rotaAtual = r;

  fecharLuz();
  const a = r.nome === "artista" ? ARTISTAS[r.idx] : null;
  tela.innerHTML = a ? TELAS.artista(a, r.idx) : TELAS[r.nome]();
  tela.scrollTop = 0;
  tela.classList.remove("entra", "entra-voltando");
  void tela.offsetWidth;
  if (anterior) tela.classList.add(voltando ? "entra-voltando" : "entra");

  const aba = a ? "artistas" : r.nome;
  document.querySelectorAll("[data-aba]").forEach((el) => {
    const ativa = el.dataset.aba === aba;
    el.classList.toggle("ativa", ativa);
    if (ativa) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });

  const raiz = r.nome === "inicio";
  $("#voltar").hidden = raiz;
  $(".marca").hidden = !raiz;
  $("#barra-titulo").textContent = raiz ? "" : a ? a.nome : { artistas: "Artistas", curadoria: "Curadoria" }[r.nome];
  document.title = raiz ? "ANIMA — Me Respeita" : `${$("#barra-titulo").textContent} — Me Respeita`;

  ligarTela(a);
}

function ligarTela(a) {
  const busca = $("#busca");
  if (busca) {
    const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    busca.addEventListener("input", () => {
      const q = norm(busca.value.trim());
      const lista = ARTISTAS.filter((x) => !q || norm(`${x.nome} ${x.nomeCivil || ""} ${x.cidade}`).includes(q));
      $("#grade").innerHTML = lista.map(cardArtista).join("");
      $("#vazio").hidden = lista.length > 0;
    });
  }
  const lerMais = $("#ler-mais");
  if (lerMais) {
    lerMais.addEventListener("click", () => {
      const aberta = $("#bio").classList.toggle("recolhida") === false;
      lerMais.textContent = aberta ? "Ler menos" : "Ler mais";
      lerMais.setAttribute("aria-expanded", aberta);
    });
  }
  if (a) tela.querySelectorAll("[data-obra]").forEach((b) => b.addEventListener("click", () => abrirLuz(a, Number(b.dataset.obra))));
}

$("#voltar").addEventListener("click", () => {
  if (pilha.length > 1) history.back();
  else location.hash = rotaAtual && rotaAtual.nome === "artista" ? "#artistas" : "#inicio";
});

// ---------- compartilhar ----------
function aviso(txt) {
  const el = $("#aviso");
  el.textContent = txt;
  el.classList.add("visivel");
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => el.classList.remove("visivel"), 2200);
}

$("#compartilhar").addEventListener("click", async () => {
  const a = rotaAtual && rotaAtual.nome === "artista" ? ARTISTAS[rotaAtual.idx] : null;
  const dados = {
    title: a ? `${a.nome} — Me Respeita` : "ANIMA — Me Respeita",
    text: a ? `Conheça ${a.nome} na exposição Me Respeita, no Metaverso.` : "Conheça as artistas e as obras da exposição Me Respeita, no Metaverso.",
    url: location.href,
  };
  try {
    if (navigator.share) await navigator.share(dados);
    else {
      await navigator.clipboard.writeText(dados.url);
      aviso("Link copiado");
    }
  } catch (e) {
    if (e.name !== "AbortError") aviso("Não foi possível compartilhar");
  }
});

// ---------- lightbox ----------
const luz = $("#luz");
let luzArtista = null;
let luzIdx = 0;

function renderLuz() {
  const m = midiaDaObra(luzArtista, luzIdx);
  const titulo = luzArtista.obras[luzIdx];
  $("#luz-midia").innerHTML =
    m.tipo === "video"
      ? `<video src="${m.src}" poster="${m.thumb}" autoplay loop muted playsinline controls></video>`
      : `<img src="${m.src}" alt="${esc(titulo)}">`;
  $("#luz-legenda").innerHTML = `<strong>${esc(titulo)}</strong><br>${esc(luzArtista.nome)} <span>${luzIdx + 1}/${luzArtista.obras.length}</span>`;
  const varias = luzArtista.obras.length > 1;
  luz.querySelectorAll(".luz-nav").forEach((b) => (b.hidden = !varias));
}

function abrirLuz(a, i) {
  luzArtista = a;
  luzIdx = i;
  renderLuz();
  luz.hidden = false;
  $("[data-luz-fechar]").focus({ preventScroll: true });
}
function fecharLuz() {
  if (luz.hidden) return;
  luz.hidden = true;
  $("#luz-midia").innerHTML = "";
  const b = $(`[data-obra="${luzIdx}"]`, tela);
  if (b) b.focus({ preventScroll: true });
}
function passo(d) {
  const n = luzArtista.obras.length;
  luzIdx = (luzIdx + d + n) % n;
  renderLuz();
}

$("[data-luz-fechar]").addEventListener("click", fecharLuz);
$(".luz-ant").addEventListener("click", () => passo(-1));
$(".luz-prox").addEventListener("click", () => passo(1));
luz.addEventListener("click", (e) => { if (e.target === luz || e.target.classList.contains("luz-midia")) fecharLuz(); });

let toqueX = null;
luz.addEventListener("touchstart", (e) => (toqueX = e.touches[0].clientX), { passive: true });
luz.addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50 && luzArtista.obras.length > 1) passo(dx < 0 ? 1 : -1);
  toqueX = null;
});

document.addEventListener("keydown", (e) => {
  if (luz.hidden) return;
  if (e.key === "Escape") fecharLuz();
  else if (e.key === "ArrowLeft") passo(-1);
  else if (e.key === "ArrowRight") passo(1);
});

// ---------- PWA ----------
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

addEventListener("hashchange", render);
render();
